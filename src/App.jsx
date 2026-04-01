import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  Crosshair,
  Download,
  FileUp,
  Filter,
  Flame,
  History,
  House,
  Play,
  Plus,
  Save,
  Search,
  Shield,
  Sparkles,
  Sword,
  Target,
  Trash2,
  Trophy,
  Upload,
  Users,
  X,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  STORAGE_KEY,
  MAP_POOL,
  REGIONS,
  ROLES,
  MATCH_FORMATS,
  SPEED_OPTIONS,
  MAP_CONFIGS,
  clamp,
  compositeRating,
  createBlankCoach,
  createBlankPlayer,
  createBlankTeam,
  createInitialAppData,
  deepClone,
  deriveBannedMaps,
  formatMoney,
  getCompositeColor,
  getMapPriority,
  getRatingColor,
  getTeamStrength,
  normalizeTeam,
  createMatchFromSetup,
  startMatch,
  stepMatch,
  simulateEntireMatch,
  buildHistoryEntry,
  buildResultsData,
} from "./simulation";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: House },
  { id: "teams", label: "Teams", icon: Users },
  { id: "match-setup", label: "Match Setup", icon: Sword },
  { id: "live", label: "Live Match", icon: Crosshair },
  { id: "results", label: "Results", icon: Trophy },
  { id: "history", label: "History", icon: History },
];

const LanguageContext = createContext(null);

const COPY = {
  en: {
    nav_home: "Home",
    nav_teams: "Teams",
    nav_match_setup: "Match Setup",
    nav_live: "Live Match",
    nav_results: "Results",
    nav_history: "History",
    app_title: "CS2 Pro Match Simulator",
    app_tagline: "Dark server room. Full series control.",
    language: "Language",
    last_saved: "Last saved",
    not_saved: "Not saved yet",
    export_all_data: "Export All Data",
    import_data: "Import Data",
    dashboard: "Dashboard",
    quick_start: "Quick Start",
    top_teams: "Top Teams",
    recent_results: "Recent Results",
    open_team_manager: "Open Team Manager",
    open_history: "Open History",
    team_manager: "Team Manager",
    new_team: "New Team",
    save_team: "Save Team",
    delete_team: "Delete",
    match_setup: "Match Setup",
    start_veto: "Start Veto",
    series_rules: "Series Rules",
    checklist: "Checklist",
    veto_screen: "Veto Screen",
    series_order: "Series Order",
    round_history: "Round History",
    live_match: "Live Match",
    round_hud: "Round HUD",
    live_feed: "Live Feed",
    economy_graph: "Economy Graph",
    series_results: "Series Results",
    highlights: "Highlights",
    map_breakdown: "Map Breakdown",
    full_player_stats: "Full Player Stats",
    history: "History",
    clear_history: "Clear History",
    filter_by_team: "Filter by team",
    combined: "Combined",
    by_team: "By Team",
    player: "Player",
    team: "Team",
    rating: "Rating",
    open_team_manager_short: "Open Team Manager",
  },
  ru: {
    nav_home: "Главная",
    nav_teams: "Команды",
    nav_match_setup: "Настройка матча",
    nav_live: "Live матч",
    nav_results: "Результаты",
    nav_history: "История",
    app_title: "CS2 Pro Match Simulator",
    app_tagline: "Темная серверная. Полный контроль серии.",
    language: "Язык",
    last_saved: "Последнее сохранение",
    not_saved: "Еще не сохранено",
    export_all_data: "Экспортировать все данные",
    import_data: "Импортировать данные",
    dashboard: "Дашборд",
    quick_start: "Быстрый старт",
    top_teams: "Топ команд",
    recent_results: "Последние результаты",
    open_team_manager: "Открыть менеджер команд",
    open_history: "Открыть историю",
    team_manager: "Менеджер команд",
    new_team: "Новая команда",
    save_team: "Сохранить команду",
    delete_team: "Удалить",
    match_setup: "Настройка матча",
    start_veto: "Начать veto",
    series_rules: "Правила серии",
    checklist: "Чеклист",
    veto_screen: "Экран veto",
    series_order: "Порядок карт",
    round_history: "История раундов",
    live_match: "Live матч",
    round_hud: "HUD раунда",
    live_feed: "Live лента",
    economy_graph: "График экономики",
    series_results: "Итоги серии",
    highlights: "Хайлайты",
    map_breakdown: "Разбор карт",
    full_player_stats: "Полная статистика игроков",
    history: "История",
    clear_history: "Очистить историю",
    filter_by_team: "Фильтр по команде",
    combined: "Все вместе",
    by_team: "По командам",
    player: "Игрок",
    team: "Команда",
    rating: "Рейтинг",
    open_team_manager_short: "Менеджер команд",
  },
};

function useI18n() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("LanguageContext is missing");
  }
  return context;
}

function defaultSetup(teams) {
  return {
    teamAId: teams[0]?.id ?? "",
    teamBId: teams[1]?.id ?? teams[0]?.id ?? "",
    format: "BO3",
    speed: "live",
    showDetailedLogs: true,
  };
}

function loadStoredSnapshot() {
  const fallback = createInitialAppData();
  const baseState = {
    teams: fallback.teams,
    matchHistory: fallback.matchHistory,
    activeView: "home",
    selectedTeamId: fallback.teams[0]?.id ?? null,
    currentMatch: null,
    resultsData: null,
  };

  if (typeof window === "undefined") {
    return { state: baseState, setup: defaultSetup(fallback.teams), lastSavedAt: null, language: "en" };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { state: baseState, setup: defaultSetup(fallback.teams), lastSavedAt: null, language: "en" };
    }

    const parsed = JSON.parse(raw);
    const teams = (parsed.state?.teams ?? parsed.teams ?? fallback.teams).map(normalizeTeam);
    const matchHistory = parsed.state?.matchHistory ?? parsed.matchHistory ?? [];
    return {
      state: {
        teams,
        matchHistory,
        activeView: parsed.state?.activeView ?? "home",
        selectedTeamId: parsed.state?.selectedTeamId ?? teams[0]?.id ?? null,
        currentMatch: parsed.state?.currentMatch ?? null,
        resultsData: parsed.state?.resultsData ?? null,
      },
      setup: parsed.matchSetup ?? defaultSetup(teams),
      lastSavedAt: parsed.lastSavedAt ?? null,
      language: parsed.language ?? "en",
    };
  } catch {
    return { state: baseState, setup: defaultSetup(fallback.teams), lastSavedAt: null, language: "en" };
  }
}

function mergeImportedTeams(existingTeams, importedTeams) {
  const map = new Map(
    existingTeams.map((team) => [`${team.name.toLowerCase()}::${team.tag.toLowerCase()}`, team])
  );

  importedTeams.map(normalizeTeam).forEach((team) => {
    map.set(`${team.name.toLowerCase()}::${team.tag.toLowerCase()}`, team);
  });

  return [...map.values()].sort((left, right) => left.name.localeCompare(right.name));
}

function appReducer(state, action) {
  switch (action.type) {
    case "NAVIGATE":
      return { ...state, activeView: action.payload };
    case "SELECT_TEAM":
      return { ...state, selectedTeamId: action.payload, activeView: "teams" };
    case "UPSERT_TEAM": {
      const nextTeam = normalizeTeam(action.payload);
      const existingIndex = state.teams.findIndex((team) => team.id === nextTeam.id);
      const nextTeams =
        existingIndex === -1
          ? [...state.teams, nextTeam]
          : state.teams.map((team) => (team.id === nextTeam.id ? nextTeam : team));
      nextTeams.sort((left, right) => left.name.localeCompare(right.name));
      return {
        ...state,
        teams: nextTeams,
        selectedTeamId: nextTeam.id,
        activeView: "teams",
      };
    }
    case "DELETE_TEAM": {
      const nextTeams = state.teams.filter((team) => team.id !== action.payload);
      return {
        ...state,
        teams: nextTeams,
        selectedTeamId: nextTeams[0]?.id ?? null,
      };
    }
    case "SET_MATCH":
      return {
        ...state,
        currentMatch: action.payload,
      };
    case "START_VETO":
      return {
        ...state,
        currentMatch: action.payload,
        resultsData: null,
        activeView: "veto",
      };
    case "START_MATCH":
      return {
        ...state,
        currentMatch: startMatch(state.currentMatch),
        activeView: "live",
      };
    case "FINISH_MATCH": {
      const finishedMatch = action.payload;
      const results = finishedMatch.results ?? buildResultsData(finishedMatch);
      const historyEntry = buildHistoryEntry(results);
      return {
        ...state,
        currentMatch: finishedMatch,
        resultsData: results,
        matchHistory: [
          historyEntry,
          ...state.matchHistory.filter((entry) => entry.id !== historyEntry.id),
        ].slice(0, 50),
        activeView: "results",
      };
    }
    case "VIEW_HISTORY_RESULT":
      return {
        ...state,
        resultsData: action.payload,
        activeView: "results",
      };
    case "IMPORT_DATA": {
      const importedTeams = (action.payload.data.teams ?? []).map(normalizeTeam);
      const importedHistory = action.payload.data.matchHistory ?? [];
      if (action.payload.mode === "replace") {
        return {
          ...state,
          teams: importedTeams,
          matchHistory: importedHistory.slice(0, 50),
          selectedTeamId: importedTeams[0]?.id ?? null,
          currentMatch: null,
          resultsData: null,
          activeView: "home",
        };
      }

      return {
        ...state,
        teams: mergeImportedTeams(state.teams, importedTeams),
        matchHistory: [
          ...importedHistory,
          ...state.matchHistory.filter(
            (entry) => !importedHistory.some((incoming) => incoming.id === entry.id)
          ),
        ].slice(0, 50),
      };
    }
    case "CLEAR_HISTORY":
      return {
        ...state,
        matchHistory: [],
      };
    default:
      return state;
  }
}

function isImageLogo(value) {
  return /^https?:\/\//i.test(value) || /^data:image/i.test(value);
}

function ensureExactlyOneCaptain(players, captainId) {
  return players.map((player) => ({
    ...player,
    isCaptain: player.id === captainId,
  }));
}

function App() {
  const initialSnapshot = useMemo(() => loadStoredSnapshot(), []);
  const [state, dispatch] = useReducer(appReducer, initialSnapshot.state);
  const [matchSetup, setMatchSetup] = useState(initialSnapshot.setup);
  const [lastSavedAt, setLastSavedAt] = useState(initialSnapshot.lastSavedAt);
  const [language, setLanguage] = useState(initialSnapshot.language ?? "en");
  const [teamDraft, setTeamDraft] = useState(
    deepClone(state.teams.find((team) => team.id === state.selectedTeamId) ?? createBlankTeam())
  );
  const [isNewTeam, setIsNewTeam] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const [pendingImport, setPendingImport] = useState(null);
  const [historyFilter, setHistoryFilter] = useState("");
  const [vetoRevealCount, setVetoRevealCount] = useState(0);
  const [roundProgress, setRoundProgress] = useState(0);
  const importInputRef = useRef(null);
  const liveMatchRef = useRef(state.currentMatch);
  const roundIntervalRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const roundStartedAtRef = useRef(Date.now());
  const t = (key) => COPY[language]?.[key] ?? COPY.en[key] ?? key;

  const pushToast = (message, tone = "success") => {
    const id = `${Date.now()}_${Math.random()}`;
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  };

  useEffect(() => {
    liveMatchRef.current = state.currentMatch;
  }, [state.currentMatch]);

  useEffect(() => {
    if (isNewTeam) {
      return;
    }

    const selected = state.teams.find((team) => team.id === state.selectedTeamId);
    if (selected) {
      setTeamDraft(deepClone(selected));
    }
  }, [state.selectedTeamId, state.teams, isNewTeam]);

  useEffect(() => {
    if (!state.teams.length) {
      return;
    }

    setMatchSetup((current) => {
      const next = { ...current };
      if (!state.teams.some((team) => team.id === next.teamAId)) {
        next.teamAId = state.teams[0]?.id ?? "";
      }
      if (!state.teams.some((team) => team.id === next.teamBId) || next.teamBId === next.teamAId) {
        next.teamBId =
          state.teams.find((team) => team.id !== next.teamAId)?.id ?? state.teams[0]?.id ?? "";
      }
      return next;
    });
  }, [state.teams]);

  useEffect(() => {
    const serialized = JSON.stringify({
      state,
      matchSetup,
      language,
      lastSavedAt: new Date().toISOString(),
    });
    window.localStorage.setItem(STORAGE_KEY, serialized);
    setLastSavedAt(JSON.parse(serialized).lastSavedAt);
  }, [state, matchSetup, language]);

  useEffect(() => {
    if (!state.currentMatch || state.currentMatch.status !== "veto" || state.activeView !== "veto") {
      return;
    }

    setVetoRevealCount(0);
    let reveal = 0;
    const intervalId = window.setInterval(() => {
      reveal += 1;
      setVetoRevealCount(Math.min(reveal, state.currentMatch.veto.steps.length));
      if (reveal >= state.currentMatch.veto.steps.length) {
        window.clearInterval(intervalId);
        window.setTimeout(() => {
          dispatch({ type: "START_MATCH" });
          pushToast("Veto complete. Knife rounds are in and the series is live.");
        }, 900);
      }
    }, 650);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [state.currentMatch, state.activeView]);

  useEffect(() => {
    window.clearInterval(roundIntervalRef.current);
    window.clearInterval(progressIntervalRef.current);
    setRoundProgress(0);

    if (!state.currentMatch || state.currentMatch.status !== "live") {
      return undefined;
    }

    if (state.currentMatch.speed === "instant") {
      const finished = simulateEntireMatch(state.currentMatch);
      dispatch({ type: "FINISH_MATCH", payload: finished });
      pushToast("Match finished instantly.");
      return undefined;
    }

    const speed = SPEED_OPTIONS.find((option) => option.id === state.currentMatch.speed)?.intervalMs ?? 5000;
    roundStartedAtRef.current = Date.now();

    progressIntervalRef.current = window.setInterval(() => {
      setRoundProgress(
        clamp((Date.now() - roundStartedAtRef.current) / speed, 0, 1)
      );
    }, 100);

    roundIntervalRef.current = window.setInterval(() => {
      const currentMatch = liveMatchRef.current;
      if (!currentMatch || currentMatch.status !== "live") {
        return;
      }

      roundStartedAtRef.current = Date.now();
      setRoundProgress(0);
      const nextMatch = stepMatch(currentMatch);
      if (nextMatch.status === "finished") {
        dispatch({ type: "FINISH_MATCH", payload: nextMatch });
        pushToast("Series complete.");
        window.clearInterval(roundIntervalRef.current);
        window.clearInterval(progressIntervalRef.current);
      } else {
        dispatch({ type: "SET_MATCH", payload: nextMatch });
      }
    }, speed);

    return () => {
      window.clearInterval(roundIntervalRef.current);
      window.clearInterval(progressIntervalRef.current);
    };
  }, [state.currentMatch?.id, state.currentMatch?.status, state.currentMatch?.speed]);

  const selectedTeam = state.teams.find((team) => team.id === state.selectedTeamId) ?? null;
  const filteredHistory = historyFilter
    ? state.matchHistory.filter((entry) =>
        entry.teams.toLowerCase().includes(historyFilter.toLowerCase())
      )
    : state.matchHistory;

  const canStartMatch =
    matchSetup.teamAId &&
    matchSetup.teamBId &&
    matchSetup.teamAId !== matchSetup.teamBId &&
    state.teams.find((team) => team.id === matchSetup.teamAId)?.players.length === 5 &&
    state.teams.find((team) => team.id === matchSetup.teamBId)?.players.length === 5;

  const handleSaveTeam = () => {
    if (teamDraft.players.length !== 5) {
      pushToast("Teams need exactly 5 players before they can be saved.", "error");
      return;
    }

    const captain = teamDraft.players.find((player) => player.isCaptain);
    if (!captain) {
      pushToast("Choose a captain before saving the team.", "error");
      return;
    }

    dispatch({ type: "UPSERT_TEAM", payload: normalizeTeam(teamDraft) });
    setIsNewTeam(false);
    pushToast("Team saved.");
  };

  const handleStartVeto = () => {
    const teamA = state.teams.find((team) => team.id === matchSetup.teamAId);
    const teamB = state.teams.find((team) => team.id === matchSetup.teamBId);
    if (!teamA || !teamB) {
      return;
    }

    const match = createMatchFromSetup(teamA, teamB, matchSetup);
    dispatch({ type: "START_VETO", payload: match });
    pushToast("Veto started.");
  };

  const handleExport = () => {
    const payload = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      teams: state.teams,
      matchHistory: state.matchHistory,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `cs2sim_data_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    pushToast("Data exported.");
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      setPendingImport(parsed);
    } catch {
      pushToast("That JSON file could not be imported.", "error");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className="min-h-screen text-text">{renderApp()}</div>
    </LanguageContext.Provider>
  );

  function renderApp() {
    const liveFocus = state.activeView === "live" && state.currentMatch;
    return (
      <div className="min-h-screen bg-hero-grid bg-hero-grid">
        <TopNav
          activeView={state.activeView}
          onNavigate={(view) => dispatch({ type: "NAVIGATE", payload: view })}
        />
        <div
          className={classNames(
            "mx-auto flex gap-6",
            liveFocus ? "w-[min(1840px,99vw)] px-3 py-3" : "w-[min(1600px,95vw)] px-4 py-6"
          )}
        >
          <div className="flex-1">
            {state.activeView === "home" && (
              <HomeView
                teams={state.teams}
                history={state.matchHistory}
                onQuickStart={() => dispatch({ type: "NAVIGATE", payload: "match-setup" })}
                onOpenTeams={() => dispatch({ type: "NAVIGATE", payload: "teams" })}
                onOpenHistory={() => dispatch({ type: "NAVIGATE", payload: "history" })}
              />
            )}
            {state.activeView === "teams" && (
              <TeamsView
                teams={state.teams}
                selectedTeamId={state.selectedTeamId}
                teamDraft={teamDraft}
                isNewTeam={isNewTeam}
                onSelectTeam={(teamId) => {
                  setIsNewTeam(false);
                  dispatch({ type: "SELECT_TEAM", payload: teamId });
                }}
                onDraftChange={setTeamDraft}
                onNewTeam={() => {
                  setIsNewTeam(true);
                  setTeamDraft(createBlankTeam());
                }}
                onSaveTeam={handleSaveTeam}
                onDeleteTeam={() =>
                  setConfirmState({
                    type: "delete-team",
                    title: "Delete Team",
                    message: `Delete ${teamDraft.name || teamDraft.tag || "this team"}?`,
                    payload: teamDraft.id,
                  })
                }
                onExport={handleExport}
                onImport={() => importInputRef.current?.click()}
              />
            )}
            {state.activeView === "match-setup" && (
              <MatchSetupView
                teams={state.teams}
                setup={matchSetup}
                onSetupChange={setMatchSetup}
                onStartVeto={handleStartVeto}
                canStartMatch={canStartMatch}
              />
            )}
            {state.activeView === "veto" && state.currentMatch && (
              <VetoView match={state.currentMatch} revealedCount={vetoRevealCount} />
            )}
            {state.activeView === "live" && state.currentMatch && (
              <LiveMatchView
                match={state.currentMatch}
                roundProgress={roundProgress}
                resultsFallback={state.resultsData}
              />
            )}
            {state.activeView === "results" && state.resultsData && (
              <ResultsView results={state.resultsData} />
            )}
            {state.activeView === "history" && (
              <HistoryView
                filter={historyFilter}
                onFilterChange={setHistoryFilter}
                entries={filteredHistory}
                onOpen={(entry) =>
                  dispatch({ type: "VIEW_HISTORY_RESULT", payload: entry.data })
                }
                onClear={() =>
                  setConfirmState({
                    type: "clear-history",
                    title: "Clear History",
                    message: "Remove all stored match history?",
                  })
                }
              />
            )}
          </div>
          <aside className={classNames("hidden w-[300px] xl:block", liveFocus && "xl:hidden")}>
            <SideRail
              selectedTeam={selectedTeam}
              currentMatch={state.currentMatch}
              lastSavedAt={lastSavedAt}
              onExport={handleExport}
              onImport={() => importInputRef.current?.click()}
            />
          </aside>
        </div>
        {!liveFocus && (
          <footer className="border-t border-border bg-surface/80 px-6 py-3 text-sm text-muted">
            {t("last_saved")}: {lastSavedAt ? new Date(lastSavedAt).toLocaleString() : t("not_saved")}
          </footer>
        )}
        <input
          ref={importInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleImport}
        />
        <ToastStack toasts={toasts} onDismiss={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} />
        {confirmState && (
          <ConfirmModal
            title={confirmState.title}
            message={confirmState.message}
            onCancel={() => setConfirmState(null)}
            onConfirm={() => {
              if (confirmState.type === "delete-team") {
                dispatch({ type: "DELETE_TEAM", payload: confirmState.payload });
                setIsNewTeam(false);
                pushToast("Team deleted.");
              }
              if (confirmState.type === "clear-history") {
                dispatch({ type: "CLEAR_HISTORY" });
                pushToast("History cleared.");
              }
              setConfirmState(null);
            }}
          />
        )}
        {pendingImport && (
          <ImportModal
            onMerge={() => {
              dispatch({ type: "IMPORT_DATA", payload: { mode: "merge", data: pendingImport } });
              setPendingImport(null);
              pushToast("Data merged.");
            }}
            onReplace={() => {
              dispatch({ type: "IMPORT_DATA", payload: { mode: "replace", data: pendingImport } });
              setPendingImport(null);
              pushToast("Data replaced.");
            }}
            onCancel={() => setPendingImport(null)}
          />
        )}
      </div>
    );
  }
}

export default App;

function renderLogo(logo, fallback = "T") {
  if (!logo) {
    return <span className="text-2xl">{fallback}</span>;
  }

  if (isImageLogo(logo)) {
    return <img src={logo} alt="" className="h-10 w-10 rounded-lg object-cover" />;
  }

  return <span className="text-2xl">{logo}</span>;
}

function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

function Panel({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={classNames("panel page-enter rounded-2xl p-5", className)}>
      {(title || subtitle || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="font-display text-2xl font-semibold tracking-wide text-text">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function TopNav({ activeView, onNavigate }) {
  const { language, setLanguage, t } = useI18n();
  const navLabels = {
    home: t("nav_home"),
    teams: t("nav_teams"),
    "match-setup": t("nav_match_setup"),
    live: t("nav_live"),
    results: t("nav_results"),
    history: t("nav_history"),
  };
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex w-[min(1600px,95vw)] items-center justify-between gap-6 px-4 py-4">
        <div>
          <div className="font-display text-xs uppercase tracking-[0.35em] text-accent">{t("app_title")}</div>
          <div className="font-display text-2xl font-semibold text-text">{t("app_tagline")}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card/70 p-1">
            <span className="px-2 text-xs uppercase tracking-[0.2em] text-muted">{t("language")}</span>
            {["en", "ru"].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={classNames(
                  "rounded-lg px-3 py-1 text-xs uppercase tracking-[0.18em]",
                  language === lang ? "bg-accent/15 text-accent" : "text-muted"
                )}
              >
                {lang}
              </button>
            ))}
          </div>
          <nav className="flex flex-wrap items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={classNames(
                  "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition",
                  active
                    ? "border-accent bg-accent/10 text-accent shadow-glow"
                    : "border-border bg-card/70 text-muted hover:border-accent/50 hover:text-text"
                )}
              >
                <Icon size={16} />
                <span className="font-display text-lg">{navLabels[item.id] ?? item.label}</span>
              </button>
            );
          })}
          </nav>
        </div>
      </div>
    </header>
  );
}

function MetricCard({ icon: Icon, label, value, tone = "default" }) {
  return (
    <div
      className={classNames(
        "rounded-2xl border p-4",
        tone === "accent"
          ? "border-accent/40 bg-accent/8"
          : tone === "danger"
            ? "border-red-500/40 bg-red-500/10"
            : "border-border bg-card/70"
      )}
    >
      <div className="mb-2 flex items-center gap-2 text-muted">
        <Icon size={16} />
        <span className="text-xs uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div className="font-display text-4xl font-semibold text-text">{value}</div>
    </div>
  );
}

function HomeView({ teams, history, onQuickStart, onOpenTeams, onOpenHistory }) {
  const { t } = useI18n();
  const topTeams = [...teams].sort((left, right) => getTeamStrength(right) - getTeamStrength(left)).slice(0, 3);
  return (
    <div className="space-y-6">
      <Panel
        title={t("dashboard")}
        subtitle="Seeded teams, live match control, history replay, and full local export/import."
        action={
          <button
            type="button"
            onClick={onQuickStart}
            className="flex items-center gap-2 rounded-xl border border-accent bg-accent/10 px-4 py-2 text-sm text-accent transition hover:bg-accent/15"
          >
            <Play size={16} />
            {t("quick_start")}
          </button>
        }
      >
        <div className="grid grid-cols-4 gap-4">
          <MetricCard icon={Users} label="Saved Teams" value={teams.length} tone="accent" />
          <MetricCard icon={History} label="Stored Matches" value={history.length} />
          <MetricCard icon={Trophy} label="Formats" value={MATCH_FORMATS.join(" / ")} />
          <MetricCard icon={Sparkles} label="Map Pool" value={MAP_POOL.length} />
        </div>
      </Panel>
      <div className="grid grid-cols-[1.3fr_0.7fr] gap-6">
        <Panel
          title={t("top_teams")}
          subtitle="Composite strength mixes player ratings with coach influence."
          action={
            <button type="button" onClick={onOpenTeams} className="text-sm text-accent hover:text-accent/80">
              {t("open_team_manager_short")}
            </button>
          }
        >
          <div className="space-y-4">
            {topTeams.map((team) => (
              <div key={team.id} className="flex items-center justify-between rounded-2xl border border-border bg-card/60 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface">
                    {renderLogo(team.logo)}
                  </div>
                  <div>
                    <div className="font-display text-2xl font-semibold text-text">
                      {team.name} <span className="text-sm text-muted">[{team.tag}]</span>
                    </div>
                    <div className="text-sm text-muted">
                      {team.region} · Coach {team.coach.nickname} · Captain{" "}
                      {team.players.find((player) => player.isCaptain)?.nickname}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="numbers text-2xl">{getTeamStrength(team)}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted">Team Strength</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel
          title={t("recent_results")}
          subtitle="Replay any stored series from the history tab."
          action={
            <button type="button" onClick={onOpenHistory} className="text-sm text-accent hover:text-accent/80">
              {t("open_history")}
            </button>
          }
        >
          <div className="space-y-3">
            {history.length === 0 && <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted">No saved matches yet.</div>}
            {history.slice(0, 5).map((entry) => (
              <div key={entry.id} className="rounded-xl border border-border bg-card/60 p-4">
                <div className="font-display text-xl text-text">{entry.teams}</div>
                <div className="mt-1 flex items-center justify-between text-sm text-muted">
                  <span>{new Date(entry.date).toLocaleString()}</span>
                  <span className="numbers">{entry.score}</span>
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">
                  MVP {entry.mvp} · {entry.mapsPlayed}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function SideRail({ selectedTeam, currentMatch, lastSavedAt, onExport, onImport }) {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <Panel title="Control Rail" subtitle="Fast access to save, export, import, and current live status.">
        <div className="space-y-3">
          <button type="button" onClick={onExport} className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-4 py-3 text-sm text-text hover:border-accent/40">
            <Download size={16} />
            {t("export_all_data")}
          </button>
          <button type="button" onClick={onImport} className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-4 py-3 text-sm text-text hover:border-accent/40">
            <Upload size={16} />
            {t("import_data")}
          </button>
          <div className="rounded-xl border border-border bg-surface/80 p-4 text-sm text-muted">
            <div className="mb-1 uppercase tracking-[0.2em] text-xs">Autosave</div>
            <div>{lastSavedAt ? new Date(lastSavedAt).toLocaleString() : t("not_saved")}</div>
          </div>
        </div>
      </Panel>
      {selectedTeam && (
        <Panel title="Selected Team" subtitle="Live quick glance for the active roster.">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface">{renderLogo(selectedTeam.logo)}</div>
            <div>
              <div className="font-display text-2xl text-text">{selectedTeam.name}</div>
              <div className="text-sm text-muted">
                {selectedTeam.region} · {selectedTeam.players.length} players
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {selectedTeam.players.map((player) => (
              <div key={player.id} className="rounded-xl border border-border bg-card/60 p-3">
                <div className="flex items-center justify-between">
                  <div className="font-display text-lg text-text">{player.nickname}</div>
                  <div className="numbers text-sm">{compositeRating(player)}</div>
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted">{player.role}</div>
              </div>
            ))}
          </div>
        </Panel>
      )}
      {currentMatch && (
        <Panel title="Live Status" subtitle="Series state follows the current match snapshot.">
          <div className="space-y-3 text-sm text-muted">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-accent">
                {currentMatch.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Format</span>
              <span className="numbers text-text">{currentMatch.format}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Series Score</span>
              <span className="numbers text-text">
                {currentMatch.seriesScore.teamA}-{currentMatch.seriesScore.teamB}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Timeouts</span>
              <span className="numbers text-text">
                {currentMatch.timeoutsRemaining.teamA} / {currentMatch.timeoutsRemaining.teamB}
              </span>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}

function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="fixed right-4 top-20 z-50 flex w-[360px] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={classNames(
            "glass animate-float-in rounded-2xl border px-4 py-3 shadow-glow",
            toast.tone === "error" ? "border-red-500/40" : "border-accent/30"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {toast.tone === "error" ? <AlertTriangle size={18} className="text-red-400" /> : <Check size={18} className="text-accent" />}
              <span className="text-sm text-text">{toast.message}</span>
            </div>
            <button type="button" onClick={() => onDismiss(toast.id)} className="text-muted hover:text-text">
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ConfirmModal({ title, message, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="panel w-full max-w-md rounded-2xl p-6">
        <div className="flex items-center gap-3 text-accent">
          <AlertTriangle size={20} />
          <h3 className="font-display text-2xl text-text">{title}</h3>
        </div>
        <p className="mt-3 text-sm text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-xl border border-border px-4 py-2 text-sm text-muted hover:text-text">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function ImportModal({ onMerge, onReplace, onCancel }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="panel w-full max-w-lg rounded-2xl p-6">
        <div className="flex items-center gap-3 text-accent">
          <FileUp size={20} />
          <h3 className="font-display text-2xl text-text">Import Data</h3>
        </div>
        <p className="mt-3 text-sm text-muted">
          Choose whether the imported JSON should merge into the current workspace or replace it entirely.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button type="button" onClick={onMerge} className="rounded-2xl border border-accent/40 bg-accent/10 p-4 text-left">
            <div className="font-display text-xl text-text">Merge</div>
            <div className="mt-1 text-sm text-muted">Keep current data and overlay imported teams/history.</div>
          </button>
          <button type="button" onClick={onReplace} className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-left">
            <div className="font-display text-xl text-text">Replace</div>
            <div className="mt-1 text-sm text-muted">Swap the entire local workspace with the imported file.</div>
          </button>
        </div>
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onCancel} className="rounded-xl border border-border px-4 py-2 text-sm text-muted hover:text-text">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function RatingBar({ value }) {
  const tone = getCompositeColor(value);
  const colorClass =
    tone === "green"
      ? "bg-emerald-400"
      : tone === "yellow"
        ? "bg-amber-400"
        : "bg-red-400";
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="uppercase tracking-[0.2em] text-muted">Composite Rating</span>
        <span className="numbers">{value}</span>
      </div>
      <div className="stat-track h-2 overflow-hidden rounded-full">
        <div className={classNames("h-full rounded-full", colorClass)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function StatSlider({ label, value, onChange }) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="numbers">{value}</span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(event) => onChange(clamp(Number(event.target.value), 0, 100))}
          className="h-2 flex-1 cursor-pointer accent-[#f5a623]"
        />
        <input
          type="number"
          min="0"
          max="100"
          value={value}
          onChange={(event) => onChange(clamp(Number(event.target.value || 0), 0, 100))}
          className="numbers w-16 rounded-lg border border-border bg-surface px-2 py-1 text-sm text-text"
        />
      </div>
    </label>
  );
}

function MapPreferenceEditor({ title, maps, onChange }) {
  const available = MAP_POOL.filter((map) => !maps.includes(map));

  const move = (index, direction) => {
    const next = [...maps];
    const target = index + direction;
    if (target < 0 || target >= next.length) {
      return;
    }
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4">
      <div className="mb-3 font-display text-xl text-text">{title}</div>
      <div className="space-y-2">
        {maps.map((map, index) => (
          <div key={map} className="flex items-center justify-between rounded-xl border border-border bg-surface/70 px-3 py-2">
            <div className="flex items-center gap-3">
              <span className="numbers text-sm text-accent">{index + 1}</span>
              <span className="font-display text-lg text-text">{map}</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => move(index, -1)} className="rounded-lg border border-border p-1 text-muted hover:text-text">
                <ChevronUp size={16} />
              </button>
              <button type="button" onClick={() => move(index, 1)} className="rounded-lg border border-border p-1 text-muted hover:text-text">
                <ChevronDown size={16} />
              </button>
              <button
                type="button"
                onClick={() => onChange(maps.filter((value) => value !== map))}
                className="rounded-lg border border-border p-1 text-muted hover:text-red-300"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {available.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {available.map((map) => (
            <button
              key={map}
              type="button"
              onClick={() => onChange([...maps, map])}
              className="rounded-full border border-border px-3 py-1 text-sm text-muted hover:border-accent/40 hover:text-text"
            >
              + {map}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PlayerEditorCard({ player, players, onChange, onRemove, onSetCaptain }) {
  const totalRating = compositeRating(player);
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="font-display text-2xl text-text">{player.nickname || "New Player"}</div>
          <div className="text-sm text-muted">{player.role}</div>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted">
            <input
              type="radio"
              name="captain"
              checked={player.isCaptain}
              onChange={() => onSetCaptain(player.id)}
            />
            Captain
          </label>
          <button
            type="button"
            onClick={onRemove}
            disabled={players.length <= 1}
            className="rounded-lg border border-border p-2 text-muted hover:text-red-300 disabled:opacity-40"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm text-muted">
          Real Name
          <input
            type="text"
            value={player.name}
            onChange={(event) => onChange({ ...player, name: event.target.value })}
            className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-text"
          />
        </label>
        <label className="text-sm text-muted">
          Nickname
          <input
            type="text"
            value={player.nickname}
            onChange={(event) => onChange({ ...player, nickname: event.target.value })}
            className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-text"
          />
        </label>
        <label className="text-sm text-muted">
          Role
          <select
            value={player.role}
            onChange={(event) => onChange({ ...player, role: event.target.value })}
            className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-text"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-muted">
          Nationality
          <input
            type="text"
            value={player.nationality}
            onChange={(event) => onChange({ ...player, nationality: event.target.value })}
            className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-text"
          />
        </label>
        <label className="text-sm text-muted">
          Age
          <input
            type="number"
            min="16"
            max="45"
            value={player.age}
            onChange={(event) => onChange({ ...player, age: clamp(Number(event.target.value || 16), 16, 45) })}
            className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-text"
          />
        </label>
      </div>
      <div className="mt-4">
        <RatingBar value={totalRating} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <StatSlider label="Aim" value={player.aim} onChange={(value) => onChange({ ...player, aim: value })} />
        <StatSlider label="Game Sense" value={player.gameSense} onChange={(value) => onChange({ ...player, gameSense: value })} />
        <StatSlider label="Clutch" value={player.clutch} onChange={(value) => onChange({ ...player, clutch: value })} />
        <StatSlider label="Utility" value={player.utility} onChange={(value) => onChange({ ...player, utility: value })} />
        <StatSlider label="Entry Fragging" value={player.entry} onChange={(value) => onChange({ ...player, entry: value })} />
        <StatSlider label="Consistency" value={player.consistency} onChange={(value) => onChange({ ...player, consistency: value })} />
      </div>
    </div>
  );
}

function TeamsView({
  teams,
  selectedTeamId,
  teamDraft,
  isNewTeam,
  onSelectTeam,
  onDraftChange,
  onNewTeam,
  onSaveTeam,
  onDeleteTeam,
  onExport,
  onImport,
}) {
  const { t } = useI18n();
  const logoInputRef = useRef(null);
  const rosterWarning = teamDraft.players.length !== 5 ? "Teams must have exactly 5 players to enter match setup." : null;

  const updateDraft = (updater) => {
    onDraftChange((current) => (typeof updater === "function" ? updater(current) : updater));
  };

  const setCaptain = (captainId) => {
    updateDraft((current) => ({
      ...current,
      captainId,
      players: ensureExactlyOneCaptain(current.players, captainId),
    }));
  };

  const onLogoFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    updateDraft((current) => ({ ...current, logo: String(dataUrl) }));
    event.target.value = "";
  };

  return (
    <div className="grid grid-cols-[320px_1fr] gap-6">
      <Panel
        title={t("team_manager")}
        subtitle="Create, edit, and tune rosters, coaches, captains, and map pools."
        className="h-fit"
        action={
          <button
            type="button"
            onClick={onNewTeam}
            className="flex items-center gap-2 rounded-xl border border-accent bg-accent/10 px-3 py-2 text-sm text-accent"
          >
            <Plus size={16} />
            {t("new_team")}
          </button>
        }
      >
        <div className="mb-4 flex gap-2">
          <button type="button" onClick={onExport} className="flex-1 rounded-xl border border-border bg-card/70 px-3 py-2 text-sm text-text hover:border-accent/40">
            Export
          </button>
          <button type="button" onClick={onImport} className="flex-1 rounded-xl border border-border bg-card/70 px-3 py-2 text-sm text-text hover:border-accent/40">
            Import
          </button>
        </div>
        <div className="space-y-3">
          {teams.map((team) => (
            <button
              key={team.id}
              type="button"
              onClick={() => onSelectTeam(team.id)}
              className={classNames(
                "w-full rounded-2xl border p-4 text-left transition",
                selectedTeamId === team.id
                  ? "border-accent bg-accent/10"
                  : "border-border bg-card/60 hover:border-accent/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface">
                  {renderLogo(team.logo)}
                </div>
                <div>
                  <div className="font-display text-2xl text-text">
                    {team.name} <span className="text-sm text-muted">[{team.tag}]</span>
                  </div>
                  <div className="text-sm text-muted">
                    {team.region} · Strength {getTeamStrength(team)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Panel>
      <div className="space-y-6">
        <Panel
          title={isNewTeam ? "New Team" : "Team Detail"}
          subtitle="Every change updates the full simulation profile: economy tendencies, vetoes, and map performance."
          action={
            <div className="flex gap-2">
              <button type="button" onClick={onSaveTeam} className="flex items-center gap-2 rounded-xl border border-accent bg-accent/10 px-4 py-2 text-sm text-accent">
                <Save size={16} />
                {t("save_team")}
              </button>
              {!isNewTeam && (
                <button type="button" onClick={onDeleteTeam} className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                  <Trash2 size={16} />
                  {t("delete_team")}
                </button>
              )}
            </div>
          }
        >
          <div className="grid grid-cols-[1fr_320px] gap-6">
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm text-muted">
                  Team Name
                  <input
                    type="text"
                    value={teamDraft.name}
                    onChange={(event) => updateDraft((current) => ({ ...current, name: event.target.value }))}
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-text"
                  />
                </label>
                <label className="text-sm text-muted">
                  Tag
                  <input
                    type="text"
                    maxLength="5"
                    value={teamDraft.tag}
                    onChange={(event) => updateDraft((current) => ({ ...current, tag: event.target.value.toUpperCase().slice(0, 5) }))}
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-text"
                  />
                </label>
                <label className="text-sm text-muted">
                  Region
                  <select
                    value={teamDraft.region}
                    onChange={(event) => updateDraft((current) => ({ ...current, region: event.target.value }))}
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-text"
                  >
                    {REGIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm text-muted">
                  Logo / Emoji / Image URL
                  <div className="mt-1 flex gap-2">
                    <input
                      type="text"
                      value={teamDraft.logo}
                      onChange={(event) => updateDraft((current) => ({ ...current, logo: event.target.value }))}
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-text"
                    />
                    <button type="button" onClick={() => logoInputRef.current?.click()} className="rounded-xl border border-border px-3 py-2 text-sm text-text">
                      Upload
                    </button>
                    <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={onLogoFile} />
                  </div>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm text-muted">
                  Coach Name
                  <input
                    type="text"
                    value={teamDraft.coach.name}
                    onChange={(event) =>
                      updateDraft((current) => ({
                        ...current,
                        coach: { ...current.coach, name: event.target.value },
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-text"
                  />
                </label>
                <label className="text-sm text-muted">
                  Coach Nickname
                  <input
                    type="text"
                    value={teamDraft.coach.nickname}
                    onChange={(event) =>
                      updateDraft((current) => ({
                        ...current,
                        coach: { ...current.coach, nickname: event.target.value },
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-text"
                  />
                </label>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <StatSlider
                  label="Tactical Rating"
                  value={teamDraft.coach.tacticalRating}
                  onChange={(value) =>
                    updateDraft((current) => ({
                      ...current,
                      coach: { ...current.coach, tacticalRating: value },
                    }))
                  }
                />
                <StatSlider
                  label="Motivation Rating"
                  value={teamDraft.coach.motivationRating}
                  onChange={(value) =>
                    updateDraft((current) => ({
                      ...current,
                      coach: { ...current.coach, motivationRating: value },
                    }))
                  }
                />
                <StatSlider
                  label="Map Knowledge"
                  value={teamDraft.coach.mapKnowledge}
                  onChange={(value) =>
                    updateDraft((current) => ({
                      ...current,
                      coach: { ...current.coach, mapKnowledge: value },
                    }))
                  }
                />
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card/60 p-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-surface">
                {renderLogo(teamDraft.logo)}
              </div>
              <div className="mt-4 font-display text-3xl text-text">
                {teamDraft.name || "Unnamed Team"}
              </div>
              <div className="mt-1 text-sm text-muted">
                {teamDraft.region} · {teamDraft.tag}
              </div>
              <div className="mt-4 space-y-4">
                <RatingBar
                  value={Math.round(
                    teamDraft.players.length
                      ? teamDraft.players.reduce((sum, player) => sum + compositeRating(player), 0) /
                          teamDraft.players.length
                      : 0
                  )}
                />
                <div className="rounded-xl border border-border bg-surface/80 p-4">
                  <div className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">Derived Bans</div>
                  <div className="flex flex-wrap gap-2">
                    {deriveBannedMaps(teamDraft).length === 0 && <span className="text-sm text-muted">None</span>}
                    {deriveBannedMaps(teamDraft).map((map) => (
                      <span key={map} className="rounded-full border border-border px-3 py-1 text-sm text-muted">
                        {map}
                      </span>
                    ))}
                  </div>
                </div>
                {rosterWarning && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                    {rosterWarning}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Panel>
        <div className="grid grid-cols-2 gap-6">
          <MapPreferenceEditor
            title="Captain / Team Preferred Maps"
            maps={teamDraft.preferredMaps}
            onChange={(maps) => updateDraft((current) => ({ ...current, preferredMaps: maps }))}
          />
          <MapPreferenceEditor
            title="Coach Preferred Maps"
            maps={teamDraft.coach.preferredMaps}
            onChange={(maps) =>
              updateDraft((current) => ({
                ...current,
                coach: { ...current.coach, preferredMaps: maps },
              }))
            }
          />
        </div>
        <Panel
          title="Roster"
          subtitle="Exactly five players are required for match simulation."
          action={
            <button
              type="button"
              disabled={teamDraft.players.length >= 5}
              onClick={() =>
                updateDraft((current) => ({
                  ...current,
                  players: [...current.players, createBlankPlayer(current.players.length + 1)],
                }))
              }
              className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-text disabled:opacity-40"
            >
              <Plus size={16} />
              Add Player
            </button>
          }
        >
          <div className="space-y-4">
            {teamDraft.players.map((player) => (
              <PlayerEditorCard
                key={player.id}
                player={player}
                players={teamDraft.players}
                onSetCaptain={setCaptain}
                onRemove={() =>
                  updateDraft((current) => ({
                    ...current,
                    players: current.players.filter((candidate) => candidate.id !== player.id),
                  }))
                }
                onChange={(nextPlayer) =>
                  updateDraft((current) => ({
                    ...current,
                    players: current.players.map((candidate) =>
                      candidate.id === player.id ? nextPlayer : candidate
                    ),
                  }))
                }
              />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function TeamSetupPreview({ team }) {
  if (!team) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted">
        Select a team.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card/70 p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-surface">
          {renderLogo(team.logo)}
        </div>
        <div>
          <div className="font-display text-3xl text-text">
            {team.name} <span className="text-sm text-muted">[{team.tag}]</span>
          </div>
          <div className="text-sm text-muted">
            {team.region} · Coach {team.coach.nickname} · Strength {getTeamStrength(team)}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {team.preferredMaps.slice(0, 4).map((map, index) => (
          <span key={map} className="rounded-full border border-border px-3 py-1 text-sm text-muted">
            #{index + 1} {map}
          </span>
        ))}
      </div>
    </div>
  );
}

function MatchSetupView({ teams, setup, onSetupChange, onStartVeto, canStartMatch }) {
  const { t } = useI18n();
  const teamA = teams.find((team) => team.id === setup.teamAId);
  const teamB = teams.find((team) => team.id === setup.teamBId);

  return (
    <div className="space-y-6">
      <Panel
        title={t("match_setup")}
        subtitle="Pick the teams, format, and speed. Veto starts from this screen."
        action={
          <button
            type="button"
            onClick={onStartVeto}
            disabled={!canStartMatch}
            className="flex items-center gap-2 rounded-xl border border-accent bg-accent/10 px-4 py-2 text-sm text-accent disabled:opacity-40"
          >
            <Play size={16} />
            {t("start_veto")}
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm text-muted">
              Team A
              <select
                value={setup.teamAId}
                onChange={(event) => onSetupChange((current) => ({ ...current, teamAId: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-text"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>
            <TeamSetupPreview team={teamA} />
          </div>
          <div className="space-y-4">
            <label className="block text-sm text-muted">
              Team B
              <select
                value={setup.teamBId}
                onChange={(event) => onSetupChange((current) => ({ ...current, teamBId: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-text"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>
            <TeamSetupPreview team={teamB} />
          </div>
        </div>
      </Panel>
      <div className="grid grid-cols-[1fr_360px] gap-6">
        <Panel title={t("series_rules")} subtitle="Current sim settings match the full MR12 spec, with OT and economy enabled.">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">Format</div>
              <div className="flex gap-2">
                {MATCH_FORMATS.map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => onSetupChange((current) => ({ ...current, format }))}
                    className={classNames(
                      "rounded-xl border px-4 py-2 text-sm",
                      setup.format === format
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-card/70 text-muted"
                    )}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">Simulation Speed</div>
              <div className="flex gap-2">
                {SPEED_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onSetupChange((current) => ({ ...current, speed: option.id }))}
                    className={classNames(
                      "rounded-xl border px-4 py-2 text-sm",
                      setup.speed === option.id
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-card/70 text-muted"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-3 rounded-2xl border border-border bg-card/70 px-4 py-3 text-sm text-text">
              <input
                type="checkbox"
                checked={setup.showDetailedLogs}
                onChange={(event) =>
                  onSetupChange((current) => ({
                    ...current,
                    showDetailedLogs: event.target.checked,
                  }))
                }
              />
              Show detailed logs
            </label>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {MAP_POOL.map((map) => (
              <div key={map} className="rounded-2xl border border-border bg-card/60 p-4">
                <div className="font-display text-2xl text-text">{map}</div>
                <div className="mt-1 text-sm text-muted">
                  T {Math.round(MAP_CONFIGS[map].baseT * 100)}% · CT {Math.round(MAP_CONFIGS[map].baseCT * 100)}%
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">
                  {MAP_CONFIGS[map].traits[0]}
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title={t("checklist")} subtitle="The series is ready when both teams have legal five-player rosters.">
          <div className="space-y-3 text-sm">
            <ChecklistRow label="Different teams selected" passed={setup.teamAId !== setup.teamBId} />
            <ChecklistRow label="Team A has 5 players" passed={teamA?.players.length === 5} />
            <ChecklistRow label="Team B has 5 players" passed={teamB?.players.length === 5} />
            <ChecklistRow label="Captains assigned" passed={Boolean(teamA?.players.some((player) => player.isCaptain) && teamB?.players.some((player) => player.isCaptain))} />
            <ChecklistRow label="Coach profiles present" passed={Boolean(teamA?.coach.nickname && teamB?.coach.nickname)} />
          </div>
          {!canStartMatch && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              Fix roster or team selection issues before starting veto.
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function ChecklistRow({ label, passed }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card/60 px-3 py-2">
      <span className="text-muted">{label}</span>
      <span className={classNames("rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em]", passed ? "bg-emerald-400/10 text-emerald-300" : "bg-red-500/10 text-red-300")}>
        {passed ? "Ready" : "Needs work"}
      </span>
    </div>
  );
}

function VetoView({ match, revealedCount }) {
  const { t } = useI18n();
  const revealed = match.veto.steps.slice(0, revealedCount);
  return (
    <div className="space-y-6">
      <Panel title={t("veto_screen")} subtitle="Cards reveal in sequence with weighted bans, picks, and the decider map.">
        <div className="mb-5 flex items-center justify-between rounded-2xl border border-border bg-card/70 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-surface">{renderLogo(match.teamA.logo)}</div>
            <div>
              <div className="font-display text-3xl text-text">{match.teamA.name}</div>
              <div className="text-sm text-muted">{match.teamA.tag}</div>
            </div>
          </div>
          <div className="font-display text-4xl text-accent">VETO</div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-display text-3xl text-text">{match.teamB.name}</div>
              <div className="text-sm text-muted">{match.teamB.tag}</div>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-surface">{renderLogo(match.teamB.logo)}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {revealed.map((step) => (
            <div
              key={step.id}
              className={classNames(
                "animate-float-in rounded-2xl border p-4",
                step.action === "ban"
                  ? "border-red-500/30 bg-red-500/10"
                  : step.action === "pick"
                    ? "border-accent/40 bg-accent/10"
                    : "border-sky-500/30 bg-sky-500/10"
              )}
            >
              <div className="text-xs uppercase tracking-[0.22em] text-muted">
                {step.action === "ban" ? "Ban" : step.action === "pick" ? "Pick" : "Decider"}
              </div>
              <div className="mt-2 font-display text-3xl text-text">{step.map}</div>
              <div className="mt-1 text-sm text-muted">
                {step.teamName} {step.action === "decider" ? "leaves it for the server" : step.action === "ban" ? "remove it" : "lock it in"}
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title={t("series_order")} subtitle="Starting sides come from the weighted knife round / side-choice model.">
        <div className="grid grid-cols-3 gap-4">
          {match.maps.map((map) => (
            <div key={map.id} className="rounded-2xl border border-border bg-card/70 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-muted">
                Map {map.order} · {map.isDecider ? "Decider" : map.pickedBy === "teamA" ? match.teamA.tag : match.teamB.tag}
              </div>
              <div className="mt-2 font-display text-3xl text-text">{map.mapName}</div>
              <div className="mt-2 text-sm text-muted">
                Knife: {(map.knifeWinner === "teamA" ? match.teamA : match.teamB).tag} · Start sides {map.startSides.teamA}/{map.startSides.teamB}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function liveRowsFromTeam(teamState) {
  return teamState.players.map((player) => ({
    id: player.id,
    nickname: player.nickname,
    role: player.role,
    weaponLabel: player.roundLoadout.weaponLabel,
    weaponType: player.roundLoadout.weaponType,
    armor: player.roundLoadout.armor,
    helmet: player.roundLoadout.helmet,
    utilityCount: player.roundLoadout.utilityItems.length,
    hp: player.hp,
    alive: player.alive,
    kills: player.stats.kills,
    deaths: player.stats.deaths,
    assists: player.stats.assists,
    rating: player.stats.rating,
    money: player.money,
  }));
}

function reasonLabel(reason) {
  if (reason === "bomb exploded") {
    return "Bomb Exploded";
  }

  if (reason === "defuse") {
    return "Defuse";
  }

  if (reason === "time") {
    return "Time";
  }

  return "Elimination";
}

function LiveMatchView({ match, roundProgress }) {
  const { t } = useI18n();
  const activeMap = match.maps[match.currentMapIndex] ?? match.maps[match.maps.length - 1];
  const latestRound = activeMap.lastRoundSummary;
  const teamAPlayers = latestRound?.loadouts.teamA ?? liveRowsFromTeam(activeMap.teamAState);
  const teamBPlayers = latestRound?.loadouts.teamB ?? liveRowsFromTeam(activeMap.teamBState);
  const roundClock = Math.max(0, Math.round(115 * (1 - roundProgress)));
  const economyData = activeMap.economyHistory.map((entry) => ({
    ...entry,
    label: entry.label,
  }));

  return (
    <div className="grid h-[calc(100vh-108px)] grid-cols-[250px_1fr_330px] gap-4 overflow-hidden">
      <Panel title={t("round_history")} subtitle="Compact sidebar timeline for every round." className="flex h-full flex-col overflow-hidden p-4">
        <div className="scrollbar-thin min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
          {[...activeMap.rounds].reverse().map((roundSummary) => (
            <div
              key={`${roundSummary.roundNumber}_${roundSummary.mapName}`}
              className={classNames(
                "rounded-xl border p-3",
                roundSummary.winnerSide === "CT"
                  ? "border-sky-500/30 bg-sky-500/10"
                  : "border-accent/30 bg-accent/10"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="font-display text-lg text-text">{roundSummary.displayRound}</div>
                <div className="numbers text-xs">
                  {roundSummary.scoreAfter.teamA}-{roundSummary.scoreAfter.teamB}
                </div>
              </div>
              <div className="mt-1 text-xs text-muted">
                {roundSummary.winnerSide} win - {roundSummary.roundType.teamA}/{roundSummary.roundType.teamB}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted">
                <span>{roundSummary.bombPlanted ? "Plant yes" : "Plant no"}</span>
                <span>{reasonLabel(roundSummary.reason)}</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <div className="flex min-h-0 flex-col gap-4 overflow-hidden">
        <Panel title={t("live_match")} subtitle="Compact fullscreen HUD with scores, sides, economy, and players." className="p-4">
          <div className="rounded-2xl border border-border bg-card/70 p-4">
            <div className="flex items-center justify-between gap-6">
              <TeamHeader team={match.teamA} score={activeMap.score.teamA} side={activeMap.teamAState.side} />
              <div className="text-center">
                <div className="font-display text-3xl text-accent">{activeMap.mapName}</div>
                <div className="mt-1 text-xs text-muted">
                  {latestRound?.displayRound ?? `R${activeMap.roundNumber}`} · {activeMap.overtimeNumber ? `OT ${activeMap.overtimeNumber}` : "Regulation"}
                </div>
                <div className={classNames("mt-2 numbers text-xl", roundClock <= 10 ? "text-red-400" : "text-text")}>
                  {Math.floor(roundClock / 60)}:{String(roundClock % 60).padStart(2, "0")}
                </div>
              </div>
              <TeamHeader team={match.teamB} score={activeMap.score.teamB} side={activeMap.teamBState.side} reverse />
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface">
              <div
                className={classNames("h-full rounded-full transition-all", roundClock <= 10 ? "bg-red-500" : "bg-accent")}
                style={{ width: `${Math.max(4, roundProgress * 100)}%` }}
              />
            </div>
          </div>
        </Panel>
        <div className="grid min-h-0 flex-1 grid-rows-[1fr_180px] gap-4 overflow-hidden">
          <Panel title={t("round_hud")} subtitle="Current summary, timeout overlays, and leaders." className="flex min-h-0 flex-col overflow-hidden p-4">
            {latestRound ? (
              <div className="flex min-h-0 flex-1 flex-col gap-3">
                <div className="rounded-2xl border border-border bg-card/60 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-muted">Latest Round</div>
                      <div className="font-display text-2xl text-text">{latestRound.strategy}</div>
                    </div>
                    <div className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                      {reasonLabel(latestRound.reason)}
                    </div>
                  </div>
                  {latestRound.timeoutCalled && (
                    <div className="mt-3 rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm text-accent">
                      Tactical timeout used by {latestRound.timeoutCalled === "teamA" ? match.teamA.name : match.teamB.name}
                    </div>
                  )}
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-border bg-surface/80 p-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-muted">Best Rating Team A</div>
                      <div className="mt-1 font-display text-2xl text-text">
                        {latestRound.spectatorLeaders.teamA.nickname}
                      </div>
                      <div className="numbers text-accent">{latestRound.spectatorLeaders.teamA.rating}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-surface/80 p-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-muted">Best Rating Team B</div>
                      <div className="mt-1 font-display text-2xl text-text">
                        {latestRound.spectatorLeaders.teamB.nickname}
                      </div>
                      <div className="numbers text-accent">{latestRound.spectatorLeaders.teamB.rating}</div>
                    </div>
                  </div>
                </div>
                <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 overflow-hidden">
                  <LivePlayerTable title={`${match.teamA.name} Players`} teamKey="teamA" players={teamAPlayers} />
                  <LivePlayerTable title={`${match.teamB.name} Players`} teamKey="teamB" players={teamBPlayers} />
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
                Waiting for the first round to resolve.
              </div>
            )}
          </Panel>
          <Panel title={t("economy_graph")} subtitle="Equipment value by round." className="overflow-hidden p-4">
            <div className="h-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={economyData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="label" stroke="#6b7280" tick={{ fill: "#6b7280", fontSize: 11 }} />
                  <YAxis stroke="#6b7280" tick={{ fill: "#6b7280", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#111318",
                      border: "1px solid #2a2d36",
                      borderRadius: 16,
                      color: "#e8eaf0",
                    }}
                  />
                  <Line type="monotone" dataKey="teamA" stroke="#f5a623" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="teamB" stroke="#5b8dd9" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>
      <Panel title={t("live_feed")} subtitle="Newest play-by-play events stay at the top." className="flex h-full flex-col overflow-hidden p-4">
        <div className="scrollbar-thin min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
              {activeMap.allLogs.slice(0, 24).map((log) => (
                <div key={log.id} className="rounded-xl border border-border bg-card/60 p-3">
                  <div className="numbers text-xs text-accent">[{log.clock}] {log.mapName} {`R${log.roundNumber}`}</div>
                  <div className="mt-1 text-sm text-text">{log.label}</div>
                </div>
              ))}
        </div>
      </Panel>
    </div>
  );
}

function TeamHeader({ team, score, side, reverse = false }) {
  return (
    <div className={classNames("flex items-center gap-4", reverse && "flex-row-reverse text-right")}>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface">
        {renderLogo(team.logo)}
      </div>
      <div>
        <div className="font-display text-4xl text-text">{score}</div>
        <div className="font-display text-2xl text-text">{team.tag}</div>
        <div className={classNames("text-xs uppercase tracking-[0.2em]", side === "CT" ? "text-sky-300" : "text-accent")}>
          {side}-Side
        </div>
      </div>
    </div>
  );
}

function LivePlayerTable({ title, teamKey, players }) {
  return (
    <div className="flex min-h-0 flex-col rounded-2xl border border-border bg-card/70 p-3">
      <div className="mb-2 font-display text-xl text-text">{title}</div>
      <div className="scrollbar-thin min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {players.map((player) => (
          <div key={player.id} className="rounded-xl border border-border bg-surface/80 p-2.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-display text-lg text-text">{player.nickname}</div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted">{player.role}</div>
              </div>
              <div
                className={classNames(
                  "rounded-lg px-3 py-1 text-xs font-semibold",
                  player.weaponType === "rifle"
                    ? "bg-accent/15 text-accent"
                    : player.weaponType === "awp"
                      ? "bg-teal-500/15 text-teal-300"
                      : "bg-white/10 text-white"
                )}
              >
                [{player.weaponLabel}]
              </div>
            </div>
            <div className="mt-2 grid grid-cols-[1fr_auto_auto_auto] items-center gap-2">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-muted">
                  <span>HP</span>
                  <span>{player.alive ? player.hp : "X"}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-card">
                  <div
                    className={classNames("h-full rounded-full", teamKey === "teamA" ? "bg-accent" : "bg-sky-400")}
                    style={{ width: `${player.alive ? player.hp : 0}%` }}
                  />
                </div>
              </div>
              <div className="text-xs text-muted">
                Armor {player.armor ? (player.helmet ? "H" : "K") : "No"}
              </div>
              <div className="text-xs text-muted">Util {player.utilityCount}</div>
              <div className="numbers text-xs">{formatMoney(player.money)}</div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="numbers text-xs">
                {player.kills}/{player.deaths}/{player.assists}
              </span>
              <span style={{ color: getRatingColor(player.rating) }} className="numbers text-xs">
                {player.rating}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultsView({ results }) {
  const { t } = useI18n();
  const [statsMode, setStatsMode] = useState("combined");
  const teamAPlayers = results.players.filter((player) => player.teamKey === "teamA");
  const teamBPlayers = results.players.filter((player) => player.teamKey === "teamB");
  return (
    <div className="space-y-6">
      <Panel title={t("series_results")} subtitle="Final scores, player leaders, map breakdowns, and highlight moments.">
        <div className="grid grid-cols-[1fr_320px] gap-6">
          <div className="rounded-2xl border border-border bg-card/70 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface">{renderLogo(results.teamA.logo)}</div>
                <div>
                  <div className="font-display text-4xl text-text">{results.teamA.name}</div>
                  <div className="text-sm text-muted">{results.teamA.tag}</div>
                </div>
              </div>
              <div className="numbers text-5xl text-accent">
                {results.seriesScore.teamA}-{results.seriesScore.teamB}
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <div className="font-display text-right text-4xl text-text">{results.teamB.name}</div>
                  <div className="text-right text-sm text-muted">{results.teamB.tag}</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface">{renderLogo(results.teamB.logo)}</div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">Series MVP</div>
            <div className="mt-2 font-display text-4xl text-text">{results.mvp?.nickname ?? "n/a"}</div>
            <div className="mt-1 text-sm text-muted">
              {results.mvp?.teamTag} · {results.mvp?.role}
            </div>
            <div className="mt-4 numbers text-3xl text-accent">{results.mvp?.rating ?? "0.00"}</div>
          </div>
        </div>
      </Panel>
      <div className="grid grid-cols-[0.8fr_1.2fr] gap-6">
        <Panel title={t("highlights")} subtitle="Auto-generated moments from clutches, spikes, and key tactical turns.">
          <div className="space-y-3">
            {results.highlights.map((highlight) => (
              <div key={highlight} className="rounded-xl border border-border bg-card/60 p-4 text-sm text-text">
                {highlight}
              </div>
            ))}
          </div>
        </Panel>
        <Panel title={t("map_breakdown")} subtitle="Each map keeps half scores, economy spent, and round-type wins.">
          <div className="space-y-4">
            {results.maps.map((map) => (
              <div key={map.id} className="rounded-2xl border border-border bg-card/60 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display text-3xl text-text">{map.mapName}</div>
                    <div className="text-sm text-muted">
                      Winner: {map.winnerKey === "teamA" ? results.teamA.tag : results.teamB.tag}
                    </div>
                  </div>
                  <div className="numbers text-3xl">
                    {map.score.teamA}-{map.score.teamB}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-xl border border-border bg-surface/80 p-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-muted">Halves</div>
                    <div className="mt-1">
                      1H {map.halfBreakdown.firstHalf.teamA}-{map.halfBreakdown.firstHalf.teamB}
                    </div>
                    <div>
                      2H {map.halfBreakdown.secondHalf.teamA}-{map.halfBreakdown.secondHalf.teamB}
                    </div>
                    {map.halfBreakdown.overtimes.map((ot) => (
                      <div key={ot.label}>
                        {ot.label} {ot.score.teamA}-{ot.score.teamB}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-border bg-surface/80 p-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-muted">Economy Spent</div>
                    <div className="mt-1 numbers">{formatMoney(map.economySpent.teamA)}</div>
                    <div className="numbers">{formatMoney(map.economySpent.teamB)}</div>
                  </div>
                  <div className="rounded-xl border border-border bg-surface/80 p-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-muted">Buy Wins</div>
                    <div className="mt-1 text-muted">
                      Eco {map.roundTypeWins.teamA.eco}/{map.roundTypeWins.teamB.eco}
                    </div>
                    <div className="text-muted">
                      Force {map.roundTypeWins.teamA.force}/{map.roundTypeWins.teamB.force}
                    </div>
                    <div className="text-muted">
                      Full {map.roundTypeWins.teamA.full}/{map.roundTypeWins.teamB.full}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel
        title={t("full_player_stats")}
        subtitle="Series aggregate scoreboard with ratings, ADR, KAST, HS, clutches, and openings."
        action={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStatsMode("combined")}
              className={classNames(
                "rounded-xl border px-4 py-2 text-sm",
                statsMode === "combined" ? "border-accent bg-accent/10 text-accent" : "border-border text-muted"
              )}
            >
              {t("combined")}
            </button>
            <button
              type="button"
              onClick={() => setStatsMode("team")}
              className={classNames(
                "rounded-xl border px-4 py-2 text-sm",
                statsMode === "team" ? "border-accent bg-accent/10 text-accent" : "border-border text-muted"
              )}
            >
              {t("by_team")}
            </button>
          </div>
        }
      >
        {statsMode === "combined" ? (
          <StatsTable players={results.players} />
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="mb-3 font-display text-2xl text-text">{results.teamA.name}</div>
              <StatsTable players={teamAPlayers} />
            </div>
            <div>
              <div className="mb-3 font-display text-2xl text-text">{results.teamB.name}</div>
              <StatsTable players={teamBPlayers} />
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

function StatsTable({ players }) {
  const { t } = useI18n();
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-[0.2em] text-muted">
          <tr>
            <th className="pb-3">{t("player")}</th>
            <th className="pb-3">{t("team")}</th>
            <th className="pb-3">K / D / A</th>
            <th className="pb-3">{t("rating")}</th>
            <th className="pb-3">ADR</th>
            <th className="pb-3">KAST%</th>
            <th className="pb-3">HS%</th>
            <th className="pb-3">Clutches</th>
            <th className="pb-3">Openings</th>
            <th className="pb-3">Best Round</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={`${player.teamKey}_${player.id}`} className="border-t border-border">
              <td className="py-3 font-display text-xl text-text">{player.nickname}</td>
              <td className="py-3 text-muted">{player.teamTag}</td>
              <td className="py-3 numbers">
                {player.kills}/{player.deaths}/{player.assists}
              </td>
              <td className="py-3 numbers" style={{ color: getRatingColor(player.rating) }}>
                {player.rating}
              </td>
              <td className="py-3 numbers">{player.adr}</td>
              <td className="py-3 numbers">{player.kastPercent}</td>
              <td className="py-3 numbers">{player.hsPercent}</td>
              <td className="py-3 numbers">
                {player.clutchesWon}/{player.clutchAttempts}
              </td>
              <td className="py-3 numbers">{player.openingKills}</td>
              <td className="py-3 numbers">{player.bestRoundKills}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HistoryView({ filter, onFilterChange, entries, onOpen, onClear }) {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <Panel
        title={t("history")}
        subtitle="Stored locally, capped to the last 50 series, and fully replayable on the results screen."
        action={
          <button type="button" onClick={onClear} className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            <Trash2 size={16} />
            {t("clear_history")}
          </button>
        }
      >
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-border bg-card/70 px-4 py-3">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder={t("filter_by_team")}
            value={filter}
            onChange={(event) => onFilterChange(event.target.value)}
            className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
          />
          <Filter size={16} className="text-muted" />
        </div>
        <div className="space-y-3">
          {entries.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
              No history entries match the current filter.
            </div>
          )}
          {entries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => onOpen(entry)}
              className="w-full rounded-2xl border border-border bg-card/60 p-4 text-left transition hover:border-accent/30"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-display text-2xl text-text">{entry.teams}</div>
                  <div className="mt-1 text-sm text-muted">
                    {new Date(entry.date).toLocaleString()} · MVP {entry.mvp}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">
                    {entry.mapsPlayed}
                  </div>
                </div>
                <div className="numbers text-3xl text-accent">{entry.score}</div>
              </div>
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
}
