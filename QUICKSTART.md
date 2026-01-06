# ⚡ Quick Start Guide - CallTrack Kurumsal

## 🚀 5 Dakikada Başlayın!

### 1. Uygulamayı Başlatın (HALIHAZIRDA ÇALIŞIYOR! ✅)
Development server zaten çalışıyor:
```
http://localhost:5173
```

Tarayıcınızda yukarıdaki adresi açın.

---

## 📱 İlk Kullanım

### Adım 1: İlk Arama Kaydınızı Ekleyin
1. Sol menüden **"Arama Girişi"** sekmesine gidin
2. Formu doldurun:
   - Personel seçin
   - Firma adını girin
   - İletişim bilgilerini ekleyin
   - Görüşme sonucunu seçin
3. **"Kaydı Tamamla"** butonuna tıklayın
4. Sağ üstte yeşil bildirim görünecek! ✅

### Adım 2: Kayıtları Görüntüleyin
1. Sol menüden **"Tüm Kayıtlar"** sekmesine gidin
2. Kayıtlarınızı göreceksiniz
3. Filtreleri kullanarak arama yapın
4. Excel'e aktarmak için **"Excel İndir"** butonuna tıklayın

### Adım 3: Raporları İnceleyin
1. Sol menüden **"Raporlar & Patron"** sekmesine gidin
2. Haftalık/Aylık raporları görün
3. Personel performansını inceleyin
4. İstatistikleri analiz edin

---

## 🎯 En Çok Kullanılan Özellikler

### 1. Hızlı Arama
```
Arama Kutusu → Firma/Kişi/Telefon yazın → Anında filtrele!
```

### 2. Veri Yedekleme
```
Sol Menü → "Yedek Al" → JSON dosyası indir
```

### 3. Excel Export
```
Tüm Kayıtlar → "Excel İndir" → CSV dosyası indir
```

### 4. Filtreli Export
```
Filtreleri ayarla → "Excel İndir" → Sadece filtrelenmiş kayıtlar indirilir
```

---

## 💡 İpuçları

### Telefon Numarası Girişi
Sadece rakamları yazın, otomatik formatlanır:
```
Yazın: 5551234567
Görünüm: (555) 123 45 67
```

### Çoklu Filtre Kullanımı
Tüm filtreleri birlikte kullanabilirsiniz:
```
Arama + Personel + Şehir + Tarih Aralığı = Detaylı Arama
```

### Sayfalama
Büyük veri setlerinde sayfalama otomatik çalışır:
```
25 kayıt/sayfa
Alt kısımda sayfa numaraları
```

---

## 🔧 Temel Komutlar

### Development Server
```bash
# Başlat (ZATEN ÇALIŞIYOR!)
npm run dev

# Durdur
Ctrl + C
```

### Build
```bash
# Web build
npm run build

# Electron build
npm run electron:build
```

---

## 📊 Örnek Senaryo

### Senaryolar: Bir Günlük Kullanım

**Sabah 09:00** - Uygulamayı açın
```
http://localhost:5173
```

**09:15-12:00** - Aramaları kaydedin
```
1. Arama Girişi → Form doldur → Kaydet
2. Tekrar et (10-20 kayıt)
```

**12:00** - Yedek alın
```
Sol Menü → Yedek Al
```

**Öğleden Sonra** - Filtreleme ve analiz
```
1. Tüm Kayıtlar → Filtreleri kullan
2. Raporlar → Performansı incele
```

**Gün Sonu** - Excel export
```
Raporlar → Excel İndir → Günlük raporu kaydet
```

---

## 🎨 Ekran Görünümleri

### Ana Ekranlar
```
┌─────────────────────────────────────┐
│ Sidebar      │ Ana İçerik Alanı    │
│              │                      │
│ ✓ Arama      │ [Form/Liste/Rapor]  │
│   Girişi     │                      │
│              │                      │
│ ○ Tüm        │                      │
│   Kayıtlar   │                      │
│              │                      │
│ ○ Raporlar   │                      │
│              │                      │
│ ─────────    │                      │
│ 💾 Yedek Al  │                      │
│ 📂 Yükle     │                      │
└─────────────────────────────────────┘
```

---

## ⌨️ Klavye Kısayolları

| Tuş | Aksiyon |
|-----|---------|
| Tab | Sonraki alan |
| Shift+Tab | Önceki alan |
| Enter | Form gönder |
| Esc | Modal kapat |

---

## 🐛 Sık Karşılaşılan Sorunlar

### Sayfa yüklenmiyor?
```bash
# Sunucuyu yeniden başlat
Ctrl + C
npm run dev
```

### Veriler kayboldu?
```bash
# Yedekten geri yükle
Sol Menü → Yedek Yükle → JSON dosyasını seç
```

### Filtreler çalışmıyor?
```bash
# Filtreleri temizle
Filtreleme kutusundaki X butonuna tıkla
```

---

## 📈 İlk Hafta Hedefleri

- [ ] 100+ arama kaydı gir
- [ ] Tüm filtreleri dene
- [ ] İlk yedek al
- [ ] Haftalık rapor indir
- [ ] Personel performansını incele

---

## 🎓 Öğrenme Yolu

### Gün 1: Temel Kullanım
- ✅ Kayıt ekleme
- ✅ Kayıt görüntüleme
- ✅ Basit arama

### Gün 2: İleri Özellikler
- ✅ Filtreleme
- ✅ Excel export
- ✅ Düzenleme/Silme

### Gün 3: Analitik
- ✅ Raporlar
- ✅ Performans analizi
- ✅ Veri yedekleme

### Gün 4+: Master Kullanıcı
- ✅ Çoklu filtre kombinasyonları
- ✅ Özel rapor oluşturma
- ✅ Veri yönetimi

---

## 🏃‍♂️ Hemen Başlayın!

### Şu Anda Yapmanız Gerekenler:

1. **Tarayıcıyı açın**: http://localhost:5173
2. **İlk kaydınızı ekleyin**
3. **Filtreleri deneyin**
4. **Yedek alın**

---

## 💪 Başarı İpuçları

1. **Düzenli yedek alın** (günlük önerilir)
2. **Filtreleri kullanın** (zamandan tasarruf)
3. **Notları detaylı yazın** (gelecekte faydalı)
4. **Raporları inceleyin** (trend analizi)
5. **Excel export kullanın** (harici analiz)

---

## 🎯 İlk 10 Dakikada Yapılacaklar

```
✅ 0-2 dk:   Uygulamayı aç
✅ 2-4 dk:   İlk kayıt ekle
✅ 4-6 dk:   Filtreleri dene
✅ 6-8 dk:   Raporları incele
✅ 8-10 dk:  Yedek al
```

---

## 📞 Yardım

### Sorunuz mu var?
- README.md dosyasını okuyun
- FEATURES.md ile özellikleri inceleyin
- IMPROVEMENTS.md ile detayları görün

### Teknik Destek
- GitHub Issues
- Email: info@sirketyazilim.com

---

## 🎉 Hazırsınız!

Artık CallTrack Kurumsal'ı kullanmaya başlayabilirsiniz.

**Development Server Çalışıyor**: ✅
**Adres**: http://localhost:5173

**Hadi başlayalım! 🚀**
