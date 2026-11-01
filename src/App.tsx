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

function makeId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function App() {
  const [activeSection, setActiveSection] = useState<Section>("inicio");
  const [systems, setSystems] = useState<RPGSystem[]>(loadSystems);
  const [isCreating, setIsCreating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [systemName, setSystemName] = useState("");
  const [systemDescription, setSystemDescription] = useState("");
  const [systemGenre, setSystemGenre] = useState(genres[0]);
  const [systemDice, setSystemDice] = useState("D20");
  const [systemVisibility, setSystemVisibility] =
    useState<"Privado" | "Público">("Privado");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(systems));
    } catch {
      // O navegador pode bloquear o armazenamento local.
    }
  }, [systems]);

  function openSection(section: Section) {
    setActiveSection(section);
    setIsCreating(false);
    setSidebarOpen(false);
  }

  function resetForm() {
    setSystemName("");
    setSystemDescription("");
    setSystemGenre(genres[0]);
    setSystemDice("D20");
    setSystemVisibility("Privado");
  }

  function createSystem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = systemName.trim();
    if (!trimmedName) return;

    const newSystem: RPGSystem = {
      id: makeId(),
      name: trimmedName,
      description: systemDescription.trim(),
      genre: systemGenre,
      dice: systemDice,
      visibility: systemVisibility,
      createdAt: new Date().toISOString(),
    };

    setSystems((current) => [newSystem, ...current]);
    resetForm();
    setIsCreating(false);
  }

  function deleteSystem(id: string) {
    const confirmed = window.confirm(
      "Tem certeza de que deseja excluir este sistema? Essa ação não pode ser desfeita."
    );

    if (confirmed) {
      setSystems((current) => current.filter((system) => system.id !== id));
    }
  }

  const pageTitle =
    navigation.find((item) => item.id === activeSection)?.label ?? "Início";

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Fechar menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-symbol">F</div>
          <div className="brand-name">
            <span>FLARE</span>
            <small>RPG PLATFORM</small>
          </div>
          <button
            className="sidebar-close"
            aria-label="Fechar menu"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="sidebar-label">ESPAÇO DE CRIAÇÃO</div>

        <nav className="navigation">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${
                activeSection === item.id ? "nav-item-active" : ""
              }`}
              onClick={() => openSection(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === "sistemas" && systems.length > 0 && (
                <span className="nav-count">{systems.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-divider" />
          <div className="sidebar-quote">
            <span className="quote-mark">“</span>
            <p>
              Toda grande aventura começa com uma ideia.
            </p>
            <small>O SEU MUNDO, SUAS REGRAS.</small>
          </div>
          <div className="sidebar-version">FLARE RPG · VERSÃO INICIAL</div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle"
              aria-label="Abrir menu"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <div className="breadcrumb">
              <span>FLARE RPG</span>
              <span className="breadcrumb-separator">/</span>
              <strong>{pageTitle}</strong>
            </div>
          </div>

          <div className="topbar-right">
            <div className="status-indicator">
              <span />
              Ambiente local
            </div>
            <div className="profile-avatar">A</div>
          </div>
        </header>

        <div className="page-content">
          {activeSection === "inicio" && (
            <section className="dashboard">
              <div className="welcome-heading">
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-line" />
                    SEU ESPAÇO DE AVENTURAS
                  </div>
                  <h1>
                    Bem-vindo ao <span>Flare.</span>
                  </h1>
                  <p className="welcome-description">
                    Crie mundos, desenvolva sistemas e prepare suas próximas
                    aventuras.
                  </p>
                </div>
                <div className="welcome-emblem">
                  <div className="emblem-ring emblem-ring-outer" />
                  <div className="emblem-ring emblem-ring-inner" />
                  <span>✦</span>
                </div>
              </div>

              <div className="hero-card">
                <div className="hero-content">
                  <span className="hero-kicker">O COMEÇO DE ALGO GRANDE</span>
                  <h2>Seu próximo mundo começa aqui.</h2>
                  <p>
                    Construa um sistema próprio, estabeleça suas regras e
                    transforme suas ideias em experiências de RPG.
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => {
                      openSection("sistemas");
                      setIsCreating(true);
                    }}
                  >
                    <span>＋</span> Criar um sistema
                  </button>
                </div>
                <div className="hero-decoration">
                  <div className="hero-orbit orbit-one" />
                  <div className="hero-orbit orbit-two" />
                  <div className="hero-orbit orbit-three" />
                  <div className="hero-core">✧</div>
                </div>
              </div>

              <div className="section-heading">
                <div>
                  <span className="eyebrow">VISÃO GERAL</span>
                  <h2>Seu espaço de trabalho</h2>
                </div>
              </div>

              <div className="overview-grid">
                <OverviewCard
                  icon="✧"
                  label="Sistemas criados"
                  value={systems.length.toString()}
                  description="Seus sistemas personalizados"
                />
                <OverviewCard
                  icon="♙"
                  label="Personagens"
                  value="0"
                  description="Ficha e evolução de personagens"
                />
                <OverviewCard
                  icon="⚔"
                  label="Campanhas"
                  value="0"
                  description="Suas aventuras em andamento"
                />
                <OverviewCard
                  icon="♧"
                  label="Grupos"
                  value="0"
                  description="Mesas e comunidades"
                />
              </div>

              <div className="section-heading recent-heading">
                <div>
                  <span className="eyebrow">CONTINUE DE ONDE PAROU</span>
                  <h2>Atividade recente</h2>
                </div>
              </div>

              <div className="activity-empty">
                <div className="empty-icon">⌁</div>
                <h3>Seu registro de aventuras está vazio.</h3>
                <p>
                  Quando você começar a criar seus sistemas e campanhas, suas
                  atividades aparecerão aqui.
                </p>
              </div>
            </section>
          )}

          {activeSection === "sistemas" && (
            <section className="systems-page">
              <div className="systems-heading">
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-line" />
                    FORJA DE REGRAS
                  </div>
                  <h1>Meus sistemas</h1>
                  <p>
                    Crie e organize sistemas de RPG com suas próprias regras.
                  </p>
                </div>

                {!isCreating && (
                  <button
                    className="primary-button create-top-button"
                    onClick={() => setIsCreating(true)}
                  >
                    <span>＋</span> Novo sistema
                  </button>
                )}
              </div>

              {!isCreating ? (
                <>
                  <div className="systems-toolbar">
                    <div className="systems-total">
                      <span className="systems-total-number">
                        {systems.length.toString().padStart(2, "0")}
                      </span>
                      <span>
                        {systems.length === 1
                          ? "SISTEMA CRIADO"
                          : "SISTEMAS CRIADOS"}
                      </span>
                    </div>
                    <span className="local-storage-label">
                      <span /> SALVOS NESTE NAVEGADOR
                    </span>
                  </div>

                  {systems.length === 0 ? (
                    <div className="systems-empty">
                      <div className="systems-empty-symbol">✧</div>
                      <h2>Uma página em branco.</h2>
                      <p>
                        Você ainda não criou nenhum sistema. Dê o primeiro
                        passo e comece a construir suas próprias regras.
                      </p>
                      <button
                        className="primary-button"
                        onClick={() => setIsCreating(true)}
                      >
                        <span>＋</span> Criar meu primeiro sistema
                      </button>
                    </div>
                  ) : (
                    <div className="systems-list">
                      {systems.map((system) => (
                        <article className="system-card" key={system.id}>
                          <div className="system-card-symbol">✧</div>
                          <div className="system-card-content">
                            <div className="system-card-topline">
                              <span className="system-genre">
                                {system.genre}
                              </span>
                              <span
                                className={`visibility-tag ${
                                  system.visibility === "Público"
                                    ? "visibility-public"
                                    : ""
                                }`}
                              >
                                {system.visibility}
                              </span>
                            </div>
                            <h3>{system.name}</h3>
                            <p>
                              {system.description ||
                                "Nenhuma descrição foi adicionada."}
                            </p>
                            <div className="system-card-meta">
                              <span>Dado principal: {system.dice}</span>
                              <span>
                                Criado em{" "}
                                {new Date(system.createdAt).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </span>
                            </div>
                          </div>
                          <button
                            className="delete-system-button"
                            onClick={() => deleteSystem(system.id)}
                            aria-label={`Excluir ${system.name}`}
                            title="Excluir sistema"
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
                  <div className="creation-header">
                    <button
                      className="back-button"
                      onClick={() => {
                        setIsCreating(false);
                        resetForm();
                      }}
                    >
                      ← Voltar para meus sistemas
                    </button>
                    <span className="creation-step-label">
                      ETAPA 01 <span>/</span> 04
                    </span>
                  </div>

                  <div className="creation-progress">
                    <div className="progress-step progress-step-active">
                      <span>01</span>
                      <small>Identidade</small>
                    </div>
                    <div className="progress-line" />
                    <div className="progress-step">
                      <span>02</span>
                      <small>Atributos</small>
                    </div>
                    <div className="progress-line" />
                    <div className="progress-step">
                      <span>03</span>
                      <small>Mecânicas</small>
                    </div>
                    <div className="progress-line" />
                    <div className="progress-step">
                      <span>04</span>
                      <small>Finalização</small>
                    </div>
                  </div>

                  <div className="creation-intro">
                    <span className="eyebrow">PRIMEIROS FUNDAMENTOS</span>
                    <h2>Dê identidade ao seu sistema.</h2>
                    <p>
                      Toda criação precisa de uma base. Comece definindo o
                      nome, o universo e algumas características fundamentais
                      do seu RPG.
                    </p>
                  </div>

                  <form className="system-form" onSubmit={createSystem}>
                    <div className="form-section-title">
                      <span>01</span>
                      <div>
                        <h3>Identidade do sistema</h3>
                        <p>Como seu sistema será conhecido?</p>
                      </div>
                    </div>

                    <label className="form-field">
                      <span>Nome do sistema <b>*</b></span>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="Ex.: Crônicas do Véu Partido"
                        value={systemName}
                        onChange={(event) => setSystemName(event.target.value)}
                        maxLength={60}
                        required
                      />
                      <small>Escolha um nome que represente seu universo.</small>
                    </label>

                    <label className="form-field">
                      <span>Descrição</span>
                      <textarea
                        className="form-input form-textarea"
                        placeholder="Descreva a proposta, o universo ou a experiência do seu RPG..."
                        value={systemDescription}
                        onChange={(event) =>
                          setSystemDescription(event.target.value)
                        }
                        maxLength={500}
                        rows={4}
                      />
                      <small>
                        {systemDescription.length}/500 caracteres
                      </small>
                    </label>

                    <div className="form-divider" />

                    <div className="form-section-title">
                      <span>02</span>
                      <div>
                        <h3>Características fundamentais</h3>
                        <p>Defina os pilares iniciais das regras.</p>
                      </div>
                    </div>

                    <div className="form-two-columns">
                      <label className="form-field">
                        <span>Gênero do universo</span>
                        <select
                          className="form-input form-select"
                          value={systemGenre}
                          onChange={(event) =>
                            setSystemGenre(event.target.value)
                          }
                        >
                          {genres.map((genre) => (
                            <option key={genre} value={genre}>
                              {genre}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="form-field">
                        <span>Sistema de dados principal</span>
                        <select
                          className="form-input form-select"
                          value={systemDice}
                          onChange={(event) =>
                            setSystemDice(event.target.value)
                          }
                        >
                          {diceOptions.map((dice) => (
                            <option key={dice} value={dice}>
                              {dice}
                            </option>
                          ))}
    
