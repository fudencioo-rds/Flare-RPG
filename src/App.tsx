TypeScript

import { useEffect, useState, type FormEvent } from "react";

type Section =
  | "inicio"
  | "sistemas"
  | "personagens"
  | "campanhas"
  | "grupos"
  | "biblioteca"
  | "configuracoes";

type BuilderData = {
  attributes: string;
  skills: string;
  diceRules: string;
  tests: string;
  resources: string;
  races: string;
  classes: string;
  abilities: string;
  progression: string;
  combat: string;
  conditions: string;
  equipment: string;
  review: string;
};

type RPGSystem = {
  id: string;
  name: string;
  description: string;
  genre: string;
  dice: string;
  visibility: "Privado" | "Público";
  createdAt: string;
  builder?: BuilderData;
};

type BuilderField = {
  key: keyof BuilderData;
  label: string;
  placeholder: string;
  hint: string;
};

type BuilderStep = {
  title: string;
  subtitle: string;
  description: string;
  fields: BuilderField[];
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

const emptyBuilder: BuilderData = {
  attributes: "",
  skills: "",
  diceRules: "",
  tests: "",
  resources: "",
  races: "",
  classes: "",
  abilities: "",
  progression: "",
  combat: "",
  conditions: "",
  equipment: "",
  review: "",
};

const builderSteps: BuilderStep[] = [
  {
    title: "Atributos e características",
    subtitle: "ETAPA 02 · FUNDAMENTOS",
    description:
      "Defina as características que representam as capacidades dos personagens.",
    fields: [
      {
        key: "attributes",
        label: "Atributos",
        placeholder:
          "Força: capacidade física e potência muscular\nDestreza: agilidade e coordenação\nInteligência: raciocínio e conhecimento\nConstituição: resistência e vigor",
        hint: "Escreva um atributo por linha. Você pode explicar sua função.",
      },
    ],
  },
  {
    title: "Perícias e especializações",
    subtitle: "ETAPA 03 · COMPETÊNCIAS",
    description:
      "Configure os conhecimentos, treinamentos e especializações dos personagens.",
    fields: [
      {
        key: "skills",
        label: "Perícias",
        placeholder:
          "Acrobacia: movimentos e equilíbrio\nInvestigação: procurar pistas\nPersuasão: convencer outras pessoas\nSobrevivência: enfrentar ambientes hostis",
        hint: "Uma perícia por linha. Inclua descrições ou atributos relacionados.",
      },
    ],
  },
  {
    title: "Dados e testes",
    subtitle: "ETAPA 04 · RESOLUÇÃO",
    description:
      "Explique como funcionam as rolagens, dificuldades e resultados das ações.",
    fields: [
      {
        key: "diceRules",
        label: "Regras de rolagem",
        placeholder:
          "Exemplo: role 1d20 e some o modificador do atributo.",
        hint: "Descreva a estrutura principal das rolagens.",
      },
      {
        key: "tests",
        label: "Testes e dificuldades",
        placeholder:
          "Teste fácil: dificuldade 8\nTeste médio: dificuldade 13\nTeste difícil: dificuldade 18\nSucesso crítico: resultado especial",
        hint: "Defina dificuldades, sucessos, falhas e resultados especiais.",
      },
    ],
  },
  {
    title: "Recursos e reservas",
    subtitle: "ETAPA 05 · RECURSOS",
    description:
      "Crie os recursos utilizados pelos personagens durante suas aventuras.",
    fields: [
      {
        key: "resources",
        label: "Recursos",
        placeholder:
          "Vida: representa a capacidade de continuar lutando\nMana: utilizada para conjurar habilidades mágicas\nEnergia: utilizada em técnicas especiais\nSanidade: representa a estabilidade mental",
        hint: "Descreva como cada recurso funciona e como é recuperado.",
      },
    ],
  },
  {
    title: "Raças, origens e classes",
    subtitle: "ETAPA 06 · IDENTIDADES",
    description:
      "Configure as opções de criação e personalização dos personagens.",
    fields: [
      {
        key: "races",
        label: "Raças e espécies",
        placeholder:
          "Humanos: versáteis e adaptáveis\nElfos: ligados à natureza e à magia\nAnões: resistentes e habilidosos",
        hint: "Descreva características, vantagens e limitações.",
      },
      {
        key: "classes",
        label: "Classes e arquétipos",
        placeholder:
          "Guerreiro: especialista em combate físico\nMago: manipula forças arcanas\nLadino: utiliza agilidade e estratégia",
        hint: "Descreva o papel e as características de cada classe.",
      },
    ],
  },
  {
    title: "Habilidades e progressão",
    subtitle: "ETAPA 07 · DESENVOLVIMENTO",
    description:
      "Defina poderes, técnicas, talentos e a evolução dos personagens.",
    fields: [
      {
        key: "abilities",
        label: "Habilidades e poderes",
        placeholder:
          "Nome da habilidade\nDescrição e efeito\nCusto de utilização\nRequisitos e limitações",
        hint: "Descreva como as habilidades funcionam e quais são suas regras.",
      },
      {
        key: "progression",
        label: "Evolução e progressão",
        placeholder:
          "Como os personagens sobem de nível?\nComo recebem novos atributos?\nComo desbloqueiam habilidades?\nExiste experiência ou outro sistema de progressão?",
        hint: "Explique como um personagem se desenvolve ao longo da campanha.",
      },
    ],
  },
  {
    title: "Combate e condições",
    subtitle: "ETAPA 08 · CONFRONTO",
    description:
      "Configure as regras de combate e os efeitos que podem afetar personagens.",
    fields: [
      {
        key: "combat",
        label: "Sistema de combate",
        placeholder:
          "Iniciativa\nOrdem dos turnos\nAções disponíveis\nMovimentação\nDefesa e esquiva\nDano e resistência",
        hint: "Descreva como um confronto acontece do início ao fim.",
      },
      {
        key: "conditions",
        label: "Condições e efeitos",
        placeholder:
          "Envenenado: efeito e duração\nAtordoado: efeito e duração\nQueimando: efeito e duração\nAmedrontado: efeito e duração",
        hint: "Registre condições, duração, consequências e formas de remoção.",
      },
    ],
  },
  {
    title: "Equipamentos e itens",
    subtitle: "ETAPA 09 · INVENTÁRIO",
    description:
      "Crie as regras para armas, armaduras, objetos e outros equipamentos.",
    fields: [
      {
        key: "equipment",
        label: "Equipamentos e itens",
        placeholder:
          "Armas e categorias\nArmaduras e proteção\nItens consumíveis\nPoções e materiais\nRaridade e propriedades especiais\nPeso e capacidade de carga",
        hint: "Descreva os itens e as regras que controlam sua utilização.",
      },
    ],
  },
  {
    title: "Revisão do sistema",
    subtitle: "ETAPA 10 · FINALIZAÇÃO",
    description:
      "Revise as decisões do projeto e registre observações importantes.",
    fields: [
      {
        key: "review",
        label: "Observações e regras adicionais",
        placeholder:
          "Regras opcionais\nExceções às regras principais\nRecomendações para mestres\nPrincípios de equilíbrio\nOutras mecânicas que deseja implementar",
        hint: "Este espaço é livre. Registre qualquer detalhe importante.",
      },
    ],
  },
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
  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState(genres[0]);
  const [dice, setDice] = useState("D20");
  const [visibility, setVisibility] =
    useState<"Privado" | "Público">("Privado");
  const [builder, setBuilder] = useState<BuilderData>(emptyBuilder);

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
    setBuilder({ ...emptyBuilder });
    setStep(0);
  }

  function startCreation() {
    resetForm();
    setCreating(true);
    setSection("sistemas");
  }

  function updateBuilder(key: keyof BuilderData, value: string) {
    setBuilder((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function saveSystem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    if (!cleanName) {
      setStep(0);
      return;
    }

    const system: RPGSystem = {
      id: createId(),
      name: cleanName,
      description: description.trim(),
      genre,
      dice,
      visibility,
      createdAt: new Date().toISOString(),
      builder: { ...builder },
    };

    setSystems((current) => [system, ...current]);
    resetForm();
    setCreating(false);
  }

  function removeSystem(id: string) {
    if (!window.confirm("Deseja realmente excluir este sistema?")) return;
    setSystems((current) => current.filter((system) => system.id !== id));
  }

  function nextStep() {
    if (step === 0 && !name.trim()) return;
    setStep((current) => Math.min(current + 1, builderSteps.length));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pageTitle =
    navigation.find((item) => item.id === section)?.label ?? "Início";

  const isIdentityStep = step === 0;
  const isFinalStep = step === builderSteps.length;
  const currentStep = builderSteps[step - 1];

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
          <small>FLARE RPG · VERSÃO 0.3</small>
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
              <strong>{creating ? "Criador de sistemas" : pageTitle}</strong>
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
                  <button className="quick-card" onClick={startCreation}>
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
                      onClick={startCreation}
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
                        onClick={startCreation}
                      >
                        Criar meu primeiro sistema
                      </button>
                    </div>
                  ) : (
                    <div className="systems-list">
                      {systems.map((system) => (
                        <article className="system-card" key={system.id}>
                          <div className="system-card-icon">✧</div>
                          <div clas
sName="system-card-content">
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
                            {system.builder && (
                              <small className="system-configured">
                                ✧ Configurações do sistema salvas
                              </small>
                            )}
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
                    <span className="eyebrow">
                      CRIADOR DE SISTEMAS · ETAPA {String(step + 1).padStart(2, "0")}
                    </span>
                    <h1>Construa seu próprio RPG.</h1>
                    <p>
                      Configure cada parte do seu sistema. Você pode avançar,
                      voltar e revisar suas escolhas antes de salvar.
                    </p>
                  </div>

                  <div className="builder-progress-info">
                    <span>
                      {isFinalStep
                        ? "Revisão final"
                        : `Etapa ${step + 1} de ${builderSteps.length + 1}`}
                    </span>
                    <strong>
                      {Math.round(
                        ((step + 1) / (builderSteps.length + 1)) * 100
                      )}
                      %
                    </strong>
                  </div>

                  <div className="builder-progress-track">
                    <div
                      className="builder-progress-fill"
                      style={{
                        width: `${((step + 1) / (builderSteps.length + 1)) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="builder-step-nav">
                    <button
                      type="button"
                      className={step === 0 ? "current" : "completed"}
                      onClick={() => setStep(0)}
                    >
                      <span>01</span>
                      <small>Identidade</small>
                    </button>
                    {builderSteps.map((item, index) => (
                      <button
                        type="button"
                        key={item.title}
                        className={
                          step === index + 1
                            ? "current"
                            : step > index + 1
                              ? "completed"
                              : ""
                        }
                        onClick={() => {
                          if (index + 1 <= step || (step === 0 && name.trim())) {
                            setStep(index + 1);
                          }
                        }}
                      >
                        <span>{String(index + 2).padStart(2, "0")}</span>
                        <small>{item.title}</small>
                      </button>
                    ))}
                  </div>

                  <form className="system-form builder-form" onSubmit={saveSystem}>
                    {isIdentityStep ? (
                      <>
                        <div className="form-heading">
                          <span>01</span>
                          <div>
                            <h2>Identidade do sistema</h2>
                            <p>Comece dando uma identidade ao seu projeto.</p>
                          </div>
                        </div>

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

                        <div className="form-heading">
                          <span>02</span>
                          <div>
                            <h2>Visibilidade</h2>
                            <p>Escolha como deseja classificar seu projeto.</p>
                          </div>
                        </div>

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
                      </>
                    ) : !isFinalStep && currentStep ? (
                      <>
                        <div className="form-heading">
                          <span>{String(step + 1).padStart(2, "0")}</span>
                          <div>
                            <h2>{currentStep.title}</h2>
                            <p>{currentStep.description}</p>
                          </div>
                        </div>

                        <span className="eyebrow">{currentStep.subtitle}</span>

                        <div className="builder-fields">
                          {currentStep.fields.map((field) => (
                            <label className="form-field" key={field.key}>
                              <span>{field.label}</span>
                              <textarea
                                className="form-input form-textarea builder-textarea"
                                value={builder[field.key]}
                                onChange={(event) =>
                                  updateBuilder(field.key, event.target.value)
                                }
                                placeholder={field.placeholder}
                                rows={8}
                              />
                              <small>{field.hint}</small>
                            </label>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="form-heading">
                          <span>10</span>
                          <div>
                            <h2>Revise seu sistema</h2>
                            <p>
                              Confira as informações antes de salvar o projeto.
                            </p>
                          </div>
                        </div>

                        <div className="builder-review">
                          <div>
                            <span>IDENTIDADE</span>
                            <h3>{name || "Sistema sem nome"}</h3>
                            <p>{description || "Sem descrição."}</p>
                            <small>
                              {genre} · Dado principal: {dice} · {visibility}
                            </small>
                          </div>

                          {builderSteps.map((item, index) => {
                            const content = item.fields
                              .map((field) => builder[field.key].trim())
                              .filter(Boolean);

                            return (
                              <div className="review-section" key={item.title}>
                                <div>
                                  <strong>
                                    {String(index + 2).padStart(2, "0")} ·{" "}
                                    {item.title}
                                  </strong>
                                  <button
                                    type="button"
                                    onClick={() => setStep(index + 1)}
                                  >
                                    Editar
                                  </button>
                                </div>
                                <p>
                                  {content.length > 0
                                    ? `${content.length} campo(s) preenchido(s)`
                                    : "Ainda não configurado"}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        <div className="form-notice">
                          <span>ⓘ</span>
                          <p>
                            O projeto será salvo neste navegador. As regras
                            estão registradas como configurações, mas ainda
                            não executam cálculos automáticos nem são
                            compartilhadas online.
                          </p>
                        </div>
                      </>
                    )}

                    <div className="builder-navigation">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={previousStep}
                        disabled={step === 0}
                      >
                        ← Etapa anterior
                      </button>

                      {isFinalStep ? (
                        <button
                          type="submit"
                          className="primary-button"
                          disabled={!name.trim()}
                        >
                          Salvar sistema ✧
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="primary-button"
                          onClick={nextStep}
                          disabled={isIdentityStep && !name.trim()}
                        >
                          Próxima etapa →
                        </button>
                      )}
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
                              
