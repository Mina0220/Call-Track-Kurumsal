# CallTrack Deployment Kılavuzu

## 🚀 Hızlı Başlangıç (Railway.app)

### 1. Railway.app'e Kayıt Olun
- https://railway.app adresine gidin
- GitHub hesabınızla giriş yapın

### 2. Yeni Proje Oluşturun
- "New Project" butonuna tıklayın
- "Deploy from GitHub repo" seçin
- Bu repository'yi seçin

### 3. Environment Variables (Gerekirse)
```
NODE_ENV=production
PORT=3001
```

### 4. Deploy!
- Railway otomatik olarak build edecek
- 2-3 dakika içinde hazır!

---

## 🖥️ VPS Deployment (Ubuntu)

### Gereksinimler
- Ubuntu 20.04+ sunucu
- Root veya sudo erişimi
- Domain (opsiyonel)

### 1. Sunucuya Bağlanın
```bash
ssh root@your-server-ip
```

### 2. Node.js Kurun
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y git
```

### 3. Projeyi Klonlayın
```bash
cd /var/www
git clone https://github.com/yourusername/call-track.git
cd call-track
npm install
```

### 4. Build Edin
```bash
npm run build
```

### 5. PM2 ile Çalıştırın
```bash
sudo npm install -g pm2
pm2 start server.js --name calltrack
pm2 save
pm2 startup
```

### 6. Nginx Kurun (Web Server)
```bash
sudo apt install nginx

# Config dosyası oluşturun
sudo nano /etc/nginx/sites-available/calltrack
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket desteği
    location /ws {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```

```bash
# Config'i aktif edin
sudo ln -s /etc/nginx/sites-available/calltrack /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. SSL Sertifikası (HTTPS)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 8. Firewall
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

## 🔄 Güncelleme

### Railway.app
- GitHub'a push yapın, otomatik deploy olur

### VPS
```bash
cd /var/www/call-track
git pull
npm install
npm run build
pm2 restart calltrack
```

---

## 📊 Monitoring

### PM2 ile Loglar
```bash
pm2 logs calltrack
pm2 status
pm2 monit
```

### Otomatik Yeniden Başlatma
PM2 sunucu çökse bile otomatik yeniden başlatır.

---

## 🔒 Güvenlik Önlemleri

### 1. Environment Variables
Hassas bilgileri `.env` dosyasında saklayın:
```bash
NODE_ENV=production
ADMIN_PASSWORD=your-secure-password
PORT=3001
```

### 2. Firewall
Sadece gerekli portları açın (22, 80, 443)

### 3. Regular Updates
```bash
sudo apt update && sudo apt upgrade
```

---

## 🆘 Sorun Giderme

### Sunucu çalışmıyor mu?
```bash
pm2 status
pm2 logs calltrack --lines 100
```

### Port zaten kullanımda?
```bash
sudo lsof -i :3001
sudo kill -9 <PID>
```

### Nginx hata veriyor?
```bash
sudo nginx -t
sudo systemctl status nginx
```

---

## 💰 Maliyet Tahmini

| Platform | Aylık | Kullanıcı | RAM |
|----------|-------|-----------|-----|
| Railway.app | $0-5 | 5-10 | 512MB |
| Render.com | $0-7 | 10-20 | 512MB |
| DigitalOcean | $6 | 20-50 | 1GB |
| DigitalOcean | $12 | 50-100 | 2GB |
| Turhost VPS | ₺150-300 | 50-100 | 2GB |

---

## 📞 Destek

Sorun yaşarsanız:
1. PM2 loglarına bakın: `pm2 logs`
2. Nginx loglarına bakın: `sudo tail -f /var/log/nginx/error.log`
3. Server loglarına bakın: Console.log'ları kontrol edin
