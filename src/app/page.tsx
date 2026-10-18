"use client";

import { useState } from "react";
import { UploadCloud, Search, ExternalLink, Loader2, AlertCircle } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleSearch = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Arama sırasında bir hata oluştu.");
      }

      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Görsel ile Arama</h1>
        <p>İstediğiniz bir görseli yükleyerek internet üzerindeki eşleşmeleri bulun.</p>
      </header>

      <main className="main-content">
        <div className="upload-area">
          <div className="upload-box" style={{ padding: preview ? '1rem' : '0' }}>
            {preview ? (
              <div className="preview-container" style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Önizleme" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                <button 
                  onClick={(e) => { e.preventDefault(); setFile(null); setPreview(null); setResults(null); }}
                  style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', zIndex: 10 }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <UploadCloud size={64} className="upload-icon" color="var(--primary)" />
                <p>Resmi buraya sürükleyin veya tıklayarak seçin</p>
              </>
            )}
            {!preview && <input type="file" accept="image/*" className="file-input" onChange={handleFileChange} />}
          </div>

          {file && (
            <button 
              className="search-button" 
              onClick={handleSearch} 
              disabled={loading}
              style={{ marginTop: '1.5rem', width: '100%', padding: '1rem', background: 'var(--primary)', color: '#000', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s' }}
            >
              {loading ? <><Loader2 className="spin" /> Aranıyor...</> : <><Search /> İnternette Bul</>}
            </button>
          )}
          
          {error && (
            <div className="error-message" style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,0,0,0.1)', color: '#ff6b6b', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle /> {error}
            </div>
          )}
        </div>

        {results && (
          <div className="results-area" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            
            {results.knowledge_graph && results.knowledge_graph.length > 0 && (
               <section className="result-section">
                 <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)' }}>Bunu mu demek istediniz?</h2>
                 <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                   {results.knowledge_graph.map((item: any, index: number) => (
                     <div key={index} style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', flex: '1 1 250px' }}>
                       <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                       {item.subtitle && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.subtitle}</p>}
                       {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-block', marginTop: '0.5rem' }}>Google'da İncele</a>}
                     </div>
                   ))}
                 </div>
               </section>
            )}

            {results.visual_matches && results.visual_matches.length > 0 ? (
              <section className="result-section">
                <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Görsel Eşleşmeleri</h2>
                <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {results.visual_matches.map((match: any, index: number) => (
                    <a key={index} href={match.link} target="_blank" rel="noopener noreferrer" className="match-card" style={{ background: 'var(--surface)', borderRadius: '8px', overflow: 'hidden', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }}>
                      <div className="match-image-wrapper" style={{ width: '100%', height: '150px', background: '#000', position: 'relative' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {match.thumbnail && <img src={match.thumbnail} alt={match.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div className="match-info" style={{ padding: '0.75rem' }}>
                        <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{match.title}</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><ExternalLink size={12}/> {match.source}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            ) : (
              <section className="result-section" style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: '8px' }}>
                <Search size={48} color="var(--text-secondary)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>İnternette bu görselle tam eşleşen bir sonuç bulunamadı.</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto' }}>
                  Google Lens, genellikle ünlü kişileri, ürünleri, ünlü mekanları veya internette çok sık paylaşılan (indexlenen) görselleri bulabilir. Normal kullanıcıların sosyal medya profilleri veya özel çekilmiş fotoğraflar çoğu zaman arama motorlarında listelenmez.
                </p>
              </section>
            )}
          </div>
        )}
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .match-card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
        .search-button:hover:not(:disabled) { background: var(--secondary); }
      `}} />
    </div>
  );
}
