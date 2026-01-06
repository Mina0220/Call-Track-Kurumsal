# CallTrack - Yerel Ağ Kullanım Kılavuzu

## Seçenek 1: Masaüstü Uygulaması (Önerilen)

Her bilgisayarda bağımsız çalışır, kurulum gerektirmez.

### Kullanım:
```bash
npm run electron
```

**Avantajlar:**
- İnternet/ağ bağlantısı gerekmez
- Her kullanıcının kendi verileri
- Daha hızlı çalışır
- Masaüstü uygulaması gibi

**Dezavantajlar:**
- Veriler bilgisayarlar arası senkronize olmaz
- Her kullanıcı kendi local storage'ını kullanır

---

## Seçenek 2: Yerel Ağ Web Sunucusu

Bir bilgisayar sunucu, diğerleri tarayıcıdan bağlanır.

### Sunucu Bilgisayarında:

1. **Sunucuyu Başlat:**
```bash
npm run network
```

2. **IP Adresini Al:**
Terminal çıktısında göreceksiniz:
```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/
```

`192.168.1.100:5173` sizin IP adresiniz olacak.

3. **Windows Güvenlik Duvarı İzni:**
İlk çalıştırmada Windows güvenlik duvarı soracak, **"Erişime izin ver"** deyin.

Eğer sormadıysa manuel olarak:
- Windows Güvenlik Duvarı → Gelişmiş ayarlar
- Gelen Kurallar → Yeni Kural
- Port → TCP → 5173
- Bağlantıya izin ver

### Diğer Bilgisayarlarda:

Tarayıcıyı açın ve sunucu IP'sine gidin:
```
http://192.168.1.100:5173
```

**ÖNEMLİ:** Tüm bilgisayarlar **aynı WiFi/ağda** olmalı!

---

## Seçenek 3: Build + Statik Sunucu (Prodüksiyon)

### 1. Build Oluştur:
```bash
npm run build
```

### 2. Basit HTTP Sunucusu Kur:
```bash
npm install -g http-server
```

### 3. Sunucuyu Başlat:
```bash
cd dist
http-server -p 8080
```

### 4. IP Adresini Öğren:
```bash
ipconfig
```
IPv4 adresini not edin (örn: 192.168.1.100)

### 5. Diğer Bilgisayarlardan Eriş:
```
http://192.168.1.100:8080
```

---

## Seçenek 4: Merkezi Veritabanı (Gelişmiş)

Tüm verilerin merkezi bir yerde saklanması için backend gerekir.

### Gereksinimler:
- Node.js backend sunucusu (Express)
- SQLite veya MongoDB
- API endpoint'leri

### Temel Mimari:
```
[Sunucu Bilgisayar]
  ├─ Node.js API (Port 3000)
  ├─ SQLite Veritabanı
  └─ Vite Frontend (Port 5173)

[Diğer Bilgisayarlar]
  └─ Tarayıcı → http://192.168.1.100:5173
```

---

## Hangi Seçeneği Kullanmalıyım?

| Durum | Önerilen Seçenek |
|-------|------------------|
| Az kullanıcı (1-3 kişi), veri paylaşımı gerekmez | **Seçenek 1** (Electron) |
| Orta kullanıcı (3-10 kişi), veri paylaşımı gerekli | **Seçenek 2** (Yerel ağ sunucusu) |
| Çok kullanıcı (10+), veri senkronizasyonu kritik | **Seçenek 4** (Backend + DB) |
| Sadece test/demo | **Seçenek 2 veya 3** |

---

## Sorun Giderme

### Diğer bilgisayarlar bağlanamıyor:
1. Firewall'u kontrol edin
2. Her iki bilgisayar da aynı WiFi'de mi?
3. VPN kapalı mı?
4. Antivirus engelliyor mu?

### IP adresini bulamıyorum:
```bash
# Windows
ipconfig

# Çıktıda IPv4 Address kısmına bakın
# Genelde 192.168.x.x veya 10.0.x.x
```

### Port zaten kullanılıyor hatası:
Port değiştirin:
```bash
npm run network -- --port 3000
```

---

## Güvenlik Notları

- **Sadece güvendiğiniz ağlarda** kullanın (ofis WiFi, ev ağı)
- **Dışarıya açmayın** (port forwarding yapmayın)
- Hassas veriler için **VPN** kullanın
- Admin paneli şifresini **mutlaka değiştirin** (src/App.jsx:2070)

---

## Destek

Sorun yaşarsanız:
1. Terminal çıktısını kontrol edin
2. Tarayıcı konsolu (F12) hatalarına bakın
3. `npm run build` ile build alın, hata var mı kontrol edin
