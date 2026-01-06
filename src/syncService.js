// Sync Service - WebSocket ile backend senkronizasyonu

class SyncService {
  constructor() {
    this.ws = null;
    this.reconnectTimeout = null;
    this.reconnectDelay = 3000;
    this.listeners = new Map();
    this.isConnected = false;
    this.serverUrl = this.getServerUrl();
  }

  getServerUrl() {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

    // Production ortamı (deployment)
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '192.168.1.17') {
      // Production'da aynı hostname kullan, port belirtme (Nginx/proxy handle eder)
      return `${protocol}//${hostname}`;
    }

    // Development ortamı
    const port = 3001;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `ws://localhost:${port}`;
    } else {
      // Network üzerinden bağlananlar için
      return `ws://${hostname}:${port}`;
    }
  }

  connect() {
    try {
      console.log('Connecting to sync server:', this.serverUrl);
      this.ws = new WebSocket(this.serverUrl);

      this.ws.onopen = () => {
        console.log('✅ Connected to sync server');
        this.isConnected = true;
        this.notifyListeners('connection', { connected: true });

        // Bağlantı kurulduğunda reconnect timeout'unu temizle
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('📨 Received from server:', message.type);

          switch (message.type) {
            case 'INIT':
              this.notifyListeners('init', message.data);
              break;
            case 'CALLS_UPDATED':
              this.notifyListeners('callsUpdated', message.calls);
              break;
            case 'TASKS_UPDATED':
              this.notifyListeners('tasksUpdated', message.tasks);
              break;
            case 'SYNC_RESPONSE':
              this.notifyListeners('syncResponse', message.data);
              break;
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('❌ Disconnected from sync server');
        this.isConnected = false;
        this.notifyListeners('connection', { connected: false });
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error connecting to sync server:', error);
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimeout) return;

    console.log(`Reconnecting in ${this.reconnectDelay / 1000} seconds...`);
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, this.reconnectDelay);
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  notifyListeners(event, data) {
    if (!this.listeners.has(event)) return;

    this.listeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in listener for ${event}:`, error);
      }
    });
  }

  send(message) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, cannot send message');
      return false;
    }

    try {
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  updateCalls(calls) {
    return this.send({
      type: 'UPDATE_CALLS',
      calls: calls
    });
  }

  updateTasks(tasks) {
    return this.send({
      type: 'UPDATE_TASKS',
      tasks: tasks
    });
  }

  requestSync() {
    return this.send({
      type: 'SYNC_REQUEST'
    });
  }

  // REST API fallback (WebSocket bağlantısı yoksa)
  async syncWithREST(type, data) {
    const baseUrl = this.serverUrl.replace('ws://', 'http://');

    try {
      const response = await fetch(`${baseUrl}/api/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [type]: data })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('REST sync error:', error);
      return null;
    }
  }
}

// Singleton instance
const syncService = new SyncService();

export default syncService;
