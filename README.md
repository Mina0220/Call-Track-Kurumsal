# 📞 CallTrack Kurumsal

Kurumsal arama takip ve raporlama sistemi - Gelişmiş özelliklerle donatılmış profesyonel çağrı yönetim uygulaması.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-4.3.9-646cff.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 Özellikler

### ✨ Temel Özellikler
- 📝 **Arama Kaydı Girişi**: Detaylı arama bilgileri kaydetme
- 📊 **Gelişmiş Raporlama**: Haftalık, aylık ve özel raporlar
- 🔍 **Akıllı Filtreleme**: Çoklu filtre seçenekleri ile hızlı arama
- 📄 **Sayfalama**: Büyük veri setleri için optimize edilmiş görüntüleme
- 💾 **Veri Yönetimi**: Yedekleme ve geri yükleme özellikleri
- 📈 **Performans Analizi**: Personel bazında detaylı performans takibi
- 🎨 **Modern UI/UX**: Kullanıcı dostu arayüz ve animasyonlar

### 🚀 Gelişmiş Özellikler
- 🔄 **Gerçek Zamanlı Senkronizasyon**: WebSocket ile çoklu cihaz desteği
- ⚡ **Real-time Bildirimler**: Başarı, hata ve uyarı bildirimleri
- 🌐 **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- 🔐 **Veri Güvenliği**: LocalStorage + Backend ile güvenli veri saklama
- 📱 **Mobil Uyumlu**: Mobil cihazlar için optimize edilmiş
- 🎯 **Hatırlatmalar**: Günlük takip hatırlatıcıları
- 📥 **Excel Export**: CSV formatında veri aktarımı
- 🏆 **Personel Performansı**: Detaylı performans metrikleri
- 🌍 **Network Desteği**: Yerel ağdaki tüm cihazlardan erişim

## 🛠️ Teknolojiler

### Frontend
- **React 18.2.0** - Modern kullanıcı arayüzü
- **Vite 4.3.9** - Hızlı geliştirme ortamı
- **Tailwind CSS 3.3.2** - Utility-first CSS framework
- **Lucide React** - Modern ikonlar
- **Electron** - Masaüstü uygulaması desteği

### Backend
- **Node.js + Express 4.x** - RESTful API
- **WebSocket (ws)** - Gerçek zamanlı senkronizasyon
- **CORS** - Cross-origin resource sharing
- **File System** - JSON tabanlı veri depolama

## 📦 Kurulum

### Gereksinimler
- Node.js 16.x veya üzeri
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd "Call Track"
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın**

**Sadece Frontend:**
```bash
npm run dev
```

**Backend + Frontend (Senkronizasyon ile):**
```bash
npm run dev:full
```

4. **Tarayıcıda açın**

**Localhost (sadece siz):**
```
http://localhost:5174
```

**Network (yerel ağdaki diğer cihazlar):**
```
http://192.168.1.17:5174
```

**Backend API:**
```
http://localhost:3001
```

## 🎯 Kullanım

### Arama Kaydı Ekleme
1. **Arama Girişi** sekmesine gidin
2. Tüm gerekli bilgileri doldurun:
   - Aramayı yapan personel
   - Firma bilgileri
   - İletişim bilgileri
   - Görüşme sonucu
3. **Kaydı Tamamla** butonuna tıklayın

### Kayıtları Görüntüleme ve Filtreleme
1. **Tüm Kayıtlar** sekmesine gidin
2. Arama çubuğunu kullanarak hızlı arama yapın
3. Filtreleri kullanarak:
   - Sonuç türüne göre
   - Personele göre
   - Şehre göre
   - Tarih aralığına göre filtreleme
4. **Excel İndir** butonu ile verileri dışa aktarın

### Raporları İnceleme
1. **Raporlar & Patron** sekmesine gidin
2. Görüntülenebilir raporlar:
   - Haftalık performans
   - Aylık performans
   - Personel performansı
   - Sektör dağılımı
   - Sonuç analizi

### Veri Yedekleme
1. Sol menüden **Yedek Al** butonuna tıklayın
2. JSON dosyası otomatik olarak indirilir
3. **Yedek Yükle** butonu ile geri yükleme yapın

## 📊 Raporlama Özellikleri

### Haftalık/Aylık Raporlar
- Toplam arama sayısı
- Başarı oranları
- Detaylı kayıt listesi
- Excel export desteği

### Personel Performansı
- Toplam arama sayısı
- Başarılı aramalar
- Beklemedeki aramalar
- Başarısız aramalar
- Başarı oranı yüzdesi

### Sektör Analizi
- Sektör bazında dağılım
- Görsel progress bar'lar
- Yüzdelik dilimler

### Sonuç Dağılımı
- Görüşme sonuçlarının analizi
- Renk kodlu gösterimler
- Toplam ve yüzdelik oranlar

## 🔧 Yapılandırma

### Personel Listesi
`src/App.jsx` dosyasında `CALLERS` dizisini düzenleyin:
```javascript
const CALLERS = ["Aysun", "Hülya", "Mert", "Tuğbahan", "Yakup"];
```

### Sayfalama
`src/App.jsx` dosyasında `ITEMS_PER_PAGE` sabitini değiştirin:
```javascript
const ITEMS_PER_PAGE = 25; // Sayfa başına kayıt sayısı
```

### Mesai Saatleri
`src/App.jsx` dosyasında `HOURS` dizisini düzenleyin:
```javascript
const HOURS = Array.from({ length: 10 }, (_, i) => (i + 9).toString().padStart(2, '0')); // 09-18
```

## 📱 Electron Uygulaması

### Geliştirme
```bash
npm run electron:dev
```

### Üretim Build
```bash
npm run electron:build
```

Build edilen uygulama `dist-electron` klasöründe oluşturulur.

## 🎨 Özelleştirme

### Renk Teması
Tailwind CSS kullanılarak kolayca özelleştirilebilir. `tailwind.config.js` dosyasını düzenleyin.

### Animasyonlar
`src/index.css` dosyasında custom animasyonlar tanımlıdır:
- `animate-slide-in`: Bildirimler için kaydırma animasyonu
- `animate-pulse-slow`: Hatırlatmalar için pulse efekti

## 📖 API Referansı

### LocalStorage Yapısı
```javascript
{
  "companyCalls": [
    {
      "id": 1234567890,
      "createdAt": "2026-01-02T10:30:00.000Z",
      "caller": "Mert",
      "companyName": "ABC Lojistik A.Ş.",
      "contactPerson": "Ahmet Yılmaz",
      "contactTitle": "Satın Alma Müdürü",
      "contactPhone": "(555) 123 45 67",
      "newContactPhone": "",
      "industry": "Lojistik",
      "city": "İstanbul",
      "district": "Kadıköy",
      "callDate": "2026-01-02",
      "callTime": "10:30",
      "result": "Görüşüldü",
      "notes": "İlgili, tekrar aranacak"
    }
  ]
}
```

### Export Formatı
CSV dosyası UTF-8 BOM ile aşağıdaki sütunları içerir:
- ID
- Tarih
- Saat
- Personel
- Firma Adı
- Sektör
- İl
- İlçe
- İlgili Kişi
- Unvan
- Telefon
- Yeni Telefon
- Sonuç
- Notlar

## 🐛 Sorun Giderme

### Port 5173 kullanımda hatası
```bash
# Farklı port kullanın
vite --port 3000
```

### Build hatası
```bash
# node_modules'i temizleyin ve yeniden yükleyin
rm -rf node_modules
npm install
```

### LocalStorage temizleme
Tarayıcı konsolunda:
```javascript
localStorage.removeItem('companyCalls')
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/YeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/YeniOzellik`)
5. Pull Request oluşturun

## 📝 Değişiklik Geçmişi

### v1.0.0 (2026-01-02)
- ✅ Gelişmiş filtreleme sistemi
- ✅ Sayfalama desteği
- ✅ Veri yedekleme/geri yükleme
- ✅ Personel performans analizi
- ✅ Modern UI/UX iyileştirmeleri
- ✅ Bildirim sistemi
- ✅ Performance optimizasyonları
- ✅ Responsive tasarım iyileştirmeleri

## 📄 Lisans

MIT License - Detaylar için `LICENSE` dosyasına bakın.

## 👥 Ekip

- **Geliştirici**: Sirket Yazilim
- **Tasarım**: Modern UI/UX Standards
- **Versiyon**: 1.0.0

## 📞 İletişim

Sorularınız veya önerileriniz için:
- 📧 Email: info@sirketyazilim.com
- 🌐 Website: www.sirketyazilim.com

## 🙏 Teşekkürler

Bu projeyi kullandığınız için teşekkür ederiz!

---

**Made with ❤️ by Sirket Yazilim**
