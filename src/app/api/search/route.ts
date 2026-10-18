import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'Resim dosyası bulunamadı.' }, { status: 400 });
    }

    const serpApiKey = process.env.SERPAPI_KEY;
    if (!serpApiKey) {
      return NextResponse.json({ error: 'SerpApi Anahtarı (API Key) yapılandırılmamış. Lütfen .env.local dosyasını kontrol edin.' }, { status: 500 });
    }

    const tmpFormData = new FormData();
    tmpFormData.append('file', file);

    const uploadRes = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: tmpFormData,
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      throw new Error(`Resim geçici sunucuya yüklenemedi. Durum: ${uploadRes.status} Hata: ${errorText}`);
    }

    const uploadData = await uploadRes.json();
    let imageUrl = uploadData?.data?.url;
    
    if (!imageUrl || !imageUrl.startsWith('http')) {
        throw new Error('Geçici sunucudan geçersiz yanıt alındı: ' + JSON.stringify(uploadData));
    }

    imageUrl = imageUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');

    const serpApiUrl = new URL('https://serpapi.com/search.json');
    serpApiUrl.searchParams.append('engine', 'google_lens');
    serpApiUrl.searchParams.append('url', imageUrl.trim());
    serpApiUrl.searchParams.append('api_key', serpApiKey);
    serpApiUrl.searchParams.append('hl', 'tr'); // Turkish results

    const serpRes = await fetch(serpApiUrl.toString());
    
    if (!serpRes.ok) {
        throw new Error('Arama motoru API hatası.');
    }

    const data = await serpRes.json();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: error.message || 'Bilinmeyen bir hata oluştu.' }, { status: 500 });
  }
}
