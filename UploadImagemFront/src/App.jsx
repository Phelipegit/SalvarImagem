import { useState, useRef, useCallback, useEffect } from "react";

const BACK_URL = "https://salvarimagem.onrender.com/api/addImage";
const GET_URL = "https://salvarimagem.onrender.com/api/devolvertudo";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function UploadImagem() {
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const [erro, setErro] = useState("");
  const [drag, setDrag] = useState(false);
  const [galeria, setGaleria] = useState([]);
  const [loadingGaleria, setLoadingGaleria] = useState(false);

  const inputRef = useRef(null);

  const buscarImagens = useCallback(async () => {
    setLoadingGaleria(true);

    try {
      const res = await fetch(GET_URL);

      if (!res.ok) {
        throw new Error("Erro ao buscar imagens");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setGaleria(data);
      } else {
        setGaleria([]);
      }
    } catch (e) {
      console.error(e);
      setGaleria([]);
    } finally {
      setLoadingGaleria(false);
    }
  }, []);

  useEffect(() => {
    buscarImagens();
  }, [buscarImagens]);

  const processarArquivo = (file) => {
    if (!file) return;

    setErro("");
    setResultado("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErro("Formato não permitido. Use JPG, PNG ou WEBP.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;

      if (!result || typeof result !== "string") {
        setErro("Erro ao processar imagem.");
        return;
      }

      const partes = result.split(",");

      if (partes.length < 2) {
        setErro("Imagem inválida.");
        return;
      }

      setPreview(result);
      setImagem(partes[1]);
    };

    reader.readAsDataURL(file);
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      processarArquivo(file);
    }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();

    setDrag(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      processarArquivo(file);
    }
  }, []);

  const onDragOver = (e) => {
    e.preventDefault();
    setDrag(true);
  };

  const onDragLeave = () => {
    setDrag(false);
  };

  const enviar = async () => {
    if (!imagem || loading) return;

    setLoading(true);
    setErro("");
    setResultado("");

    try {
      const res = await fetch(BACK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imagemCodificada: imagem,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Erro ao enviar imagem.");
      }

      const url =
        typeof data === "string"
          ? data
          : data?.secure_url || data?.url || "";

      if (!url) {
        throw new Error("URL da imagem não encontrada.");
      }

      setResultado(url);

      await buscarImagens();
    } catch (e) {
      console.error(e);
      setErro(e.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const limpar = () => {
    setImagem(null);
    setPreview(null);
    setResultado("");
    setErro("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.bg1} />
      <div style={styles.bg2} />
      <div style={styles.bg3} />

      <div style={styles.card}>
        <p style={{ color: "#ff6b6b", marginBottom: 16 }}>
          vou arrumar os bugs amanhã six seven
        </p>

        <div style={styles.badge}>Upload</div>

        <h1 style={styles.title}>Enviar imagem</h1>

        <p style={styles.sub}>
          JPG, PNG ou WEBP · máx. 10MB
        </p>

        {!preview ? (
          <div
            style={{
              ...styles.dropzone,
              ...(drag ? styles.dropzoneDrag : {}),
            }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => inputRef.current?.click()}
          >
            <div style={styles.dropIcon}>
              ↑
            </div>

            <p style={styles.dropText}>
              Arraste aqui ou{" "}
              <span style={styles.dropLink}>
                clique para selecionar
              </span>
            </p>

            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={onFileChange}
              style={{ display: "none" }}
            />
          </div>
        ) : (
          <div style={styles.previewWrap}>
            <img
              src={preview}
              alt="preview"
              style={styles.previewImg}
            />

            <button
              onClick={limpar}
              style={styles.removeBtn}
              type="button"
            >
              ✕
            </button>
          </div>
        )}

        {!!erro && (
          <div style={styles.erroBox}>
            {erro}
          </div>
        )}

        {!!resultado && (
          <div style={styles.successBox}>
            <p
              style={{
                marginBottom: 8,
                fontSize: 12,
                opacity: 0.7,
              }}
            >
              URL da imagem
            </p>

            <a
              href={resultado}
              target="_blank"
              rel="noreferrer"
              style={styles.urlLink}
            >
              {resultado}
            </a>
          </div>
        )}

        <button
          onClick={enviar}
          disabled={!imagem || loading}
          style={{
            ...styles.btn,
            ...((!imagem || loading)
              ? styles.btnDisabled
              : {}),
          }}
        >
          {loading ? "Enviando..." : "Enviar para Cloudinary"}
        </button>
      </div>

      <div style={styles.galeriaWrap}>
        <div style={styles.galeriaHeader}>
          <div>
            <div style={styles.badge}>Galeria</div>

            <h2 style={styles.galeriaTitle}>
              Imagens de Usuários
            </h2>

            <p style={styles.galeriaSub}>
              {galeria.length} imagem
              {galeria.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={buscarImagens}
            style={styles.refreshBtn}
          >
            ↻
          </button>
        </div>

        {loadingGaleria ? (
          <div style={styles.galeriaLoading}>
            Carregando...
          </div>
        ) : galeria.length === 0 ? (
          <div style={styles.galeriaVazia}>
            Nenhuma imagem ainda
          </div>
        ) : (
          <div style={styles.grid}>
            {galeria.map((item, index) => {
              const imageUrl = item?.url;

              if (!imageUrl) return null;

              return (
                <a
                  key={item?.id || index}
                  href={imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.gridItem}
                >
                  <img
                    src={imageUrl}
                    alt="imagem"
                    style={styles.gridImg}
                  />
                </a>
              );
            })}
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
    padding: "3rem 2rem",
    position: "relative",
    overflow: "hidden",
    fontFamily: "sans-serif",
  },

  bg1: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(83,74,183,0.18) 0%, transparent 70%)",
    top: -150,
    right: -100,
  },

  bg2: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(29,158,117,0.12) 0%, transparent 70%)",
    bottom: -120,
    left: -80,
  },

  bg3: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(212,83,126,0.1) 0%, transparent 70%)",
    top: "50%",
    left: "10%",
  },

  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: "2rem",
    width: "100%",
    maxWidth: 440,
    backdropFilter: "blur(20px)",
    position: "relative",
    zIndex: 2,
  },

  badge: {
    display: "inline-block",
    fontSize: 11,
    color: "#7F77DD",
    background: "rgba(83,74,183,0.15)",
    borderRadius: 999,
    padding: "4px 12px",
    marginBottom: 16,
  },

  title: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 8,
  },

  sub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
    marginBottom: 24,
  },

  dropzone: {
    border: "2px dashed rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: "2.5rem 1rem",
    textAlign: "center",
    cursor: "pointer",
    background: "rgba(255,255,255,0.02)",
    marginBottom: 16,
  },

  dropzoneDrag: {
    borderColor: "#7F77DD",
    background: "rgba(127,119,221,0.08)",
  },

  dropIcon: {
    fontSize: 36,
    color: "#7F77DD",
    marginBottom: 12,
  },

  dropText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
  },

  dropLink: {
    color: "#7F77DD",
    textDecoration: "underline",
  },

  previewWrap: {
    position: "relative",
    marginBottom: 16,
  },

  previewImg: {
    width: "100%",
    borderRadius: 14,
    maxHeight: 250,
    objectFit: "cover",
  },

  removeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: "none",
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    cursor: "pointer",
  },

  erroBox: {
    background: "rgba(255,0,0,0.1)",
    border: "1px solid rgba(255,0,0,0.2)",
    color: "#ff8b8b",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },

  successBox: {
    background: "rgba(0,255,100,0.08)",
    border: "1px solid rgba(0,255,100,0.15)",
    color: "#7dffb1",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    overflowWrap: "break-word",
  },

  urlLink: {
    color: "#7dffb1",
    fontSize: 12,
  },

  btn: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "none",
    background:
      "linear-gradient(135deg, #534AB7 0%, #7F77DD 100%)",
    color: "#fff",
    fontSize: 15,
    cursor: "pointer",
  },

  btnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  galeriaWrap: {
    width: "100%",
    maxWidth: 960,
    marginTop: "3rem",
    position: "relative",
    zIndex: 2,
  },

  galeriaHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  galeriaTitle: {
    color: "#fff",
    fontSize: 24,
    marginTop: 8,
  },

  galeriaSub: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 13,
  },

  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    border: "none",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    cursor: "pointer",
    fontSize: 18,
  },

  galeriaLoading: {
    color: "#fff",
    textAlign: "center",
    padding: "3rem 0",
  },

  galeriaVazia: {
    color: "rgba(255,255,255,0.3)",
    textAlign: "center",
    padding: "3rem 0",
    border: "1px dashed rgba(255,255,255,0.1)",
    borderRadius: 16,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 14,
  },

  gridItem: {
    borderRadius: 14,
    overflow: "hidden",
    display: "block",
    background: "#111",
  },

  gridImg: {
    width: "100%",
    aspectRatio: "1",
    objectFit: "cover",
    display: "block",
  },
};