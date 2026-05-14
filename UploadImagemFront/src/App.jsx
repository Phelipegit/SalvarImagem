import { useState, useRef, useCallback, useEffect } from "react";

const BACK_URL = "https://salvarimagem.onrender.com/api/addImage";
const GET_URL = "https://salvarimagem.onrender.com/api/devolvertudo";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function UploadImagem() {
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [drag, setDrag] = useState(false);
  const [galeria, setGaleria] = useState([]);
  const [loadingGaleria, setLoadingGaleria] = useState(false);
  const inputRef = useRef();

  const buscarImagens = useCallback(async () => {
    setLoadingGaleria(true);
    try {
      const res = await fetch(GET_URL);
      const data = await res.json();
      setGaleria(data);
    } catch {
      setGaleria([]);
    } finally {
      setLoadingGaleria(false);
    }
  }, []);

  useEffect(() => { buscarImagens(); }, [buscarImagens]);

  const processarArquivo = (file) => {
    setErro(null);
    setResultado(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErro("Formato não permitido. Use JPG, PNG ou WEBP.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Puro = e.target.result.split(",")[1];
      setPreview(e.target.result);
      setImagem(base64Puro);
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e) => {
    if (e.target.files[0]) processarArquivo(e.target.files[0]);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.files[0]) processarArquivo(e.dataTransfer.files[0]);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDrag(true); };
  const onDragLeave = () => setDrag(false);

  const enviar = async () => {
    if (!imagem) return;
    setLoading(true);
    setErro(null);
    setResultado(null);
    try {
      const res = await fetch(BACK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagemCodificada: imagem }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao enviar imagem.");
      setResultado(data.secure_url || data);
      buscarImagens();
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  };

  const limpar = () => {
    setImagem(null);
    setPreview(null);
    setResultado(null);
    setErro(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div style={styles.page}>
      <div style={styles.bg1} />
      <div style={styles.bg2} />
      <div style={styles.bg3} />

      <div style={styles.card}>
        <div style={styles.badge}>Upload</div>
        <h1 style={styles.title}>Enviar imagem</h1>
        <p style={styles.sub}>JPG, PNG ou WEBP · máx. 10MB</p>

        {!preview ? (
          <div
            style={{ ...styles.dropzone, ...(drag ? styles.dropzoneDrag : {}) }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => inputRef.current.click()}
          >
            <div style={styles.dropIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                <polyline points="16 10 12 6 8 10" />
                <line x1="12" y1="6" x2="12" y2="16" />
              </svg>
            </div>
            <p style={styles.dropText}>
              Arraste aqui ou <span style={styles.dropLink}>clique para selecionar</span>
            </p>
            <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={onFileChange} style={{ display: "none" }} />
          </div>
        ) : (
          <div style={styles.previewWrap}>
            <img src={preview} alt="preview" style={styles.previewImg} />
            <button onClick={limpar} style={styles.removeBtn} title="Remover">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {erro && (
          <div style={styles.erroBox}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {erro}
          </div>
        )}

        {resultado && (
          <div style={styles.successBox}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 12, marginBottom: 4, opacity: 0.7 }}>URL da imagem</p>
              <a href={resultado} target="_blank" rel="noreferrer" style={styles.urlLink}>{resultado}</a>
            </div>
          </div>
        )}

        <button
          onClick={enviar}
          disabled={!imagem || loading}
          style={{ ...styles.btn, ...(!imagem || loading ? styles.btnDisabled : {}) }}
        >
          {loading ? (
            <>
              <span style={styles.spinner} />
              Enviando...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                <polyline points="16 10 12 6 8 10" />
                <line x1="12" y1="6" x2="12" y2="16" />
              </svg>
              Enviar para Cloudinary
            </>
          )}
        </button>
      </div>

      <div style={styles.galeriaWrap}>
        <div style={styles.galeriaHeader}>
          <div>
            <div style={styles.badge}>Galeria</div>
            <h2 style={styles.galeriaTitle}>Imagens de Usuários</h2>
            <p style={styles.galeriaSub}>{galeria.length} imagem{galeria.length !== 1 ? "s" : ""} enviada{galeria.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={buscarImagens} style={styles.refreshBtn} title="Atualizar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
        </div>

        {loadingGaleria ? (
          <div style={styles.galeriaLoading}>
            <span style={{ ...styles.spinner, borderTopColor: "#7F77DD" }} />
          </div>
        ) : galeria.length === 0 ? (
          <div style={styles.galeriaVazia}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ color: "rgba(255,255,255,0.15)", marginBottom: 12 }}>
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.25)" }}>Nenhuma imagem ainda</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {galeria.map((item) => (
              <a key={item.id} href={item.url} target="_blank" rel="noreferrer" style={styles.gridItem}>
                <img src={item.url} alt="imagem do usuário" style={styles.gridImg} />
                <div style={styles.gridOverlay}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0d0d14",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "3rem 2rem",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'DM Sans', sans-serif",
  },
  bg1: {
    position: "absolute", width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(83,74,183,0.18) 0%, transparent 70%)",
    top: -150, right: -100, pointerEvents: "none",
  },
  bg2: {
    position: "absolute", width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(29,158,117,0.12) 0%, transparent 70%)",
    bottom: -120, left: -80, pointerEvents: "none",
  },
  bg3: {
    position: "absolute", width: 300, height: 300, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(212,83,126,0.1) 0%, transparent 70%)",
    top: "50%", left: "10%", pointerEvents: "none",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: 24,
    padding: "2.5rem",
    width: "100%",
    maxWidth: 440,
    backdropFilter: "blur(20px)",
    position: "relative",
    zIndex: 1,
    marginTop: "2rem",
  },
  galeriaWrap: {
    width: "100%",
    maxWidth: 960,
    marginTop: "3rem",
    position: "relative",
    zIndex: 1,
  },
  galeriaHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
  },
  galeriaTitle: {
    fontSize: 22,
    fontWeight: 600,
    color: "#fff",
    letterSpacing: "-0.02em",
    marginBottom: 4,
    marginTop: 8,
  },
  galeriaSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.3)",
  },
  refreshBtn: {
    background: "rgba(255,255,255,0.05)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "rgba(255,255,255,0.5)",
    width: 38, height: 38,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
    marginTop: 8,
  },
  galeriaLoading: {
    display: "flex", justifyContent: "center",
    padding: "3rem 0",
  },
  galeriaVazia: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "4rem 0",
    border: "0.5px dashed rgba(255,255,255,0.08)",
    borderRadius: 16,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 12,
  },
  gridItem: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    aspectRatio: "1",
    display: "block",
    border: "0.5px solid rgba(255,255,255,0.08)",
  },
  gridImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.3s",
  },
  gridOverlay: {
    position: "absolute", inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    opacity: 0,
    color: "#fff",
    transition: "opacity 0.2s",
  },
  badge: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#7F77DD",
    background: "rgba(83,74,183,0.15)",
    border: "0.5px solid rgba(83,74,183,0.3)",
    borderRadius: 20,
    padding: "4px 12px",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
    color: "#fff",
    marginBottom: 6,
    letterSpacing: "-0.02em",
  },
  sub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.35)",
    marginBottom: 28,
  },
  dropzone: {
    border: "1.5px dashed rgba(255,255,255,0.12)",
    borderRadius: 14,
    padding: "2.5rem 1.5rem",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    marginBottom: 16,
    background: "rgba(255,255,255,0.02)",
  },
  dropzoneDrag: {
    borderColor: "#7F77DD",
    background: "rgba(83,74,183,0.08)",
  },
  dropIcon: {
    width: 56, height: 56,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 14px",
    color: "rgba(255,255,255,0.3)",
  },
  dropText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.4)",
    lineHeight: 1.5,
  },
  dropLink: {
    color: "#7F77DD",
    textDecoration: "underline",
    cursor: "pointer",
  },
  previewWrap: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  previewImg: {
    width: "100%",
    maxHeight: 220,
    objectFit: "cover",
    display: "block",
  },
  removeBtn: {
    position: "absolute", top: 8, right: 8,
    background: "rgba(0,0,0,0.7)",
    border: "none", borderRadius: "50%",
    width: 28, height: 28,
    color: "#fff", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  erroBox: {
    display: "flex", alignItems: "flex-start", gap: 8,
    background: "rgba(226,75,74,0.1)",
    border: "0.5px solid rgba(226,75,74,0.3)",
    borderRadius: 10, padding: "10px 14px",
    fontSize: 13, color: "#F09595",
    marginBottom: 16,
  },
  successBox: {
    display: "flex", alignItems: "flex-start", gap: 10,
    background: "rgba(29,158,117,0.1)",
    border: "0.5px solid rgba(29,158,117,0.25)",
    borderRadius: 10, padding: "12px 14px",
    fontSize: 13, color: "#5DCAA5",
    marginBottom: 16, wordBreak: "break-all",
  },
  urlLink: {
    color: "#5DCAA5", fontSize: 12,
    wordBreak: "break-all",
  },
  btn: {
    width: "100%",
    padding: "13px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #534AB7 0%, #7F77DD 100%)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 8,
    transition: "opacity 0.2s, transform 0.1s",
  },
  btnDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
  spinner: {
    width: 16, height: 16,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    display: "inline-block",
  },
};
