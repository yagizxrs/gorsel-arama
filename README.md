# Görsel ile Arama

Google Lens API kullanarak yüklediğiniz görseli internet üzerinde arayın. Next.js ile geliştirilmiş, SerpApi entegrasyonlu bir görsel arama uygulaması.

## Özellikler

- Sürükle-bırak veya tıkla görsel yükleme
- Google Lens ile görsel eşleştirme
- Bilgi grafiği sonuçları
- Karanlık tema arayüz

## Gereksinimler

- Node.js 18+
- [SerpApi](https://serpapi.com/) hesabı (ücretsiz plan: 100 arama/ay)

## Kurulum

### 1. Repoyu klonlayın

```bash
git clone https://github.com/kullanici-adiniz/repo-adiniz.git
cd repo-adiniz
```

### 2. Bağımlılıkları yükleyin

```bash
npm install
```

### 3. Ortam değişkenlerini ayarlayın

`.env.local.example` dosyasını kopyalayıp `.env.local` olarak kaydedin:

```bash
cp .env.local.example .env.local
```

Ardından `.env.local` dosyasını açıp SerpApi anahtarınızı girin:

```
SERPAPI_KEY=your_actual_key_here
```

> SerpApi anahtarı almak için: [serpapi.com](https://serpapi.com/) → Üye ol → Dashboard → API Key

### 4. Geliştirme sunucusunu başlatın

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresinde çalışır.

## Kullanım

1. Ana sayfada görsel yükleme alanına tıklayın veya görselinizi sürükleyin
2. **İnternette Bul** butonuna basın
3. Sonuçları görsel eşleşmeleri ve bilgi grafiği olarak inceleyin

## Teknik Detaylar

- **Framework:** Next.js 16 (App Router)
- **API:** [SerpApi Google Lens](https://serpapi.com/google-lens-api)
- **Görsel yükleme:** tmpfiles.org geçici barındırma (API gerektirmez)
- **UI:** Lucide React ikonları

## Lisans

MIT
