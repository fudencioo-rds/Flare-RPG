import { useState } from "react";

type Section =
  | "inicio"
  | "sistemas"
  | "personagens"
  | "campanhas"
  | "grupos"
  | "biblioteca"
  | "configuracoes";

const navigation: {
  id: Section;
  label: string;
  symbol: string;
}[] = [
  { id: "inicio", label: "Início", symbol: "⌂" },
  { id: "sistemas", label: "Meus sistemas", symbol: "✧" },
  { id: "personagens", label: "Personagens", symbol: "♙" },
  { id: "campanhas", label: "Campanhas", symbol: "⚔" },
  { id: "grupos", label: "Grupos", symbol: "♟" },
  { id: "biblioteca", label: "Biblioteca", symbol: "▤" },
];

const sectionInfo: Record<
  Section,
  { title: string; description: string }
> = {
  inicio: {
    title: "Seu universo de aventuras",
    description: "Tudo o que você precisa para suas próximas jornadas.",
  },
  sistemas: {
    title: "Meus sistemas",
    description: "Crie, organize e personalize seus próprios sistemas de RPG.",
  },
  personagens: {
    title: "Personagens",
    description: "Seus heróis, suas histórias e suas fichas.",
  },
  campanhas: {
    title: "Campanhas",
    description: "Organize aventuras e conduza suas sessões.",
  },
  grupos: {
    title: "Grupos",
    description: "Reúna seus jogadores e organize suas mesas.",
  },
  biblioteca: {
    title: "Biblioteca",
    description: "Um espaço para guardar e compartilhar conteúdos de RPG.",
  },
  configuracoes: {
    title: "Configurações",
    description: "Personalize sua experiência no Flare RPG.",
  },
};

export default function App() {
  const [activeSection, setActiveSection] =
    useState<Section>("inicio");

  const [menuOpen, setMenuOpen] = useState(false);

  function navigate(section: Section) {
    setActiveSection(section);
    setMenuOpen(false);
  }

  const currentSection = sectionInfo[activeSection];

  return (
    <div className="app-shell">
      {menuOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-emblem">✦</div>

          <div className="brand-text">
            <span className="brand-name">FLARE</span>
            <span className="brand-subtitle">ROLEPLAY PLATFORM</span>
          </div>
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-label">MENU PRINCIPAL</div>

        <nav className="navigation">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${
                activeSection === item.id ? "nav-item-active" : ""
              }`}
              onClick={() => navigate(item.id)}
            >
              <span className="nav-symbol">{item.symbol}</span>
              <span>{item.label}</span>

              {activeSection === item.id && (
                <span className="nav-indicator" />
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-divider sidebar-bottom-divider" />

        <button
          className={`nav-item ${
            activeSection === "configuracoes" ? "nav-item-active" : ""
          }`}
          onClick={() => navigate("configuracoes")}
        >
          <span className="nav-symbol">⚙</span>
          <span>Configurações</span>
        </button>

        <div className="sidebar-footer">
          <div className="sidebar-footer-symbol">✧</div>
          <p>Seu próximo mundo começa aqui.</p>
          <span>FLARE RPG · VERSÃO 0.1</span>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu-button"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>

          <div className="breadcrumb">
            <span>FLARE</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{currentSection.title}</strong>
          </div>

          <div className="topbar-actions">
            <div className="account-placeholder">
              <div className="account-avatar">?</div>

              <div className="account-info">
                <strong>Visitante</strong>
                <span>Conta não conectada</span>
              </div>
            </div>
          </div>
        </header>

        <div className="page-content">
          {activeSection === "inicio" ? (
            <>
              <section className="welcome-section">
                <div className="welcome-content">
                  <span className="eyebrow">
                    <span className="eyebrow-line" />
                    SUA JORNADA COMEÇA AQUI
                  </span>

                  <h1>
                    Bem-vindo ao
                    <span> Flare RPG.</span>
                  </h1>

                  <p>
                    Um espaço para criar mundos, desenvolver histórias
                    e reunir pessoas em torno de grandes aventuras.
                  </p>

                  <button
                    className="primary-button"
                    onClick={() => navigate("sistemas")}
                  >
                    <span>✧</span>
                    Explorar meus sistemas
                    <span className="button-arrow">→</span>
                  </button>
                </div>

                <div className="welcome-decoration">
                  <div className="decoration-ring decoration-ring-outer" />
                  <div className="decoration-ring decoration-ring-inner" />
                  <div className="decoration-core">✦</div>
                  <div className="decoration-orbit orbit-one" />
                  <div className="decoration-orbit orbit-two" />
                </div>
              </section>

              <section className="section-block">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">ACESSO RÁPIDO</span>
                    <h2>O que vamos criar hoje?</h2>
                  </div>
                </div>

                <div className="quick-grid">
                  <button
                    className="quick-card"
                    onClick={() => navigate("sistemas")}
                  >
                    <span className="quick-icon">✧</span>
                    <span className="quick-card-title">
                      Criar um sistema
                    </span>
                    <span className="quick-card-description">
                      Desenvolva suas próprias regras e mecânicas.
                    </span>
                    <span className="quick-card-arrow">→</span>
                  </button>

                  <button
                    className="quick-card"
                    onClick={() => navigate("personagens")}
                  >
                    <span className="quick-icon">♙</span>
                    <span className="quick-card-title">
                      Criar personagem
                    </span>
                    <span className="quick-card-description">
                      Dê vida a um novo aventureiro.
                    </span>
                    <span className="quick-card-arrow">→</span>
                  </button>

                  <button
                    className="quick-card"
                    onClick={() => navigate("campanhas")}
                  >
                    <span className="quick-icon">⚔</span>
                    <span className="quick-card-title">
                      Nova campanha
                    </span>
                    <span className="quick-card-description">
                      Prepare uma nova jornada para seu grupo.
                    </span>
                    <span className="quick-card-arrow">→</span>
                  </button>
                </div>
              </section>

              <section className="section-block overview-section">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">SEU ESPAÇO</span>
                    <h2>Visão geral</h2>
                  </div>
                </div>

                <div className="overview-grid">
                  <button
                    className="overview-card"
                    onClick={() => navigate("campanhas")}
                  >
                    <span className="overview-symbol">⚔</span>
                    <span className="overview-title">Campanhas</span>
                    <span className="overview-status">
                      Nenhuma campanha criada
                    </span>
                    <span className="overview-link">Acessar →</span>
                  </button>

                  <button
                    className="overview-card"
                    onClick={() => navigate("sistemas")}
                  >
                    <span className="overview-symbol">✧</span>
                    <span className="overview-title">Sistemas</span>
                    <span className="overview-status">
                      Nenhum sistema criado
                    </span>
                    <span className="overview-link">Acessar →</span>
                  </button>

                  <button
                    className="overview-card"
                    onClick={() => navigate("personagens")}
                  >
                    <span className="overview-symbol">♙</span>
                    <span className="overview-title">Personagens</span>
                    <span className="overview-status">
                      Nenhum personagem criado
                    </span>
                    <span className="overview-link">Acessar →</span>
                  </button>
                </div>
              </section>

              <section className="section-block activity-section">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">ACOMPANHAMENTO</span>
                    <h2>Atividade recente</h2>
                  </div>
                </div>

                <div className="empty-activity">
                  <span className="empty-activity-symbol">◈</span>
                  <strong>Suas aventuras aparecerão aqui.</strong>
                  <p>
                    Quando você começar a utilizar a plataforma,
                    suas atividades recentes serão organizadas neste espaço.
                  </p>
                </div>
              </section>
            </>
          ) : (
            <section className="placeholder-page">
              <span className="eyebrow">FLARE RPG</span>
              <h1>{currentSection.title}</h1>
              <p>{currentSection.description}</p>

              <div className="construction-panel">
                <span className="construction-symbol">✧</span>
                <h2>Este espaço está sendo preparado.</h2>
                <p>
                  Estamos construindo esta parte da plataforma.
                  Em breve, ela terá seus próprios recursos e ferramentas.
                </p>

                <span className="construction-status">
                  <span className="status-dot" />
                  EM DESENVOLVIMENTO
                </span>
              </div>

              <button
                className="secondary-button"
                onClick={() => navigate("inicio")}
              >
                ← Voltar ao início
              </button>
            </section>
          )}
        </div>

        <footer className="main-footer">
          <span>FLARE RPG</span>
          <span>Crie mundos. Conte histórias. Jogue juntos.</span>
        </footer>
      </main>
    </div>
  );
              }
