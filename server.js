import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import { initDatabase, getAllCalls, updateCalls as dbUpdateCalls, getAllTasks, updateTasks as dbUpdateTasks } from './database.js';
import { validateCalls, validateTasks } from './validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const USE_DATABASE = !!process.env.DATABASE_URL;

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 update requests per windowMs
  message: 'Too many update requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// Production'da build edilmiş frontend'i serve et
if (IS_PRODUCTION) {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Veri dosyası yolu
const DATA_FILE = path.join(__dirname, 'data.json');

// Veri yapısı
let appData = {
  calls: [],
  tasks: [],
  lastUpdated: Date.now()
};

// Veriyi dosyadan yükle
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
      appData = JSON.parse(rawData);
      console.log('📁 Data loaded from file');
    } else {
      console.log('📁 No data file found, starting fresh');
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Veriyi dosyaya kaydet
function saveData() {
  if (!USE_DATABASE) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2), 'utf-8');
      console.log('📁 Data saved to file');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }
}

// Database'den veri yükle
async function loadFromDatabase() {
  if (USE_DATABASE) {
    try {
      await initDatabase();
      const calls = await getAllCalls();
      const tasks = await getAllTasks();
      appData.calls = calls;
      appData.tasks = tasks;
      appData.lastUpdated = Date.now();
      console.log(`🗄️  Loaded ${calls.length} calls and ${tasks.length} tasks from database`);
    } catch (error) {
      console.error('❌ Error loading from database:', error);
    }
  }
}

// Sunucu başlatıldığında veriyi yükle
if (USE_DATABASE) {
  await loadFromDatabase();
} else {
  loadData();
}

// HTTP Server
const server = createServer(app);

// WebSocket Server
const wss = new WebSocketServer({ server });

// Tüm bağlı clientlara mesaj gönder
function broadcast(message) {
  const data = JSON.stringify(message);
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // OPEN
      client.send(data);
    }
  });
}

// WebSocket bağlantıları
wss.on('connection', (ws, req) => {
  console.log('New client connecting...');

  // Simple token-based authentication (optional in development, required in production)
  const token = req.headers['sec-websocket-protocol'] || req.url.split('?token=')[1];
  const expectedToken = process.env.WS_AUTH_TOKEN;

  // Only enforce authentication in production if token is set
  if (IS_PRODUCTION && expectedToken && token !== expectedToken) {
    console.log('❌ WebSocket authentication failed');
    ws.close(1008, 'Authentication failed');
    return;
  }

  console.log('✅ New client connected');
  ws.isAuthenticated = true;

  // Yeni bağlanan cliente mevcut veriyi gönder
  ws.send(JSON.stringify({
    type: 'INIT',
    data: appData
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received:', data.type);

      // Verify authentication before processing
      if (IS_PRODUCTION && expectedToken && !ws.isAuthenticated) {
        ws.send(JSON.stringify({
          type: 'ERROR',
          message: 'Not authenticated'
        }));
        return;
      }

      switch (data.type) {
        case 'UPDATE_CALLS':
          // Validate input
          const callsValidation = validateCalls(data.calls || []);
          if (!callsValidation.valid) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Validation failed',
              details: callsValidation.errors
            }));
            return;
          }

          appData.calls = callsValidation.sanitized;
          appData.lastUpdated = Date.now();

          // Database veya dosyaya kaydet (use sanitized data)
          if (USE_DATABASE) {
            dbUpdateCalls(appData.calls).catch(err => console.error('DB update error:', err));
          } else {
            saveData();
          }

          // Diğer clientlara broadcast
          broadcast({
            type: 'CALLS_UPDATED',
            calls: appData.calls,
            timestamp: appData.lastUpdated
          });
          break;

        case 'UPDATE_TASKS':
          // Validate input
          const tasksValidation = validateTasks(data.tasks || []);
          if (!tasksValidation.valid) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Validation failed',
              details: tasksValidation.errors
            }));
            return;
          }

          appData.tasks = tasksValidation.sanitized;
          appData.lastUpdated = Date.now();

          // Database veya dosyaya kaydet (use sanitized data)
          if (USE_DATABASE) {
            dbUpdateTasks(appData.tasks).catch(err => console.error('DB update error:', err));
          } else {
            saveData();
          }

          // Diğer clientlara broadcast
          broadcast({
            type: 'TASKS_UPDATED',
            tasks: appData.tasks,
            timestamp: appData.lastUpdated
          });
          break;

        case 'SYNC_REQUEST':
          ws.send(JSON.stringify({
            type: 'SYNC_RESPONSE',
            data: appData
          }));
          break;
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// REST API Endpoints

// Tüm veriyi getir
app.get('/api/data', (req, res) => {
  res.json(appData);
});

// Calls verilerini getir
app.get('/api/calls', (req, res) => {
  res.json({ calls: appData.calls });
});

// Calls verilerini güncelle (strict rate limiting + validation)
app.post('/api/calls', strictLimiter, async (req, res) => {
  try {
    const incomingCalls = req.body.calls || [];

    // Validate and sanitize input
    const validation = validateCalls(incomingCalls);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    // Use sanitized data
    appData.calls = validation.sanitized;
    appData.lastUpdated = Date.now();

    // Database veya dosyaya kaydet
    if (USE_DATABASE) {
      await dbUpdateCalls(appData.calls);
    } else {
      saveData();
    }

    // WebSocket üzerinden broadcast
    broadcast({
      type: 'CALLS_UPDATED',
      calls: appData.calls,
      timestamp: appData.lastUpdated
    });

    res.json({ success: true, data: appData });
  } catch (error) {
    console.error('Error updating calls:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Tasks verilerini getir
app.get('/api/tasks', (req, res) => {
  res.json({ tasks: appData.tasks });
});

// Tasks verilerini güncelle (strict rate limiting + validation)
app.post('/api/tasks', strictLimiter, async (req, res) => {
  try {
    const incomingTasks = req.body.tasks || [];

    // Validate and sanitize input
    const validation = validateTasks(incomingTasks);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    // Use sanitized data
    appData.tasks = validation.sanitized;
    appData.lastUpdated = Date.now();

    // Database veya dosyaya kaydet
    if (USE_DATABASE) {
      await dbUpdateTasks(appData.tasks);
    } else {
      saveData();
    }

    // WebSocket üzerinden broadcast
    broadcast({
      type: 'TASKS_UPDATED',
      tasks: appData.tasks,
      timestamp: appData.lastUpdated
    });

    res.json({ success: true, data: appData });
  } catch (error) {
    console.error('Error updating tasks:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Production'da tüm route'ları index.html'e yönlendir (SPA için)
if (IS_PRODUCTION) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Sunucuyu başlat
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running on:`);
  console.log(`   Local:   http://localhost:${PORT}`);
  if (!IS_PRODUCTION) {
    console.log(`   Network: http://192.168.1.17:${PORT}`);
  }
  console.log(`   Mode:    ${IS_PRODUCTION ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`   Storage: ${USE_DATABASE ? 'PostgreSQL 🗄️' : 'File System 📁'}`);
  console.log(`\n📡 WebSocket server is ready for connections\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  saveData();
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  saveData();
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
