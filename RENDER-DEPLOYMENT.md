# 🚀 Render.com Deployment Kılavuzu

## 📋 Ön Gereksinimler

1. **GitHub Hesabı** (ücretsiz)
2. **Render.com Hesabı** (ücretsiz)
3. **Projeniz GitHub'da** olmalı

---

## 🎯 Adım Adım Kurulum

### 1️⃣ GitHub'a Yükleme (5 dakika)

#### A. GitHub'da Yeni Repository Oluşturun

1. https://github.com/new adresine gidin
2. Repository adı: `calltrack-kurumsal` (veya istediğiniz isim)
3. **Public** veya **Private** seçin (ikisi de çalışır)
4. ✅ **"Add a README file"** İŞARETLEMEYİN (zaten var)
5. **"Create repository"** butonuna tıklayın

#### B. Yerel Projenizi GitHub'a Yükleyin

Terminal'de şu komutları çalıştırın:

```bash
cd "/Users/egetezel/Desktop/Call Track"

# Git başlat (zaten yapıldı)
git init

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit - CallTrack Kurumsal with sync"

# GitHub repository'nizi ekleyin (YOURUSERNAME yerine kendi kullanıcı adınızı yazın)
git remote add origin https://github.com/YOURUSERNAME/calltrack-kurumsal.git

# Main branch
git branch -M main

# GitHub'a yükle
git push -u origin main
```

**Not:** GitHub kullanıcı adı ve token isteyecektir:
- Username: GitHub kullanıcı adınız
- Password: GitHub personal access token ([buradan oluşturun](https://github.com/settings/tokens))

---

### 2️⃣ Render.com'da Deployment (3 dakika)

#### A. Render.com'a Kayıt Olun

1. https://render.com adresine gidin
2. **"Get Started for Free"** butonuna tıklayın
3. **GitHub** ile giriş yapın (OAuth)
4. Render'a GitHub erişimi verin

#### B. Yeni Web Service Oluşturun

1. Dashboard'da **"New +"** butonuna tıklayın
2. **"Web Service"** seçin
3. GitHub repository'nizi bulun ve **"Connect"** butonuna tıklayın
   - Eğer görmüyorsanız: **"Configure account"** → Repository'yi seçin

#### C. Ayarları Yapın

**Name (İsim):**
```
calltrack-app
```

**Region:**
```
Frankfurt (EU Central)
```
(veya en yakın bölge)

**Branch:**
```
main
```

**Root Directory:**
```
(boş bırakın)
```

**Runtime:**
```
Node
```

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm start
```

**Plan:**
```
Free (Ücretsiz)
```

#### D. Environment Variables (Ortam Değişkenleri)

**"Advanced"** butonuna tıklayın ve şu değişkenleri ekleyin:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |

#### E. Deploy Edin!

1. **"Create Web Service"** butonuna tıklayın
2. ⏳ Build başlayacak (2-5 dakika sürer)
3. ✅ Deploy tamamlandığında yeşil "Live" yazısı görünür

---

## 🌐 Uygulamanıza Erişim

### Render.com URL'niz

Deploy tamamlandıktan sonra şuna benzer bir URL alacaksınız:

```
https://calltrack-app.onrender.com
```

Bu URL ile:
- ✅ Frontend'e erişebilirsiniz
- ✅ Backend API çalışır
- ✅ WebSocket bağlantısı otomatik
- ✅ HTTPS dahil (SSL ücretsiz)

---

## 🔧 Özel Domain Ekleme (Opsiyonel)

Kendi domain'inizi kullanmak isterseniz:

1. Render dashboard'da servisinize tıklayın
2. **"Settings"** → **"Custom Domain"** bölümüne gidin
3. Domain'inizi ekleyin (örn: `calltrack.sirketiniz.com`)
4. DNS ayarlarınıza şu CNAME kaydını ekleyin:
   ```
   CNAME calltrack -> calltrack-app.onrender.com
   ```
5. Render otomatik SSL sertifikası oluşturacak

---

## 📊 Ücretsiz Plan Limitleri

Render.com Free Plan:
- ✅ 750 saat/ay çalışma süresi
- ✅ 512 MB RAM
- ✅ Otomatik SSL (HTTPS)
- ⚠️ 15 dakika aktivitesizlikten sonra uyku moduna geçer
- ⚠️ İlk erişimde 30-60 saniye uyanma süresi

**Not:** Sürekli aktif kalmasını istiyorsanız:
- Paid plan'a geçin ($7/ay)
- Veya her 10 dakikada bir ping atın (UptimeRobot gibi)

---

## 🔄 Güncelleme ve Deployment

### Otomatik Deployment (Önerilen)

Her GitHub push'unda otomatik deploy olur:

```bash
# Değişikliklerinizi yapın
# Sonra:
git add .
git commit -m "Yeni özellik eklendi"
git push
```

Render otomatik olarak:
1. Değişiklikleri algılar
2. Yeniden build eder
3. Deploy eder
4. 2-3 dakikada canlıya alır

### Manuel Deployment

Render dashboard'da:
1. Servisinize tıklayın
2. **"Manual Deploy"** → **"Deploy latest commit"**

---

## 📈 Monitoring ve Loglar

### Logları Görüntüleme

1. Render dashboard'da servisinize tıklayın
2. **"Logs"** sekmesine gidin
3. Gerçek zamanlı log'ları görebilirsiniz

**Arama yapın:**
```
Error
WebSocket
Connected
```

### Metrics (Metrikler)

**"Metrics"** sekmesinde:
- CPU kullanımı
- Memory kullanımı
- Request sayısı
- Response times

---

## 🐛 Sorun Giderme

### Build Hatası

**Hata:** `npm install` başarısız

**Çözüm:**
```bash
# Yerel olarak test edin
npm install
npm run build

# Eğer çalışıyorsa, package-lock.json'u commit edin
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

### Start Hatası

**Hata:** `Error: Cannot find module`

**Çözüm:**
Build command'i kontrol edin:
```
npm install && npm run build
```

### WebSocket Bağlantı Hatası

**Hata:** `WebSocket connection failed`

**Çözüm:**
syncService.js otomatik olarak `wss://` kullanacak.
Eğer hala sorun varsa:
1. Browser console'u açın
2. Hangi URL'e bağlanmaya çalıştığını görün
3. URL doğru mu kontrol edin

### Uygulama Yavaş

**Neden:** Free plan uyku modundan uyanıyor

**Çözümler:**
1. **Paid plan** ($7/ay) - Sürekli aktif
2. **UptimeRobot** - Her 5 dakikada ping (ücretsiz)
3. **Cron-job.org** - Scheduled requests

---

## 💾 Veri Kalıcılığı

### ⚠️ ÖNEMLİ: Free Plan'da Veri Sorunu

Render.com free plan'da dosya sistemi **geçicidir**:
- ❌ `data.json` her yeniden başlatmada SİLİNİR
- ❌ Deploy sonrası veriler KAYBOLUR

### ✅ Çözümler

#### Seçenek 1: Render PostgreSQL (ÖNERİLİR)

**Ücretsiz PostgreSQL ekleyin:**

1. Dashboard'da **"New +"** → **"PostgreSQL"**
2. İsim: `calltrack-db`
3. Free plan seçin
4. **"Create Database"**
5. Web service'inize bağlayın

**server.js'i güncelleyin:**
```javascript
// PostgreSQL kullanmak için (ayrı kurulum gerekli)
// npm install pg
```

#### Seçenek 2: Render Disk (Paid)

Persistent disk ekleyin ($1/ay):
1. Settings → **"Disks"**
2. Mount path: `/app/data`
3. Size: 1 GB
4. server.js'de: `const DATA_FILE = '/app/data/data.json'`

#### Seçenek 3: External Database

**Ücretsiz seçenekler:**
- **MongoDB Atlas** (512MB ücretsiz)
- **Supabase** (500MB ücretsiz)
- **Firebase** (Spark plan ücretsiz)

---

## 🔒 Güvenlik Önerileri

### 1. Environment Variables

Hassas bilgileri environment variable'larda saklayın:

**Render Settings → Environment Variables:**
```
ADMIN_PASSWORD=your-secure-password-here
API_KEY=your-api-key-here
```

### 2. CORS Ayarları

Production için CORS'u sınırlayın:

```javascript
// server.js
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*'
}));
```

**Environment Variable:**
```
ALLOWED_ORIGINS=https://calltrack-app.onrender.com
```

### 3. Rate Limiting

DDoS koruması için rate limiting ekleyin:

```bash
npm install express-rate-limit
```

---

## 💰 Maliyet Optimizasyonu

### Free Plan İçinde Kalmak

- ✅ 750 saat = 31 gün 24/7 çalışma
- ✅ Tek bir web service yeterli
- ✅ Küçük ekipler için ideal (5-10 kullanıcı)

### Paid Plan'a Ne Zaman Geçmeli?

**$7/ay Starter Plan:**
- Sürekli aktif kalması gerekiyorsa
- 50+ kullanıcı
- Hızlı response gerekiyorsa
- Custom domain SSL

---

## 🎯 Production Checklist

Deploy öncesi kontrol listesi:

- [x] ✅ GitHub'a yüklendi
- [x] ✅ render.yaml mevcut
- [x] ✅ Build command doğru
- [x] ✅ Start command doğru
- [x] ✅ Environment variables ayarlandı
- [x] ✅ .gitignore güncel
- [ ] ⚠️ Veri kalıcılığı çözümü (PostgreSQL/Disk)
- [ ] ⚠️ Admin şifresi güncellendi
- [ ] ⚠️ CORS ayarları yapıldı

---

## 📞 Destek

### Render.com Destek

- 📖 Docs: https://render.com/docs
- 💬 Community: https://community.render.com
- 📧 Support: support@render.com

### Hata Raporlama

1. Render dashboard → Logs
2. Hatayı kopyalayın
3. Community'de sorun

---

## 🚀 Hızlı Başlangıç Özeti

```bash
# 1. GitHub'a yükle
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/calltrack.git
git push -u origin main

# 2. Render.com
# - New Web Service
# - Repository bağla
# - Build: npm install && npm run build
# - Start: npm start
# - Deploy!

# 3. Erişim
# https://your-app.onrender.com
```

**Deploy süresi:** 5-10 dakika
**Maliyet:** ₺0 (Free plan)

---

Başarılı deployment'lar! 🎉
