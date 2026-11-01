import { useEffect, useState, type FormEvent } from "react";

type Section =
  | "inicio"
  | "sistemas"
  | "personagens"
  | "campanhas"
  | "grupos"
  | "biblioteca"
  | "configuracoes";

type RPGSystem = {
  id: string;
  name: string;
  description: string;
  genre: string;
  dice: string;
  visibility: "Privado" | "Público";
  createdAt: string;
};

const STORAGE_KEY = "flare-rpg-systems";

const navigation: { id: Section; label: string; icon: string }[] = [
  { id: "inicio", label: "Início", icon: "⌂" },
  { id: "sistemas", label: "Meus sistemas", icon: "✧" },
  { id: "personagens", label: "Personagens", icon: "♙" },
  { id: "campanhas", label: "Campanhas", icon: "⚔" },
  { id: "grupos", label: "Grupos", icon: "♧" },
  { id: "biblioteca", label: "Biblioteca", icon: "▤" },
  { id: "configuracoes", label: "Configurações", icon: "⚙" },
];

const genres = [
  "Fantasia medieval",
  "Fantasia sombria",
  "Fantasia urbana",
  "Ficção científica",
  "Terror",
  "Pós-apocalíptico",
  "Mitologia",
  "Outro",
];

const diceOptions = [
  "D4",
  "D6",
  "D8",
  "D10",
  "D12",
  "D20",
  "D100",
  "Múltiplos dados",
  "Sem dados",
  "Personalizado",
];

const sectionDescriptions: Record<Section, string> = {
  inicio: "Seu espaço de criação e aventuras.",
  sistemas: "Crie e organize seus próprios sistemas de RPG.",
  personagens: "Seus heróis, suas histórias e suas fichas.",
  campanhas: "Organize aventuras e conduza suas sessões.",
  grupos: "Reúna seus jogadores e organize suas mesas.",
  biblioteca: "Guarde e organize seus conteúdos de RPG.",
  configuracoes: "Personalize sua experiência no Flare RPG.",
};

function loadSystems(): RPGSystem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) ? (parsed as RPGSystem[]) : [];
  } catch {
    return [];
  }
}

function createId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function App() {
  const [section, setSection] = useState<Section>("inicio");
  const [systems, setSystems] = useState<RPGSystem[]>(loadSystems);
  const [creating, setCreating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState(genres[0]);
  const [dice, setDice] = useState("D20");
  const [visibility, setVisibility] =
    useState<"Privado" | "Público">("Privado");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(systems));
    } catch {
      // O armazenamento local pode estar indisponível.
    }
  }, [systems]);

  function navigate(next: Section) {
    setSection(next);
    setCreating(false);
    setMenuOpen(false);
  }

  function resetForm() {
    setName("");
    setDescription("");
    setGenre(genres[0]);
    setDice("D20");
    setVisibility("Privado");
  }

  function saveSystem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    if (!cleanName) return;

    const system: RPGSystem = {
      id: createId(),
      name: cleanName,
      description: description.trim(),
      genre,
      dice,
      visibility,
      createdAt: new Date().toISOString(),
    };

    setSystems((current) => [system, ...current]);
    resetForm();
    setCreating(false);
  }

  function removeSystem(id: string) {
    if (!window.confirm("Deseja realmente excluir este sistema?")) return;

    setSystems((current) => current.filter((system) => system.id !== id));
  }

  const pageTitle =
    navigation.find((item) => item.id === section)?.label ?? "Início";

  return (
    <div className="app-shell">
      {menuOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-emblem">✦</div>
          <div>
            <div className="brand-name">FLARE</div>
            <div className="brand-subtitle">RPG PLATFORM</div>
          </div>
          <button
            className="sidebar-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
          >
            ×
          </button>
        </div>

        <div className="sidebar-label">MENU PRINCIPAL</div>

        <nav className="navigation">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${section === item.id ? "active" : ""}`}
              onClick={() => navigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === "sistemas" && systems.length > 0 && (
                <span className="nav-count">{systems.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-divider" />
          <span className="footer-star">✧</span>
          <p>Seu próximo mundo começa aqui.</p>
          <small>FLARE RPG · VERSÃO 0.2</small>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
            >
              ☰
            </button>

            <div className="breadcrumb">
              <span>FLARE</span>
              <span>/</span>
              <strong>{creating ? "Novo sistema" : pageTitle}</strong>
            </div>
          </div>

          <div className="account">
            <div className="account-avatar">?</div>
            <div>
              <strong>Visitante</strong>
              <small>Conta não conectada</small>
            </div>
          </div>
        </header>

        <div className="page-content">
          {section === "inicio" && (
            <>
              <section className="welcome-section">
                <div className="welcome-content">
                  <span className="eyebrow">SUA JORNADA COMEÇA AQUI</span>
                  <h1>
                    Bem-vindo ao <span>Flare RPG.</span>
                  </h1>
                  <p>
                    Um espaço para criar mundos, desenvolver histórias e
                    reunir pessoas em torno de grandes aventuras.
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => navigate("sistemas")}
                  >
                    ✧ Explorar meus sistemas <span>→</span>
                  </button>
                </div>

                <div className="welcome-decoration">
                  <div className="decoration-ring ring-one" />
                  <div className="decoration-ring ring-two" />
                  <div className="decoration-core">✦</div>
                </div>
              </section>

              <section className="content-section">
                <div className="section-heading">
                  <span className="eyebrow">ACESSO RÁPIDO</span>
                  <h2>O que vamos criar hoje?</h2>
                </div>

                <div className="quick-grid">
                  <button
                    className="quick-card"
                    onClick={() => {
                      navigate("sistemas");
                      setCreating(true);
                    }}
                  >
                    <span className="quick-icon">✧</span>
                    <strong>Criar um sistema</strong>
                    <p>Desenvolva suas próprias regras e mecânicas.</p>
                    <span className="card-arrow">→</span>
                  </button>

                  <button
                    className="quick-card"
                    onClick={() => navigate("personagens")}
                  >
                    <span className="quick-icon">♙</span>
                    <strong>Criar personagem</strong>
                    <p>Dê vida a um novo aventureiro.</p>
                    <span className="card-arrow">→</span>
                  </button>

                  <button
                    className="quick-card"
                    onClick={() => navigate("campanhas")}
                  >
                    <span className="quick-icon">⚔</span>
                    <strong>Nova campanha</strong>
                    <p>Prepare uma jornada para seu grupo.</p>
                    <span className="card-arrow">→</span>
                  </button>
                </div>
              </section>

              <section className="content-section">
                <div className="section-heading">
                  <span className="eyebrow">SEU ESPAÇO</span>
                  <h2>Visão geral</h2>
                </div>

                <div className="overview-grid">
                  <OverviewCard
                    icon="⚔"
                    title="Campanhas"
                    status="Nenhuma campanha criada"
                    onClick={() => navigate("campanhas")}
                  />
                  <OverviewCard
                    icon="✧"
                    title="Sistemas"
                    status={`${systems.length} sistema(s) criado(s)`}
                    onClick={() => navigate("sistemas")}
                  />
                  <OverviewCard
                    icon="♙"
                    title="Personagens"
                    status="Nenhum personagem criado"
                    onClick={() => navigate("personagens")}
                  />
                </div>
              </section>

              <section className="content-section">
                <div className="section-heading">
                  <span className="eyebrow">ACOMPANHAMENTO</span>
                  <h2>Atividade recente</h2>
                </div>

                <div className="empty-activity">
                  <span>◈</span>
                  <strong>Suas aventuras aparecerão aqui.</strong>
                  <p>
                    Suas atividades recentes serão organizadas neste espaço.
                  </p>
                </div>
              </section>
            </>
          )}

          {section === "sistemas" && (
            <section className="systems-page">
              {!creating ? (
                <>
                  <div className="systems-heading">
                    <div>
                      <span className="eyebrow">SEU ACERVO</span>
                      <h1>Meus sistemas</h1>
                      <p>
                        Construa sistemas de RPG com suas próprias regras,
                        mecânicas e universos.
                      </p>
                    </div>
                    <button
                      className="primary-button"
                      onClick={() => setCreating(true)}
                    >
                      + Criar sistema
                    </button>
                  </div>

                  <div className="systems-toolbar">
                    <span>{systems.length} sistema(s) criado(s)</span>
                    <small>SEUS PROJETOS</small>
                  </div>

                  {systems.length === 0 ? (
                    <div className="systems-empty">
                      <span>✧</span>
                      <h2>Seu próximo universo começa aqui.</h2>
                      <p>
                        Você ainda não criou nenhum sistema. Comece definindo
                        a identidade do seu RPG.
                      </p>
                      <button
                        className="secondary-button"
                        onClick={() => setCreating(true)}
                      >
                        Criar meu primeiro sistema
                      </button>
                    </div>
                  ) : (
                    <div className="systems-list">
                      {systems.map((system) => (
                        <article className="system-card" key={system.id}>
                          <div className="system-card-icon">✧</div>
                          <div className="system-card-content">
                            <div className="system-card-title">
                              <h2>{system.name}</h2>
                              <span
                                className={`visibility-tag ${
                                  system.visibility === "Público"
                                    ? "public"
                                    : ""
                                }`}
                              >
                                {system.visibility}
                              </span>
                            </div>
                            <p>
                              {system.description ||
                                "Nenhuma descrição adicionada."}
                            </p>
                            <div className="system-metadata">
                              <span>{system.genre}</span>
                              <span>Dados: {system.dice}</span>
                              <span>
                                {new Date(system.createdAt).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </span>
                            </div>
                          </div>
                          <button
                            className="delete-button"
                            onClick={() => removeSystem(system.id)}
                            aria-label={`Excluir ${system.name}`}
                          >
                            ×
                          </button>
                        </article>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="system-creation">
                  <button
                    className="back-button"
                    onClick={() => {
                      resetForm();
                      setCreating(false);
                    }}
                  >
                    ← Voltar aos meus sistemas
                  </button>

                  <div className="creation-heading">
                    <span className="eyebrow">CRIADOR DE SISTEMAS · ETAPA 1</span>
                    <h1>Vamos criar um universo.</h1>
                    <p>
                      Primeiro, defina a identidade do seu sistema. As regras
                      e mecânicas serão configuradas em etapas futuras.
                    </p>
                  </div>

                  <div className="creation-progress">
                    <ProgressStep number="1" label="Identidade" active />
                    <div className="progress-line" />
                    <ProgressStep number="2" label="Atributos" />
                    <div className="progress-line" />
                    <ProgressStep number="3" label="Mecânicas" />
                    <div className="progress-line" />
                    <ProgressStep number="4" label="Finalização" />
                  </div>

                  <form className="system-form" onSubmit={saveSystem}>
                    <FormHeading number="01" title="Identidade do sistema" />

                    <label className="form-field">
                      <span>Nome do sistema *</span>
                      <input
                        className="form-input"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Ex.: Crônicas do Véu Partido"
                        maxLength={60}
                        required
                      />
                      <small>Escolha um nome para seu RPG.</small>
                    </label>

                    <label className="form-field">
                      <span>Descrição</span>
                      <textarea
                        className="form-input form-textarea"
                        value={description}
                        onChange={(event) =>
                          setDescription(event.target.value)
                        }
                        placeholder="Conte um pouco sobre o universo e a proposta do seu RPG..."
                        maxLength={500}
                        rows={4}
                      />
                      <small>{description.length}/500 caracteres</small>
                    </label>

                    <div className="form-divider" />

                    <FormHeading
                      number="02"
                      title="Características fundamentais"
                    />

                    <div className="form-two-columns">
                      <label className="form-field">
                        <span>Gênero / Ambientação</span>
                        <select
                          className="form-input"
                          value={genre}
                          onChange={(event) => setGenre(event.target.value)}
                        >
                          {genres.map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                        </select>
                      </label>

                      <label className="form-field">
                        <span>Dado principal</span>
                        <select
                          className="form-input"
                          value={dice}
                          onChange={(event) => setDice(event.target.value)}
                        >
                          {diceOptions.map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="form-divider" />

                    <FormHeading number="03" title="Visibilidade" />

                    <div className="visibility-options">
                      <button
                        type="button"
                        className={`visibility-option ${
                          visibility === "Privado" ? "selected" : ""
                        }`}
                        onClick={() => setVisibility("Privado")}
                      >
                        <span className="visibility-icon">♙</span>
                        <strong>Privado</strong>
                        <small>
                          Somente você poderá acessar neste navegador.
                        </small>
                      </button>

                      <button
                        type="button"
                        className={`visibility-option ${
                          visibility === "Público" ? "selected" : ""
                        }`}
                        onClick={() => setVisibility("Público")}
                      >
                        <span className="visibility-icon">◎</span>
                        <strong>Público</strong>
                        <small>
                          Preparado para compartilhamento futuro.
                        </small>
                      </button>
                    </div>

                    <div className="form-notice">
                      <span>ⓘ</span>
                      <p>
                        Os sistemas são salvos apenas neste navegador.
                        Publicação pública e sincronização ainda não estão
                        disponíveis.
                      </p>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                          resetForm();
                          setCreating(false);
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="primary-button"
                        disabled={!name.trim()}
                      >
                        Salvar sistema →
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </section>
          )}

          {section !== "inicio" && section !== "sistemas" && (
            <section className="placeholder-page">
              <span className="eyebrow">FLARE RPG</span>
              <h1>{pageTitle}</h1>
              <p>{sectionDescriptions[section]}</p>
              <div className="construction-panel">
                <span>✧</span>
                <h2>Este espaço está sendo preparado.</h2>
                <p>
                  Esta parte da plataforma ainda está em desenvolvimento.
                </p>
                <small>EM DESENVOLVIMENTO</small>
              </div>
              <button
                className="secondary-button"
                onClick={() => navigate("inicio")}
              >
                ← Voltar ao início
              </button>
            </section>
          )}

          <footer className="main-footer">
            <strong>FLARE RPG</strong>
            <span>Crie mundos. Conte histórias. Jogue juntos.</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

function OverviewCard({
  icon,
  title,
  status,
  onClick,
}: {
  icon: string;
  title: string;
  status: string;
  onClick: () => void;
}) {
  return (
    <button className="overview-card" onClick={onClick}>
      <span className="overview-icon">{icon}</span>
      <strong>{title}</strong>
      <small>{status}</small>
      <span className="overview-link">Acessar →</span>
    </button>
  );
}

function ProgressStep({
  number,
  label,
  active = false,
}: {
  number: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div className={`progress-step ${active ? "active" : ""}`}>
      <span>{number}</span>
      <small>{label}</small>
    </div>
  );
}

function FormHeading({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="form-heading">
      <span>{number}</span>
      <h2>{title}</h2>
    </div>
  );
}
