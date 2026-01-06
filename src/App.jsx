import React, { useState, useEffect, useMemo, useRef } from 'react';
import syncService from './syncService';
import { 
  Phone, 
  Calendar, 
  User, 
  Building, 
  MapPin, 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BarChart3, 
  List, 
  Trash2,
  PieChart,
  FileText,
  Search,
  Smartphone,
  UserCircle,
  Download,
  CalendarDays,
  Edit,
  Filter,
  X,
  Bell,
  AlertTriangle,
  Printer,
  FileBarChart,
  Hourglass,
  Settings, 
  Upload,   
  Save,     
  Target,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Database,
  Mail,
  Users,
  History,
  Star,
  StickyNote,
  Sparkles, 
  Loader2,   
  Copy,
  Key,
  Moon, 
  Sun,
  Menu,
  Palette,
  Crown,
  Compass,
  ArrowRight,
  Shield,
  Lock
} from 'lucide-react';

// --- TEMA AYARLARI (Sadeleştirilmiş Renkler) ---
const THEMES = {
  blue: {
    label: 'Okyanus',
    hex: '#3b82f6', 
    classes: {
      primary: 'bg-blue-600',
      primaryHover: 'hover:bg-blue-700',
      secondary: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      ring: 'focus:ring-blue-500',
      navActive: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    }
  },
  pink: {
    label: 'Neon',
    hex: '#ec4899',
    classes: {
      primary: 'bg-pink-600',
      primaryHover: 'hover:bg-pink-700',
      secondary: 'bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300',
      text: 'text-pink-600 dark:text-pink-400',
      border: 'border-pink-200 dark:border-pink-800',
      ring: 'focus:ring-pink-500',
      navActive: 'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
    }
  },
  violet: {
    label: 'Galaksi',
    hex: '#8b5cf6',
    classes: {
      primary: 'bg-violet-600',
      primaryHover: 'hover:bg-violet-700',
      secondary: 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300',
      text: 'text-violet-600 dark:text-violet-400',
      border: 'border-violet-200 dark:border-violet-800',
      ring: 'focus:ring-violet-500',
      navActive: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
    }
  },
  emerald: {
    label: 'Doğa',
    hex: '#10b981',
    classes: {
      primary: 'bg-emerald-600',
      primaryHover: 'hover:bg-emerald-700',
      secondary: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800',
      ring: 'focus:ring-emerald-500',
      navActive: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    }
  },
  amber: {
    label: 'Güneş',
    hex: '#f59e0b',
    classes: {
      primary: 'bg-amber-500',
      primaryHover: 'hover:bg-amber-600',
      secondary: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
      ring: 'focus:ring-amber-500',
      navActive: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    }
  }
};

// --- AI FONKSİYONU ---
const callGemini = async (prompt) => {
  const apiKey = safeLocalStorage.getItem('geminiApiKey');
  if (!apiKey) return "Lütfen 'Ayarlar' menüsünden Google Gemini API Anahtarınızı giriniz.";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    if (data.error) return `Hata: ${data.error.message}`;
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Üzgünüm, yanıt alınamadı.";
  } catch (error) {
    return "Bağlantı hatası.";
  }
};

// --- KONFETİ ANIMASYONU ---
const createConfetti = () => {
  const colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 3000);
  }
};

// --- ANİMASYONLU SAYAÇ KOMPONENTİ ---
const AnimatedCounter = React.memo(({ value, duration = 1000 }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return <span>{count}</span>;
});
AnimatedCounter.displayName = 'AnimatedCounter';

// --- SABİT VERİLER ---
const CALLERS = ["Aysun", "Hülya", "Mehmet", "Mert", "Tuğbahan", "Yakup"];
const DAILY_TARGET = 20; 

const PENDING_STATUSES = [
  "Mail İstedi",
  "Randevu Alındı",
  "Teklif Bekliyor",
  "Yetkiliye İletildi",
  "Tekrar Aranacak",
  "Ulaşılamadı"
];

// HAZIR SENARYOLAR
const SCRIPTS = {
  "Giriş & Tanışma": "Merhaba, ben New Balance Danışmanlık'tan [Adınız]. Firmanızın [Sektör] sektöründeki iş gücü açığını, yurt dışından temin ettiğimiz disiplinli ve nitelikli personellerle çözüyoruz. İK yöneticinizle 2 dakika görüşmem mümkün mü?",
  "İtiraz (Yasal Süreçler)": "Haklısınız, bürokrasi karmaşık görünebilir. Ancak biz 'Anahtar Teslim' çalışıyoruz. Çalışma izni ve vize süreçlerinin tamamını uzman ekibimiz yönetiyor.",
  "Kapanış & Toplantı": "Bilgiler için teşekkürler. İhtiyacınız olan [Pozisyon] için elimizdeki hazır aday havuzundan size uygun CV'leri hazırlayıp iletiyorum."
};

// --- İL ve İLÇE VERİTABANI (Tam Liste) ---
const CITIES_DATA = {
  "Adana": ["Seyhan", "Yüreğir", "Çukurova", "Sarıçam", "Ceyhan", "Kozan", "İmamoğlu", "Karataş", "Karaisalı", "Pozantı", "Yumurtalık", "Tufanbeyli", "Feke", "Aladağ", "Saimbeyli"],
  "Adıyaman": ["Merkez", "Kahta", "Besni", "Gölbaşı", "Gerger", "Sincik", "Çelikhan", "Tut", "Samsat"],
  "Afyonkarahisar": ["Merkez", "Sandıklı", "Dinar", "Bolvadin", "Sinanpaşa", "Emirdağ", "Şuhut", "Çay", "İhsaniye", "İscehisar", "Sultandağı", "Çobanlar", "Dazkırı", "Başmakçı", "Evciler", "Bayat", "Hocalar", "Kızılören"],
  "Ağrı": ["Merkez", "Patnos", "Doğubayazıt", "Diyadin", "Eleşkirt", "Tutak", "Taşlıçay", "Hamur"],
  "Aksaray": ["Merkez", "Ortaköy", "Eskil", "Gülağaç", "Güzelyurt", "Ağaçören", "Sarıyahşi"],
  "Amasya": ["Merkez", "Merzifon", "Suluova", "Taşova", "Gümüşhacıköy", "Göynücek", "Hamamözü"],
  "Ankara": ["Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Etimesgut", "Sincan", "Altındağ", "Pursaklar", "Gölbaşı", "Polatlı", "Çubuk", "Kahramankazan", "Beypazarı", "Elmadağ", "Şereflikoçhisar", "Akyurt", "Nallıhan", "Haymana", "Kızılcahamam", "Bala", "Kalecik", "Ayaş", "Güdül", "Çamlıdere", "Evren"],
  "Antalya": ["Kepez", "Muratpaşa", "Alanya", "Manavgat", "Konyaaltı", "Serik", "Aksu", "Döşemealtı", "Kumluca", "Kaş", "Korkuteli", "Gazipaşa", "Finike", "Kemer", "Elmalı", "Demre", "Akseki", "Gündoğmuş", "İbradı"],
  "Ardahan": ["Merkez", "Göle", "Çıldır", "Hanak", "Posof", "Damal"],
  "Artvin": ["Merkez", "Hopa", "Borçka", "Yusufeli", "Arhavi", "Şavşat", "Murgul", "Ardanuç", "Kemalpaşa"],
  "Aydın": ["Efeler", "Nazilli", "Söke", "Kuşadası", "Didim", "Germencik", "İncirliova", "Çine", "Köşk", "Kuyucak", "Bozdoğan", "Sultanhisar", "Karacasu", "Yenipazar", "Buharkent", "Karpuzlu"],
  "Balıkesir": ["Altıeylül", "Karesi", "Edremit", "Bandırma", "Gönen", "Ayvalık", "Burhaniye", "Bigadiç", "Susurluk", "Dursunbey", "Sındırgı", "İvrindi", "Erdek", "Havran", "Kepsut", "Manyas", "Savaştepe", "Balya", "Gömeç", "Marmara"],
  "Bartın": ["Merkez", "Ulus", "Amasra", "Kurucaşile"],
  "Batman": ["Merkez", "Kozluk", "Sason", "Beşiri", "Gercüş", "Hasankeyf"],
  "Bayburt": ["Merkez", "Demirözü", "Aydıntepe"],
  "Bilecik": ["Merkez", "Bozüyük", "Osmaneli", "Söğüt", "Gölpazarı", "Pazaryeri", "İnhisar", "Yenipazar"],
  "Bingöl": ["Merkez", "Genç", "Solhan", "Karlıova", "Adaklı", "Kiğı", "Yedisu", "Yayladere"],
  "Bitlis": ["Tatvan", "Merkez", "Güroymak", "Ahlat", "Hizan", "Mutki", "Adilcevaz"],
  "Bolu": ["Merkez", "Gerede", "Mudurnu", "Göynük", "Mengen", "Yeniçağa", "Dörtdivan", "Seben", "Kıbrıscık"],
  "Burdur": ["Merkez", "Bucak", "Gölhisar", "Yeşilova", "Çavdır", "Tefenni", "Ağlasun", "Karamanlı", "Altınyayla", "Çeltikçi", "Kemer"],
  "Bursa": ["Osmangazi", "Yıldırım", "Nilüfer", "İnegöl", "Gemlik", "Mustafakemalpaşa", "Mudanya", "Gürsu", "Karacabey", "Orhangazi", "Kestel", "Yenişehir", "İznik", "Orhaneli", "Keles", "Büyükorhan", "Harmancık"],
  "Çanakkale": ["Merkez", "Biga", "Çan", "Gelibolu", "Ayvacık", "Yenice", "Ezine", "Bayramiç", "Lapseki", "Eceabat", "Gökçeada", "Bozcaada"],
  "Çankırı": ["Merkez", "Çerkeş", "Ilgaz", "Orta", "Şabanözü", "Kurşunlu", "Yapraklı", "Kızılırmak", "Eldivan", "Atkaracalar", "Korgun", "Bayramören"],
  "Çorum": ["Merkez", "Sungurlu", "Osmancık", "İskilip", "Alaca", "Bayat", "Mecitözü", "Kargı", "Ortaköy", "Uğurludağ", "Dodurga", "Oğuzlar", "Laçin", "Boğazkale"],
  "Denizli": ["Pamukkale", "Merkezefendi", "Çivril", "Acıpayam", "Tavas", "Honaz", "Sarayköy", "Buldan", "Kale", "Çal", "Çameli", "Serinhisar", "Bozkurt", "Güney", "Çardak", "Bekilli", "Beyağaç", "Babadağ", "Baklan"],
  "Diyarbakır": ["Bağlar", "Kayapınar", "Yenişehir", "Sur", "Ergani", "Bismil", "Silvan", "Çınar", "Çermik", "Dicle", "Kulp", "Hani", "Lice", "Eğil", "Hazro", "Kocaköy", "Çüngüş"],
  "Düzce": ["Merkez", "Akçakoca", "Kaynaşlı", "Gölyaka", "Çilimli", "Yığılca", "Gümüşova", "Cumayeri"],
  "Edirne": ["Merkez", "Keşan", "Uzunköprü", "İpsala", "Havsa", "Meriç", "Enez", "Süloğlu", "Lalapaşa"],
  "Elazığ": ["Merkez", "Kovancılar", "Karakoçan", "Palu", "Arıcak", "Baskil", "Maden", "Sivrice", "Alacakaya", "Keban", "Ağın"],
  "Erzincan": ["Merkez", "Tercan", "Üzümlü", "Çayırlı", "İliç", "Kemah", "Kemaliye", "Otlukbeli", "Refahiye"],
  "Erzurum": ["Yakutiye", "Palandöken", "Aziziye", "Horasan", "Oltu", "Pasinler", "Karayazı", "Hınıs", "Tekman", "Karaçoban", "Aşkale", "Şenkaya", "Çat", "Köprüköy", "İspir", "Tortum", "Narman", "Uzundere", "Olur", "Pazaryolu"],
  "Eskişehir": ["Odunpazarı", "Tepebaşı", "Sivrihisar", "Çifteler", "Seyitgazi", "Alpu", "Mihalıççık", "Mahmudiye", "Beylikova", "İnönü", "Günyüzü", "Sarıcakaya", "Mihalgazi", "Han"],
  "Gaziantep": ["Şahinbey", "Şehitkamil", "Nizip", "İslahiye", "Nurdağı", "Araban", "Oğuzeli", "Yavuzeli", "Karkamış"],
  "Giresun": ["Merkez", "Bulancak", "Espiye", "Görele", "Tirebolu", "Dereli", "Yağlıdere", "Keşap", "Eynesil", "Şebinkarahisar", "Piraziz", "Güce", "Çamoluk", "Doğankent", "Alucra", "Çanakçı"],
  "Gümüşhane": ["Merkez", "Kelkit", "Şiran", "Kürtün", "Torul", "Köse"],
  "Hakkari": ["Yüksekova", "Merkez", "Şemdinli", "Çukurca", "Derecik"],
  "Hatay": ["Antakya", "İskenderun", "Defne", "Dörtyol", "Samandağ", "Kırıkhan", "Reyhanlı", "Arsuz", "Altınözü", "Hassa", "Payas", "Erzin", "Yayladağı", "Belen", "Kumlu"],
  "Iğdır": ["Merkez", "Tuzluca", "Karakoyunlu", "Aralık"],
  "Isparta": ["Merkez", "Yalvaç", "Eğirdir", "Gelendost", "Keçiborlu", "Senirkent", "Şarkikaraağaç", "Atabey", "Uluborlu", "Sütçüler", "Gönen", "Aksu", "Yenişarbademli"],
  "İstanbul": ["Kadıköy", "Üsküdar", "Beşiktaş", "Beyoğlu", "Fatih", "Şişli", "Bakırköy", "Zeytinburnu", "Esenler", "Güngören", "Bahçelievler", "Bağcılar", "Küçükçekmece", "Avcılar", "Başakşehir", "Eyüpsultan", "Gaziosmanpaşa", "Kağıthane", "Sarıyer", "Beykoz", "Kartal", "Maltepe", "Pendik", "Tuzla", "Ümraniye", "Ataşehir", "Sancaktepe", "Sultanbeyli", "Çekmeköy", "Büyükçekmece", "Bayrampaşa", "Arnavutköy", "Sultangazi", "Esenyurt", "Çatalca", "Silivri", "Şile", "Adalar"],
  "İzmir": ["Konak", "Karşıyaka", "Bornova", "Buca", "Çiğli", "Gaziemir", "Balçova", "Narlıdere", "Bayraklı", "Karabağlar", "Aliağa", "Güzelbahçe", "Menderes", "Menemen", "Seferihisar", "Torbalı", "Urla", "Foça", "Tire", "Kemalpaşa", "Ödemiş", "Bayındır", "Bergama", "Çeşme", "Dikili", "Selçuk", "Kınık", "Beydağ", "Kiraz", "Karaburun"],
  "Kahramanmaraş": ["Dulkadiroğlu", "Onikişubat", "Elbistan", "Afşin", "Pazarcık", "Göksun", "Andırın", "Türkoğlu", "Çağlayancerit", "Ekinözü", "Nurhak"],
  "Karabük": ["Merkez", "Safranbolu", "Yenice", "Eflani", "Eskipazar", "Ovacık"],
  "Karaman": ["Merkez", "Ermenek", "Ayrancı", "Kazımkarabekir", "Başyayla", "Sarıveliler"],
  "Kars": ["Merkez", "Kağızman", "Sarıkamış", "Selim", "Susuz", "Arpaçay", "Digor", "Akyaka"],
  "Kastamonu": ["Merkez", "Tosya", "Taşköprü", "İnebolu", "Araç", "Cide", "Devrekani", "Bozkurt", "Küre", "Daday", "Abana", "Çatalzeytin", "Doğanyurt", "Hanönü", "İhsangazi", "Pınarbaşı", "Şenpazar", "Ağlı", "Azdavay", "Seydiler"],
  "Kayseri": ["Kocasinan", "Melikgazi", "Talas", "Develi", "İncesu", "Yahyalı", "Pınarbaşı", "Sarıoğlan", "Tomarza", "Bünyan", "Akkışla", "Hacılar", "Felahiye", "Özvatan", "Sarız", "Yeşilhisar"],
  "Kilis": ["Merkez", "Musabeyli", "Elbeyli", "Polateli"],
  "Kırıkkale": ["Merkez", "Delice", "Keskin", "Sulakyurt", "Bahşılı", "Balışeyh", "Çelebi", "Karakeçili", "Yahşihan"],
  "Kırklareli": ["Merkez", "Lüleburgaz", "Babaeski", "Vize", "Pınarhisar", "Demirköy", "Kofçaz", "Pehlivanköy"],
  "Kırşehir": ["Merkez", "Kaman", "Çiçekdağı", "Mucur", "Akpınar", "Akçakent", "Boztepe"],
  "Kocaeli": ["Gebze", "İzmit", "Darıca", "Körfez", "Gölcük", "Derince", "Çayırova", "Kartepe", "Başiskele", "Karamürsel", "Kandıra", "Dilovası"],
  "Konya": ["Selçuklu", "Meram", "Karatay", "Ereğli", "Akşehir", "Beyşehir", "Çumra", "Seydişehir", "Ilgın", "Cihanbeyli", "Kulu", "Karapınar", "Kadınhanı", "Sarayönü", "Bozkır", "Yunak", "Doğanhisar", "Hüyük", "Altınekin", "Hadim", "Çeltik", "Güneysınır", "Emirgazi", "Taşkent", "Tuzlukçu", "Derebucak", "Akören", "Ahırlı", "Halkapınar", "Yalıhüyük"],
  "Kütahya": ["Merkez", "Tavşanlı", "Simav", "Gediz", "Emet", "Altıntaş", "Domaniç", "Hisarcık", "Aslanapa", "Çavdarhisar", "Şaphane", "Pazarlar", "Dumlupınar"],
  "Malatya": ["Battalgazi", "Yeşilyurt", "Doğanşehir", "Akçadağ", "Darende", "Hekimhan", "Yazıhan", "Pütürge", "Arapgir", "Kuluncak", "Arguvan", "Kale", "Doğanyol"],
  "Manisa": ["Yunusemre", "Şehzadeler", "Akhisar", "Turgutlu", "Salihli", "Soma", "Alaşehir", "Saruhanlı", "Kula", "Kırkağaç", "Demirci", "Sarıgöl", "Gördes", "Selendi", "Ahmetli", "Gölmarmara", "Köprübaşı"],
  "Mardin": ["Kızıltepe", "Artuklu", "Midyat", "Nusaybin", "Derik", "Mazıdağı", "Dargeçit", "Savur", "Yeşilli", "Ömerli"],
  "Mersin": ["Tarsus", "Toroslar", "Yenişehir", "Akdeniz", "Mezitli", "Erdemli", "Silifke", "Anamur", "Mut", "Bozyazı", "Gülnar", "Aydıncık", "Çamlıyayla"],
  "Muğla": ["Bodrum", "Fethiye", "Milas", "Menteşe", "Marmaris", "Seydikemer", "Ortaca", "Dalaman", "Yatağan", "Köyceğiz", "Ula", "Datça", "Kavaklıdere"],
  "Muş": ["Merkez", "Bulanık", "Malazgirt", "Varto", "Hasköy", "Korkut"],
  "Nevşehir": ["Merkez", "Ürgüp", "Avanos", "Gülşehir", "Derinkuyu", "Acıgöl", "Kozaklı", "Hacıbektaş"],
  "Niğde": ["Merkez", "Bor", "Çiftlik", "Ulukışla", "Altunhisar", "Çamardı"],
  "Ordu": ["Altınordu", "Ünye", "Fatsa", "Gölköy", "Perşembe", "Kumru", "Korgan", "Akkuş", "Aybastı", "Ulubey", "İkizce", "Mesudiye", "Gürgentepe", "Çatalpınar", "Çaybaşı", "Kabataş", "Kabadüz", "Çamaş", "Gülyalı"],
  "Osmaniye": ["Merkez", "Kadirli", "Düziçi", "Bahçe", "Toprakkale", "Sumbas", "Hasanbeyli"],
  "Rize": ["Merkez", "Çayeli", "Ardeşen", "Pazar", "Fındıklı", "Güneysu", "Kalkandere", "İyidere", "Derepazarı", "Çamlıhemşin", "İkizdere", "Hemşin"],
  "Sakarya": ["Adapazarı", "Serdivan", "Akyazı", "Erenler", "Hendek", "Karasu", "Geyve", "Arifiye", "Sapanca", "Pamukova", "Ferizli", "Kaynarca", "Kocaali", "Söğütlü", "Karapürçek", "Taraklı"],
  "Samsun": ["İlkadım", "Atakum", "Bafra", "Çarşamba", "Canik", "Vezirköprü", "Terme", "Tekkeköy", "Havza", "Alaçam", "19 Mayıs", "Kavak", "Salıpazarı", "Ayvacık", "Asarcık", "Ladik", "Yakakent"],
  "Siirt": ["Merkez", "Kurtalan", "Pervari", "Baykan", "Şirvan", "Eruh", "Tillo"],
  "Sinop": ["Merkez", "Boyabat", "Gerze", "Ayancık", "Durağan", "Türkeli", "Erfelek", "Dikmen", "Saraydüzü"],
  "Sivas": ["Merkez", "Şarkışla", "Yıldızeli", "Suşehri", "Gemerek", "Zara", "Kangal", "Gürün", "Divriği", "Koyulhisar", "Hafik", "Ulaş", "Altınyayla", "İmranlı", "Akıncılar", "Gölova", "Doğanşar"],
  "Şanlıurfa": ["Eyyübiye", "Haliliye", "Siverek", "Viranşehir", "Karaköprü", "Akçakale", "Suruç", "Birecik", "Harran", "Ceylanpınar", "Bozova", "Hilvan", "Halfeti"],
  "Şırnak": ["Cizre", "Silopi", "Merkez", "İdil", "Uludere", "Beytüşşebap", "Güçlükonak"],
  "Tekirdağ": ["Çorlu", "Süleymanpaşa", "Çerkezköy", "Kapaklı", "Ergene", "Malkara", "Saray", "Hayrabolu", "Şarköy", "Muratlı", "Marmaraereğlisi"],
  "Tokat": ["Merkez", "Erbaa", "Turhal", "Niksar", "Zile", "Reşadiye", "Almus", "Pazar", "Başçiftlik", "Yeşilyurt", "Artova", "Sulusaray"],
  "Trabzon": ["Ortahisar", "Akçaabat", "Araklı", "Of", "Yomra", "Arsin", "Vakfıkebir", "Sürmene", "Maçka", "Beşikdüzü", "Çarşıbaşı", "Tonya", "Düzköy", "Çaykara", "Şalpazarı", "Hayrat", "Köprübaşı", "Dernekpazarı"],
  "Tunceli": ["Merkez", "Pertek", "Mazgirt", "Çemişgezek", "Hozat", "Ovacık", "Pülümür", "Nazımiye"],
  "Uşak": ["Merkez", "Banaz", "Eşme", "Sivaslı", "Ulubey", "Karahallı"],
  "Van": ["İpekyolu", "Erciş", "Tuşba", "Edremit", "Özalp", "Çaldıran", "Başkale", "Muradiye", "Gürpınar", "Gevaş", "Saray", "Çatak", "Bahçesaray"],
  "Yalova": ["Merkez", "Çiftlikköy", "Çınarcık", "Altınova", "Armutlu", "Termal"],
  "Yozgat": ["Merkez", "Sorgun", "Yerköy", "Boğazlıyan", "Akdağmadeni", "Çayıralan", "Sarıkaya", "Şefaatli", "Saraykent", "Çekerek", "Kadışehri", "Aydıncık", "Yenifakılı", "Çandır"],
  "Zonguldak": ["Ereğli", "Merkez", "Çaycuma", "Devrek", "Kozlu", "Alaplı", "Kilimli", "Gökçebey"]
};

// --- SEKTÖR LİSTESİ ---
const INDUSTRIES = [
  "Teknoloji & Yazılım",
  "Bilişim & IT Hizmetleri",
  "E-Ticaret & Dijital Pazarlama",
  "İnşaat & Yapı",
  "Mimarlık & Mühendislik",
  "Altyapı & Proje Yönetimi",
  "Lojistik & Ulaşım",
  "Kargo & Kurye Hizmetleri",
  "Depolama & Ambar Yönetimi",
  "Sağlık & Medikal",
  "Hastane & Klinik",
  "Eczane & İlaç",
  "Tıbbi Cihaz & Ekipman",
  "Perakende & Mağazacılık",
  "Süpermarket & Market Zinciri",
  "Alışveriş Merkezi",
  "Üretim & Sanayi",
  "İmalat & Fabrika",
  "Makine & Metal İşleme",
  "Plastik & Kimya",
  "Finans & Bankacılık",
  "Sigorta & Emeklilik",
  "Yatırım & Varlık Yönetimi",
  "Finansal Danışmanlık",
  "Eğitim & Akademi",
  "Okul & Üniversite",
  "Özel Eğitim & Kurs",
  "Turizm & Otelcilik",
  "Restoran & Cafe",
  "Seyahat Acentesi",
  "Otomotiv",
  "Otomotiv Yan Sanayi",
  "Araç Kiralama & Servis",
  "Enerji & Madencilik",
  "Elektrik & Gaz Dağıtım",
  "Yenilenebilir Enerji",
  "Petrol & Doğalgaz",
  "Tekstil & Moda",
  "Hazır Giyim & Konfeksiyon",
  "Deri & Ayakkabı",
  "Ev Tekstili",
  "Gayrimenkul",
  "Emlak & Konut",
  "İnşaat & Geliştirme",
  "Gıda & İçecek",
  "Gıda Üretim & İşleme",
  "İçecek Sanayi",
  "Catering & Yemek Hizmetleri",
  "Danışmanlık",
  "Yönetim Danışmanlığı",
  "İK & İnsan Kaynakları",
  "Hukuk & Avukatlık",
  "Mali Müşavirlik & Muhasebe",
  "Hizmet Sektörü",
  "Temizlik & Güvenlik",
  "Bakım & Onarım",
  "Tarım & Hayvancılık",
  "Ziraat & Çiftçilik",
  "Sera & Bahçecilik",
  "Medya & İletişim",
  "Yayıncılık & Basın",
  "Reklam & Ajans",
  "Telekomünikasyon",
  "Mobil & İnternet Servis Sağlayıcı",
  "Çağrı Merkezi & BPO",
  "Savunma & Havacılık",
  "Savunma Sanayi",
  "Havayolu & Hava Taşımacılığı",
  "Denizcilik & Gemi İnşa",
  "Mobilya & Dekorasyon",
  "Ahşap & Marangoz",
  "İç Mimari & Tasarım",
  "Kozmetik & Kişisel Bakım",
  "Güzellik & SPA",
  "Spor & Fitness",
  "Spor Malzemeleri",
  "Etkinlik & Organizasyon",
  "Hukuk & Adalet",
  "Çevre & Atık Yönetimi",
  "Geri Dönüşüm",
  "Veterinerlik & Hayvan Sağlığı",
  "Kültür & Sanat",
  "Müze & Galeri",
  "Sosyal Hizmet & Vakıf",
  "Dernek & STK",
  "Diğer"
];

// --- YARDIMCI FONKSİYONLAR ---
// Safe localStorage wrapper
const safeLocalStorage = {
  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? item : defaultValue;
    } catch (error) {
      console.warn(`localStorage.getItem failed for key "${key}":`, error);
      return defaultValue;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`localStorage.setItem failed for key "${key}":`, error);
      return false;
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`localStorage.removeItem failed for key "${key}":`, error);
      return false;
    }
  }
};

const escapeHTML = (str) => {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

const formatPhoneNumber = (value) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const length = phoneNumber.length;

  if (length < 4) return phoneNumber;
  if (length < 7) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  if (length <= 10) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 10)}`;

  // For numbers longer than 10 digits, cap at 10
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 10)}`;
};

const Card = React.memo(({ children, className = "", hover = true, glass = false }) => (
  <div className={`
    ${glass
      ? 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50'
      : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'
    }
    rounded-2xl shadow-soft
    ${hover ? 'hover:shadow-xl hover:-translate-y-1 hover:border-slate-200 dark:hover:border-slate-600' : ''}
    transition-all duration-300 ease-out
    ${className}
  `}>
    {children}
  </div>
));
Card.displayName = 'Card';

const Button = React.memo(({ children, variant = 'primary', size = 'md', icon: Icon, onClick, type = 'button', disabled = false, className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50',
    secondary: 'bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-700 dark:text-slate-200 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-700 shadow-md',
    success: 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg shadow-emerald-500/30',
    danger: 'bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white shadow-lg shadow-rose-500/30',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-semibold rounded-xl
        flex items-center justify-center gap-2
        transition-all duration-300 ease-out
        hover:scale-105 hover:-translate-y-0.5
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0
        ${className}
      `}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
      {children}
    </button>
  );
});
Button.displayName = 'Button';

const Badge = React.memo(({ children, type, pulse = false }) => {
  const styles = {
    success: "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 dark:from-emerald-900/40 dark:to-emerald-900/20 dark:text-emerald-300 ring-1 ring-emerald-600/20 shadow-sm",
    warning: "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 dark:from-amber-900/40 dark:to-amber-900/20 dark:text-amber-300 ring-1 ring-amber-600/20 shadow-sm",
    danger: "bg-gradient-to-r from-rose-100 to-rose-50 text-rose-700 dark:from-rose-900/40 dark:to-rose-900/20 dark:text-rose-300 ring-1 ring-rose-600/20 shadow-sm",
    neutral: "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 dark:from-slate-700 dark:to-slate-800 dark:text-slate-300 ring-1 ring-slate-500/20 shadow-sm",
    blue: "bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 dark:from-pink-900/40 dark:to-pink-900/20 dark:text-pink-400 ring-1 ring-pink-600/20 shadow-sm"
  };
  return (
    <span className={`
      px-3 py-1 rounded-full text-xs font-semibold
      ${styles[type] || styles.neutral}
      ${pulse ? '' : ''}
      transition-all duration-200 hover:scale-105
    `}>
      {children}
    </span>
  );
});
Badge.displayName = 'Badge';

const HOURS = Array.from({ length: 10 }, (_, i) => (i + 9).toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

// --- BİLEŞENLER ---

const Toast = React.memo(({ message, onClose }) => (
  <div className="fixed top-6 right-6 z-[100] animate-fade-in">
    <div className="group bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-50 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 dark:border-slate-200/20 transition-all duration-200">
      <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full p-2 shadow-lg shadow-emerald-500/40">
        <CheckCircle size={18} className="text-white" strokeWidth={2.5} />
      </div>
      <span className="font-semibold text-sm text-white dark:text-slate-900">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 p-1 rounded-lg hover:bg-white/10 dark:hover:bg-slate-900/10 transition-all duration-300 hover:rotate-90 group-hover:scale-110"
      >
        <X size={18} className="text-white/80 dark:text-slate-900/80" />
      </button>
    </div>
  </div>
));
Toast.displayName = 'Toast';

const ReminderBox = React.memo(({ reminders, theme }) => {
  if (!reminders || reminders.length === 0) return null;
  return (
    <div className={`p-4 mb-6 rounded-2xl border-l-4 shadow-sm bg-gradient-to-r ${theme.classes.lightGradient} border-${theme.hex} relative overflow-hidden hover-lift animate-slide-up`}>
      <div className="flex items-start gap-4 relative z-10">
        <div className={`p-2 rounded-xl bg-white/80 dark:bg-black/20 shadow-sm backdrop-blur-sm animate-wiggle`}>
          <AlertTriangle className={theme.classes.text} size={20} />
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-sm mb-2 ${theme.classes.text} flex items-center gap-2`}>
            <Bell size={14} className="animate-shake" /> Günün Hatırlatmaları (<AnimatedCounter value={reminders.length} duration={500} />)
          </h3>
          <div className="space-y-2">
            {reminders.map((call, index) => (
              <div key={call.id} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 rounded-lg border border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center text-xs shadow-sm hover:translate-x-1 hover:shadow-md transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${theme.classes.primary} animate-pulse`}></div>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{call.companyName}</span>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <span className="text-slate-500 dark:text-slate-400">{call.contactPerson}</span>
                </div>
                <Badge type="warning">{call.result}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
ReminderBox.displayName = 'ReminderBox';

// GELİŞMİŞ FİLTRELEME VE ARAMA BARI
const AdvancedSearchBar = React.memo(({ searchQuery, setSearchQuery, filters, setFilters, showFilters, setShowFilters, calls, theme }) => {
  const uniqueResults = [...new Set(calls.map(c => c.result))];
  const uniqueIndustries = [...new Set(calls.map(c => c.industry))].filter(Boolean);

  const activeFiltersCount = Object.values(filters).filter(v => v !== 'all').length;

  return (
    <div className="space-y-4 mb-6 animate-slide-up">
      {/* Arama Çubuğu */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Firma, yetkili, telefon, email, şehir, notlar ara..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-pink-500 dark:focus:border-pink-400 focus:ring-4 focus:ring-pink-500/20 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
            showFilters || activeFiltersCount > 0
              ? `${theme.classes.primary} text-white shadow-lg`
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Filter size={18} />
          Filtreler
          {activeFiltersCount > 0 && (
            <span className="bg-white/30 px-2 py-0.5 rounded-full text-xs font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filtre Paneli */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-slate-200 dark:border-slate-700 animate-fade-in">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Sonuç</label>
            <select
              value={filters.result}
              onChange={(e) => setFilters({ ...filters, result: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none"
            >
              <option value="all">Tümü</option>
              {uniqueResults.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Personel</label>
            <select
              value={filters.caller}
              onChange={(e) => setFilters({ ...filters, caller: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none"
            >
              <option value="all">Tümü</option>
              {CALLERS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Sektör</label>
            <select
              value={filters.industry}
              onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none"
            >
              <option value="all">Tümü</option>
              {uniqueIndustries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Tarih Aralığı</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 outline-none"
            >
              <option value="all">Tüm Zamanlar</option>
              <option value="today">Bugün</option>
              <option value="week">Son 7 Gün</option>
              <option value="month">Son 30 Gün</option>
            </select>
          </div>

          {activeFiltersCount > 0 && (
            <div className="md:col-span-4 flex justify-end">
              <button
                onClick={() => setFilters({ result: 'all', caller: 'all', industry: 'all', dateRange: 'all' })}
                className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <X size={16} />
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      )}

      {/* Arama/Filtre Sonuç Bilgisi */}
      {(searchQuery || activeFiltersCount > 0) && (
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
          <span>
            <span className="font-bold text-slate-800 dark:text-white">{calls.length}</span> sonuç bulundu
          </span>
        </div>
      )}
    </div>
  );
});
AdvancedSearchBar.displayName = 'AdvancedSearchBar';

// MİNİMAL GÜNLÜK HEDEF BİLEŞENİ
const DailyGoal = React.memo(({ current, theme }) => {
  const progress = Math.min((current / DAILY_TARGET) * 100, 100);

  // Rozet
  const getBadgeIcon = (count) => {
      if (count >= 20) return "🏆";
      if (count >= 10) return "🚀";
      return "🌱";
  };

  return (
    <div className="mx-3 mb-4 animate-fade-in">
      <div className="flex justify-between items-end mb-1.5 px-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <Target size={12} /> Hedef
        </span>
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
           <AnimatedCounter value={current} duration={800} />/{DAILY_TARGET} <span className="text-[10px] ml-1 opacity-80  inline-block">{getBadgeIcon(current)}</span>
        </span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner relative">
        <div
          className={`h-full rounded-full transition-all duration-200 ease-out ${theme.classes.primary} relative overflow-hidden`}
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-gradient"></div>
        </div>
        {progress >= 100 && (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white animate-pulse">
            ✓ Tamamlandı!
          </div>
        )}
      </div>
    </div>
  );
});
DailyGoal.displayName = 'DailyGoal';

// Admin Panel Component
const AdminPanel = ({ isAuthenticated, onLogin, onLogout, password, setPassword, theme, calls, setCalls, tasks }) => {
  const [activeView, setActiveView] = useState('overview');
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState('all');
  const [selectedSector, setSelectedSector] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [taskPersonnelFilter, setTaskPersonnelFilter] = useState('all');

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <Card className="p-8">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${theme.classes.lightGradient}`}>
              <Lock size={32} className={theme.classes.text} />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Yönetici Paneli</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Devam etmek için giriş yapın</p>
            </div>
          </div>

          <form onSubmit={onLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin şifresini girin"
                className={`w-full p-3 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${theme.classes.border} ${theme.classes.ring}`}
                required
              />
            </div>
            <Button type="submit" variant="primary" className="w-full" icon={Shield}>
              Giriş Yap
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      alert('Lütfen silmek için kayıt seçin');
      return;
    }
    if (window.confirm(`${selectedIds.length} kayıt silinecek. Emin misiniz?`)) {
      setCalls(calls.filter(call => !selectedIds.includes(call.id)));
      setSelectedIds([]);
      setBulkDeleteMode(false);
    }
  };

  // Personel analizi
  const personnelStats = useMemo(() => {
    const stats = {};
    calls.forEach(call => {
      const caller = call.caller || 'Bilinmiyor';
      if (!stats[caller]) {
        stats[caller] = { total: 0, success: 0, pending: 0, failed: 0, sectors: {}, cities: {} };
      }
      stats[caller].total++;
      if (call.result === 'Randevu Alındı' || call.result === 'İlgililer') stats[caller].success++;
      else if (call.result === 'Tekrar Ara' || call.result === 'Whatsapp Gönderildi') stats[caller].pending++;
      else stats[caller].failed++;
      if (call.industry) stats[caller].sectors[call.industry] = (stats[caller].sectors[call.industry] || 0) + 1;
      if (call.city) stats[caller].cities[call.city] = (stats[caller].cities[call.city] || 0) + 1;
    });
    return stats;
  }, [calls]);

  // Sektör analizi
  const sectorStats = useMemo(() => {
    const stats = {};
    calls.forEach(call => {
      const sector = call.industry || 'Diğer';
      if (!stats[sector]) stats[sector] = { total: 0, success: 0, successRate: 0, personnel: {} };
      stats[sector].total++;
      if (call.result === 'Randevu Alındı' || call.result === 'İlgililer') stats[sector].success++;
      const caller = call.caller || 'Bilinmiyor';
      stats[sector].personnel[caller] = (stats[sector].personnel[caller] || 0) + 1;
    });
    Object.keys(stats).forEach(sector => {
      stats[sector].successRate = ((stats[sector].success / stats[sector].total) * 100).toFixed(1);
    });
    return stats;
  }, [calls]);

  // İş Takip İstatistikleri
  const taskStats = useMemo(() => {
    if (!tasks || tasks.length === 0) return null;

    const stats = {
      total: tasks.length,
      byPerson: {},
      byType: {},
      byStatus: { pending: 0, in_progress: 0, completed: 0 },
      totalTime: 0,
      todayTasks: 0,
      weekTasks: 0
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    tasks.forEach(task => {
      // Personel bazında
      if (!stats.byPerson[task.person]) {
        stats.byPerson[task.person] = { total: 0, completed: 0, inProgress: 0, pending: 0 };
      }
      stats.byPerson[task.person].total++;
      if (task.status === 'completed') stats.byPerson[task.person].completed++;
      if (task.status === 'in_progress') stats.byPerson[task.person].inProgress++;
      if (task.status === 'pending') stats.byPerson[task.person].pending++;

      // Tür bazında
      stats.byType[task.taskType] = (stats.byType[task.taskType] || 0) + 1;

      // Durum bazında
      stats.byStatus[task.status]++;

      // Süre hesabı
      if (task.startTime && task.endTime) {
        const [startH, startM] = task.startTime.split(':').map(Number);
        const [endH, endM] = task.endTime.split(':').map(Number);
        const minutes = (endH * 60 + endM) - (startH * 60 + startM);
        if (minutes > 0) stats.totalTime += minutes;
      }

      // Tarih bazında
      const taskDate = new Date(task.date);
      if (taskDate >= today) stats.todayTasks++;
      if (taskDate >= weekAgo) stats.weekTasks++;
    });

    return stats;
  }, [tasks]);

  // Filtrelenmiş görev istatistikleri
  const filteredTaskStats = useMemo(() => {
    if (!tasks || tasks.length === 0) return null;

    const filteredTasks = taskPersonnelFilter === 'all'
      ? tasks
      : tasks.filter(t => t.person === taskPersonnelFilter);

    if (filteredTasks.length === 0) return null;

    const stats = {
      total: filteredTasks.length,
      byPerson: {},
      byType: {},
      byStatus: { pending: 0, in_progress: 0, completed: 0 },
      totalTime: 0,
      todayTasks: 0,
      weekTasks: 0
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    filteredTasks.forEach(task => {
      // Personel bazında
      if (!stats.byPerson[task.person]) {
        stats.byPerson[task.person] = { total: 0, completed: 0, inProgress: 0, pending: 0 };
      }
      stats.byPerson[task.person].total++;
      if (task.status === 'completed') stats.byPerson[task.person].completed++;
      if (task.status === 'in_progress') stats.byPerson[task.person].inProgress++;
      if (task.status === 'pending') stats.byPerson[task.person].pending++;

      // Tür bazında
      stats.byType[task.taskType] = (stats.byType[task.taskType] || 0) + 1;

      // Durum bazında
      stats.byStatus[task.status]++;

      // Süre hesabı
      if (task.startTime && task.endTime) {
        const [startH, startM] = task.startTime.split(':').map(Number);
        const [endH, endM] = task.endTime.split(':').map(Number);
        const minutes = (endH * 60 + endM) - (startH * 60 + startM);
        if (minutes > 0) stats.totalTime += minutes;
      }

      // Tarih bazında
      const taskDate = new Date(task.date);
      if (taskDate >= today) stats.todayTasks++;
      if (taskDate >= weekAgo) stats.weekTasks++;
    });

    return stats;
  }, [tasks, taskPersonnelFilter]);

  // Filtrelenmiş çağrılar
  const filteredCalls = useMemo(() => {
    let filtered = [...calls];
    if (selectedPersonnel !== 'all') filtered = filtered.filter(c => c.caller === selectedPersonnel);
    if (selectedSector !== 'all') filtered = filtered.filter(c => c.industry === selectedSector);
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter(c => {
        const callDate = new Date(c.callDate);
        if (dateFilter === 'today') return callDate >= today;
        else if (dateFilter === 'week') {
          const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);
          return callDate >= weekAgo;
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(today); monthAgo.setMonth(monthAgo.getMonth() - 1);
          return callDate >= monthAgo;
        }
        return true;
      });
    }
    return filtered;
  }, [calls, selectedPersonnel, selectedSector, dateFilter]);

  const toggleSelection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${theme.classes.lightGradient} shadow-sm`}>
            <Shield size={24} className={theme.classes.text} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Yönetici Paneli</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Detaylı raporlama ve analiz</p>
          </div>
        </div>
        <Button onClick={onLogout} variant="danger" icon={Lock} size="sm">
          Çıkış Yap
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveView('overview')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
            activeView === 'overview'
              ? `bg-gradient-to-r ${theme.classes.gradient} text-white shadow-md`
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <BarChart3 size={16} className="inline mr-2" />
          Genel Bakış
        </button>
        <button
          onClick={() => setActiveView('personnel')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
            activeView === 'personnel'
              ? `bg-gradient-to-r ${theme.classes.gradient} text-white shadow-md`
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <Users size={16} className="inline mr-2" />
          Personel Analizi
        </button>
        <button
          onClick={() => setActiveView('sectors')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
            activeView === 'sectors'
              ? `bg-gradient-to-r ${theme.classes.gradient} text-white shadow-md`
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <PieChart size={16} className="inline mr-2" />
          Sektör Analizi
        </button>
        <button
          onClick={() => setActiveView('tasks')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
            activeView === 'tasks'
              ? `bg-gradient-to-r ${theme.classes.gradient} text-white shadow-md`
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <Clock size={16} className="inline mr-2" />
          İş Takip
        </button>
        <button
          onClick={() => setActiveView('bulk')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
            activeView === 'bulk'
              ? `bg-gradient-to-r ${theme.classes.gradient} text-white shadow-md`
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <Database size={16} className="inline mr-2" />
          Toplu İşlemler
        </button>
      </div>

      {/* Overview View */}
      {activeView === 'overview' && (
      <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Database size={20} className="text-blue-500" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Toplam Kayıt</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{calls.length}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Building size={20} className="text-green-500" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Benzersiz Firma</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{new Set(calls.map(c => c.companyName)).size}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users size={20} className="text-purple-500" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Aktif Personel</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{Object.keys(personnelStats).length}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase size={20} className="text-orange-500" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Aktif Sektör</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{Object.keys(sectorStats).length}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Hızlı İstatistikler</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400 font-semibold mb-1">Başarılı Aramalar</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {calls.filter(c => c.result === 'Randevu Alındı' || c.result === 'İlgililer').length}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-600 dark:text-yellow-400 font-semibold mb-1">Bekleyen</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {calls.filter(c => c.result === 'Tekrar Ara' || c.result === 'Whatsapp Gönderildi').length}
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold mb-1">Bu Ay</p>
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">
              {calls.filter(c => {
                const callDate = new Date(c.callDate);
                const now = new Date();
                return callDate.getMonth() === now.getMonth() && callDate.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
        </div>
      </Card>
      </div>
      )}

      {/* Personnel View */}
      {activeView === 'personnel' && (
        <div className="space-y-6">
          {/* Personel Filtresi */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Personel Filtresi</h3>
              <button
                onClick={() => setSelectedPersonnel('all')}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Tümünü Göster
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {CALLERS.map(caller => {
                const stats = personnelStats[caller] || { total: 0 };
                const isSelected = selectedPersonnel === caller;
                return (
                  <button
                    key={caller}
                    onClick={() => setSelectedPersonnel(caller)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? `border-${theme.classes.color}-500 bg-${theme.classes.color}-50 dark:bg-${theme.classes.color}-900/20`
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-10 h-10 mx-auto mb-2 rounded-full ${isSelected ? `bg-gradient-to-br ${theme.classes.gradient}` : 'bg-slate-200 dark:bg-slate-700'} flex items-center justify-center text-white font-bold`}>
                      {caller.charAt(0).toUpperCase()}
                    </div>
                    <p className={`text-sm font-semibold ${isSelected ? theme.classes.text : 'text-slate-700 dark:text-slate-300'}`}>{caller}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stats.total} arama</p>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Detaylı Personel İstatistikleri */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
              {selectedPersonnel === 'all' ? 'Tüm Personel' : selectedPersonnel} - Detaylı Performans
            </h3>
            <div className="space-y-4">
              {Object.entries(personnelStats)
                .filter(([name]) => selectedPersonnel === 'all' || name === selectedPersonnel)
                .sort((a, b) => b[1].total - a[1].total)
                .map(([name, stats]) => (
              <div key={name} className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Toplam {stats.total} arama</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.success}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Başarılı</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">{stats.success}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Başarılı</p>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Bekleyen</p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{stats.failed}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Olumsuz</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">En Çok Aradığı Sektörler:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(stats.sectors).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([sector, count]) => (
                      <span key={sector} className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded">
                        {sector} ({count})
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-2 space-y-2">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">En Çok Aradığı Şehirler:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(stats.cities).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([city, count]) => (
                      <span key={city} className="text-xs px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded">
                        {city} ({count})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

          {/* Seçili Personelin Kayıtları */}
          {selectedPersonnel !== 'all' && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                {selectedPersonnel} - Tüm Arama Kayıtları ({filteredCalls.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredCalls.length === 0 ? (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-8">Bu personele ait kayıt bulunamadı</p>
                ) : (
                  filteredCalls.slice(0, 50).map(call => (
                    <div key={call.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h5 className="font-semibold text-slate-900 dark:text-white text-sm">{call.companyName}</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            {call.industry} • {call.city} • {call.callDate}
                          </p>
                        </div>
                        <Badge variant={
                          call.result === 'Randevu Alındı' || call.result === 'İlgililer' ? 'success' :
                          call.result === 'Tekrar Ara' || call.result === 'Whatsapp Gönderildi' ? 'warning' :
                          'default'
                        }>
                          {call.result}
                        </Badge>
                      </div>
                      {call.notes && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">"{call.notes}"</p>
                      )}
                    </div>
                  ))
                )}
              </div>
              {filteredCalls.length > 50 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-3">
                  İlk 50 kayıt gösteriliyor. Toplam {filteredCalls.length} kayıt bulundu.
                </p>
              )}
            </Card>
          )}
        </div>
      )}

      {/* Sectors View */}
      {activeView === 'sectors' && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Sektör Bazlı Analiz</h3>
          <div className="space-y-4">
            {Object.entries(sectorStats).sort((a, b) => b[1].total - a[1].total).map(([sector, stats]) => (
              <div key={sector} className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{sector}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{stats.total} arama • Başarı oranı: %{stats.successRate}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${parseFloat(stats.successRate) > 50 ? 'text-green-600 dark:text-green-400' : parseFloat(stats.successRate) > 25 ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-600 dark:text-slate-400'}`}>
                      %{stats.successRate}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-3">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all" style={{ width: `${stats.successRate}%` }} />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="text-sm"><span className="text-slate-600 dark:text-slate-400">Toplam:</span><span className="font-bold text-slate-900 dark:text-white ml-2">{stats.total}</span></div>
                  <div className="text-sm"><span className="text-slate-600 dark:text-slate-400">Başarılı:</span><span className="font-bold text-green-600 dark:text-green-400 ml-2">{stats.success}</span></div>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Bu sektörü arayan personel:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(stats.personnel).sort((a, b) => b[1] - a[1]).map(([person, count]) => (
                      <span key={person} className="text-xs px-2 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded">
                        {person} ({count})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tasks View */}
      {activeView === 'tasks' && taskStats && (
        <div className="space-y-6">
          {/* Personel Filtresi */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Personel Filtresi</h3>
              <button
                onClick={() => setTaskPersonnelFilter('all')}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Tümünü Göster
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Object.keys(taskStats.byPerson).map(person => {
                const stats = taskStats.byPerson[person];
                const isSelected = taskPersonnelFilter === person;
                return (
                  <button
                    key={person}
                    onClick={() => setTaskPersonnelFilter(person)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? `border-${theme.classes.color}-500 bg-${theme.classes.color}-50 dark:bg-${theme.classes.color}-900/20`
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-10 h-10 mx-auto mb-2 rounded-full ${isSelected ? `bg-gradient-to-br ${theme.classes.gradient}` : 'bg-slate-200 dark:bg-slate-700'} flex items-center justify-center text-white font-bold`}>
                      {person.charAt(0).toUpperCase()}
                    </div>
                    <p className={`text-sm font-semibold ${isSelected ? theme.classes.text : 'text-slate-700 dark:text-slate-300'}`}>{person}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stats.total} görev</p>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Genel İstatistikler */}
          {filteredTaskStats ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <List size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{filteredTaskStats.total}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {taskPersonnelFilter === 'all' ? 'Toplam Görev' : `${taskPersonnelFilter} - Görev`}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{filteredTaskStats.byStatus.completed}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tamamlandı</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <Clock size={24} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{filteredTaskStats.byStatus.in_progress}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Devam Ediyor</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <Calendar size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{filteredTaskStats.todayTasks}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Bugün</p>
                </div>
              </div>
            </Card>
          </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-slate-500 dark:text-slate-400">Bu personel için görev bulunamadı</p>
            </Card>
          )}

          {/* Personel Görev Performansı */}
          {filteredTaskStats && (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Users size={20} />
              Personel Görev Performansı
            </h3>
            <div className="space-y-4">
              {Object.entries(filteredTaskStats.byPerson)
                .sort((a, b) => b[1].total - a[1].total)
                .map(([person, stats]) => (
                  <div key={person} className="border-b dark:border-slate-700 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.classes.gradient}`}></div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{person}</h4>
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{stats.total} görev</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Tamamlandı</p>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{stats.inProgress}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Devam Ediyor</p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/20 rounded-lg">
                        <p className="text-xl font-bold text-slate-600 dark:text-slate-400">{stats.pending}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Bekliyor</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                        <span>Tamamlanma Oranı</span>
                        <span className="font-semibold">{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${theme.classes.gradient} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          )}

          {/* Görev Türü Dağılımı */}
          {filteredTaskStats && (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <PieChart size={20} />
              Görev Türü Dağılımı
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(filteredTaskStats.byType)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => {
                  const percentage = Math.round((count / filteredTaskStats.total) * 100);
                  const typeLabels = {
                    call: { label: 'Arama', color: 'blue' },
                    meeting: { label: 'Toplantı', color: 'purple' },
                    followup: { label: 'Takip', color: 'green' },
                    research: { label: 'Araştırma', color: 'orange' },
                    application: { label: 'Başvuru', color: 'indigo' },
                    authorization: { label: 'Yetki Alma', color: 'red' },
                    iskur: { label: 'İşkur', color: 'teal' },
                    admin: { label: 'İdari', color: 'slate' },
                    break: { label: 'Mola', color: 'yellow' },
                    other: { label: 'Diğer', color: 'pink' }
                  };
                  const info = typeLabels[type] || { label: type, color: 'slate' };

                  return (
                    <div key={type} className={`text-center p-4 rounded-lg bg-${info.color}-50 dark:bg-${info.color}-900/20 border border-${info.color}-100 dark:border-${info.color}-800`}>
                      <p className={`text-2xl font-bold text-${info.color}-600 dark:text-${info.color}-400 mb-1`}>{count}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{info.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">%{percentage}</p>
                    </div>
                  );
                })}
            </div>
          </Card>

          )}

          {/* Çalışma Süresi */}
          {filteredTaskStats && filteredTaskStats.totalTime > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Clock size={20} />
                Toplam Çalışma Süresi
              </h3>
              <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl">
                <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {Math.floor(filteredTaskStats.totalTime / 60)}:{(filteredTaskStats.totalTime % 60).toString().padStart(2, '0')}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">saat:dakika</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                  {taskPersonnelFilter === 'all' ? 'Tüm görevlerin toplam süresi' : `${taskPersonnelFilter}'in toplam çalışma süresi`}
                </p>
              </div>
            </Card>
          )}

          {/* Haftalık Trend */}
          {filteredTaskStats && (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Aktivite Özeti
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{filteredTaskStats.todayTasks}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Bugünkü Görevler</p>
              </div>
              <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">{filteredTaskStats.weekTasks}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Bu Hafta</p>
              </div>
            </div>
          </Card>
          )}
        </div>
      )}

      {activeView === 'tasks' && !taskStats && (
        <Card className="p-12 text-center">
          <Clock size={64} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Henüz Görev Kaydı Yok</h3>
          <p className="text-slate-500 dark:text-slate-400">İş Takip sekmesinden görevler eklendiğinde burada görünecektir.</p>
        </Card>
      )}

      {/* Bulk View */}
      {activeView === 'bulk' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Filtreler</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Personel</label>
                <select value={selectedPersonnel} onChange={(e) => setSelectedPersonnel(e.target.value)} className={`w-full p-2 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`}>
                  <option value="all">Tümü</option>
                  {Object.keys(personnelStats).map(name => <option key={name} value={name}>{name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Sektör</label>
                <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)} className={`w-full p-2 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`}>
                  <option value="all">Tümü</option>
                  {Object.keys(sectorStats).sort().map(sector => <option key={sector} value={sector}>{sector}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Tarih</label>
                <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className={`w-full p-2 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`}>
                  <option value="all">Tüm Zamanlar</option>
                  <option value="today">Bugün</option>
                  <option value="week">Son 7 Gün</option>
                  <option value="month">Son 30 Gün</option>
                </select>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400"><strong>{filteredCalls.length}</strong> kayıt filtrelenmiş gösteriliyor</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Toplu Silme İşlemleri</h3>
              <div className="flex gap-2">
                {!bulkDeleteMode ? (
                  <Button onClick={() => { setBulkDeleteMode(true); setSelectedIds([]); }} variant="secondary" size="sm" icon={Trash2}>Toplu Sil Modunu Aç</Button>
                ) : (
                  <>
                    <Button onClick={() => setSelectedIds(filteredCalls.map(c => c.id))} variant="secondary" size="sm">Tümünü Seç ({filteredCalls.length})</Button>
                    <Button onClick={() => setSelectedIds([])} variant="secondary" size="sm">Temizle</Button>
                    <Button onClick={handleBulkDelete} variant="danger" size="sm" disabled={selectedIds.length === 0} icon={Trash2}>Sil ({selectedIds.length})</Button>
                    <Button onClick={() => { setBulkDeleteMode(false); setSelectedIds([]); }} variant="ghost" size="sm" icon={X}>İptal</Button>
                  </>
                )}
              </div>
            </div>

            {bulkDeleteMode && (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredCalls.map(call => (
                  <div key={call.id} onClick={() => toggleSelection(call.id)} className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedIds.includes(call.id) ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-rose-300'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900 dark:text-white">{call.companyName}</p>
                          <Badge variant={call.result === 'Randevu Alındı' || call.result === 'İlgililer' ? 'success' : call.result === 'Tekrar Ara' ? 'warning' : 'default'}>{call.result}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span><User size={12} className="inline" /> {call.caller}</span>
                          <span><Calendar size={12} className="inline" /> {call.callDate}</span>
                          <span><Briefcase size={12} className="inline" /> {call.industry}</span>
                          <span><MapPin size={12} className="inline" /> {call.city}</span>
                        </div>
                      </div>
                      <input type="checkbox" checked={selectedIds.includes(call.id)} onChange={() => toggleSelection(call.id)} className="w-5 h-5 ml-4" onClick={(e) => e.stopPropagation()} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!bulkDeleteMode && (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">Toplu silme işlemi için yukarıdaki butonu kullanın.</p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

// İş Takip Bileşeni
const TaskTracker = ({ tasks, setTasks, theme }) => {
  const [activeView, setActiveView] = useState('add'); // add, list, stats

  // Türkiye saatini al
  const getTurkeyDateTime = () => {
    const now = new Date();
    const turkeyTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
    return turkeyTime;
  };

  const getTurkeyDate = () => {
    const turkeyTime = getTurkeyDateTime();
    return turkeyTime.toISOString().split('T')[0];
  };

  const getTurkeyTime = () => {
    const turkeyTime = getTurkeyDateTime();
    const hours = turkeyTime.getHours().toString().padStart(2, '0');
    const minutes = turkeyTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [taskForm, setTaskForm] = useState({
    person: '',
    date: getTurkeyDate(),
    startTime: getTurkeyTime(),
    endTime: '',
    taskType: 'call',
    description: '',
    status: 'in_progress',
    priority: 'normal'
  });
  const [filterDate, setFilterDate] = useState(getTurkeyDate());
  const [filterPerson, setFilterPerson] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTaskType, setFilterTaskType] = useState('all');

  const TASK_TYPES = [
    { value: 'call', label: 'Arama', icon: Phone, color: 'blue' },
    { value: 'meeting', label: 'Toplantı', icon: Users, color: 'purple' },
    { value: 'followup', label: 'Takip', icon: CheckCircle, color: 'green' },
    { value: 'research', label: 'Araştırma', icon: Search, color: 'orange' },
    { value: 'application', label: 'Başvuru Yapma', icon: FileText, color: 'indigo' },
    { value: 'authorization', label: 'Yetki Alma', icon: Shield, color: 'red' },
    { value: 'iskur', label: 'İşkur İşlemleri', icon: Briefcase, color: 'teal' },
    { value: 'admin', label: 'İdari İşlem', icon: FileText, color: 'slate' },
    { value: 'break', label: 'Mola', icon: Clock, color: 'yellow' },
    { value: 'other', label: 'Diğer', icon: StickyNote, color: 'pink' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: Date.now(),
      ...taskForm,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
    setTaskForm({
      person: taskForm.person,
      date: getTurkeyDate(),
      startTime: getTurkeyTime(),
      endTime: '',
      taskType: 'call',
      description: '',
      status: 'in_progress',
      priority: 'normal'
    });
  };

  const deleteTask = (id) => {
    if (window.confirm('Bu görevi silmek istediğinize emin misiniz?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  // Excel Export Fonksiyonu
  const exportTasksToExcel = () => {
    if (filteredTasks.length === 0) {
      alert('Dışa aktarılacak görev bulunamadı!');
      return;
    }

    const headers = ['ID', 'Tarih', 'Başlangıç Saati', 'Bitiş Saati', 'Personel', 'Görev Türü', 'Açıklama', 'Durum', 'Öncelik', 'Oluşturma Tarihi'];

    const rows = filteredTasks.map(task => {
      const taskType = TASK_TYPES.find(t => t.value === task.taskType);
      const statusLabel = task.status === 'completed' ? 'Tamamlandı' :
                         task.status === 'in_progress' ? 'Devam Ediyor' : 'Bekliyor';
      const priorityLabel = task.priority === 'high' ? 'Yüksek' :
                           task.priority === 'low' ? 'Düşük' : 'Normal';

      return [
        task.id,
        task.date,
        task.startTime,
        task.endTime || '-',
        task.person,
        taskType?.label || task.taskType,
        `"${task.description.replace(/"/g, '""')}"`,
        statusLabel,
        priorityLabel,
        new Date(task.createdAt).toLocaleString('tr-TR')
      ].join(',');
    });

    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `Gorev_Listesi_${getTurkeyDate()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchDate = !filterDate || task.date === filterDate;
      const matchPerson = filterPerson === 'all' || task.person === filterPerson;
      const matchStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchTaskType = filterTaskType === 'all' || task.taskType === filterTaskType;
      return matchDate && matchPerson && matchStatus && matchTaskType;
    });
  }, [tasks, filterDate, filterPerson, filterStatus, filterTaskType]);

  const personnelList = useMemo(() => {
    return [...new Set(tasks.map(t => t.person))].filter(Boolean);
  }, [tasks]);

  const todayStats = useMemo(() => {
    const today = getTurkeyDate();
    const todayTasks = tasks.filter(t => t.date === today);
    return {
      total: todayTasks.length,
      completed: todayTasks.filter(t => t.status === 'completed').length,
      inProgress: todayTasks.filter(t => t.status === 'in_progress').length,
      pending: todayTasks.filter(t => t.status === 'pending').length
    };
  }, [tasks]);

  const detailedStats = useMemo(() => {
    const stats = {
      byPerson: {},
      byTaskType: {},
      byStatus: {},
      totalTime: 0
    };

    tasks.forEach(task => {
      // Personel bazında
      if (!stats.byPerson[task.person]) {
        stats.byPerson[task.person] = { total: 0, completed: 0, inProgress: 0, pending: 0 };
      }
      stats.byPerson[task.person].total++;
      if (task.status === 'completed') stats.byPerson[task.person].completed++;
      if (task.status === 'in_progress') stats.byPerson[task.person].inProgress++;
      if (task.status === 'pending') stats.byPerson[task.person].pending++;

      // Görev türü bazında
      if (!stats.byTaskType[task.taskType]) {
        stats.byTaskType[task.taskType] = 0;
      }
      stats.byTaskType[task.taskType]++;

      // Durum bazında
      if (!stats.byStatus[task.status]) {
        stats.byStatus[task.status] = 0;
      }
      stats.byStatus[task.status]++;

      // Toplam süre hesabı
      if (task.startTime && task.endTime) {
        const [startH, startM] = task.startTime.split(':').map(Number);
        const [endH, endM] = task.endTime.split(':').map(Number);
        const minutes = (endH * 60 + endM) - (startH * 60 + startM);
        if (minutes > 0) stats.totalTime += minutes;
      }
    });

    return stats;
  }, [tasks]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${theme.classes.lightGradient} shadow-sm`}>
            <Clock size={24} className={theme.classes.text} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">İş Takip Sistemi</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Günlük aktivite ve görev yönetimi</p>
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{todayStats.total}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Bugün Toplam</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{todayStats.completed}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tamamlandı</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setActiveView('add')} className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${activeView === 'add' ? `bg-gradient-to-r ${theme.classes.gradient} text-white shadow-md` : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
          <CheckCircle size={16} className="inline mr-2" />Görev Ekle
        </button>
        <button onClick={() => setActiveView('list')} className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${activeView === 'list' ? `bg-gradient-to-r ${theme.classes.gradient} text-white shadow-md` : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
          <List size={16} className="inline mr-2" />Görev Listesi
        </button>
        <button onClick={() => setActiveView('stats')} className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${activeView === 'stats' ? `bg-gradient-to-r ${theme.classes.gradient} text-white shadow-md` : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
          <BarChart3 size={16} className="inline mr-2" />İstatistikler
        </button>
      </div>

      {/* Add Task View */}
      {activeView === 'add' && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Yeni Görev Ekle</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Personel</label>
                <select required value={taskForm.person} onChange={(e) => setTaskForm({...taskForm, person: e.target.value})} className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`}>
                  <option value="">Personel Seçin</option>
                  {CALLERS.map(caller => <option key={caller} value={caller}>{caller}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Tarih</label>
                <input type="date" required value={taskForm.date} onChange={(e) => setTaskForm({...taskForm, date: e.target.value})} className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Başlangıç Saati</label>
                <input type="time" required value={taskForm.startTime} onChange={(e) => setTaskForm({...taskForm, startTime: e.target.value})} className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Bitiş Saati (Opsiyonel)</label>
                <input type="time" value={taskForm.endTime} onChange={(e) => setTaskForm({...taskForm, endTime: e.target.value})} className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Görev Türü</label>
                <select required value={taskForm.taskType} onChange={(e) => setTaskForm({...taskForm, taskType: e.target.value})} className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`}>
                  {TASK_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Durum</label>
                <select value={taskForm.status} onChange={(e) => setTaskForm({...taskForm, status: e.target.value})} className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`}>
                  <option value="pending">Bekliyor</option>
                  <option value="in_progress">Devam Ediyor</option>
                  <option value="completed">Tamamlandı</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Öncelik</label>
                <select value={taskForm.priority} onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})} className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`}>
                  <option value="low">Düşük</option>
                  <option value="normal">Normal</option>
                  <option value="high">Yüksek</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Açıklama</label>
              <textarea required value={taskForm.description} onChange={(e) => setTaskForm({...taskForm, description: e.target.value})} placeholder="Ne yaptınız? Detaylı açıklama..." rows={3} className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`} />
            </div>
            <Button type="submit" variant="primary" icon={CheckCircle} className="w-full md:w-auto">Görev Ekle</Button>
          </form>
        </Card>
      )}

      {/* Task List View */}
      {activeView === 'list' && (
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Tarih</label>
                <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className={`w-full p-2 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`} />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Personel</label>
                <select value={filterPerson} onChange={(e) => setFilterPerson(e.target.value)} className={`w-full p-2 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`}>
                  <option value="all">Tümü</option>
                  {personnelList.map(person => <option key={person} value={person}>{person}</option>)}
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Durum</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={`w-full p-2 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`}>
                  <option value="all">Tümü</option>
                  <option value="pending">Bekliyor</option>
                  <option value="in_progress">Devam Ediyor</option>
                  <option value="completed">Tamamlandı</option>
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Görev Türü</label>
                <select value={filterTaskType} onChange={(e) => setFilterTaskType(e.target.value)} className={`w-full p-2 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`}>
                  <option value="all">Tümü</option>
                  {TASK_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400">{filteredTasks.length} görev gösteriliyor</p>
              <Button onClick={exportTasksToExcel} variant="primary" icon={Download} className="text-sm">
                Excel İndir
              </Button>
            </div>
          </Card>

          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <Card className="p-8 text-center">
                <Clock size={48} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p className="text-slate-500 dark:text-slate-400">Henüz görev kaydedilmemiş</p>
              </Card>
            ) : (
              filteredTasks.sort((a, b) => `${b.date} ${b.startTime}`.localeCompare(`${a.date} ${a.startTime}`)).map(task => {
                const taskType = TASK_TYPES.find(t => t.value === task.taskType);
                const Icon = taskType?.icon || Clock;
                return (
                  <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg bg-${taskType?.color || 'slate'}-50 dark:bg-${taskType?.color || 'slate'}-900/20`}>
                          <Icon size={20} className={`text-${taskType?.color || 'slate'}-600 dark:text-${taskType?.color || 'slate'}-400`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="font-bold text-slate-900 dark:text-white">{task.person}</h4>
                            <Badge variant={task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'warning' : 'default'}>{task.status === 'completed' ? 'Tamamlandı' : task.status === 'in_progress' ? 'Devam Ediyor' : 'Bekliyor'}</Badge>
                            {task.priority === 'high' && <Badge variant="danger">Yüksek Öncelik</Badge>}
                            {task.priority === 'low' && <Badge variant="default">Düşük Öncelik</Badge>}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{task.description}</p>
                          <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span><Calendar size={12} className="inline" /> {task.date}</span>
                            <span><Clock size={12} className="inline" /> {task.startTime} - {task.endTime || '...'}</span>
                            <span className={`px-2 py-0.5 rounded bg-${taskType?.color || 'slate'}-50 dark:bg-${taskType?.color || 'slate'}-900/20 text-${taskType?.color || 'slate'}-600 dark:text-${taskType?.color || 'slate'}-400`}>{taskType?.label}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {task.status !== 'completed' && (
                          <button onClick={() => updateTaskStatus(task.id, 'completed')} className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 transition-colors" title="Tamamla">
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button onClick={() => deleteTask(task.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors" title="Sil">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Stats View */}
      {activeView === 'stats' && (
        <div className="space-y-6">
          {/* Genel İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <List size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{tasks.length}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Toplam Görev</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{detailedStats.byStatus.completed || 0}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tamamlandı</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <Clock size={24} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{detailedStats.byStatus.in_progress || 0}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Devam Ediyor</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <Users size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{Object.keys(detailedStats.byPerson).length}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Aktif Personel</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Personel Bazında İstatistikler */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Personel Performansı</h3>
            <div className="space-y-4">
              {Object.entries(detailedStats.byPerson).map(([person, stats]) => (
                <div key={person} className="border-b dark:border-slate-700 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white">{person}</h4>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{stats.total} görev</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Tamamlandı</p>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="font-bold text-yellow-600 dark:text-yellow-400">{stats.inProgress}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Devam Ediyor</p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-900/20 rounded-lg">
                      <p className="font-bold text-slate-600 dark:text-slate-400">{stats.pending}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Bekliyor</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                      <span>Tamamlanma Oranı</span>
                      <span>{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className={`bg-gradient-to-r ${theme.classes.gradient} h-2 rounded-full transition-all duration-300`} style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Görev Türü Dağılımı */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Görev Türü Dağılımı</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {TASK_TYPES.map(type => {
                const count = detailedStats.byTaskType[type.value] || 0;
                const percentage = tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0;
                const Icon = type.icon;
                return (
                  <div key={type.value} className={`text-center p-4 rounded-lg bg-${type.color}-50 dark:bg-${type.color}-900/20`}>
                    <Icon size={28} className={`mx-auto mb-2 text-${type.color}-600 dark:text-${type.color}-400`} />
                    <p className={`text-2xl font-bold text-${type.color}-600 dark:text-${type.color}-400`}>{count}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{type.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">%{percentage}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Toplam Çalışma Süresi */}
          {detailedStats.totalTime > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Toplam Çalışma Süresi</h3>
              <div className="text-center">
                <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  {Math.floor(detailedStats.totalTime / 60)} saat {detailedStats.totalTime % 60} dakika
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Kayıtlı görevlerin toplam süresi</p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

const SettingsView = ({ onBackup, onRestore, onDeleteAll, theme, setThemeColor }) => {
  const fileInputRef = useRef(null);
  const [apiKey, setApiKey] = useState(() => safeLocalStorage.getItem('geminiApiKey', ''));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onRestore(file);
  };
  
  const handleSaveApiKey = () => {
    if (safeLocalStorage.setItem('geminiApiKey', apiKey)) {
      alert("API Anahtarı kaydedildi!");
    } else {
      alert("API Anahtarı kaydedilemedi. Lütfen tarayıcı ayarlarınızı kontrol edin.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
       <div className="flex items-center gap-3 mb-6 px-1">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${theme.classes.lightGradient} shadow-sm`}>
          <Settings size={24} className={theme.classes.text} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Ayarlar</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Sistem yapılandırması</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* TEMA SEÇİCİ */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
              <Palette size={16} className={theme.classes.text} /> Tema Rengi
          </h3>
          <div className="flex flex-wrap gap-3">
            {Object.keys(THEMES).map(key => (
              <button 
                key={key}
                onClick={() => setThemeColor(key)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${THEMES[key].classes.primary} ${theme.label === THEMES[key].label ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-500 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
                title={THEMES[key].label}
              >
                {theme.label === THEMES[key].label && <CheckCircle size={14} className="text-white" />}
              </button>
            ))}
          </div>
        </Card>

         <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
              <Key size={16} className={theme.classes.text} /> Yapay Zeka
          </h3>
          <div className="flex gap-2">
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API Anahtarı..."
              className={`flex-1 p-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 ${theme.classes.ring} outline-none text-slate-900 dark:text-white transition-all`}
            />
            <button onClick={handleSaveApiKey} className={`px-4 py-2 rounded-lg text-sm font-bold text-white shadow-sm hover:shadow-md transition-all active:scale-95 ${theme.classes.primary} ${theme.classes.primaryHover}`}>Kaydet</button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group cursor-pointer" onClick={onBackup}>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Save size={16} className="text-blue-600 dark:text-blue-400"/>
                </div>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Yedekle</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 ml-11">Verileri JSON olarak indir.</p>
          </Card>

          <Card className="p-6 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors group cursor-pointer relative">
              <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload size={16} className="text-emerald-600 dark:text-emerald-400"/>
                </div>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Geri Yükle</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 ml-11">Yedek dosyasını yükle.</p>
          </Card>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <button onClick={onDeleteAll} className="text-red-400 hover:text-red-600 text-xs font-bold flex items-center gap-1.5 mx-auto transition-colors px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md">
            <Trash2 size={14} /> Tüm Verileri Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
};

const CallsTable = ({ data, title, onDownload, showActions = true, onEdit, onDelete, onToggleFavorite, showFavoriteToggle = true, showNotes = false, theme }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const itemsPerPage = 10;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'callDate') {
        aValue = new Date(a.callDate.split('.').reverse().join('-')).getTime();
        bValue = new Date(b.callDate.split('.').reverse().join('-')).getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 px-1">
        <div>
           <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">{title}</h2>
           <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">{data.length} kayıt listeleniyor</p>
        </div>
        
        <div className="flex items-center gap-3">
          {onDownload && (
            <button onClick={onDownload} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 ${theme.classes.text}`}>
              <Download size={14} /> <span className="hidden sm:inline">Excel İndir</span>
            </button>
          )}
        </div>
      </div>
    
      <Card className="overflow-hidden border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-700 text-xs uppercase tracking-wider">
              <tr>
                {showFavoriteToggle && <th className="p-3 w-10 text-center">#</th>}
                <th className="p-3">
                  <button onClick={() => handleSort('callDate')} className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                    Tarih {sortField === 'callDate' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </button>
                </th>
                <th className="p-3">
                  <button onClick={() => handleSort('companyName')} className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                    Firma {sortField === 'companyName' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </button>
                </th>
                <th className="p-3">
                  <button onClick={() => handleSort('contactPerson')} className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                    Yetkili {sortField === 'contactPerson' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </button>
                </th>
                <th className="p-3">İletişim</th>
                <th className="p-3 text-center">
                  <button onClick={() => handleSort('caller')} className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors mx-auto">
                    Per. {sortField === 'caller' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </button>
                </th>
                <th className="p-3 text-center">Konum</th>
                <th className="p-3">
                  <button onClick={() => handleSort('result')} className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                    Sonuç {sortField === 'result' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </button>
                </th>
                {showActions && <th className="p-3 text-right">İşlem</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedData.length === 0 ? (
                <tr><td colSpan="10" className="p-12 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center gap-2">
                    <Database size={24} className="opacity-20"/>
                    <span className="text-xs">Kayıt bulunamadı.</span>
                </td></tr>
              ) : (
                paginatedData.map((call) => (
                  <tr key={call.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    {showFavoriteToggle && (
                        <td className="p-3 text-center">
                            <button onClick={() => onToggleFavorite(call.id)} className={`transition-transform active:scale-90 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 ${call.isFavorite ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}>
                                <Star size={16} fill={call.isFavorite ? "currentColor" : "none"} />
                            </button>
                        </td>
                    )}
                    <td className="p-3 whitespace-nowrap">
                      <div className="font-medium text-slate-700 dark:text-slate-300 text-xs">{call.callDate}</div>
                      <div className="text-slate-400 text-[10px] flex items-center gap-1 mt-0.5"><Clock size={8}/> {call.callTime}</div>
                    </td>
                    <td className="p-3">
                        <div className="font-bold text-slate-800 dark:text-white text-sm">{call.companyName}</div>
                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wide">{call.industry}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-slate-700 dark:text-slate-300 text-sm font-medium">{call.contactPerson}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{call.contactTitle}</div>
                    </td>
                    <td className="p-3">
                       <div className="flex flex-col gap-1.5">
                           <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs font-mono">
                                <Phone size={10} className="opacity-50"/> {call.contactPhone || "-"}
                           </div>
                           {call.contactEmail && (
                                <a href={`mailto:${call.contactEmail}`} className={`flex items-center gap-1.5 text-[10px] truncate max-w-[120px] ${theme.classes.text} hover:underline`}>
                                    <Mail size={10} className="opacity-50"/> {call.contactEmail}
                                </a>
                           )}
                       </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 mx-auto border border-slate-200 dark:border-slate-600">
                        {call.caller ? call.caller.charAt(0) : "-"}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(call.companyName + ' ' + call.city + ' ' + call.district)}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-slate-300 hover:text-red-500 dark:text-slate-600 transition-colors inline-block p-1"
                          title="Haritada Göster"
                        >
                            <MapPin size={16} />
                        </a>
                    </td>
                    <td className="p-3">
                      <Badge type={
                        call.result.includes('Olumlu') || call.result.includes('Randevu') || call.result.includes('Mail') ? 'success' :
                        call.result.includes('Reddedildi') || call.result.includes('Yanlış') ? 'danger' : 'warning'
                      }>
                        {call.result}
                      </Badge>
                      {showNotes && call.notes && (
                         <div className="text-[10px] text-slate-400 mt-1.5 max-w-[150px] truncate pl-1.5 border-l-2 border-slate-100 dark:border-slate-700 italic">{call.notes}</div>
                      )}
                    </td>
                    {showActions && (
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <button onClick={() => onEdit(call)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors" title="Düzenle">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => onDelete(call.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors" title="Sil">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {data.length > itemsPerPage && (
          <div className="flex justify-between items-center p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
             <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Sayfa {currentPage} / {totalPages}</span>
             <div className="flex gap-1">
               <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 dark:text-white transition-colors shadow-sm"><ChevronLeft size={14}/></button>
               <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 dark:text-white transition-colors shadow-sm"><ChevronRight size={14}/></button>
             </div>
          </div>
        )}
      </Card>
    </div>
  );
};

// AI E-Posta Modalı
const AIEmailModal = ({ isOpen, onClose, data, onCopy, theme }) => {
    const [emailDraft, setEmailDraft] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isCancelled = false;

        const generateDraft = async () => {
            if (!isOpen || !data) return;

            setLoading(true);
            const prompt = `
              Bir kurumsal danışmanlık firması olan New Balance Danışmanlık için profesyonel bir e-posta taslağı yaz.

              Alıcı Bilgileri:
              - Firma: ${data.companyName}
              - İlgili Kişi: ${data.contactPerson}
              - Sektör: ${data.industry}

              Konu: Yurt Dışı İşçi Temini Hakkında (Devam Eden Görüşmemiz)

              Bağlam:
              Müşteri ile bir telefon görüşmesi yaptık. Görüşme sonucu: "${data.result}".
              Görüşme notları: "${data.notes}".

              E-postada şunlara değin:
              1. Görüşme için teşekkür et.
              2. İşçi açığı sorunlarını çözebileceğimizi nazikçe hatırlat.
              3. Eğer "Mail İstedi" ise tanıtım dosyasının ekte olduğunu belirt.
              4. Eğer "Teklif Bekliyor" ise teklifin ekte olduğunu veya yakında iletileceğini söyle.
              5. Profesyonel ve samimi bir dil kullan.
              6. İmza kısmına [Adınız] yaz.
            `;

            try {
                const response = await callGemini(prompt);
                if (!isCancelled) {
                    setEmailDraft(response);
                    setLoading(false);
                }
            } catch (error) {
                if (!isCancelled) {
                    console.error('Failed to generate email draft:', error);
                    setLoading(false);
                }
            }
        };

        if (isOpen && data) {
            generateDraft();
        }

        return () => {
            isCancelled = true;
        };
    }, [isOpen, data]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-white/10">
                <div className={`p-4 flex justify-between items-center text-white bg-gradient-to-r ${theme.classes.gradient}`}>
                    <h3 className="font-bold flex items-center gap-2"><Sparkles size={20}/> AI E-Posta Asistanı</h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X size={20}/></button>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <Loader2 className={`animate-spin ${theme.classes.text}`} size={48} />
                            <p className="text-slate-500 font-medium">Taslak hazırlanıyor...</p>
                        </div>
                    ) : (
                        <textarea 
                            className={`w-full h-80 p-5 border rounded-xl text-slate-700 dark:text-slate-200 dark:bg-slate-950 leading-relaxed outline-none resize-none shadow-inner ${theme.classes.border} focus:ring-2 ${theme.classes.ring} text-sm`}
                            value={emailDraft}
                            onChange={(e) => setEmailDraft(e.target.value)}
                        ></textarea>
                    )}
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition text-sm">Vazgeç</button>
                    <button 
                        onClick={() => { onCopy(emailDraft); onClose(); }}
                        disabled={loading}
                        className={`px-5 py-2.5 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100 text-sm ${theme.classes.primary} ${theme.classes.primaryHover}`}
                    >
                        <Copy size={16} /> Kopyala
                    </button>
                </div>
            </div>
        </div>
    );
};

const ScriptHelper = ({ theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState("Giriş & Tanışma (Soğuk Arama)");
  const [activeTab, setActiveTab] = useState('scripts'); // 'scripts' or 'ai'
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleAskAI = async () => {
      if (!aiPrompt.trim()) return;
      setAiLoading(true);
      const response = await callGemini(`
        Sen uzman bir satış koçu ve ikna uzmanısın. New Balance Danışmanlık (Yurt dışı işçi temini firması) personeli olarak aşağıdaki müşteri itirazına veya durumuna verilebilecek en profesyonel, ikna edici ve kısa cevabı yaz.
        
        Durum/İtiraz: "${aiPrompt}"
      `);
      setAiResponse(response);
      setAiLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        type="button"
        className={`text-xs font-bold hover:underline flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${theme.classes.text} border border-slate-200 dark:border-slate-700`}
      >
        <BookOpen size={14} /> Senaryo & AI
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[550px] ring-1 ring-white/10">
        <div className={`p-3 flex justify-between items-center text-white shrink-0 bg-gradient-to-r ${theme.classes.gradient}`}>
          <div className="flex gap-2 bg-black/10 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('scripts')}
                className={`font-bold text-xs flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${activeTab === 'scripts' ? 'bg-white text-slate-900 shadow-md' : 'text-white/80 hover:bg-white/10'}`}
              >
                <BookOpen size={14}/> Hazır Senaryolar
              </button>
              <button 
                onClick={() => setActiveTab('ai')}
                className={`font-bold text-xs flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${activeTab === 'ai' ? 'bg-white text-slate-900 shadow-md' : 'text-white/80 hover:bg-white/10'}`}
              >
                <Sparkles size={14}/> AI Asistanı
              </button>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X size={20}/></button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {activeTab === 'scripts' ? (
              <>
                <div className="w-1/3 bg-slate-50 dark:bg-slate-950/50 border-r border-slate-100 dark:border-slate-800 overflow-y-auto">
                    {Object.keys(SCRIPTS).map(key => (
                    <button
                        key={key}
                        onClick={() => setSelectedScript(key)}
                        className={`w-full text-left p-4 text-xs font-bold border-b border-slate-100 dark:border-slate-800 transition-colors ${selectedScript === key ? `bg-white dark:bg-slate-800 ${theme.classes.text} border-l-4 border-l-current shadow-sm` : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'}`}
                    >
                        {key}
                    </button>
                    ))}
                </div>
                <div className="w-2/3 p-6 bg-white dark:bg-slate-900 flex flex-col overflow-y-auto">
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">{selectedScript}</h4>
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed flex-1 whitespace-pre-wrap font-medium">{SCRIPTS[selectedScript]}</p>
                    <button 
                    onClick={() => { navigator.clipboard.writeText(SCRIPTS[selectedScript]); setIsOpen(false); }}
                    className="mt-4 bg-emerald-600 text-white py-2 px-6 rounded-xl font-bold text-xs hover:bg-emerald-700 self-end shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                    <Copy size={14} /> Kopyala & Kapat
                    </button>
                </div>
              </>
          ) : (
              <div className="w-full p-6 flex flex-col h-full bg-white dark:bg-slate-900">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
                      {aiResponse ? (
                          <div className={`p-4 rounded-xl border ${theme.classes.bgLight} ${theme.classes.border}`}>
                              <h5 className={`font-bold mb-2 flex items-center gap-2 text-sm ${theme.classes.textDark}`}><Sparkles size={16}/> Önerilen Cevap:</h5>
                              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
                              <div className="mt-4 flex justify-end">
                                <button 
                                    onClick={() => navigator.clipboard.writeText(aiResponse)}
                                    className={`text-[10px] bg-white dark:bg-slate-800 border px-3 py-1.5 rounded-lg hover:shadow-md flex items-center gap-2 font-bold transition-all ${theme.classes.text} ${theme.classes.border}`}
                                >
                                    <Copy size={12}/> Kopyala
                                </button>
                              </div>
                          </div>
                      ) : (
                          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 dark:text-slate-600">
                              <Sparkles size={48} className="mb-4 opacity-20"/>
                              <p className="text-sm font-medium">Müşterinin ne dediğini veya itirazını yazın,<br/>yapay zeka size anında cevap versin.</p>
                          </div>
                      )}
                  </div>
                  
                  <div className="mt-auto bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="flex gap-2">
                          <input 
                              type="text" 
                              value={aiPrompt}
                              onChange={(e) => setAiPrompt(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                              placeholder="Örn: Rakip firma daha ucuz fiyat verdi..."
                              className={`flex-1 p-3 border rounded-xl outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm text-sm ${theme.classes.border} focus:ring-2 ${theme.classes.ring}`}
                          />
                          <button 
                              onClick={handleAskAI}
                              disabled={aiLoading || !aiPrompt.trim()}
                              className={`text-white px-6 rounded-xl font-bold disabled:opacity-50 flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 text-sm ${theme.classes.primary} ${theme.classes.primaryHover}`}
                          >
                              {aiLoading ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>}
                              Sor
                          </button>
                      </div>
                  </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Timeline View Component (Close CRM Style)
const TimelineView = React.memo(({ data, onEdit, onDelete, theme }) => {
  const [selectedCall, setSelectedCall] = useState(null);

  const getActivityIcon = (result) => {
    if (result.includes('Görüşüldü') || result.includes('Randevu')) return { icon: CheckCircle, color: 'bg-emerald-500', ring: 'ring-emerald-500/20' };
    if (result.includes('Mail') || result.includes('Teklif')) return { icon: Mail, color: 'bg-blue-500', ring: 'ring-blue-500/20' };
    if (result.includes('Tekrar')) return { icon: Clock, color: 'bg-amber-500', ring: 'ring-amber-500/20' };
    if (result.includes('Reddedildi')) return { icon: XCircle, color: 'bg-rose-500', ring: 'ring-rose-500/20' };
    return { icon: Phone, color: 'bg-slate-400', ring: 'ring-slate-400/20' };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Left: Timeline Feed */}
      <div className="lg:col-span-2 space-y-4 overflow-y-auto pr-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Activity Timeline</h2>
          <Badge type="neutral">{data.length} aktivite</Badge>
        </div>

        {data.map((call, index) => {
          const activity = getActivityIcon(call.result);
          const Icon = activity.icon;

          return (
            <button
              key={call.id}
              onClick={() => setSelectedCall(call)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`w-full text-left group animate-slide-up ${selectedCall?.id === call.id ? 'ring-2 ring-pink-500' : ''}`}
            >
              <Card hover={true} className="p-4">
                <div className="flex gap-4">
                  {/* Icon Timeline */}
                  <div className="flex flex-col items-center">
                    <div className={`p-2 rounded-xl ${activity.color} ring-4 ${activity.ring} shadow-lg`}>
                      <Icon size={18} className="text-white" strokeWidth={2.5} />
                    </div>
                    {index < data.length - 1 && (
                      <div className="w-0.5 h-full bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-700 mt-2" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1 flex items-center gap-2">
                          {call.companyName}
                          {call.isFavorite && <Star size={14} fill="currentColor" className="text-amber-400" />}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <User size={14} /> {call.contactPerson}
                          {call.contactTitle && <span className="text-xs">• {call.contactTitle}</span>}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">{call.callDate}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{call.callTime}</p>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge type={activity.icon === CheckCircle ? 'success' : activity.icon === XCircle ? 'danger' : 'neutral'}>
                        {call.result}
                      </Badge>
                      <span className="text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                        {call.caller}
                      </span>
                      {call.industry && (
                        <span className="text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          <Briefcase size={12} className="inline mr-1" />
                          {call.industry}
                        </span>
                      )}
                    </div>

                    {/* Notes Preview */}
                    {call.notes && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                        {call.notes}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </button>
          );
        })}

        {data.length === 0 && (
          <Card className="p-12">
            <div className="text-center text-slate-400 dark:text-slate-500">
              <History size={48} className="mx-auto mb-3 opacity-50" />
              <p className="font-medium">Henüz aktivite yok</p>
            </div>
          </Card>
        )}
      </div>

      {/* Right: Contact Detail Panel */}
      <div className="lg:col-span-1">
        {selectedCall ? (
          <div className="sticky top-4 space-y-4 animate-fade-in">
            <Card hover={false} className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">İletişim Bilgileri</h3>
                <button
                  onClick={() => setSelectedCall(null)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Company Info */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    Firma
                  </label>
                  <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building size={16} className="text-slate-400" />
                    {selectedCall.companyName}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    Yetkili Kişi
                  </label>
                  <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <User size={16} className="text-slate-400" />
                    {selectedCall.contactPerson}
                    {selectedCall.contactTitle && (
                      <span className="text-xs text-slate-500">• {selectedCall.contactTitle}</span>
                    )}
                  </p>
                </div>

                {selectedCall.contactPhone && (
                  <div>
                    <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                      Telefon
                    </label>
                    <a
                      href={`tel:${selectedCall.contactPhone}`}
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                    >
                      <Phone size={16} />
                      {selectedCall.contactPhone}
                    </a>
                  </div>
                )}

                {selectedCall.contactEmail && (
                  <div>
                    <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                      E-posta
                    </label>
                    <a
                      href={`mailto:${selectedCall.contactEmail}`}
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                    >
                      <Mail size={16} />
                      {selectedCall.contactEmail}
                    </a>
                  </div>
                )}

                {(selectedCall.city || selectedCall.district) && (
                  <div>
                    <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                      Konum
                    </label>
                    <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      <MapPin size={16} className="text-slate-400" />
                      {selectedCall.city}{selectedCall.district && `, ${selectedCall.district}`}
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {selectedCall.notes && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                    Notlar
                  </label>
                  <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                    {selectedCall.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Edit}
                  onClick={() => onEdit(selectedCall)}
                  className="flex-1"
                >
                  Düzenle
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={() => {
                    onDelete(selectedCall.id);
                    setSelectedCall(null);
                  }}
                  className="flex-1"
                >
                  Sil
                </Button>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card hover={false} className="p-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Hızlı Bilgiler</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Personel</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedCall.caller}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Tarih & Saat</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedCall.callDate} {selectedCall.callTime}
                  </span>
                </div>
                {selectedCall.industry && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Sektör</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedCall.industry}</span>
                  </div>
                )}
                {selectedCall.employeeCount && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Çalışan Sayısı</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedCall.employeeCount}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        ) : (
          <Card hover={false} className="p-12 sticky top-4">
            <div className="text-center text-slate-400 dark:text-slate-500">
              <UserCircle size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">Detayları görmek için bir kayıt seçin</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
});
TimelineView.displayName = 'TimelineView';

// Modern Dashboard Component
const Dashboard = React.memo(({ stats, onNavigate, pendingCalls, recentCalls, theme }) => {
  const KPICard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <Card hover={true} className="p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon size={24} className="text-white" strokeWidth={2.5} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-4xl font-black text-slate-900 dark:text-white">
          <AnimatedCounter value={value} duration={1000} />
        </p>
        {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">{subtitle}</p>}
      </div>
    </Card>
  );

  const QuickActionCard = ({ icon: Icon, title, description, onClick, color }) => (
    <button
      onClick={onClick}
      className="group w-full text-left p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-soft hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} w-fit mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
        <Icon size={20} className="text-white" strokeWidth={2.5} />
      </div>
      <h3 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Güncel performans özeti ve hızlı aksiyonlar</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400 dark:text-slate-500">Bugün</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">{new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          icon={Phone}
          title="Bugünkü Aramalar"
          value={stats.todaysCalls}
          subtitle={`Hedef: ${DAILY_TARGET}`}
          color="from-pink-500 to-rose-600"
        />
        <KPICard
          icon={CheckCircle}
          title="Bu Hafta"
          value={stats.weeklyCalls}
          color="from-blue-500 to-cyan-600"
        />
        <KPICard
          icon={Target}
          title="Başarı Oranı"
          value={stats.successRate}
          subtitle="%"
          color="from-emerald-500 to-green-600"
          trend={12}
        />
        <KPICard
          icon={Hourglass}
          title="Takipte"
          value={pendingCalls.length}
          subtitle="işlem bekliyor"
          color="from-amber-500 to-orange-600"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Hızlı Aksiyonlar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            icon={Phone}
            title="Yeni Arama Ekle"
            description="Hızlıca yeni bir görüşme kaydı oluştur"
            onClick={() => onNavigate('entry')}
            color="from-pink-500 to-rose-600"
          />
          <QuickActionCard
            icon={List}
            title="Tüm Kayıtlar"
            description="Arama geçmişini görüntüle ve filtrele"
            onClick={() => onNavigate('list')}
            color="from-blue-500 to-cyan-600"
          />
          <QuickActionCard
            icon={FileBarChart}
            title="Raporlar"
            description="Detaylı istatistikler ve analizler"
            onClick={() => onNavigate('reports')}
            color="from-purple-500 to-indigo-600"
          />
        </div>
      </div>

      {/* Recent Activity & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <Card hover={false} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Hourglass size={20} className="text-amber-500" />
              Bekleyen İşler
            </h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('pending')}>
              Tümünü Gör →
            </Button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {pendingCalls.slice(0, 5).map((call, index) => (
              <div
                key={call.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 animate-slide-up"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{call.companyName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{call.contactPerson}</p>
                </div>
                <Badge type="warning">{call.result}</Badge>
              </div>
            ))}
            {pendingCalls.length === 0 && (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                <CheckCircle size={48} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium">Harika! Bekleyen iş yok.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card hover={false} className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History size={20} className="text-blue-500" />
              Son Aktiviteler
            </h2>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentCalls.slice(0, 5).map((call, index) => (
              <div
                key={call.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 animate-slide-up"
              >
                <div className={`p-2 rounded-lg ${call.result.includes('Görüşüldü') || call.result.includes('Randevu') ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  <Phone size={14} className={call.result.includes('Görüşüldü') || call.result.includes('Randevu') ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{call.companyName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{call.caller} • {call.callDate}</p>
                </div>
                <Badge type={call.result.includes('Görüşüldü') || call.result.includes('Randevu') ? 'success' : 'neutral'} pulse={false}>
                  {call.result}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
});
Dashboard.displayName = 'Dashboard';

const EntryForm = ({ formData, onChange, onTimeChange, onSubmit, editingId, onCancelEdit, reminders, allCalls, theme }) => {
  const [showAIEmail, setShowAIEmail] = useState(false);

  const historyMatch = useMemo(() => {
    if (!formData.companyName || editingId) return null;
    const searchName = formData.companyName.trim().toLowerCase();
    return allCalls.find(c => c.companyName.trim().toLowerCase() === searchName);
  }, [formData.companyName, allCalls, editingId]);

  return (
    <div className="max-w-4xl mx-auto relative animate-in fade-in slide-in-from-bottom-8 duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
         <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            {editingId ? <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-xl"><Edit size={24} className="text-amber-600 dark:text-amber-400" /></div> : <div className={`p-2 rounded-xl ${theme.classes.secondary}`}><CheckCircle size={24} /></div>}
            {editingId ? "Kaydı Düzenle" : "Yeni Arama Kaydı"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 ml-11 text-sm font-medium">
            {editingId ? "Bilgileri güncelleyin." : "Formu doldurarak yeni bir görüşme ekleyin."}
            </p>
         </div>
         <ScriptHelper theme={theme} />
      </div>

      <AIEmailModal isOpen={showAIEmail} onClose={() => setShowAIEmail(false)} data={formData} onCopy={(text) => navigator.clipboard.writeText(text)} theme={theme} />
      <ReminderBox reminders={reminders} theme={theme} />

      <form onSubmit={onSubmit} className="space-y-6">
        
        {/* GRUP 1: PERSONEL VE TEMEL BİLGİLER */}
        <Card className="p-6 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
           <div className="grid grid-cols-1 gap-4">
              <div>
                 <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 ml-1">Aramayı Yapan Personel</label>
                 <div className="relative group">
                    <UserCircle className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-current transition-colors" size={18} />
                    <select required name="caller" value={formData.caller} onChange={onChange} className={`w-full pl-10 p-3 bg-slate-50 dark:bg-slate-900/50 border rounded-xl focus:ring-2 outline-none text-slate-900 dark:text-white font-bold text-base appearance-none transition-all ${theme.classes.border} ${theme.classes.ring}`}>
                        <option value="">Personel Seçiniz...</option>
                        {CALLERS.sort().map(caller => <option key={caller} value={caller}>{caller}</option>)}
                    </select>
                 </div>
              </div>
           </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GRUP 2: FİRMA BİLGİLERİ */}
            <Card className="p-6 h-full flex flex-col">
            <h3 className={`text-base font-bold border-b border-slate-100 dark:border-slate-700 pb-3 mb-4 flex items-center gap-2 ${theme.classes.textDark}`}>
                <Building size={18} className={theme.classes.icon}/> Firma Bilgileri
            </h3>
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 ml-1">Firma Adı</label>
                    <input required type="text" name="companyName" value={formData.companyName} onChange={onChange} className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none dark:bg-slate-900 dark:text-white transition-all font-medium text-sm ${historyMatch ? 'border-amber-400 focus:ring-amber-500 bg-amber-50 dark:bg-amber-900/10' : `${theme.classes.border} ${theme.classes.ring}`}`} placeholder="Örn: ABC Lojistik A.Ş." />
                    {historyMatch && (
                        <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-2 text-[10px] text-amber-800 dark:text-amber-200 animate-in slide-in-from-top-2 fade-in">
                        <History className="shrink-0 mt-0.5" size={12} />
                        <div>
                            <strong>Dikkat:</strong> Bu firma <strong>{historyMatch.callDate}</strong> tarihinde <strong>{historyMatch.caller}</strong> tarafından aranmış. Sonuç: <span className="font-bold underline">{historyMatch.result}</span>
                        </div>
                        </div>
                    )}
                </div>
                
                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 ml-1">Sektör</label>
                    <div className="relative">
                        <select required name="industry" value={formData.industry} onChange={onChange} className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white appearance-none text-sm ${theme.classes.border} ${theme.classes.ring}`}>
                            <option value="">Seçiniz...</option>
                            {INDUSTRIES.map(industry => (
                                <option key={industry} value={industry}>{industry}</option>
                            ))}
                        </select>
                         <ChevronLeft className="absolute right-3 top-3 rotate-[-90deg] text-slate-400 pointer-events-none" size={14} />
                    </div>
                </div>
                
                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 ml-1">Tarih</label>
                    <input required type="date" name="callDate" value={formData.callDate} onChange={onChange} className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 ml-1">İl</label>
                        <div className="relative">
                            <select required name="city" value={formData.city} onChange={onChange} className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white appearance-none text-sm ${theme.classes.border} ${theme.classes.ring}`}>
                                <option value="">İl Seç...</option>
                                {Object.keys(CITIES_DATA).sort((a, b) => a.localeCompare(b, 'tr')).map(city => <option key={city} value={city}>{city}</option>)}
                            </select>
                             <ChevronLeft className="absolute right-3 top-3 rotate-[-90deg] text-slate-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 ml-1">İlçe</label>
                        <div className="relative">
                            <select required name="district" value={formData.district} onChange={onChange} disabled={!formData.city} className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white appearance-none text-sm ${theme.classes.border} ${theme.classes.ring}`}>
                                <option value="">İlçe Seç...</option>
                                {formData.city && [...CITIES_DATA[formData.city]].sort((a, b) => a.localeCompare(b, 'tr')).map(dist => <option key={dist} value={dist}>{dist}</option>)}
                            </select>
                            <ChevronLeft className="absolute right-3 top-3 rotate-[-90deg] text-slate-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 ml-1">Firma / Adres Detayı</label>
                    <textarea name="addressDetail" value={formData.addressDetail || ''} onChange={onChange} rows="2" className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none text-sm ${theme.classes.border} ${theme.classes.ring}`} placeholder="Açık adres veya not..."></textarea>
                </div>
            </div>
            </Card>

            {/* GRUP 3: İLETİŞİM */}
            <Card className="p-6 h-full flex flex-col">
            <h3 className={`text-base font-bold border-b border-slate-100 dark:border-slate-700 pb-3 mb-4 flex items-center gap-2 ${theme.classes.textDark}`}>
                <User size={18} className={theme.classes.icon}/> İletişim Bilgileri
            </h3>
            <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 ml-1">Görüşülen Kişi</label>
                        <input required type="text" name="contactPerson" value={formData.contactPerson} onChange={onChange} className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`} placeholder="Ad Soyad" />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 ml-1">Unvan</label>
                        <input required type="text" name="contactTitle" value={formData.contactTitle} onChange={onChange} className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`} placeholder="Örn: İK Müdürü" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 ml-1">E-Posta</label>
                    <input type="email" name="contactEmail" value={formData.contactEmail || ''} onChange={onChange} className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`} placeholder="email@firma.com" />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 ml-1">Aranan Numara</label>
                    <input required type="text" name="contactPhone" value={formData.contactPhone} onChange={onChange} className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm ${theme.classes.border} ${theme.classes.ring}`} placeholder="(5XX) ..." />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 ml-1">Cep No (Varsa)</label>
                    <input type="text" name="newContactPhone" value={formData.newContactPhone} onChange={onChange} className={`w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm`} placeholder="(5XX) ..." />
                </div>
            </div>
            </Card>
        </div>

        {/* GRUP 4: SONUÇ & DETAYLAR */}
        <Card className="p-6 border-b-4 border-b-slate-100 dark:border-b-slate-800">
           <h3 className={`text-base font-bold border-b border-slate-100 dark:border-slate-700 pb-3 mb-4 flex items-center gap-2 ${theme.classes.textDark}`}>
              <FileText size={18} className={theme.classes.icon}/> Görüşme Sonucu & Detaylar
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 ml-1">Görüşme Saati</label>
                    <div className="flex gap-2">
                    <select value={formData.callTime.split(':')[0]} onChange={(e) => onTimeChange('hour', e.target.value)} className={`w-1/2 p-2.5 border rounded-lg outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm ${theme.classes.border} ${theme.classes.ring}`}>
                        {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <select value={formData.callTime.split(':')[1]} onChange={(e) => onTimeChange('minute', e.target.value)} className={`w-1/2 p-2.5 border rounded-lg outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm ${theme.classes.border} ${theme.classes.ring}`}>
                        {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    </div>
                 </div>
                 
                 <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 ml-1">Çalışan Kişi Sayısı</label>
                    <input type="number" name="employeeCount" value={formData.employeeCount || ''} onChange={onChange} min="0" className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm ${theme.classes.border} ${theme.classes.ring}`} placeholder="Örn: 50" />
                 </div>

                 <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 ml-1">Görüşme Sonucu</label>
                    <div className="relative">
                        <select required name="result" value={formData.result} onChange={onChange} className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold appearance-none text-sm ${theme.classes.border} ${theme.classes.ring}`}>
                        <option value="Görüşüldü">✅ Görüşüldü (Olumlu)</option>
                        <option value="Mail İstedi">📧 Mail İstedi</option>
                        <option value="Randevu Alındı">📅 Randevu Alındı</option>
                        <option value="Teklif Bekliyor">📄 Teklif Bekliyor</option>
                        <option value="Yetkiliye İletildi">🗣️ Yetkiliye İletildi</option>
                        <option value="Tekrar Aranacak">🔄 Tekrar Aranacak</option>
                        <option value="Ulaşılamadı">📞 Ulaşılamadı</option>
                        <option value="Reddedildi">❌ Reddedildi (Olumsuz)</option>
                        <option value="Yanlış Numara">🚫 Yanlış Numara</option>
                        </select>
                        <ChevronLeft className="absolute right-3 top-3 rotate-[-90deg] text-slate-400 pointer-events-none" size={14} />
                    </div>
                 </div>
              </div>

              <div>
                 <div className="flex justify-between items-center mb-1.5 ml-1">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Notlar</label>
                    {(formData.result === "Mail İstedi" || formData.result === "Teklif Bekliyor") && (
                      <button type="button" onClick={() => setShowAIEmail(true)} className={`text-[10px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${theme.classes.text}`}>
                        <Sparkles size={12} /> AI ile Taslak Yaz
                      </button>
                    )}
                 </div>
                 <textarea name="notes" value={formData.notes} onChange={onChange} rows="8" className={`w-full p-3 border rounded-lg focus:ring-2 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none leading-relaxed shadow-inner text-sm ${theme.classes.border} ${theme.classes.ring}`} placeholder="Görüşme detaylarını buraya not edebilirsiniz..."></textarea>
              </div>
           </div>
        </Card>

        <div className="flex gap-4 pt-2">
          <button type="submit" className={`flex-1 font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-white shadow-lg shadow-current/20 hover:shadow-current/40 hover:-translate-y-1 transform active:scale-[0.98] ${editingId ? 'bg-amber-500 hover:bg-amber-600' : `${theme.classes.primary} ${theme.classes.primaryHover}`}`}>
            {editingId ? <Edit size={20} /> : <CheckCircle size={20} />}
            {editingId ? "Değişiklikleri Kaydet" : "Kaydı Tamamla"}
          </button>
          
          {editingId && (
            <button type="button" onClick={onCancelEdit} className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-4 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2">
              <X size={20} /> İptal
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// ... ReportsView and SettingsView components ...
const ReportsView = ({ stats, onExport, onDownloadHTML, onPrint, theme }) => {
  const formatDate = (date) => date.toLocaleDateString('tr-TR');
  const weekTitle = `Haftalık Rapor (${formatDate(stats.dateRanges.weekStart)} - ${formatDate(stats.dateRanges.weekEnd)})`;
  const monthTitle = `Aylık Rapor (${formatDate(stats.dateRanges.monthStart)} - ${formatDate(stats.dateRanges.monthEnd)})`;
  const maxHour = Math.max(...Object.values(stats.hourlyStats), 1);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex justify-between items-center bg-slate-800 dark:bg-slate-900 text-white p-6 rounded-xl shadow-lg">
        <div>
          <h2 className="text-2xl font-bold">Yönetici Paneli</h2>
          <p className="text-slate-300 dark:text-slate-400">Genel performans özeti ve raporlar</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-4">
            <button onClick={() => onExport(null, "Tum_Arama_Kayitlari")} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border border-emerald-500">
              <Download size={16} /> Tüm Veriler (Excel)
            </button>
            <div className="text-right">
              <div className="text-3xl font-bold"><AnimatedCounter value={stats.total} duration={1500} /></div>
              <div className="text-sm text-slate-400">Toplam Arama</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`p-6 border-l-4 hover-lift ${theme.classes.border.replace('border-200', 'border-500').replace('dark:border-800', '')}`}>
          <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Bu Hafta ({formatDate(stats.dateRanges.weekStart)} - ...)</div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white"><AnimatedCounter value={stats.weeklyCount} duration={1200} /></div>
          <div className="text-xs text-emerald-600 mt-2 font-medium">Bu hafta girilen kayıtlar</div>
        </Card>
        <Card className="p-6 border-l-4 border-amber-500 hover-lift">
          <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Bu Ay ({formatDate(stats.dateRanges.monthStart)} - ...)</div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white"><AnimatedCounter value={stats.monthlyCount} duration={1200} /></div>
          <div className="text-xs text-emerald-600 mt-2 font-medium">Bu ay girilen kayıtlar</div>
        </Card>
        <Card className="p-6 border-l-4 border-emerald-500 hover-lift">
          <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Verimlilik</div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white">
            <AnimatedCounter value={stats.total > 0 ? Math.round(((stats.results['Görüşüldü'] || 0) + (stats.results['Teklif Bekliyor'] || 0) + (stats.results['Randevu Alındı'] || 0) + (stats.results['Mail İstedi'] || 0)) / stats.total * 100) : 0} duration={1200} />%
          </div>
          <div className="text-xs text-slate-400 mt-2 font-medium">Olumlu Sonuç Oranı</div>
        </Card>
      </div>

      <Card className="p-6">
         <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Clock size={20} className={theme.classes.icon} /> Saatlik Arama Yoğunluğu
         </h3>
         <div className="h-40 flex items-end gap-1 border-b border-slate-200 dark:border-slate-700 pb-2">
            {HOURS.map(hour => {
              const count = stats.hourlyStats[hour] || 0;
              const height = (count / maxHour) * 100;
              return (
                <div key={hour} className="flex-1 flex flex-col items-center group">
                  <div className={`w-full ${theme.classes.bgLight} hover:bg-opacity-80 transition-all rounded-t relative`} style={{ height: `${height}%`, backgroundColor: theme.hex }}>
                     <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition">{count}</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">{hour}</span>
                </div>
              );
            })}
         </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <PieChart size={20} className={theme.classes.icon} /> Sektör Dağılımı
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.industries).map(([name, count]) => (
              <div key={name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 dark:text-slate-300">{name || "Belirtilmemiş"}</span>
                  <span className="font-medium text-slate-900 dark:text-white">{count}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{ width: `${(count / stats.total) * 100}%`, backgroundColor: theme.hex }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <FileText size={20} className={theme.classes.icon} /> Sonuç Analizi
          </h3>
          <div className="space-y-4">
            {Object.entries(stats.results).map(([name, count]) => (
              <div key={name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${name.includes('Reddedildi') || name.includes('Yanlış') ? 'bg-rose-500' : name.includes('Ulaşılamadı') || name.includes('Tekrar') || name.includes('Yetkiliye') ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{name}</span>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center mb-2">
           <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Haftalık Rapor</h3>
           <div className="flex gap-2">
             <button onClick={() => onPrint(stats.weeklyList, weekTitle)} className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Printer size={14} /> Yazdır / PDF Olarak Kaydet
              </button>
             <button onClick={() => onDownloadHTML(stats.weeklyList, weekTitle)} className={`text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${theme.classes.btn}`}>
                <FileBarChart size={14} /> Gelişmiş Rapor (Grafikli)
              </button>
           </div>
        </div>
        <CallsTable data={stats.weeklyList} title={weekTitle} showActions={false} showNotes={false} theme={theme} onDownload={() => onExport(stats.weeklyList, `Haftalik_Rapor_${formatDate(stats.dateRanges.weekStart)}_${formatDate(stats.dateRanges.weekEnd)}`)} />
        
        <div className="flex justify-between items-center mb-2 pt-6 border-t border-slate-200 dark:border-slate-700">
           <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Aylık Rapor</h3>
           <div className="flex gap-2">
             <button onClick={() => onPrint(stats.monthlyList, monthTitle)} className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Printer size={14} /> Yazdır / PDF Olarak Kaydet
              </button>
             <button onClick={() => onDownloadHTML(stats.monthlyList, monthTitle)} className={`text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${theme.classes.btn}`}>
                <FileBarChart size={14} /> Gelişmiş Rapor (Grafikli)
              </button>
           </div>
        </div>
        <CallsTable data={stats.monthlyList} title={monthTitle} showActions={false} showNotes={false} theme={theme} onDownload={() => onExport(stats.monthlyList, `Aylik_Rapor_${formatDate(stats.dateRanges.monthStart)}_${formatDate(stats.dateRanges.monthEnd)}`)} />
      </div>
    </div>
  );
};

// --- Ana Uygulama ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [calls, setCalls] = useState(() => {
    const saved = safeLocalStorage.getItem('companyCalls');
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Failed to parse saved calls:', error);
      return [];
    }
  });

  // İŞ TAKİP STATE
  const [tasks, setTasks] = useState(() => {
    const saved = safeLocalStorage.getItem('dailyTasks');
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Failed to parse saved tasks:', error);
      return [];
    }
  });

  // GELİŞMİŞ FİLTRELEME VE ARAMA
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    result: 'all',
    caller: 'all',
    industry: 'all',
    dateRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // DARK MODE STATE
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = safeLocalStorage.getItem('darkMode');
    if (savedTheme !== null) {
      return savedTheme === 'true';
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    return false;
  });

  // ADMIN PANEL STATE
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    const savedAuth = sessionStorage.getItem('adminAuth');
    return savedAuth === 'true';
  });
  const [adminPassword, setAdminPassword] = useState('');
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin2026'; // Production'da environment variable kullanılır

  // THEME STATE
  const [themeColor, setThemeColor] = useState(() => {
    return safeLocalStorage.getItem('themeColor', 'pink');
  });

  const theme = useMemo(() => THEMES[themeColor] || THEMES.pink, [themeColor]);

  // Dark Mode'u zorla uygula
  useEffect(() => {
    const root = window.document.documentElement;
    // Temizle
    root.classList.remove('light', 'dark'); 
    
    if (darkMode) {
      root.classList.add('dark');
      safeLocalStorage.setItem('darkMode', 'true');
    } else {
      root.classList.add('light');
      safeLocalStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  useEffect(() => {
    safeLocalStorage.setItem('themeColor', themeColor);
  }, [themeColor]);

  // Mobil Menü State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Tüm Kayıtlar sekmesi için filter state'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState('timeline'); // 'table' or 'timeline'

  const [editingId, setEditingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [currentSystemTime, setCurrentSystemTime] = useState(() => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    let finalHour = hour;
    if (hour < 9) finalHour = 9;
    else if (hour > 18) finalHour = 18;
    return {
      hour: finalHour.toString().padStart(2, '0'),
      minute: minute.toString().padStart(2, '0')
    };
  });
  const [isTimeManuallyChanged, setIsTimeManuallyChanged] = useState(false);

  const [formData, setFormData] = useState({
    caller: '', 
    companyName: '',
    callDate: new Date().toISOString().split('T')[0], 
    callTime: `${currentSystemTime.hour}:${currentSystemTime.minute}`,
    contactPerson: '',
    contactTitle: '',
    contactPhone: '',
    newContactPhone: '',
    contactEmail: '',
    employeeCount: '',
    industry: '',
    city: '',
    district: '',
    addressDetail: '', 
    result: 'Görüşüldü',
    notes: '',
    isFavorite: false 
  });

  // Server'dan gelen güncellemeleri takip etmek için ref
  const isServerUpdate = useRef(false);
  const isMounted = useRef(false);
  const syncTimeoutRef = useRef(null);

  // Sync service'e bağlan
  useEffect(() => {
    syncService.connect();

    // Sunucudan veri geldiğinde
    const handleInit = (data) => {
      console.log('📥 Initial data received from server');
      isServerUpdate.current = true;
      if (data.calls && data.calls.length > 0) {
        setCalls(data.calls);
      }
      if (data.tasks && data.tasks.length > 0) {
        setTasks(data.tasks);
      }
      setTimeout(() => {
        isServerUpdate.current = false;
        isMounted.current = true;
      }, 1000);
    };

    const handleCallsUpdated = (calls) => {
      console.log('📥 Calls updated from server:', calls.length, 'items');
      isServerUpdate.current = true;
      setCalls(calls);
      safeLocalStorage.setItem('companyCalls', JSON.stringify(calls));
      setTimeout(() => { isServerUpdate.current = false; }, 500);
    };

    const handleTasksUpdated = (tasks) => {
      console.log('📥 Tasks updated from server:', tasks.length, 'items');
      isServerUpdate.current = true;
      setTasks(tasks);
      safeLocalStorage.setItem('dailyTasks', JSON.stringify(tasks));
      setTimeout(() => { isServerUpdate.current = false; }, 500);
    };

    syncService.on('init', handleInit);
    syncService.on('callsUpdated', handleCallsUpdated);
    syncService.on('tasksUpdated', handleTasksUpdated);

    return () => {
      syncService.off('init', handleInit);
      syncService.off('callsUpdated', handleCallsUpdated);
      syncService.off('tasksUpdated', handleTasksUpdated);
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, []);

  // Calls değiştiğinde hem localStorage'a hem de sunucuya kaydet (debounced)
  useEffect(() => {
    safeLocalStorage.setItem('companyCalls', JSON.stringify(calls));

    // Server'dan gelen güncelleme ise tekrar gönderme
    if (!isServerUpdate.current && isMounted.current) {
      // Debounce: Hızlı değişiklikleri grupla
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(() => {
        syncService.updateCalls(calls);
        console.log('📤 Calls synced to server:', calls.length, 'items');
      }, 300);
    }
  }, [calls]);

  // Tasks değiştiğinde hem localStorage'a hem de sunucuya kaydet (debounced)
  useEffect(() => {
    safeLocalStorage.setItem('dailyTasks', JSON.stringify(tasks));

    // Server'dan gelen güncelleme ise tekrar gönderme
    if (!isServerUpdate.current && isMounted.current) {
      // Debounce: Hızlı değişiklikleri grupla
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(() => {
        syncService.updateTasks(tasks);
        console.log('📤 Tasks synced to server:', tasks.length, 'items');
      }, 300);
    }
  }, [tasks]);

  useEffect(() => {
    const uniqueCalls = calls.filter((call, index, self) =>
      index === self.findIndex((c) => c.id === call.id)
    );
    if (uniqueCalls.length !== calls.length) {
      setCalls(uniqueCalls);
    }
  }, []);

  useEffect(() => {
    if (!isTimeManuallyChanged && !editingId) {
      const interval = setInterval(() => {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        if (hour >= 9 && hour <= 18) {
          if (hour === 18 && minute > 0) {} else {
             const newTimeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
             setFormData(prev => ({ ...prev, callTime: newTimeStr }));
          }
        }
      }, 30000); 
      return () => clearInterval(interval);
    }
  }, [isTimeManuallyChanged, editingId]);

  const toggleFavorite = (id) => {
    setCalls(calls.map(call => 
      call.id === id ? { ...call, isFavorite: !call.isFavorite } : call
    ));
  };

  // ... (Yedekleme ve diğer fonksiyonlar aynı) ...
  const handleBackup = () => {
    const dataStr = JSON.stringify(calls, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Calla_Yedek_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage("Yedek dosyası indirildi.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRestore = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (Array.isArray(json)) {
          if (window.confirm("Mevcut veriler silinip yedek dosyasındaki veriler yüklenecek. Emin misiniz?")) {
            setCalls(json);
            setToastMessage("Veriler başarıyla geri yüklendi.");
            setTimeout(() => setToastMessage(null), 3000);
          }
        } else {
          alert("Geçersiz yedek dosyası formatı.");
        }
      } catch (error) {
        alert("Dosya okunurken hata oluştu.");
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteAll = () => {
    if (window.confirm("DİKKAT! Tüm kayıtlar kalıcı olarak silinecek. Bu işlem geri alınamaz. Emin misiniz?")) {
      setCalls([]);
      setToastMessage("Tüm veriler silindi.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const printReport = (dataToPrint, reportTitle) => {
    // ... (Önceki print fonksiyonu aynı) ...
     if (dataToPrint.length === 0) {
      setToastMessage("Yazdırılacak veri bulunamadı.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    const total = dataToPrint.length;
    let successCount = 0;
    dataToPrint.forEach(c => {
      if (['Görüşüldü', 'Randevu Alındı', 'Teklif Bekliyor', 'Mail İstedi'].includes(c.result)) {
        successCount++;
      }
    });
    const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0;
    const printWindow = window.open('', '_blank');
    if (!printWindow) { alert("Lütfen açılır pencerelere izin verin."); return; }
    const htmlContent = `
      <html>
      <head>
        <title>${reportTitle}</title>
        <style>
          @media print { @page { size: A4; margin: 1cm; } }
          body { font-family: sans-serif; color: #333; }
          h1 { color: #1e3a8a; text-align: center; }
          .summary { margin: 20px 0; padding: 15px; background: #f1f5f9; border: 1px solid #ddd; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { background: #1e40af; color: white; padding: 8px; text-align: left; }
          td { border-bottom: 1px solid #ddd; padding: 6px; }
          .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h1>${escapeHTML(reportTitle)}</h1>
        <div class="summary"><strong>Toplam Arama:</strong> ${total} | <strong>Olumlu Dönüş:</strong> ${successCount} | <strong>Başarı Oranı:</strong> %${successRate}</div>
        <table><thead><tr><th>Tarih</th><th>Firma</th><th>Yetkili</th><th>Telefon</th><th>Sonuç</th></tr></thead><tbody>
            ${dataToPrint.map(row => `<tr><td>${escapeHTML(row.callDate)}</td><td>${escapeHTML(row.companyName)}</td><td>${escapeHTML(row.contactPerson)}</td><td>${escapeHTML(row.contactPhone)}</td><td>${escapeHTML(row.result)}</td></tr>`).join('')}
        </tbody></table>
        <div class="footer">Calla CRM | developed by Ege</div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const downloadAdvancedReport = (dataToPrint, reportTitle) => {
      if (dataToPrint.length === 0) {
      setToastMessage("Raporlanacak veri bulunamadı.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    const total = dataToPrint.length;
    let successCount = 0;
    const positiveOutcomes = ['Görüşüldü', 'Randevu Alındı', 'Teklif Bekliyor', 'Mail İstedi', 'Yetkiliye İletildi'];
    const sectorCounts = {};
    const resultCounts = {};
    const dailyCounts = {};
    let totalEmployees = 0;
    dataToPrint.forEach(c => {
      if (positiveOutcomes.includes(c.result)) successCount++;
      sectorCounts[c.industry] = (sectorCounts[c.industry] || 0) + 1;
      resultCounts[c.result] = (resultCounts[c.result] || 0) + 1;
      dailyCounts[c.callDate] = (dailyCounts[c.callDate] || 0) + 1;
      if (c.employeeCount) totalEmployees += parseInt(c.employeeCount, 10);
    });
    const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0;
    const busiestDay = Object.keys(dailyCounts).sort((a,b) => dailyCounts[b] - dailyCounts[a])[0] || "-";
    const sectorLabels = JSON.stringify(Object.keys(sectorCounts));
    const sectorData = JSON.stringify(Object.values(sectorCounts));
    const resultLabels = JSON.stringify(Object.keys(resultCounts));
    const resultData = JSON.stringify(Object.values(resultCounts));
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>${reportTitle}</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; padding: 40px; }
          .container { max-width: 1000px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
          h1 { color: #1e3a8a; text-align: center; margin-bottom: 5px; }
          .subtitle { text-align: center; color: #64748b; margin-bottom: 30px; }
          .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
          .kpi-card { background: #eff6ff; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #bfdbfe; }
          .kpi-val { font-size: 28px; font-weight: bold; color: #1e40af; display: block; }
          .kpi-lbl { font-size: 12px; color: #60a5fa; text-transform: uppercase; font-weight: bold; }
          .charts-row { display: flex; gap: 30px; margin-bottom: 40px; }
          .chart-container { flex: 1; height: 300px; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { background: #f1f5f9; padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0; color: #475569; }
          td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
          .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>YÖNETİCİ PERFORMANS RAPORU</h1>
          <div class="subtitle">${reportTitle}</div>
          <div class="kpi-grid">
            <div class="kpi-card"><span class="kpi-val">${total}</span><span class="kpi-lbl">Toplam Arama</span></div>
            <div class="kpi-card"><span class="kpi-val">%${successRate}</span><span class="kpi-lbl">Başarı Oranı</span></div>
            <div class="kpi-card"><span class="kpi-val">${totalEmployees}</span><span class="kpi-lbl">Toplam Çalışan Sayısı</span></div>
            <div class="kpi-card"><span class="kpi-val">${busiestDay}</span><span class="kpi-lbl">En Aktif Gün</span></div>
          </div>
          <div class="charts-row">
            <div class="chart-container"><canvas id="sectorChart"></canvas></div>
            <div class="chart-container"><canvas id="resultChart"></canvas></div>
          </div>
          <h3>Arama Kayıt Dökümü</h3>
          <table><thead><tr><th>Tarih</th><th>Firma</th><th>Yetkili</th><th>Sektör</th><th>Çalışan Sayısı</th><th>Sonuç</th></tr></thead><tbody>
              ${dataToPrint.map(r => `<tr><td>${r.callDate}</td><td>${r.companyName}</td><td>${r.contactPerson}</td><td>${r.industry}</td><td>${r.employeeCount || '-'}</td><td>${r.result}</td></tr>`).join('')}
          </tbody></table>
          <div class="footer">Rapor Tarihi: ${new Date().toLocaleString('tr-TR')} | Calla CRM - developed by Ege</div>
        </div>
        <script>
          const ctx1 = document.getElementById('sectorChart');
          new Chart(ctx1, { type: 'bar', data: { labels: ${sectorLabels}, datasets: [{ label: 'Sektör Dağılımı', data: ${sectorData}, backgroundColor: '#3b82f6', borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Sektör Analizi' } } } });
          const ctx2 = document.getElementById('resultChart');
          new Chart(ctx2, { type: 'doughnut', data: { labels: ${resultLabels}, datasets: [{ data: ${resultData}, backgroundColor: ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#6366f1'], }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Sonuç Dağılımı' } } } });
        </script>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Calla_Gelismiş_Rapor_${new Date().toISOString().slice(0,10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (dataToExport = calls, fileNamePrefix = "Tum_Arama_Kayitlari") => {
      const data = dataToExport || calls;
    if (data.length === 0) {
      setToastMessage("Dışa aktarılacak kayıt bulunamadı.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    let tableContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Arama Kayıtları</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <style>table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #000000; padding: 8px; text-align: left; vertical-align: top; font-family: Arial, sans-serif; font-size: 12px; } th { background-color: #f2f2f2; font-weight: bold; } .text { mso-number-format:"\\@"; } </style></head>
      <body><table><thead><tr><th>ID</th><th>Tarih</th><th>Saat</th><th>Personel</th><th>Firma Adı</th><th>Sektör</th><th>İl</th><th>İlçe</th><th>İlgili Kişi</th><th>Unvan</th><th>E-Posta</th><th>Telefon</th><th>Yeni Telefon</th><th>Çalışan Sayısı</th><th>Sonuç</th><th>Notlar</th></tr></thead><tbody>
    `;
    data.forEach(call => {
      tableContent += `<tr><td>${call.id}</td><td>${call.callDate}</td><td>${call.callTime}</td><td>${call.caller || ''}</td><td>${call.companyName || ''}</td><td>${call.industry || ''}</td><td>${call.city || ''}</td><td>${call.district || ''}</td><td>${call.contactPerson || ''}</td><td>${call.contactTitle || ''}</td><td>${call.contactEmail || ''}</td><td class="text">${call.contactPhone || ''}</td><td class="text">${call.newContactPhone || ''}</td><td>${call.employeeCount || ''}</td><td>${call.result || ''}</td><td>${(call.notes || '').replace(/(\r\n|\n|\r)/gm, " ")}</td></tr>`;
    });
    tableContent += `</tbody></table></body></html>`;
    const blob = new Blob([tableContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileNamePrefix}_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '-')}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'city') {
      setFormData(prev => ({ ...prev, [name]: value, district: '' }));
    } else if (name === 'contactPhone' || name === 'newContactPhone') {
      const formatted = formatPhoneNumber(value);
      if (formatted.length <= 15) {
        setFormData(prev => ({ ...prev, [name]: formatted }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTimeChange = (type, value) => {
    setFormData(prev => {
      const [currentHour, currentMinute] = prev.callTime.split(':');
      let newTime;
      if (type === 'hour') {
        newTime = `${value}:${currentMinute}`;
      } else {
        newTime = `${currentHour}:${value}`;
      }
      setIsTimeManuallyChanged(true);
      return { ...prev, callTime: newTime };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setCalls(prevCalls => prevCalls.map(call =>
        call.id === editingId ? { ...formData, id: editingId, createdAt: call.createdAt } : call
      ));
      setToastMessage("Kayıt başarıyla güncellendi!");
      setTimeout(() => setToastMessage(null), 3000);
      setEditingId(null);
      createConfetti(); // Konfeti animasyonu
    } else {
      const newId = Date.now() + Math.floor(Math.random() * 10000);
      const newCall = { id: newId, createdAt: new Date().toISOString(), ...formData };
      setCalls(prevCalls => [newCall, ...prevCalls]);
      setToastMessage("Arama kaydı başarıyla eklendi!");
      setTimeout(() => setToastMessage(null), 3000);
      createConfetti(); // Konfeti animasyonu
    }
    setFormData(prev => ({
      ...prev,
      companyName: '',
      contactPerson: '',
      contactTitle: '',
      contactPhone: '',
      newContactPhone: '',
      contactEmail: '',
      employeeCount: '',
      industry: '',
      city: '',
      district: '',
      addressDetail: '', 
      result: 'Görüşüldü',
      notes: '',
      isFavorite: false
    }));
    setIsTimeManuallyChanged(false);
  };

  const handleEdit = (call) => {
    setFormData(call);
    setEditingId(call.id);
    setActiveTab('entry');
    window.scrollTo(0,0);
    setIsTimeManuallyChanged(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(prev => ({
      ...prev,
      companyName: '',
      contactPerson: '',
      contactTitle: '',
      contactPhone: '',
      newContactPhone: '',
      contactEmail: '',
      employeeCount: '',
      industry: '',
      city: '',
      district: '',
      addressDetail: '',
      result: 'Görüşüldü',
      notes: ''
    }));
    setIsTimeManuallyChanged(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
      setCalls(calls.filter(call => call.id !== id));
    }
  };

  // Admin Panel Handlers
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setAdminPassword('');
      showToast('Admin paneline giriş yapıldı', 'success');
    } else {
      showToast('Hatalı şifre!', 'error');
      setAdminPassword('');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    showToast('Admin panelinden çıkış yapıldı', 'info');
    setActiveTab('dashboard');
  };

  const pendingCalls = useMemo(() => {
    return calls.filter(call => PENDING_STATUSES.includes(call.result));
  }, [calls]);

  // FİLTRELENMİŞ VE ARANMIŞ ÇAĞRILAR (Ana Sayfa ve Raporlar için)
  const filteredCallsMain = useMemo(() => {
    let filtered = [...calls];

    // Arama sorgusu
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(call =>
        call.companyName?.toLowerCase().includes(query) ||
        call.contactPerson?.toLowerCase().includes(query) ||
        call.contactPhone?.includes(query) ||
        call.contactEmail?.toLowerCase().includes(query) ||
        call.city?.toLowerCase().includes(query) ||
        call.district?.toLowerCase().includes(query) ||
        call.notes?.toLowerCase().includes(query)
      );
    }

    // Sonuç filtresi
    if (filters.result !== 'all') {
      filtered = filtered.filter(call => call.result === filters.result);
    }

    // Personel filtresi
    if (filters.caller !== 'all') {
      filtered = filtered.filter(call => call.caller === filters.caller);
    }

    // Sektör filtresi
    if (filters.industry !== 'all') {
      filtered = filtered.filter(call => call.industry === filters.industry);
    }

    // Tarih aralığı filtresi
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const today = now.toISOString().split('T')[0];

      filtered = filtered.filter(call => {
        const callDate = call.callDate.split('.').reverse().join('-');

        switch (filters.dateRange) {
          case 'today':
            return callDate === today;
          case 'week': {
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(callDate) >= weekAgo;
          }
          case 'month': {
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return new Date(callDate) >= monthAgo;
          }
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [calls, searchQuery, filters]);

  // TÜM KAYITLAR SEKMESİ İÇİN FİLTRELEME
  const filteredCalls = useMemo(() => {
    return calls.filter(call => {
      const matchesSearch =
        !searchTerm ||
        (call.companyName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (call.contactPerson?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (call.caller?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      const matchesResult = !filterResult || call.result === filterResult;
      const matchesFavorite = !showFavoritesOnly || call.isFavorite;

      let matchesDateRange = true;
      if (startDate || endDate) {
        const callDate = new Date(call.callDate.split('.').reverse().join('-'));
        matchesDateRange =
          (!startDate || callDate >= new Date(startDate)) &&
          (!endDate || callDate <= new Date(endDate));
      }

      return matchesSearch && matchesResult && matchesDateRange && matchesFavorite;
    });
  }, [calls, searchTerm, filterResult, startDate, endDate, showFavoritesOnly]);

  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const dayOfWeek = now.getDay() || 7; 
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek + 1); 
    startOfWeek.setHours(0,0,0,0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); 
    endOfWeek.setHours(23,59,59,999);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23,59,59,999);
    const filterByRange = (start, end) => calls.filter(c => {
      const callDate = new Date(c.callDate);
      return callDate >= start && callDate <= end;
    });
    const weeklyCalls = filterByRange(startOfWeek, endOfWeek);
    const monthlyCalls = filterByRange(startOfMonth, endOfMonth);
    const todaysReminders = calls.filter(c => 
      c.callDate === todayStr && 
      (c.result === 'Tekrar Aranacak' || c.result === 'Randevu Alındı')
    );
    const todaysCalls = calls.filter(c => c.callDate === todayStr).length;
    const hourlyStats = {};
    calls.forEach(c => { if (c.callTime) { const hour = c.callTime.split(':')[0]; hourlyStats[hour] = (hourlyStats[hour] || 0) + 1; } });
    const industries = {};
    calls.forEach(c => { industries[c.industry] = (industries[c.industry] || 0) + 1; });
    const results = {};
    calls.forEach(c => { results[c.result] = (results[c.result] || 0) + 1; });
    return {
      total: calls.length,
      weeklyCount: weeklyCalls.length,
      monthlyCount: monthlyCalls.length,
      todaysCalls,
      industries,
      results,
      hourlyStats,
      weeklyList: weeklyCalls,
      monthlyList: monthlyCalls,
      todaysReminders,
      dateRanges: { weekStart: startOfWeek, weekEnd: endOfWeek, monthStart: startOfMonth, monthEnd: endOfMonth }
    };
  }, [calls]);

  // --- Render ---

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex transition-colors duration-300">
      {/* Yan Menü */}
      <aside className={`w-64 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 border-r border-slate-200/50 dark:border-slate-800/50 hidden md:flex flex-col fixed h-full shadow-xl z-20 backdrop-blur-sm`}>
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-4">
          <div className="relative flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-600 shadow-lg shadow-pink-500/30 ">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            <div className="flex items-center gap-2 relative z-10">
              <h1 className="text-3xl font-black tracking-tight text-white leading-none drop-shadow-md">
                CALLA
              </h1>
            </div>
          </div>
          <div className="px-1 text-center">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
              New Balance Danışmanlık
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
            { id: 'entry', icon: CheckCircle, label: 'Arama Girişi' },
            { id: 'pending', icon: Hourglass, label: 'Takip Listesi', badge: pendingCalls.length },
            { id: 'list', icon: List, label: 'Tüm Kayıtlar' },
            { id: 'tasks', icon: Clock, label: 'İş Takip' },
            { id: 'reports', icon: FileBarChart, label: 'Raporlar' },
            { id: 'admin', icon: Shield, label: 'Yönetici Paneli' },
            { id: 'settings', icon: Settings, label: 'Ayarlar & Yedek' },
          ].map((item, index) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); if(item.id === 'entry') { setEditingId(null); handleCancelEdit(); } }}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium
                transition-all duration-300 ease-out group
                animate-fade-in
                ${activeTab === item.id
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 scale-105'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 dark:hover:from-slate-800 dark:hover:to-slate-800/50 hover:text-pink-600 dark:hover:text-pink-400 hover:scale-105'
                }
              `}
            >
              <item.icon size={20} className="group-hover:scale-110 transition-transform duration-300" />
              <span className="flex-1 text-left text-sm">{item.label}</span>
              {item.badge > 0 && (
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md ">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        
        <div className="p-4 space-y-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            
            {/* TUĞBAHAN ÖZEL MESAJI */}
            {formData.caller === "Tuğbahan" && (
              <div className="mx-2 mb-2 p-3 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg transform transition-all hover:scale-105 duration-300 border border-white/20">
                <div className="text-center flex flex-col items-center">
                  <div className="bg-white/20 p-1.5 rounded-full mb-2 backdrop-blur-sm">
                    <Crown className="text-yellow-300 animate-pulse" size={20} />
                  </div>
                  <p className="font-bold text-xs uppercase tracking-widest text-pink-100 mb-1">Günün Motivasyonu</p>
                  <p className="font-serif italic text-sm leading-tight text-white drop-shadow-md">
                    "Dünyanın En İyi Başvuru Yapan Kadını"
                  </p>
                </div>
              </div>
            )}

            <DailyGoal current={stats.todaysCalls} theme={theme} />

            <div className="flex justify-center">
                <button
                    onClick={toggleDarkMode}
                    className="group relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-300/50 dark:border-slate-700/50 text-slate-600 dark:text-amber-400 p-3 rounded-2xl hover:shadow-lg hover:scale-110 transition-all duration-300 shadow-md overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                        {darkMode ? <Sun size={20} className="" /> : <Moon size={20} className="" />}
                    </div>
                </button>
            </div>
            <div className="text-[10px] text-slate-400 text-center pt-1">
            developed by Ege
            </div>
        </div>
      </aside>

      {/* Mobil Menü Başlığı */}
      <div className="md:hidden fixed top-0 w-full bg-slate-900 text-white p-4 z-20 flex justify-between items-center shadow-md">
         <span className="font-black text-xl tracking-tight text-slate-800 dark:text-white">
            CALLA
         </span>
         <div className="flex gap-4">
             {/* Basit mobil navigasyon */}
            <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'text-pink-400' : ''}><BarChart3 size={24}/></button>
            <button onClick={() => setActiveTab('entry')} className={activeTab === 'entry' ? 'text-pink-400' : ''}><CheckCircle size={24}/></button>
            <button onClick={() => setActiveTab('list')} className={activeTab === 'list' ? 'text-pink-400' : ''}><List size={24}/></button>
            <button onClick={() => setActiveTab('reports')} className={activeTab === 'reports' ? 'text-pink-400' : ''}><FileBarChart size={24}/></button>
         </div>
      </div>

      {/* TOAST BİLDİRİMİ */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      {/* Ana İçerik Alanı */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 pb-32 transition-all">

        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            onNavigate={setActiveTab}
            pendingCalls={pendingCalls}
            recentCalls={calls.slice().reverse().slice(0, 10)}
            theme={theme}
          />
        )}

        {activeTab === 'entry' && (
          <EntryForm 
            formData={formData} 
            onChange={handleInputChange} 
            onTimeChange={handleTimeChange}
            onSubmit={handleSubmit}
            editingId={editingId}
            onCancelEdit={handleCancelEdit}
            reminders={stats.todaysReminders}
            allCalls={calls}
            theme={theme}
          />
        )}

        {activeTab === 'pending' && (
          <CallsTable 
            data={pendingCalls} 
            title="Takip Gerektiren İşler" 
            onDownload={() => exportToExcel(pendingCalls, "Takip_Listesi")}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFavorite={toggleFavorite}
            showNotes={false} 
            theme={theme}
          />
        )}
        
        {activeTab === 'list' && (
          <div className="space-y-6">
            {/* Header with View Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {showFavoritesOnly ? "⭐ Yıldızlı Kayıtlar" : (searchTerm || filterResult || startDate) ? "Filtrelenmiş Sonuçlar" : "Tüm Arama Kayıtları"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{filteredCalls.length} kayıt bulundu</p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                    viewMode === 'timeline'
                      ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <History size={16} />
                  Timeline
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <List size={16} />
                  Tablo
                </button>
              </div>
            </div>

            {/* ARAMA VE FİLTRELEME ALANI */}
            <Card className="p-4 flex flex-col gap-4">
               {/* Üst Satır */}
               <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                 <div className="relative w-full md:w-1/3">
                   <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                   <input
                      type="text"
                      placeholder="Firma, Kişi veya Personel Ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-slate-900 dark:text-white"
                   />
                 </div>

                 <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                      className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${showFavoritesOnly ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/20' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}
                    >
                      <Star size={18} fill={showFavoritesOnly ? "currentColor" : "none"} />
                      <span className="hidden sm:inline">Yıldızlılar</span>
                    </button>

                    <div className="relative w-full md:w-56">
                        <Filter size={18} className="absolute left-3 top-3 text-slate-400" />
                        <select
                          value={filterResult}
                          onChange={(e) => setFilterResult(e.target.value)}
                          className="w-full pl-10 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none appearance-none text-slate-900 dark:text-white"
                        >
                          <option value="">Tüm Sonuçlar</option>
                          <option value="Görüşüldü">✅ Görüşüldü</option>
                          <option value="Mail İstedi">📧 Mail İstedi</option>
                          <option value="Randevu Alındı">📅 Randevu</option>
                          <option value="Teklif Bekliyor">📄 Teklif</option>
                          <option value="Tekrar Aranacak">🔄 Tekrar Ara</option>
                          <option value="Reddedildi">❌ Reddedildi</option>
                        </select>
                     </div>
                 </div>
               </div>

               {/* Alt Satır: Tarih */}
               <div className="flex flex-col md:flex-row gap-4 items-center border-t border-slate-100 dark:border-slate-700 pt-4">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <CalendarDays size={16}/> Tarih Aralığı:
                  </span>
                  <div className="flex gap-2 items-center">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none focus:border-pink-500" />
                    <span className="text-slate-300">-</span>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none focus:border-pink-500" />
                  </div>

                  {(searchTerm || filterResult || startDate || endDate || showFavoritesOnly) && (
                    <button
                      onClick={() => { setSearchTerm(''); setFilterResult(''); setStartDate(''); setEndDate(''); setShowFavoritesOnly(false); }}
                      className="ml-auto text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <X size={16} /> Temizle
                    </button>
                  )}
               </div>
            </Card>

            {/* Conditional View Rendering */}
            {viewMode === 'timeline' ? (
              <TimelineView
                data={filteredCalls}
                onEdit={handleEdit}
                onDelete={handleDelete}
                theme={theme}
              />
            ) : (
              <CallsTable
                data={filteredCalls}
                title=""
                onDownload={() => exportToExcel(filteredCalls, "Filtreli_Arama_Kayitlari")}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFavorite={toggleFavorite}
                showNotes={true}
                theme={theme}
              />
            )}
          </div>
        )}
        
        {activeTab === 'reports' && (
          <ReportsView
            stats={stats}
            onExport={exportToExcel}
            onPrint={printReport}
            onDownloadHTML={downloadAdvancedReport}
            theme={theme}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskTracker tasks={tasks} setTasks={setTasks} theme={theme} />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            isAuthenticated={isAdminAuthenticated}
            onLogin={handleAdminLogin}
            onLogout={handleAdminLogout}
            password={adminPassword}
            setPassword={setAdminPassword}
            theme={theme}
            calls={calls}
            setCalls={setCalls}
            tasks={tasks}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            onBackup={handleBackup}
            onRestore={handleRestore}
            onDeleteAll={handleDeleteAll}
            theme={theme}
            setThemeColor={setThemeColor}
          />
        )}
      </main>
    </div>
  );
}