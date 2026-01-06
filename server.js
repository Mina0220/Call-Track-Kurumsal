import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

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
      console.log('Data loaded from file');
    } else {
      console.log('No data file found, starting fresh');
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Veriyi dosyaya kaydet
function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2), 'utf-8');
    console.log('Data saved to file');
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Sunucu başlatıldığında veriyi yükle
loadData();

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
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Yeni bağlanan cliente mevcut veriyi gönder
  ws.send(JSON.stringify({
    type: 'INIT',
    data: appData
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received:', data.type);

      switch (data.type) {
        case 'UPDATE_CALLS':
          appData.calls = data.calls;
          appData.lastUpdated = Date.now();
          saveData();
          // Diğer clientlara broadcast
          broadcast({
            type: 'CALLS_UPDATED',
            calls: appData.calls,
            timestamp: appData.lastUpdated
          });
          break;

        case 'UPDATE_TASKS':
          appData.tasks = data.tasks;
          appData.lastUpdated = Date.now();
          saveData();
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

// Calls verilerini güncelle
app.post('/api/calls', (req, res) => {
  try {
    appData.calls = req.body.calls || [];
    appData.lastUpdated = Date.now();
    saveData();

    // WebSocket üzerinden broadcast
    broadcast({
      type: 'CALLS_UPDATED',
      calls: appData.calls,
      timestamp: appData.lastUpdated
    });

    res.json({ success: true, data: appData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Tasks verilerini getir
app.get('/api/tasks', (req, res) => {
  res.json({ tasks: appData.tasks });
});

// Tasks verilerini güncelle
app.post('/api/tasks', (req, res) => {
  try {
    appData.tasks = req.body.tasks || [];
    appData.lastUpdated = Date.now();
    saveData();

    // WebSocket üzerinden broadcast
    broadcast({
      type: 'TASKS_UPDATED',
      tasks: appData.tasks,
      timestamp: appData.lastUpdated
    });

    res.json({ success: true, data: appData });
  } catch (error) {
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
