# MyFitApp (Kişisel Bütçe Takip Uygulaması)

React Native + Expo Router ile geliştirilmiş basit ve şık bir gelir/gider takip uygulaması. Veriler cihaz içinde SQLite ile saklanır; giriş/kayıt (local), işlem ekleme, haftalık bütçe limiti ve raporlama grafiklerini içerir.

## İçerik
- Özellikler
- Ekranlar
- Kurulum ve Çalıştırma
- Komutlar
- Mimarî ve Klasör Yapısı
- Teknolojiler
- Geliştirme Notları

## Özellikler
- Gelir ve gider işlemleri ekleme/silme
- Haftalık bütçe limiti belirleme ve ilerleme çubuğu
- Aylık toplam gelir/gider özetleri
- Son 7 gün gelir/gider çizgi grafiği ve kategori bazlı bar grafik
- Local email/şifre ile basit oturum yönetimi (SQLite üzerinde tablo)
- Şık arayüz, animasyonlar ve toast bildirimleri

## Ekranlar
- Giriş / Kayıt: Basit e‑posta/şifre ile yerel kullanıcı oluşturma ve giriş
- Ana Sayfa (Dashboard): Bakiye, gelir, gider kartları; haftalık bütçe ilerlemesi; son işlemler listesi
- İşlem Ekle: Gelir/gider türü, tutar, açıklama, kategori ve tarih/saat seçimi
- Raporlar: Son 7 gün çizgi grafiği, aylık kategori bazlı bar grafiği, kategori detayları

## Kurulum ve Çalıştırma
Önkoşullar: Node.js LTS, pnpm/yarn/npm, Expo CLI (opsiyonel), Android Studio veya Xcode (native çalıştırma için)

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run start

# Android cihaz/emülatörde çalıştır
npm run android

# iOS simülatörde çalıştır (macOS)
npm run ios

# Web (deneysel)
npm run web
```

İlk açılışta uygulama `expo-sqlite` ile `transactions` ve `user` tablolarını oluşturur.

## Komutlar
- `npm run start`: Expo Metro sunucusunu başlatır
- `npm run android`: Android derleme/çalıştırma
- `npm run ios`: iOS derleme/çalıştırma
- `npm run web`: Web hedefi
- `npm run lint`: Lint
- `npm test`: Jest (watch)

## Mimarî ve Klasör Yapısı
- `app/_layout.tsx`: Sağlayıcılar ve SQLite başlatma
- `app/(auth)/*`: `login.tsx`, `signup.tsx` ve stack düzeni
- `app/(tabs)/*`: Sekmeler ve sayfalar: `index.tsx` (Dashboard), `add.tsx`, `reports.tsx`
- `context/BudgetContext.tsx`: SQLite CRUD, toplamlar, haftalık bütçe
- `context/AuthContext.tsx`: Basit kullanıcı durumu ve çıkış
- `components/Toast.tsx`: Başarılı/hata bildirimleri
- `hooks/useFrameworkReady.ts`: Web hazır sinyali

## Teknolojiler
- React Native 0.76, Expo 52, Expo Router 4
- SQLite (expo-sqlite)
- date-fns, react-native-chart-kit, react-native-reanimated
- lucide-react-native ikonları, expo-linear-gradient, expo-blur

## Geliştirme Notları
- Veritabanı: `transactions (id, amount, category, description, date, type)` ve `user (id, email, password)` tabloları `app/_layout.tsx` içinde oluşturulur.
- Kimlik Doğrulama: Tamamen yerel ve basit; şifreler hash’lenmez. Üretimde güvenlik için uygun bir backend/kimlik sistemi önerilir.
- Web hedefi sınırlı olabilir; ana hedef mobil.

## Lisans
Bu proje eğitim ve kişisel kullanım içindir. Gerekli durumlarda lisans ekleyin.
