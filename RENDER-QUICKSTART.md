# ⚡ Render.com Hızlı Başlangıç

## 🎯 5 Dakikada Deploy

### 1. GitHub'a Yükleyin

```bash
# Terminal'de çalıştırın
cd "/Users/egetezel/Desktop/Call Track"

# Git başlat (zaten yapıldı ise atlayın)
git init

# Dosyaları ekle
git add .
git commit -m "Initial commit - CallTrack with sync"

# GitHub repository oluşturun: github.com/new
# Sonra:
git remote add origin https://github.com/KULLANICIADI/calltrack.git
git branch -M main
git push -u origin main
```

### 2. Render.com'a Deploy

1. **Render.com'a gidin:** https://render.com
2. **GitHub ile giriş** yapın
3. **"New +"** → **"Web Service"**
4. **Repository'nizi seçin**

### 3. Ayarları Yapın

| Ayar | Değer |
|------|-------|
| **Name** | `calltrack-app` |
| **Branch** | `main` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

**Environment Variables ekleyin:**
- `NODE_ENV` = `production`
- `PORT` = `10000`

### 4. Deploy!

**"Create Web Service"** → Bekleyin (2-5 dakika)

✅ Hazır! URL'niz: `https://calltrack-app.onrender.com`

---

## ⚠️ ÖNEMLİ: Veri Sorunu

**Free plan'da `data.json` dosyası her deploy'da silinir!**

### Hızlı Çözüm: Render PostgreSQL (ÜCRETSİZ)

1. **"New +"** → **"PostgreSQL"**
2. **Free plan** seçin
3. Database oluşturun

Sonra backend'i database kullanacak şekilde güncellemek gerekir (ayrı bir kurulum).

---

## 🔄 Güncelleme

```bash
# Değişiklik yaptıktan sonra
git add .
git commit -m "Yeni özellik"
git push
```

Render otomatik deploy eder!

---

## 📊 Free Plan Özellikleri

✅ **Ücretsiz:**
- 750 saat/ay
- 512 MB RAM
- SSL (HTTPS)
- Otomatik deploy

⚠️ **Kısıtlamalar:**
- 15 dakika aktivitesizlikte uyur
- İlk erişimde 30-60 saniye uyanır
- Dosya sistemi geçici (data.json kaybolur)

---

## 💡 İpuçları

### Hızlı Uyanma

UptimeRobot ile her 5 dakikada ping atın (ücretsiz):
1. https://uptimerobot.com
2. Monitor ekle: `https://calltrack-app.onrender.com/api/data`

### Sürekli Aktif

Paid plan: $7/ay
- Hiç uyumaz
- Daha hızlı
- Daha fazla RAM

---

## 🐛 Sorun mu var?

**Logları kontrol edin:**
1. Render dashboard → Servis → **"Logs"**
2. Hataları arayın

**Yerel test:**
```bash
npm run build
npm start
```

---

**Hazır! 🎉**

Detaylı bilgi: `RENDER-DEPLOYMENT.md`
