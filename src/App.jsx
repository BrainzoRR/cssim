import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
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

const COPY_RU = {
  nav_home: "Главная",
  nav_teams: "Команды",
  nav_match_setup: "Матч",
  nav_live: "Live Match",
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
  live_match: "Live Match",
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
};

const RADAR_ASSETS = {
  Mirage: { upper: "/radars/mirage.webp" },
  Inferno: { upper: "/radars/inferno.webp" },
  Nuke: { upper: "/radars/nuke-upper.webp", lower: "/radars/nuke-lower.webp" },
  Overpass: { upper: "/radars/overpass.webp" },
  Dust: { upper: "/radars/dust2.webp" },
  Ancient: { upper: "/radars/ancient.webp" },
  Anubis: { upper: "/radars/anubis.webp" },
};

const RADAR_VIEWBOXES = {
  Mirage: {
    upper: { left: 0.1, top: 0.08, width: 0.82, height: 0.84 },
  },
  Inferno: {
    upper: { left: 0.06, top: 0.05, width: 0.87, height: 0.88 },
  },
  Nuke: {
    upper: { left: 0.2, top: 0.22, width: 0.76, height: 0.54 },
    lower: { left: 0.2, top: 0.22, width: 0.76, height: 0.54 },
  },
  Overpass: {
    upper: { left: 0.2, top: 0.03, width: 0.65, height: 0.92 },
  },
  Dust: {
    upper: { left: 0.03, top: 0.02, width: 0.94, height: 0.95 },
  },
  Ancient: {
    upper: { left: 0.08, top: 0.08, width: 0.85, height: 0.84 },
  },
  Anubis: {
    upper: { left: 0.16, top: 0.06, width: 0.73, height: 0.92 },
  },
};

function radarRegion(x, y, width, height, level = "upper") {
  return { x, y, width, height, level };
}

const RADAR_SITE_FALLBACKS = {
  Mirage: {
    A: radarRegion(0.74, 0.48, 0.2, 0.18),
    B: radarRegion(0.22, 0.56, 0.18, 0.18),
    Mid: radarRegion(0.52, 0.61, 0.18, 0.16),
  },
  Inferno: {
    A: radarRegion(0.73, 0.72, 0.2, 0.18),
    B: radarRegion(0.23, 0.18, 0.18, 0.18),
    Mid: radarRegion(0.49, 0.6, 0.18, 0.18),
  },
  Nuke: {
    A: radarRegion(0.57, 0.44, 0.18, 0.16),
    B: radarRegion(0.58, 0.54, 0.2, 0.18, "lower"),
    Mid: radarRegion(0.49, 0.52, 0.18, 0.18),
  },
  Overpass: {
    A: radarRegion(0.78, 0.24, 0.18, 0.16),
    B: radarRegion(0.24, 0.64, 0.18, 0.18),
    Mid: radarRegion(0.52, 0.35, 0.18, 0.18),
  },
  Dust: {
    A: radarRegion(0.79, 0.19, 0.18, 0.14),
    B: radarRegion(0.16, 0.17, 0.18, 0.16),
    Mid: radarRegion(0.5, 0.39, 0.2, 0.16),
  },
  Ancient: {
    A: radarRegion(0.73, 0.38, 0.18, 0.18),
    B: radarRegion(0.18, 0.27, 0.18, 0.16),
    Mid: radarRegion(0.46, 0.53, 0.18, 0.16),
  },
  Anubis: {
    A: radarRegion(0.26, 0.58, 0.2, 0.18),
    B: radarRegion(0.8, 0.2, 0.18, 0.16),
    Mid: radarRegion(0.51, 0.53, 0.2, 0.16),
  },
};

const RADAR_ZONE_POSITIONS = {
  Mirage: {
    "A ramp": radarRegion(0.63, 0.86, 0.1, 0.1),
    palace: radarRegion(0.67, 0.18, 0.12, 0.12),
    ticket: radarRegion(0.84, 0.43, 0.08, 0.12),
    jungle: radarRegion(0.71, 0.52, 0.12, 0.12),
    apartments: radarRegion(0.17, 0.18, 0.14, 0.12),
    bench: radarRegion(0.21, 0.67, 0.06, 0.08),
    market: radarRegion(0.3, 0.57, 0.1, 0.1),
    van: radarRegion(0.15, 0.58, 0.08, 0.08),
    "top mid": radarRegion(0.52, 0.68, 0.14, 0.12),
    window: radarRegion(0.53, 0.53, 0.08, 0.08),
    connector: radarRegion(0.63, 0.66, 0.1, 0.1),
    catwalk: radarRegion(0.39, 0.52, 0.12, 0.1),
  },
  Inferno: {
    short: radarRegion(0.61, 0.7, 0.08, 0.08),
    library: radarRegion(0.76, 0.63, 0.08, 0.08),
    pit: radarRegion(0.83, 0.76, 0.12, 0.12),
    "site::A": radarRegion(0.74, 0.74, 0.12, 0.12),
    banana: radarRegion(0.29, 0.44, 0.14, 0.18),
    coffins: radarRegion(0.2, 0.16, 0.08, 0.08),
    "new box": radarRegion(0.25, 0.17, 0.08, 0.08),
    dark: radarRegion(0.19, 0.23, 0.08, 0.08),
    mid: radarRegion(0.47, 0.58, 0.12, 0.12),
    arch: radarRegion(0.62, 0.56, 0.08, 0.08),
    boiler: radarRegion(0.52, 0.72, 0.1, 0.1),
    lane: radarRegion(0.42, 0.71, 0.1, 0.1),
  },
  Nuke: {
    outside: radarRegion(0.24, 0.47, 0.14, 0.16),
    mini: radarRegion(0.44, 0.38, 0.08, 0.08),
    hut: radarRegion(0.56, 0.47, 0.08, 0.1),
    heaven: radarRegion(0.61, 0.37, 0.08, 0.08),
    ramp: radarRegion(0.21, 0.5, 0.14, 0.14, "lower"),
    decon: radarRegion(0.69, 0.55, 0.08, 0.08, "lower"),
    "double doors": radarRegion(0.78, 0.52, 0.08, 0.08, "lower"),
    "site::B": radarRegion(0.57, 0.53, 0.14, 0.12, "lower"),
    garage: radarRegion(0.28, 0.41, 0.08, 0.08),
    secret: radarRegion(0.39, 0.63, 0.12, 0.1, "lower"),
    lobby: radarRegion(0.69, 0.58, 0.12, 0.12),
  },
  Overpass: {
    long: radarRegion(0.75, 0.22, 0.14, 0.14),
    bathrooms: radarRegion(0.63, 0.23, 0.12, 0.1),
    truck: radarRegion(0.82, 0.31, 0.08, 0.08),
    "site::A": radarRegion(0.78, 0.24, 0.12, 0.12),
    monster: radarRegion(0.18, 0.74, 0.12, 0.14),
    "short::B": radarRegion(0.37, 0.67, 0.1, 0.1),
    pillar: radarRegion(0.27, 0.64, 0.08, 0.08),
    "site::B": radarRegion(0.24, 0.59, 0.14, 0.12),
    connector: radarRegion(0.46, 0.46, 0.1, 0.1),
    fountain: radarRegion(0.54, 0.26, 0.08, 0.08),
    party: radarRegion(0.66, 0.13, 0.1, 0.1),
    "short::Mid": radarRegion(0.4, 0.54, 0.1, 0.1),
  },
  Dust: {
    long: radarRegion(0.18, 0.65, 0.16, 0.14),
    catwalk: radarRegion(0.62, 0.25, 0.12, 0.12),
    "A site": radarRegion(0.79, 0.19, 0.14, 0.1),
    "short::A": radarRegion(0.69, 0.28, 0.1, 0.1),
    tunnels: radarRegion(0.16, 0.1, 0.14, 0.12),
    window: radarRegion(0.23, 0.18, 0.08, 0.08),
    "B site": radarRegion(0.15, 0.17, 0.12, 0.1),
    door: radarRegion(0.24, 0.27, 0.08, 0.1),
    mid: radarRegion(0.5, 0.4, 0.12, 0.1),
    xbox: radarRegion(0.58, 0.38, 0.08, 0.08),
    "lower tunnels": radarRegion(0.39, 0.49, 0.12, 0.12),
    "top mid": radarRegion(0.49, 0.29, 0.12, 0.1),
  },
  Ancient: {
    "A main": radarRegion(0.22, 0.73, 0.14, 0.12),
    donut: radarRegion(0.31, 0.48, 0.1, 0.1),
    temple: radarRegion(0.74, 0.44, 0.12, 0.1),
    "site::A": radarRegion(0.73, 0.36, 0.14, 0.14),
    cave: radarRegion(0.16, 0.21, 0.12, 0.12),
    lane: radarRegion(0.24, 0.33, 0.1, 0.1),
    "back site": radarRegion(0.13, 0.31, 0.1, 0.1),
    ramp: radarRegion(0.38, 0.31, 0.12, 0.1),
    mid: radarRegion(0.47, 0.53, 0.12, 0.12),
    "red room": radarRegion(0.45, 0.63, 0.1, 0.1),
    boost: radarRegion(0.41, 0.48, 0.1, 0.1),
  },
  Anubis: {
    "A main": radarRegion(0.18, 0.76, 0.16, 0.14),
    heaven: radarRegion(0.28, 0.3, 0.1, 0.12),
    "bridge::A": radarRegion(0.35, 0.39, 0.12, 0.08),
    "site::A": radarRegion(0.24, 0.56, 0.14, 0.14),
    canal: radarRegion(0.84, 0.22, 0.1, 0.12),
    pillar: radarRegion(0.72, 0.31, 0.1, 0.1),
    "site::B": radarRegion(0.81, 0.18, 0.12, 0.1),
    "bridge::B": radarRegion(0.66, 0.33, 0.12, 0.08),
    mid: radarRegion(0.5, 0.53, 0.12, 0.1),
    connector: radarRegion(0.55, 0.44, 0.1, 0.08),
    water: radarRegion(0.57, 0.63, 0.12, 0.1),
    "top mid": radarRegion(0.45, 0.72, 0.1, 0.1),
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

const LEGACY_SEED_SIGNATURE = ["FAZE::FAZE", "G2::G2", "NAVI::NAVI", "VIRTUS.PRO::VP"];

function shouldRefreshLegacySeeds(teams) {
  if (teams.length !== LEGACY_SEED_SIGNATURE.length) {
    return false;
  }

  const signature = teams
    .map((team) => `${team.name.toUpperCase()}::${team.tag.toUpperCase()}`)
    .sort();

  return signature.every((value, index) => value === LEGACY_SEED_SIGNATURE[index]);
}

function recoverResultsData(currentMatch, resultsData) {
  if (resultsData) {
    return resultsData;
  }

  if (currentMatch?.status === "finished") {
    return currentMatch.results ?? buildResultsData(currentMatch);
  }

  return null;
}

function sanitizeRestoredSession(snapshotState) {
  const restoredMatch = snapshotState?.currentMatch ?? null;
  const restoredResults = recoverResultsData(restoredMatch, snapshotState?.resultsData ?? null);
  const currentMatch = restoredMatch?.status === "finished" ? null : restoredMatch;
  let activeView = snapshotState?.activeView ?? "home";

  if ((activeView === "live" || activeView === "veto") && !currentMatch) {
    activeView = restoredResults ? "results" : activeView === "veto" ? "match-setup" : "home";
  }

  if (activeView === "results" && !restoredResults) {
    activeView = currentMatch ? (currentMatch.status === "veto" ? "veto" : "live") : "home";
  }

  if (activeView === "live" && currentMatch?.status === "veto") {
    activeView = "veto";
  }

  if (activeView === "veto" && currentMatch?.status === "live") {
    activeView = "live";
  }

  return {
    activeView,
    currentMatch,
    resultsData: restoredResults,
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
    return {
      state: baseState,
      setup: defaultSetup(fallback.teams),
      lastSavedAt: null,
      language: "en",
      siteMode: null,
      liveLayoutMode: "broadcast",
      livePresentationMode: "semi",
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        state: baseState,
        setup: defaultSetup(fallback.teams),
        lastSavedAt: null,
        language: "en",
        siteMode: null,
        liveLayoutMode: "broadcast",
        livePresentationMode: "semi",
      };
    }

    const parsed = JSON.parse(raw);
    const storedTeams = (parsed.state?.teams ?? parsed.teams ?? fallback.teams).map(normalizeTeam);
    const teams = shouldRefreshLegacySeeds(storedTeams) ? fallback.teams : storedTeams;
    const matchHistory = parsed.state?.matchHistory ?? parsed.matchHistory ?? [];
    const restoredSession = sanitizeRestoredSession(parsed.state ?? {});
    return {
      state: {
        teams,
        matchHistory,
        activeView: restoredSession.activeView,
        selectedTeamId:
          teams.some((team) => team.id === parsed.state?.selectedTeamId)
            ? parsed.state?.selectedTeamId
            : teams[0]?.id ?? null,
        currentMatch: restoredSession.currentMatch,
        resultsData: restoredSession.resultsData,
      },
      setup: parsed.matchSetup ?? defaultSetup(teams),
      lastSavedAt: parsed.lastSavedAt ?? null,
      language: parsed.language ?? "en",
      siteMode: parsed.siteMode ?? null,
      liveLayoutMode: parsed.liveLayoutMode ?? "broadcast",
      livePresentationMode: parsed.livePresentationMode ?? "semi",
    };
  } catch {
    return {
      state: baseState,
      setup: defaultSetup(fallback.teams),
      lastSavedAt: null,
      language: "en",
      siteMode: null,
      liveLayoutMode: "broadcast",
      livePresentationMode: "semi",
    };
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
      if (!state.currentMatch) {
        return state.resultsData
          ? { ...state, activeView: "results" }
          : { ...state, activeView: "match-setup" };
      }
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
        currentMatch: null,
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
        currentMatch: null,
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
  const [siteMode, setSiteMode] = useState(initialSnapshot.siteMode ?? null);
  const [liveLayoutMode, setLiveLayoutMode] = useState(initialSnapshot.liveLayoutMode ?? "broadcast");
  const [livePresentationMode, setLivePresentationMode] = useState(initialSnapshot.livePresentationMode ?? "semi");
  const [roundPlayback, setRoundPlayback] = useState(null);
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
  const vetoStartTimeoutRef = useRef(null);
  const instantMatchHandledRef = useRef(null);
  const playbackTimersRef = useRef([]);
  const t = (key) => (language === "ru" ? COPY_RU[key] : COPY[language]?.[key]) ?? COPY.en[key] ?? key;

  const pushToast = (message, tone = "success") => {
    const id = `${Date.now()}_${Math.random()}`;
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  };

  const handleSiteModeChange = (mode) => {
    setSiteMode(mode);
    setLiveLayoutMode(mode === "mobile" ? "phone" : "broadcast");
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
      siteMode,
      liveLayoutMode,
      livePresentationMode,
      lastSavedAt: new Date().toISOString(),
    });
    window.localStorage.setItem(STORAGE_KEY, serialized);
    setLastSavedAt(JSON.parse(serialized).lastSavedAt);
  }, [state, matchSetup, language, siteMode, liveLayoutMode, livePresentationMode]);

  useEffect(() => {
    const phoneLiveMode =
      state.activeView === "live" &&
      state.currentMatch &&
      (siteMode === "mobile" || liveLayoutMode === "phone");
    document.documentElement.classList.toggle("phone-live", Boolean(phoneLiveMode));
    document.body.classList.toggle("phone-live", Boolean(phoneLiveMode));

    return () => {
      document.documentElement.classList.remove("phone-live");
      document.body.classList.remove("phone-live");
    };
  }, [state.activeView, state.currentMatch, liveLayoutMode, siteMode]);

  useEffect(() => {
    if (!state.currentMatch || state.currentMatch.status !== "veto" || state.activeView !== "veto") {
      return;
    }

    window.clearTimeout(vetoStartTimeoutRef.current);
    setVetoRevealCount(0);
    let reveal = 0;
    const intervalId = window.setInterval(() => {
      reveal += 1;
      setVetoRevealCount(Math.min(reveal, state.currentMatch.veto.steps.length));
      if (reveal >= state.currentMatch.veto.steps.length) {
        window.clearInterval(intervalId);
        vetoStartTimeoutRef.current = window.setTimeout(() => {
          dispatch({ type: "START_MATCH" });
          pushToast("Veto complete. Knife rounds are in and the series is live.");
        }, 900);
      }
    }, 650);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(vetoStartTimeoutRef.current);
    };
  }, [state.currentMatch, state.activeView]);

  useEffect(() => {
    window.clearInterval(roundIntervalRef.current);
    window.clearInterval(progressIntervalRef.current);
    playbackTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    playbackTimersRef.current = [];
    setRoundProgress(0);

    if (!state.currentMatch || state.currentMatch.status !== "live") {
      instantMatchHandledRef.current = null;
      setRoundPlayback(null);
      return undefined;
    }

    if (state.currentMatch.speed === "instant") {
      if (instantMatchHandledRef.current === state.currentMatch.id) {
        return undefined;
      }
      instantMatchHandledRef.current = state.currentMatch.id;
      const finished = simulateEntireMatch(state.currentMatch);
      dispatch({ type: "FINISH_MATCH", payload: finished });
      pushToast("Match finished instantly.");
      return undefined;
    }

    const speed = SPEED_OPTIONS.find((option) => option.id === state.currentMatch.speed)?.intervalMs ?? 5000;
    const startProgressTimer = (durationMs) => {
      roundStartedAtRef.current = Date.now();
      progressIntervalRef.current = window.setInterval(() => {
        setRoundProgress(
          clamp((Date.now() - roundStartedAtRef.current) / Math.max(1, durationMs), 0, 1)
        );
      }, 100);
    };
    setRoundPlayback(null);

    if (livePresentationMode === "live") {
      const currentMatch = liveMatchRef.current;
      if (!currentMatch || currentMatch.status !== "live") {
        return undefined;
      }

      const nextMatch = stepMatch(currentMatch);
      const playbackSummary = nextMatch.latestRound;
      const playbackFrames = playbackSummary?.timeline ?? [];
      const playbackPreset =
        currentMatch.speed === "slow"
          ? { preRollMs: 520, postRollMs: 760, minFrameMs: 300, maxFrameMs: 520, extraBudgetMs: 1200 }
          : { preRollMs: 900, postRollMs: 1100, minFrameMs: 520, maxFrameMs: 900, extraBudgetMs: 2200 };
      const frameDelay = clamp(
        Math.floor((speed + playbackPreset.extraBudgetMs) / Math.max(1, playbackFrames.length || 1)),
        playbackPreset.minFrameMs,
        playbackPreset.maxFrameMs
      );
      const liveRoundDuration =
        playbackPreset.preRollMs + playbackFrames.length * frameDelay + playbackPreset.postRollMs;
      const commitDelay = Math.max(speed, liveRoundDuration);

      startProgressTimer(commitDelay);

      setRoundPlayback({
        summary: playbackSummary,
        frameIndex: -1,
        totalFrames: playbackFrames.length,
      });

      playbackFrames.forEach((frame, index) => {
        const timerId = window.setTimeout(() => {
          setRoundPlayback((current) =>
            current?.summary?.roundNumber === playbackSummary?.roundNumber
              ? { ...current, frameIndex: index }
              : current
          );
        }, playbackPreset.preRollMs + frameDelay * index);
        playbackTimersRef.current.push(timerId);
      });

      roundIntervalRef.current = window.setTimeout(() => {
        setRoundPlayback(null);
        if (nextMatch.status === "finished") {
          dispatch({ type: "FINISH_MATCH", payload: nextMatch });
          pushToast("Series complete.");
        } else {
          dispatch({ type: "SET_MATCH", payload: nextMatch });
        }
      }, commitDelay);

      return () => {
        window.clearTimeout(roundIntervalRef.current);
        window.clearInterval(progressIntervalRef.current);
        playbackTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
        playbackTimersRef.current = [];
      };
    }

    startProgressTimer(speed);

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
      playbackTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      playbackTimersRef.current = [];
    };
  }, [state.currentMatch, livePresentationMode]);

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
    const resolvedResultsData = recoverResultsData(state.currentMatch, state.resultsData);
    const resolvedActiveView =
      (state.activeView === "live" || state.activeView === "veto") &&
      !state.currentMatch &&
      resolvedResultsData
        ? "results"
        : state.activeView;
    const liveFocus = resolvedActiveView === "live" && state.currentMatch;
    const effectiveLiveLayout = siteMode === "mobile" ? "phone" : liveLayoutMode;
    const mobileSite = siteMode === "mobile";
    const phoneLiveMode = liveFocus && effectiveLiveLayout === "phone";
    return (
      <div className={classNames(phoneLiveMode ? "h-[100dvh] overflow-hidden bg-hero-grid" : "min-h-screen bg-hero-grid")}>
        {!phoneLiveMode &&
          (mobileSite ? (
              <MobileHeader
              activeView={resolvedActiveView}
              siteMode={siteMode}
              onSiteModeChange={handleSiteModeChange}
              language={language}
              onLanguageChange={setLanguage}
            />
          ) : (
            <TopNav
              activeView={resolvedActiveView}
              onNavigate={(view) => dispatch({ type: "NAVIGATE", payload: view })}
              siteMode={siteMode}
              onSiteModeChange={handleSiteModeChange}
            />
          ))}
        <div
          className={classNames(
            "mx-auto flex gap-6",
            phoneLiveMode
              ? "h-[100dvh] w-screen overflow-hidden px-0 py-0"
              : mobileSite
                ? "w-screen px-3 py-3 pb-24"
              : liveFocus
                ? "w-[min(1840px,99vw)] px-3 py-3"
                : "w-[min(1600px,95vw)] px-4 py-6"
          )}
        >
          <div className="flex-1">
            {resolvedActiveView === "home" && (
              <HomeView
                teams={state.teams}
                history={state.matchHistory}
                mobile={mobileSite}
                onQuickStart={() => dispatch({ type: "NAVIGATE", payload: "match-setup" })}
                onOpenTeams={() => dispatch({ type: "NAVIGATE", payload: "teams" })}
                onOpenHistory={() => dispatch({ type: "NAVIGATE", payload: "history" })}
              />
            )}
            {resolvedActiveView === "teams" && (
              <TeamsView
                teams={state.teams}
                mobile={mobileSite}
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
            {resolvedActiveView === "match-setup" && (
              <MatchSetupView
                teams={state.teams}
                mobile={mobileSite}
                setup={matchSetup}
                onSetupChange={setMatchSetup}
                onStartVeto={handleStartVeto}
                canStartMatch={canStartMatch}
              />
            )}
            {resolvedActiveView === "veto" && state.currentMatch && (
              <VetoView match={state.currentMatch} revealedCount={vetoRevealCount} mobile={mobileSite} />
            )}
            {resolvedActiveView === "live" && state.currentMatch && (
              <LiveMatchView
                match={state.currentMatch}
                roundProgress={roundProgress}
                mobileSite={mobileSite}
                layoutMode={effectiveLiveLayout}
                onLayoutModeChange={setLiveLayoutMode}
                presentationMode={livePresentationMode}
                onPresentationModeChange={setLivePresentationMode}
                roundPlayback={roundPlayback}
                fullscreen={phoneLiveMode}
                siteMode={siteMode}
                onSiteModeChange={handleSiteModeChange}
              />
            )}
            {resolvedActiveView === "results" && resolvedResultsData && (
              <ResultsView results={resolvedResultsData} mobile={mobileSite} />
            )}
            {resolvedActiveView === "history" && (
              <HistoryView
                mobile={mobileSite}
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
          <aside className={classNames("hidden w-[300px] xl:block", liveFocus && "xl:hidden", phoneLiveMode && "hidden", mobileSite && "xl:hidden")}>
            <SideRail
              selectedTeam={selectedTeam}
              currentMatch={state.currentMatch}
              lastSavedAt={lastSavedAt}
              onExport={handleExport}
              onImport={() => importInputRef.current?.click()}
            />
          </aside>
        </div>
        {!liveFocus && !mobileSite && (
          <footer className="border-t border-border bg-surface/80 px-6 py-3 text-sm text-muted">
            {t("last_saved")}: {lastSavedAt ? new Date(lastSavedAt).toLocaleString() : t("not_saved")}
          </footer>
        )}
        {mobileSite && !phoneLiveMode && (
            <MobileBottomNav
              activeView={resolvedActiveView}
              onNavigate={(view) => dispatch({ type: "NAVIGATE", payload: view })}
            />
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
        {!siteMode && (
          <SiteModeModal
            onChoose={(mode) => {
              handleSiteModeChange(mode);
            }}
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

function resolveRadarPosition(mapName, zone, site) {
  const mapZones = RADAR_ZONE_POSITIONS[mapName] ?? {};
  if (zone) {
    const siteKey = site ? `${zone}::${site}` : null;
    if (siteKey && mapZones[siteKey]) {
      return mapZones[siteKey];
    }
    if (mapZones[zone]) {
      return mapZones[zone];
    }
  }

  return RADAR_SITE_FALLBACKS[mapName]?.[site] ?? { x: 0.5, y: 0.5, level: "upper" };
}

function getRadarViewBox(mapName, level = "upper") {
  return RADAR_VIEWBOXES[mapName]?.[level] ?? { left: 0, top: 0, width: 1, height: 1 };
}

function hashRadarSeed(value = "") {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRadarUnit(seed, salt = 0) {
  const hash = hashRadarSeed(`${seed}:${salt}`);
  return (hash % 10000) / 9999;
}

function spawnInRadarRegion(region, seed) {
  const width = region.width ?? 0.06;
  const height = region.height ?? 0.06;
  const x = region.x - width / 2 + seededRadarUnit(seed, 1) * width;
  const y = region.y - height / 2 + seededRadarUnit(seed, 2) * height;
  return {
    ...region,
    x: clamp(x, 0.02, 0.98),
    y: clamp(y, 0.02, 0.98),
  };
}

function buildRadarMarkers(events = [], mapName) {
  const kills = events
    .filter((event) => event.kind === "kill")
    .map((event, index, source) => {
      const position = spawnInRadarRegion(
        resolveRadarPosition(mapName, event.zone, event.site),
        `${mapName}:${event.zone ?? event.site ?? "unknown"}:${event.id}:${index}`
      );
      return {
        id: `${event.id}_${index}`,
        x: position.x,
        y: position.y,
        level: position.level ?? "upper",
        zone: event.zone,
        site: event.site,
        victimTeamKey: event.victimTeamKey,
        victimSide: event.victimSide,
        clock: event.clock,
        label: event.label,
        openingKill: event.openingKill,
        recent: index === source.length - 1,
      };
    });

  return kills;
}

function formatRoundClock(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds);
  return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, "0")}`;
}

function clockLabelToSeconds(label) {
  if (!label || typeof label !== "string") {
    return 115;
  }

  const [minutes, seconds] = label.split(":").map((value) => Number.parseInt(value, 10));
  if (Number.isNaN(minutes) || Number.isNaN(seconds)) {
    return 115;
  }

  return minutes * 60 + seconds;
}

function useIsLandscape(enabled = true) {
  const getValue = () => (typeof window !== "undefined" ? window.innerWidth > window.innerHeight : true);
  const [isLandscape, setIsLandscape] = useState(getValue);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return undefined;
    }

    const syncOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    syncOrientation();
    window.addEventListener("resize", syncOrientation);
    window.addEventListener("orientationchange", syncOrientation);

    return () => {
      window.removeEventListener("resize", syncOrientation);
      window.removeEventListener("orientationchange", syncOrientation);
    };
  }, [enabled]);

  return isLandscape;
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

function TopNav({ activeView, onNavigate, siteMode, onSiteModeChange }) {
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
      <div className="mx-auto flex w-[min(1600px,98vw)] items-center justify-between gap-4 px-3 py-3 sm:px-4 sm:py-4">
        <div>
          <div className="font-display text-[10px] uppercase tracking-[0.3em] text-accent sm:text-xs sm:tracking-[0.35em]">{t("app_title")}</div>
          <div className="font-display text-lg font-semibold text-text sm:text-2xl">{t("app_tagline")}</div>
        </div>
        <div className="flex min-w-0 items-center gap-3">
          <SiteModeSwitch siteMode={siteMode} onChange={onSiteModeChange} compact />
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card/70 p-1">
            <span className="hidden px-2 text-xs uppercase tracking-[0.2em] text-muted sm:inline">{t("language")}</span>
            {["en", "ru"].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={classNames(
                  "rounded-lg px-2.5 py-1 text-xs uppercase tracking-[0.18em] sm:px-3",
                  language === lang ? "bg-accent/15 text-accent" : "text-muted"
                )}
              >
                {lang}
              </button>
            ))}
          </div>
          <nav className="flex min-w-0 items-center gap-2 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={classNames(
                  "flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm transition sm:px-4",
                  active
                    ? "border-accent bg-accent/10 text-accent shadow-glow"
                    : "border-border bg-card/70 text-muted hover:border-accent/50 hover:text-text"
                )}
              >
                <Icon size={16} />
                <span className="hidden font-display text-lg md:inline">{navLabels[item.id] ?? item.label}</span>
              </button>
            );
          })}
          </nav>
        </div>
      </div>
    </header>
  );
}

function MobileHeader({ activeView, siteMode, onSiteModeChange, language, onLanguageChange }) {
  const { t } = useI18n();
  const currentNav = NAV_ITEMS.find((item) => item.id === activeView);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-3 py-3">
        <div className="min-w-0">
          <div className="font-display text-[10px] uppercase tracking-[0.28em] text-accent">{t("app_title")}</div>
          <div className="truncate font-display text-xl text-text">{currentNav?.label ?? t("nav_home")}</div>
        </div>
        <div className="flex items-center gap-2">
          <SiteModeSwitch siteMode={siteMode} onChange={onSiteModeChange} compact />
          <div className="flex items-center gap-1 rounded-xl border border-border bg-card/70 p-1">
            {["en", "ru"].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={classNames(
                  "rounded-lg px-2 py-1 text-[11px] uppercase tracking-[0.14em]",
                  language === lang ? "bg-accent/10 text-accent" : "text-muted"
                )}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileBottomNav({ activeView, onNavigate }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 px-2 py-2 backdrop-blur-md">
      <div className="grid grid-cols-6 gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={classNames(
                "flex flex-col items-center justify-center rounded-xl px-1 py-2 text-[10px]",
                active ? "bg-accent/10 text-accent" : "text-muted"
              )}
            >
              <Icon size={16} />
              <span className="mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function SiteModeModal({ onChoose }) {
  const isMobileSuggested =
    typeof window !== "undefined" ? window.matchMedia("(max-width: 1024px)").matches : false;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="panel w-full max-w-2xl rounded-3xl p-6 sm:p-8">
        <div className="text-xs uppercase tracking-[0.28em] text-accent">Version Select</div>
        <h2 className="mt-3 font-display text-4xl text-text">Choose how the site should open</h2>
        <p className="mt-3 text-sm text-muted">
          Desktop keeps the full broadcast layout. Mobile switches the whole site to a phone-first shell with simplified navigation and a mobile live HUD.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onChoose("desktop")}
            className="rounded-3xl border border-border bg-card/70 p-5 text-left transition hover:border-accent/35"
          >
            <div className="font-display text-3xl text-text">Desktop</div>
            <div className="mt-2 text-sm text-muted">
              Wide layout, full tables, broadcast HUD, best for PC and tablet landscape.
            </div>
            {isMobileSuggested ? null : (
              <div className="mt-4 inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent">
                Recommended
              </div>
            )}
          </button>
          <button
            type="button"
            onClick={() => onChoose("mobile")}
            className="rounded-3xl border border-border bg-card/70 p-5 text-left transition hover:border-accent/35"
          >
            <div className="font-display text-3xl text-text">Mobile</div>
            <div className="mt-2 text-sm text-muted">
              Compact phone-first navigation, adapted content flow, and a dedicated mobile live screen.
            </div>
            {isMobileSuggested ? (
              <div className="mt-4 inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent">
                Recommended
              </div>
            ) : null}
          </button>
        </div>
      </div>
    </div>
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

function HomeView({ teams, history, mobile = false, onQuickStart, onOpenTeams, onOpenHistory }) {
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
        <div className={classNames("grid gap-4", mobile ? "grid-cols-2" : "grid-cols-4")}>
          <MetricCard icon={Users} label="Saved Teams" value={teams.length} tone="accent" />
          <MetricCard icon={History} label="Stored Matches" value={history.length} />
          <MetricCard icon={Trophy} label="Formats" value={MATCH_FORMATS.join(" / ")} />
          <MetricCard icon={Sparkles} label="Map Pool" value={MAP_POOL.length} />
        </div>
      </Panel>
      <div className={classNames("grid gap-6", mobile ? "grid-cols-1" : "grid-cols-[1.3fr_0.7fr]")}>
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
  mobile = false,
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
    <div className={classNames("grid gap-6", mobile ? "grid-cols-1" : "grid-cols-[320px_1fr]")}>
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
          <div className={classNames("grid gap-6", mobile ? "grid-cols-1" : "grid-cols-[1fr_320px]")}>
            <div className="space-y-5">
              <div className={classNames("grid gap-4", mobile ? "grid-cols-1" : "grid-cols-2")}>
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
                    Logo / Emoji / Image URL / PNG
                    <div className="mt-1 flex gap-2">
                      <input
                        type="text"
                        value={teamDraft.logo}
                        onChange={(event) => updateDraft((current) => ({ ...current, logo: event.target.value }))}
                        className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-text"
                      />
                      <button type="button" onClick={() => logoInputRef.current?.click()} className="rounded-xl border border-border px-3 py-2 text-sm text-text">
                        Upload PNG
                      </button>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        className="hidden"
                        onChange={onLogoFile}
                      />
                    </div>
                    <span className="mt-2 block text-xs text-muted">
                      PNG, JPG, SVG, and WebP logos are converted to a local data URL and saved in browser storage.
                    </span>
                </label>
              </div>
              <div className={classNames("grid gap-4", mobile ? "grid-cols-1" : "grid-cols-2")}>
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
              <div className={classNames("grid gap-4", mobile ? "grid-cols-1" : "grid-cols-3")}>
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
        <div className={classNames("grid gap-6", mobile ? "grid-cols-1" : "grid-cols-2")}>
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

function MatchSetupView({ teams, setup, mobile = false, onSetupChange, onStartVeto, canStartMatch }) {
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
        <div className={classNames("grid gap-6", mobile ? "grid-cols-1" : "grid-cols-2")}>
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
      <div className={classNames("grid gap-6", mobile ? "grid-cols-1" : "grid-cols-[1fr_360px]")}>
        <Panel title={t("series_rules")} subtitle="Current sim settings match the full MR12 spec, with OT and economy enabled.">
          <div className={classNames("grid gap-4", mobile ? "grid-cols-1" : "grid-cols-3")}>
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
          <div className={classNames("mt-6 grid gap-4", mobile ? "grid-cols-2" : "grid-cols-3")}>
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

function VetoView({ match, revealedCount, mobile = false }) {
  const { t } = useI18n();
  const revealed = match.veto.steps.slice(0, revealedCount);
  return (
    <div className="space-y-6">
      <Panel title={t("veto_screen")} subtitle="Cards reveal in sequence with weighted bans, picks, and the decider map.">
        <div className={classNames("mb-5 rounded-2xl border border-border bg-card/70 p-5", mobile ? "space-y-4" : "flex items-center justify-between")}>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-surface">{renderLogo(match.teamA.logo)}</div>
            <div>
              <div className="font-display text-3xl text-text">{match.teamA.name}</div>
              <div className="text-sm text-muted">{match.teamA.tag}</div>
            </div>
          </div>
          <div className={classNames("font-display text-4xl text-accent", mobile && "text-center")}>VETO</div>
          <div className={classNames("flex items-center gap-4", mobile && "justify-end")}>
            <div className="text-right">
              <div className="font-display text-3xl text-text">{match.teamB.name}</div>
              <div className="text-sm text-muted">{match.teamB.tag}</div>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-surface">{renderLogo(match.teamB.logo)}</div>
          </div>
        </div>
        <div className={classNames("grid gap-4", mobile ? "grid-cols-1" : "grid-cols-3")}>
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
        <div className={classNames("grid gap-4", mobile ? "grid-cols-1" : "grid-cols-3")}>
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

function LiveMatchView({
  match,
  roundProgress,
  mobileSite = false,
  layoutMode = "broadcast",
  onLayoutModeChange,
  presentationMode = "semi",
  onPresentationModeChange,
  roundPlayback = null,
  fullscreen = false,
  siteMode = "desktop",
  onSiteModeChange,
}) {
  const { t } = useI18n();
  const [radarExpanded, setRadarExpanded] = useState(false);
  const activeMap = match.maps[match.currentMapIndex] ?? match.maps[match.maps.length - 1];
  const playbackSummary = roundPlayback?.summary ?? null;
  const playbackTotalFrames = roundPlayback?.totalFrames ?? playbackSummary?.timeline?.length ?? 0;
  const playbackFrame =
    playbackSummary && roundPlayback.frameIndex >= 0
      ? playbackSummary.timeline?.[Math.min(roundPlayback.frameIndex, (playbackSummary.timeline?.length ?? 1) - 1)] ?? null
      : null;
  const playbackSnapshot = playbackFrame?.snapshot ?? playbackSummary?.startLoadouts ?? null;
  const latestRound = playbackSummary ?? activeMap.lastRoundSummary;
  const teamAPlayers = playbackSnapshot?.teamA ?? latestRound?.loadouts.teamA ?? liveRowsFromTeam(activeMap.teamAState);
  const teamBPlayers = playbackSnapshot?.teamB ?? latestRound?.loadouts.teamB ?? liveRowsFromTeam(activeMap.teamBState);
  const teamAState = activeMap.teamAState;
  const teamBState = activeMap.teamBState;
  const roundClock =
    playbackSummary
      ? clockLabelToSeconds(playbackFrame?.clock ?? "1:55")
      : Math.max(0, Math.round(115 * (1 - roundProgress)));
  const roundClockLabel = playbackSummary ? playbackFrame?.clock ?? "1:55" : formatRoundClock(roundClock);
  const economyData = activeMap.economyHistory.map((entry) => ({
    ...entry,
    label: entry.label,
  }));
  const roundTimelineEvents = playbackSummary
    ? (playbackSummary.timeline ?? []).slice(0, Math.max(0, roundPlayback.frameIndex + 1))
    : latestRound?.timeline ?? [];
  const radarMarkers = buildRadarMarkers(roundTimelineEvents, activeMap.mapName);
  const latestRadarMarker = radarMarkers[radarMarkers.length - 1] ?? null;
  const feedEntries = playbackSummary
    ? (playbackSummary.timeline ?? [])
        .slice(0, Math.max(0, roundPlayback.frameIndex + 1))
        .map((entry) => ({
          ...entry,
          roundNumber: playbackSummary.roundNumber,
          mapName: activeMap.mapName,
        }))
        .reverse()
    : activeMap.allLogs.slice(0, 20);
  const currentPlaybackEvent = playbackFrame ?? null;
  const playbackStepLabel =
    playbackSummary && playbackTotalFrames
      ? `${Math.max(0, Math.min(playbackTotalFrames, roundPlayback.frameIndex + 1))}/${playbackTotalFrames}`
      : null;
  const liveStatusLabel = playbackSummary
    ? currentPlaybackEvent?.openingKill
      ? "Opening frag"
      : currentPlaybackEvent?.bombPlanted
        ? "Bomb planted"
        : currentPlaybackEvent?.defuse
          ? "Defuse attempt"
          : currentPlaybackEvent?.kind === "clutch"
            ? "Clutch live"
            : "Round live"
    : null;

  if (mobileSite || layoutMode === "phone") {
    return (
      <PhoneLandscapeLiveMatchView
        match={match}
        activeMap={activeMap}
        latestRound={latestRound}
        teamAPlayers={teamAPlayers}
        teamBPlayers={teamBPlayers}
        teamAState={teamAState}
        teamBState={teamBState}
        roundClock={roundClock}
        roundProgress={roundProgress}
        layoutMode={layoutMode}
        onLayoutModeChange={onLayoutModeChange}
        presentationMode={presentationMode}
        onPresentationModeChange={onPresentationModeChange}
        currentPlaybackEvent={currentPlaybackEvent}
        feedEntries={feedEntries}
        liveStatusLabel={liveStatusLabel}
        playbackStepLabel={playbackStepLabel}
        fullscreen={fullscreen}
        mobileSite={mobileSite}
        siteMode={siteMode}
        onSiteModeChange={onSiteModeChange}
        radarMarkers={radarMarkers}
        latestRadarMarker={latestRadarMarker}
      />
    );
  }

  return (
    <div className="grid h-[calc(100vh-102px)] min-h-0 grid-cols-[320px_minmax(0,1fr)_320px] gap-3 overflow-hidden">
      <BroadcastTeamColumn
        team={match.teamA}
        score={activeMap.score.teamA}
        side={teamAState.side}
        players={teamAPlayers}
        coach={match.teamA.coach}
        timeoutsRemaining={match.timeoutsRemaining.teamA}
      />
      <div className="flex min-h-0 flex-col gap-4 overflow-hidden">
        <Panel
          title={t("live_match")}
          subtitle="Compact fullscreen HUD with scores, sides, economy, and players."
          action={
            <div className="flex items-center gap-2">
              <SiteModeSwitch siteMode={siteMode} onChange={onSiteModeChange} compact />
              <PresentationModeSwitch mode={presentationMode} onChange={onPresentationModeChange} />
              <LayoutModeSwitch layoutMode={layoutMode} onChange={onLayoutModeChange} />
            </div>
          }
          className="p-4"
        >
          <div className="rounded-2xl border border-border bg-card/70 p-4">
            <div className="flex items-center justify-between gap-6">
              <TeamHeader team={match.teamA} score={activeMap.score.teamA} side={activeMap.teamAState.side} />
              <div className="text-center">
                <div className="font-display text-3xl text-accent">{activeMap.mapName}</div>
                <div className="mt-1 text-xs text-muted">
                  {latestRound?.displayRound ?? `R${activeMap.roundNumber}`} · {activeMap.overtimeNumber ? `OT ${activeMap.overtimeNumber}` : "Regulation"}
                </div>
                <div className={classNames("mt-2 numbers text-xl", roundClock <= 10 ? "text-red-400" : "text-text")}>
                  {roundClockLabel}
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
        <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_380px] gap-3 overflow-hidden">
          <div className="grid min-h-0 grid-cols-[220px_minmax(0,1fr)_280px] gap-3 overflow-hidden">
            <Panel title={t("round_history")} subtitle="Every round stays visible in a compact timeline." className="flex min-h-0 flex-col overflow-hidden p-3">
              <div className="scrollbar-thin min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                {[...activeMap.rounds].reverse().map((roundSummary) => (
                  <div
                    key={`${roundSummary.roundNumber}_${roundSummary.mapName}`}
                    className={classNames(
                      "rounded-xl border px-3 py-2",
                      roundSummary.winnerSide === "CT"
                        ? "border-sky-500/25 bg-sky-500/10"
                        : "border-accent/25 bg-accent/10"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-display text-lg text-text">{roundSummary.displayRound}</div>
                      <div className="numbers text-xs text-text">
                        {roundSummary.scoreAfter.teamA}-{roundSummary.scoreAfter.teamB}
                      </div>
                    </div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted">
                      {roundSummary.winnerSide} · A {roundTypeLabel(roundSummary.roundType.teamA)} / B {roundTypeLabel(roundSummary.roundType.teamB)}
                    </div>
                    <div className="mt-1 text-[11px] text-muted">
                      {roundSummary.bombPlanted ? "Plant" : "No plant"} · {reasonLabel(roundSummary.reason)}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title={t("round_hud")} subtitle="Latest call, leaders, clutch state, and money flow." className="min-h-0 overflow-hidden p-3">
              {latestRound ? (
                <div className="grid h-full min-h-0 grid-rows-[auto_auto_1fr] gap-3">
                  <div className="rounded-2xl border border-border bg-card/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.2em] text-muted">
                          {playbackSummary ? "Live Round" : "Latest Round"}
                        </div>
                        <div className="font-display text-3xl text-text">{latestRound.strategy}</div>
                        <div className="mt-1 text-sm text-muted">
                          {playbackSummary
                            ? currentPlaybackEvent?.label ?? "Freeze time, buys locked in, waiting for the first duel."
                            : `${latestRound.winnerKey === "teamA" ? match.teamA.tag : match.teamB.tag} win by ${reasonLabel(latestRound.reason)}`}
                        </div>
                      </div>
                      <div className="rounded-full border border-border px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted">
                        {playbackSummary
                          ? `${liveStatusLabel ?? "Live"}${playbackStepLabel ? ` · ${playbackStepLabel}` : ""}`
                          : latestRound.displayRound}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted">
                      <div className="rounded-xl border border-border bg-surface/70 px-3 py-2">
                        A buy: <span className="ml-1 uppercase text-text">{roundTypeLabel(latestRound.roundType.teamA)}</span>
                      </div>
                      <div className="rounded-xl border border-border bg-surface/70 px-3 py-2">
                        B buy: <span className="ml-1 uppercase text-text">{roundTypeLabel(latestRound.roundType.teamB)}</span>
                      </div>
                      <div className="rounded-xl border border-border bg-surface/70 px-3 py-2">
                        {latestRound.bombPlanted ? `Plant ${latestRound.plantSite ?? ""}` : "No plant"}
                      </div>
                    </div>
                    {latestRound.timeoutCalled && (
                      <div className="mt-3 rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent">
                        Tactical timeout: {latestRound.timeoutCalled === "teamA" ? match.teamA.coach.nickname : match.teamB.coach.nickname}
                      </div>
                    )}
                    {playbackSummary && currentPlaybackEvent?.openingKill && (
                      <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                        First death of the round just landed.
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <LeaderCard
                      title={match.teamA.tag}
                      nickname={latestRound.spectatorLeaders.teamA.nickname}
                      rating={latestRound.spectatorLeaders.teamA.rating}
                      side={teamAState.side}
                    />
                    <LeaderCard
                      title={match.teamB.tag}
                      nickname={latestRound.spectatorLeaders.teamB.nickname}
                      rating={latestRound.spectatorLeaders.teamB.rating}
                      side={teamBState.side}
                    />
                  </div>
                  <div className="grid min-h-0 grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-border bg-card/60 p-4">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-muted">
                        {playbackSummary ? "Current Event" : "Spotlight"}
                      </div>
                      <div className="mt-2 font-display text-2xl text-text">
                        {playbackSummary
                          ? currentPlaybackEvent?.label ?? "Freeze time"
                          : latestRound.clutch
                            ? `${latestRound.clutch.nickname} 1v${latestRound.clutch.size}`
                            : "Structured round"}
                      </div>
                      <div className="mt-2 text-sm text-muted">
                        {playbackSummary
                          ? "The round is being played event by event for full-stream coverage."
                          : latestRound.highlight ?? "No special swing moment on the latest round."}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-card/60 p-4">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-muted">Money Flow</div>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-border bg-surface/70 px-3 py-2">
                          <div className="text-[11px] uppercase tracking-[0.16em] text-muted">{match.teamA.tag}</div>
                          <div className="mt-1 numbers text-lg text-text">
                            {formatMoney(playbackSummary ? latestRound.economy.teamAEquipmentValue : latestRound.economy.teamATotalMoney)}
                          </div>
                        </div>
                        <div className="rounded-xl border border-border bg-surface/70 px-3 py-2">
                          <div className="text-[11px] uppercase tracking-[0.16em] text-muted">{match.teamB.tag}</div>
                          <div className="mt-1 numbers text-lg text-text">
                            {formatMoney(playbackSummary ? latestRound.economy.teamBEquipmentValue : latestRound.economy.teamBTotalMoney)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-muted">
                        {playbackSummary
                          ? `Round started at ${latestRound.scoreBefore.teamA}-${latestRound.scoreBefore.teamB}`
                          : `Equip value ${formatMoney(latestRound.economy.teamAEquipmentValue)} / ${formatMoney(latestRound.economy.teamBEquipmentValue)}`}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border px-6 text-center text-sm text-muted">
                  Waiting for the first round to resolve.
                </div>
              )}
            </Panel>
            <Panel title={t("live_feed")} subtitle="Newest play-by-play stays on top for casting." className="flex min-h-0 flex-col overflow-hidden p-3">
              <div className="scrollbar-thin min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                {feedEntries.map((log, index) => (
                  <div key={log.id} className={classNames("rounded-xl border px-3 py-2.5", playbackSummary && index === 0 ? "border-accent/40 bg-accent/10" : "border-border bg-card/60")}>
                    <div className="numbers text-[11px] text-accent">[{log.clock}] {log.mapName} {`R${log.roundNumber}`}</div>
                    <div className="mt-1 text-sm leading-5 text-text">{log.label}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
          <div className="grid min-h-0 grid-cols-[380px_minmax(0,1fr)] gap-3 overflow-hidden">
            <Panel title="Radar" subtitle="Death markers stay on the map for the whole round." className="overflow-hidden p-3">
              <div className="mb-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setRadarExpanded(true)}
                  className="rounded-xl border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-accent transition hover:border-accent hover:bg-accent/15"
                >
                  Open Radar
                </button>
              </div>
              <RadarPanel
                mapName={activeMap.mapName}
                markers={radarMarkers}
                latestMarker={latestRadarMarker}
                sideLookup={{ teamA: teamAState.side, teamB: teamBState.side }}
                showSidebar={false}
              />
            </Panel>
            <Panel title={t("economy_graph")} subtitle="Equipment value by round." className="overflow-hidden p-3">
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
                    <Line
                      type="monotone"
                      dataKey="teamA"
                      stroke="#f5a623"
                      strokeWidth={2.5}
                      dot={economyData.length <= 2 ? { r: 4, fill: "#f5a623", strokeWidth: 0 } : false}
                    />
                    <Line
                      type="monotone"
                      dataKey="teamB"
                      stroke="#5b8dd9"
                      strokeWidth={2.5}
                      dot={economyData.length <= 2 ? { r: 4, fill: "#5b8dd9", strokeWidth: 0 } : false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>
        </div>
      </div>
      <BroadcastTeamColumn
        team={match.teamB}
        score={activeMap.score.teamB}
        side={teamBState.side}
        players={teamBPlayers}
        coach={match.teamB.coach}
        timeoutsRemaining={match.timeoutsRemaining.teamB}
        reverse
      />
      {radarExpanded && (
        <RadarExpandedModal
          mapName={activeMap.mapName}
          markers={radarMarkers}
          latestMarker={latestRadarMarker}
          sideLookup={{ teamA: teamAState.side, teamB: teamBState.side }}
          onClose={() => setRadarExpanded(false)}
        />
      )}
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

function LayoutModeSwitch({ layoutMode, onChange, compact = false }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-card/70 p-1">
      {[
        { id: "broadcast", label: compact ? "Desk" : "Broadcast" },
        { id: "phone", label: "Phone" },
      ].map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => onChange?.(mode.id)}
          className={classNames(
            "rounded-lg border px-3 py-1.5 transition",
            compact ? "text-[11px]" : "text-xs uppercase tracking-[0.16em]",
            layoutMode === mode.id
              ? "border-accent bg-accent/10 text-accent"
              : "border-transparent text-muted hover:text-text"
          )}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}

function SiteModeSwitch({ siteMode, onChange, compact = false }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-border bg-card/70 p-1">
      {[
        { id: "desktop", label: compact ? "PC" : "Desktop" },
        { id: "mobile", label: "Mobile" },
      ].map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => onChange?.(mode.id)}
          className={classNames(
            "rounded-lg border px-3 py-1.5 transition",
            compact ? "text-[11px]" : "text-xs uppercase tracking-[0.16em]",
            siteMode === mode.id
              ? "border-accent bg-accent/10 text-accent"
              : "border-transparent text-muted hover:text-text"
          )}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}

function PresentationModeSwitch({ mode, onChange }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-border bg-card/70 p-1">
      {[
        { id: "semi", label: "Semi-Live" },
        { id: "live", label: "Live" },
      ].map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange?.(item.id)}
          className={classNames(
            "rounded-lg border px-3 py-1.5 text-xs uppercase tracking-[0.14em] transition",
            mode === item.id
              ? "border-accent bg-accent/10 text-accent"
              : "border-transparent text-muted hover:text-text"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function PhoneLandscapeLiveMatchView({
  match,
  activeMap,
  latestRound,
  teamAPlayers,
  teamBPlayers,
  teamAState,
  teamBState,
  roundClock,
  roundProgress,
  layoutMode,
  onLayoutModeChange,
  presentationMode = "semi",
  onPresentationModeChange,
  currentPlaybackEvent = null,
  feedEntries = [],
  liveStatusLabel = null,
  playbackStepLabel = null,
  fullscreen,
  mobileSite = false,
  siteMode = "desktop",
  onSiteModeChange,
  radarMarkers = [],
  latestRadarMarker = null,
}) {
  const { t } = useI18n();
  const isLandscape = useIsLandscape(mobileSite);
  const [mobilePane, setMobilePane] = useState("round");
  const economyData = activeMap.economyHistory.map((entry) => ({
    ...entry,
    label: entry.label,
  }));

  if (mobileSite && !isLandscape) {
    return <RotatePhonePrompt match={match} activeMap={activeMap} siteMode={siteMode} onSiteModeChange={onSiteModeChange} />;
  }

  if (mobileSite) {
    return (
      <MobileLiveMatchView
        match={match}
        activeMap={activeMap}
        latestRound={latestRound}
        teamAPlayers={teamAPlayers}
        teamBPlayers={teamBPlayers}
        teamAState={teamAState}
        teamBState={teamBState}
        roundClock={roundClock}
        roundProgress={roundProgress}
        economyData={economyData}
        mobilePane={mobilePane}
        onPaneChange={setMobilePane}
        presentationMode={presentationMode}
        onPresentationModeChange={onPresentationModeChange}
        currentPlaybackEvent={currentPlaybackEvent}
        feedEntries={feedEntries}
        liveStatusLabel={liveStatusLabel}
        playbackStepLabel={playbackStepLabel}
        siteMode={siteMode}
        onSiteModeChange={onSiteModeChange}
        radarMarkers={radarMarkers}
        latestRadarMarker={latestRadarMarker}
      />
    );
  }

  return (
    <div
      className={classNames(
        "grid min-h-0 grid-cols-[126px_minmax(0,1fr)_126px] gap-1.5 overflow-hidden sm:grid-cols-[145px_minmax(0,1fr)_145px]",
        fullscreen ? "h-[100dvh] w-screen" : "h-[calc(100dvh-98px)]"
      )}
    >
      <CompactTeamColumn
        team={match.teamA}
        score={activeMap.score.teamA}
        side={teamAState.side}
        players={teamAPlayers}
      />
      <div className="grid min-h-0 grid-rows-[76px_minmax(0,1fr)] gap-1.5 overflow-hidden">
        <div className="panel overflow-hidden rounded-none border-x-0 border-t-0 p-2 sm:rounded-2xl sm:border sm:p-2.5">
          <div className="rounded-xl border border-border bg-card/70 px-3 py-2">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div>
                <div className="font-display text-sm text-text sm:text-lg">{match.teamA.tag}</div>
                <div className="numbers text-2xl text-accent sm:text-3xl">{activeMap.score.teamA}</div>
              </div>
              <div className="text-center">
                <div className="font-display text-lg text-accent sm:text-xl">{activeMap.mapName}</div>
                <div className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-muted">
                  {latestRound?.displayRound ?? `R${activeMap.roundNumber}`} · {activeMap.overtimeNumber ? `OT ${activeMap.overtimeNumber}` : "Reg"}
                </div>
                <div className={classNames("numbers text-base", roundClock <= 10 ? "text-red-400" : "text-text")}>
                  {formatRoundClock(roundClock)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-sm text-text sm:text-lg">{match.teamB.tag}</div>
                <div className="numbers text-2xl text-sky-300 sm:text-3xl">{activeMap.score.teamB}</div>
              </div>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
              <div
                className={classNames("h-full rounded-full transition-all", roundClock <= 10 ? "bg-red-500" : "bg-accent")}
                style={{ width: `${Math.max(4, roundProgress * 100)}%` }}
              />
            </div>
            {!mobileSite && (
              <div className="mt-2 flex items-center justify-end gap-2">
                <PresentationModeSwitch mode={presentationMode} onChange={onPresentationModeChange} />
                <LayoutModeSwitch layoutMode={layoutMode} onChange={onLayoutModeChange} compact />
              </div>
            )}
          </div>
        </div>
        <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_164px] gap-1.5 overflow-hidden sm:grid-cols-[minmax(0,1fr)_190px]">
          <Panel title={mobileSite ? "" : t("round_hud")} subtitle={mobileSite ? "" : "Core round context."} className="min-h-0 overflow-hidden rounded-none border-x-0 p-2 sm:rounded-2xl sm:border sm:p-2.5">
            {latestRound ? (
              <div className="grid h-full min-h-0 grid-rows-[auto_auto_1fr] gap-2">
                <div className="rounded-2xl border border-border bg-card/60 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-display text-2xl text-text">{latestRound.strategy}</div>
                      <div className="text-xs text-muted">
                        {currentPlaybackEvent?.label ??
                          `${latestRound.winnerKey === "teamA" ? match.teamA.tag : match.teamB.tag} win by ${reasonLabel(latestRound.reason)}`}
                      </div>
                    </div>
                    <div className="rounded-full border border-border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-muted">
                      {liveStatusLabel ? `${liveStatusLabel}${playbackStepLabel ? ` · ${playbackStepLabel}` : ""}` : latestRound.displayRound}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl border border-border bg-surface/80 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-muted">{match.teamA.tag}</div>
                    <div className="mt-1 text-xs text-text">{roundTypeLabel(latestRound.roundType.teamA)}</div>
                  </div>
                  <div className="rounded-xl border border-border bg-surface/80 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-muted">{match.teamB.tag}</div>
                    <div className="mt-1 text-xs text-text">{roundTypeLabel(latestRound.roundType.teamB)}</div>
                  </div>
                  <div className="rounded-xl border border-border bg-surface/80 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-muted">Bomb</div>
                    <div className="mt-1 text-xs text-text">{latestRound.bombPlanted ? latestRound.plantSite ?? "Planted" : "No plant"}</div>
                  </div>
                </div>
                <div className="grid min-h-0 grid-cols-2 gap-2">
                  <div className="rounded-2xl border border-border bg-card/60 px-3 py-2.5">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-muted">Top {match.teamA.tag}</div>
                    <div className="mt-1 font-display text-xl text-text">{latestRound.spectatorLeaders.teamA.nickname}</div>
                    <div className="numbers text-sm text-accent">{latestRound.spectatorLeaders.teamA.rating}</div>
                    <div className="mt-2 numbers text-xs text-muted">{formatMoney(latestRound.economy.teamATotalMoney)}</div>
                  </div>
                  <div className="rounded-2xl border border-border bg-card/60 px-3 py-2.5">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-muted">Top {match.teamB.tag}</div>
                    <div className="mt-1 font-display text-xl text-text">{latestRound.spectatorLeaders.teamB.nickname}</div>
                    <div className="numbers text-sm text-sky-300">{latestRound.spectatorLeaders.teamB.rating}</div>
                    <div className="mt-2 numbers text-xs text-muted">{formatMoney(latestRound.economy.teamBTotalMoney)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border px-4 text-center text-xs text-muted">
                Waiting for the first round.
              </div>
            )}
          </Panel>
          <Panel title={mobileSite ? "" : t("live_feed")} subtitle={mobileSite ? "" : "Recent calls."} className="flex min-h-0 flex-col overflow-hidden rounded-none border-x-0 p-2 sm:rounded-2xl sm:border sm:p-2.5">
            <div className="scrollbar-thin min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
              {(feedEntries.length ? feedEntries : activeMap.allLogs.slice(0, 8)).map((log, index) => (
                <div key={log.id} className="rounded-xl border border-border bg-card/60 px-2.5 py-2">
                  <div className="numbers text-[10px] text-accent">[{log.clock}] {`R${log.roundNumber}`}</div>
                  <div className="mt-1 text-[11px] leading-4 text-text">{log.label}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
      <CompactTeamColumn
        team={match.teamB}
        score={activeMap.score.teamB}
        side={teamBState.side}
        players={teamBPlayers}
        reverse
      />
    </div>
  );
}

function CompactTeamColumn({ team, score, side, players, reverse = false }) {
  const tone = sideToneClasses(side);

  return (
    <section className="panel page-enter grid h-full min-h-0 grid-rows-[48px_repeat(5,minmax(0,1fr))] gap-1 rounded-none border-y-0 p-1.5 sm:rounded-2xl sm:border sm:p-2">
      <div className={classNames("flex items-center justify-between rounded-xl border px-2.5 py-2", tone.border, tone.bg, reverse && "flex-row-reverse text-right")}>
        <div className="min-w-0">
          <div className="truncate font-display text-base text-text sm:text-xl">{team.tag}</div>
          <div className={classNames("text-[10px] uppercase tracking-[0.16em]", tone.text)}>{side}</div>
        </div>
        <div className="numbers text-2xl text-text sm:text-3xl">{score}</div>
      </div>
      {players.map((player) => (
        <CompactTeamPlayerCard key={player.id} player={player} side={side} reverse={reverse} />
      ))}
    </section>
  );
}

function CompactTeamPlayerCard({ player, side, reverse = false }) {
  const tone = sideToneClasses(side);

  return (
    <div className={classNames("rounded-lg border px-1.5 py-1", player.alive ? tone.border : "border-border bg-surface/60 opacity-70")}>
      <div className={classNames("flex items-center justify-between gap-1", reverse && "flex-row-reverse text-right")}>
        <div className="min-w-0">
          <div className="truncate font-display text-[13px] text-text sm:text-sm">{player.nickname}</div>
          <div className="numbers text-[10px] text-muted">
            {player.kills}/{player.deaths}/{player.assists}
          </div>
        </div>
        <div className={classNames("rounded-md px-1.5 py-0.5 text-[10px] font-semibold", weaponBadgeClasses(player.weaponType))}>
          [{player.weaponLabel}]
        </div>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface">
        <div
          className={classNames("h-full rounded-full", tone.bar)}
          style={{ width: `${player.alive ? player.hp : 0}%` }}
        />
      </div>
      <div className={classNames("mt-1 flex items-center justify-between text-[10px]", reverse && "flex-row-reverse")}>
        <span className="text-muted">{player.alive ? `${player.hp} HP` : "OUT"}</span>
        <span className="text-muted">U {player.utilityCount}</span>
        <span style={{ color: getRatingColor(player.rating) }} className="numbers">
          {player.rating}
        </span>
      </div>
    </div>
  );
}

function RotatePhonePrompt({ match, activeMap, siteMode, onSiteModeChange }) {
  return (
    <div className="flex h-[100dvh] w-screen items-center justify-center overflow-hidden px-4 py-5">
      <div className="panel w-full max-w-sm rounded-3xl p-6 text-center">
        <div className="text-xs uppercase tracking-[0.24em] text-accent">Mobile Live</div>
        <div className="mt-3 font-display text-4xl text-text">Rotate Phone</div>
        <div className="mt-3 text-sm text-muted">
          The mobile live HUD is tuned for landscape so all 10 players, the score, and round context stay visible.
        </div>
        <div className="mt-5 rounded-2xl border border-border bg-card/70 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="font-display text-xl text-text">{match.teamA.tag}</div>
              <div className="numbers text-2xl text-accent">{activeMap.score.teamA}</div>
            </div>
            <div className="text-center">
              <div className="font-display text-xl text-accent">{activeMap.mapName}</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted">Landscape</div>
            </div>
            <div className="text-right">
              <div className="font-display text-xl text-text">{match.teamB.tag}</div>
              <div className="numbers text-2xl text-sky-300">{activeMap.score.teamB}</div>
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-center">
          <SiteModeSwitch siteMode={siteMode} onChange={onSiteModeChange} />
        </div>
      </div>
    </div>
  );
}

function MobileLiveMatchView({
  match,
  activeMap,
  latestRound,
  teamAPlayers,
  teamBPlayers,
  teamAState,
  teamBState,
  roundClock,
  roundProgress,
  economyData,
  mobilePane,
  onPaneChange,
  presentationMode = "semi",
  onPresentationModeChange,
  currentPlaybackEvent = null,
  feedEntries = [],
  liveStatusLabel = null,
  playbackStepLabel = null,
  siteMode = "mobile",
  onSiteModeChange,
  radarMarkers = [],
  latestRadarMarker = null,
}) {
  const tabs = [
    { id: "round", label: "Round" },
    { id: "feed", label: "Feed" },
    { id: "map", label: "Map" },
    { id: "econ", label: "Economy" },
  ];

  return (
    <div className="grid h-[100dvh] w-screen grid-cols-[112px_minmax(0,1fr)_112px] gap-1 overflow-hidden bg-hero-grid px-1 py-1 sm:grid-cols-[124px_minmax(0,1fr)_124px]">
      <MobileCompactTeamColumn team={match.teamA} score={activeMap.score.teamA} side={teamAState.side} players={teamAPlayers} />
      <div className="grid min-h-0 grid-rows-[38px_58px_32px_minmax(0,1fr)] gap-1 overflow-hidden">
        <div className="panel rounded-2xl p-1.5">
          <div className="flex items-center justify-between gap-1">
            <SiteModeSwitch siteMode={siteMode} onChange={onSiteModeChange} compact />
            <PresentationModeSwitch mode={presentationMode} onChange={onPresentationModeChange} />
          </div>
        </div>
        <div className="panel rounded-2xl p-2">
          <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card/80 px-3 py-2">
            <div className="min-w-0">
              <div className="font-display text-sm text-text">{match.teamA.tag}</div>
              <div className={classNames("text-[9px] uppercase tracking-[0.18em]", sideToneClasses(teamAState.side).text)}>{teamAState.side}</div>
            </div>
            <div className="numbers text-3xl text-accent">{activeMap.score.teamA}</div>
            <div className="min-w-0 text-center">
              <div className="font-display text-lg text-accent">{activeMap.mapName}</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted">{latestRound?.displayRound ?? `R${activeMap.roundNumber}`}</div>
              <div className="numbers text-sm text-text">{formatRoundClock(roundClock)}</div>
            </div>
            <div className="numbers text-3xl text-sky-300">{activeMap.score.teamB}</div>
            <div className="min-w-0 text-right">
              <div className="font-display text-sm text-text">{match.teamB.tag}</div>
              <div className={classNames("text-[9px] uppercase tracking-[0.18em]", sideToneClasses(teamBState.side).text)}>{teamBState.side}</div>
            </div>
          </div>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface">
            <div className={classNames("h-full rounded-full transition-all", roundClock <= 10 ? "bg-red-500" : "bg-accent")} style={{ width: `${Math.max(4, roundProgress * 100)}%` }} />
          </div>
        </div>
        <div className="panel rounded-2xl p-1">
          <div className="grid h-full grid-cols-4 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onPaneChange(tab.id)}
                className={classNames(
                  "rounded-xl border text-[10px] uppercase tracking-[0.18em] transition",
                  mobilePane === tab.id ? "border-accent bg-accent/10 text-accent" : "border-border bg-card/50 text-muted"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="panel min-h-0 overflow-hidden rounded-2xl p-2">
          {mobilePane === "feed" ? (
            <MobileFeedPanel logs={feedEntries.length ? feedEntries : activeMap.allLogs} limit={7} />
          ) : mobilePane === "map" ? (
            <RadarPanel
              mapName={activeMap.mapName}
              markers={radarMarkers}
              latestMarker={latestRadarMarker}
              sideLookup={{ teamA: teamAState.side, teamB: teamBState.side }}
              compact
            />
          ) : mobilePane === "econ" ? (
            <MobileEconomyPanel economyData={economyData} latestRound={latestRound} teamA={match.teamA} teamB={match.teamB} timeoutsRemaining={match.timeoutsRemaining} />
          ) : (
            <MobileRoundContext
              match={match}
              latestRound={latestRound}
              fallbackRound={activeMap.roundNumber}
              currentPlaybackEvent={currentPlaybackEvent}
              liveStatusLabel={liveStatusLabel}
              playbackStepLabel={playbackStepLabel}
            />
          )}
        </div>
      </div>
      <MobileCompactTeamColumn team={match.teamB} score={activeMap.score.teamB} side={teamBState.side} players={teamBPlayers} reverse />
    </div>
  );
}

function MobileRoundContext({
  match,
  latestRound,
  fallbackRound,
  currentPlaybackEvent = null,
  liveStatusLabel = null,
  playbackStepLabel = null,
}) {
  if (!latestRound) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border px-4 text-center text-xs text-muted">
        Waiting for round {fallbackRound}.
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_auto_1fr] gap-2">
      <div className="rounded-2xl border border-border bg-card/60 px-3 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="font-display text-xl text-text">{latestRound.strategy}</div>
            <div className="truncate text-[11px] text-muted">
              {currentPlaybackEvent?.label ??
                `${latestRound.winnerKey === "teamA" ? match.teamA.tag : match.teamB.tag} win by ${reasonLabel(latestRound.reason)}`}
            </div>
          </div>
          <div className="rounded-full border border-border px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-muted">
            {liveStatusLabel ? `${liveStatusLabel}${playbackStepLabel ? ` · ${playbackStepLabel}` : ""}` : latestRound.displayRound}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-border bg-surface/80 px-2.5 py-2">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted">{match.teamA.tag}</div>
          <div className="mt-1 text-xs text-text">{roundTypeLabel(latestRound.roundType.teamA)}</div>
        </div>
        <div className="rounded-xl border border-border bg-surface/80 px-2.5 py-2">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted">Bomb</div>
          <div className="mt-1 text-xs text-text">{latestRound.bombPlanted ? latestRound.plantSite ?? "Planted" : "No plant"}</div>
        </div>
        <div className="rounded-xl border border-border bg-surface/80 px-2.5 py-2">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted">{match.teamB.tag}</div>
          <div className="mt-1 text-xs text-text">{roundTypeLabel(latestRound.roundType.teamB)}</div>
        </div>
      </div>
      <div className="grid min-h-0 grid-cols-2 gap-2">
        <div className="rounded-2xl border border-border bg-card/60 px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted">Top {match.teamA.tag}</div>
          <div className="mt-1 truncate font-display text-lg text-text">{latestRound.spectatorLeaders.teamA.nickname}</div>
          <div className="numbers text-sm text-accent">{latestRound.spectatorLeaders.teamA.rating}</div>
          <div className="mt-1 numbers text-[11px] text-muted">{formatMoney(latestRound.economy.teamATotalMoney)}</div>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted">Top {match.teamB.tag}</div>
          <div className="mt-1 truncate font-display text-lg text-text">{latestRound.spectatorLeaders.teamB.nickname}</div>
          <div className="numbers text-sm text-sky-300">{latestRound.spectatorLeaders.teamB.rating}</div>
          <div className="mt-1 numbers text-[11px] text-muted">{formatMoney(latestRound.economy.teamBTotalMoney)}</div>
        </div>
      </div>
    </div>
  );
}

function MobileFeedPanel({ logs, limit = 7 }) {
  return (
    <div className="scrollbar-thin min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
      {logs.slice(0, limit).map((log) => (
        <div key={log.id} className="rounded-xl border border-border bg-card/60 px-2.5 py-2">
          <div className="numbers text-[10px] text-accent">[{log.clock}] R{log.roundNumber}</div>
          <div className="mt-1 text-[11px] leading-4 text-text">{log.label}</div>
        </div>
      ))}
    </div>
  );
}

function MobileEconomyPanel({ economyData, latestRound, teamA, teamB, timeoutsRemaining }) {
  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-border bg-card/60 px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted">{teamA.tag} Bank</div>
          <div className="mt-1 numbers text-sm text-accent">{formatMoney(latestRound?.economy.teamATotalMoney ?? 0)}</div>
          <div className="mt-1 text-[10px] text-muted">TO {timeoutsRemaining.teamA}</div>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted">{teamB.tag} Bank</div>
          <div className="mt-1 numbers text-sm text-sky-300">{formatMoney(latestRound?.economy.teamBTotalMoney ?? 0)}</div>
          <div className="mt-1 text-[10px] text-muted">TO {timeoutsRemaining.teamB}</div>
        </div>
      </div>
      <div className="min-h-0 rounded-2xl border border-border bg-card/60 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={economyData}>
            <CartesianGrid stroke="#1f232c" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} axisLine={false} width={34} />
            <Tooltip
              contentStyle={{
                background: "#111318",
                border: "1px solid #2a2d36",
                borderRadius: 12,
                color: "#e8eaf0",
              }}
            />
            <Line
              type="monotone"
              dataKey="teamA"
              stroke="#f5a623"
              strokeWidth={2.2}
              dot={economyData.length <= 2 ? { r: 3, fill: "#f5a623", strokeWidth: 0 } : false}
            />
            <Line
              type="monotone"
              dataKey="teamB"
              stroke="#5b8dd9"
              strokeWidth={2.2}
              dot={economyData.length <= 2 ? { r: 3, fill: "#5b8dd9", strokeWidth: 0 } : false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MobileCompactTeamColumn({ team, score, side, players, reverse = false }) {
  const tone = sideToneClasses(side);

  return (
    <section className="panel page-enter grid h-full min-h-0 grid-rows-[42px_repeat(5,minmax(0,1fr))] gap-1 overflow-hidden rounded-none border-y-0 p-1">
      <div className={classNames("flex items-center justify-between rounded-xl border px-2 py-1.5", tone.border, tone.bg, reverse && "flex-row-reverse text-right")}>
        <div className="min-w-0">
          <div className="truncate font-display text-sm text-text">{team.tag}</div>
          <div className={classNames("text-[9px] uppercase tracking-[0.16em]", tone.text)}>{side}</div>
        </div>
        <div className="numbers text-2xl text-text">{score}</div>
      </div>
      {players.map((player) => (
        <MobileCompactPlayerCard key={player.id} player={player} side={side} reverse={reverse} />
      ))}
    </section>
  );
}

function MobileCompactPlayerCard({ player, side, reverse = false }) {
  const tone = sideToneClasses(side);

  return (
    <div className={classNames("rounded-lg border px-1.5 py-1", player.alive ? tone.border : "border-border bg-surface/60 opacity-70")}>
      <div className={classNames("flex items-center justify-between gap-1", reverse && "flex-row-reverse text-right")}>
        <div className="min-w-0">
          <div className="truncate font-display text-[12px] text-text">{player.nickname}</div>
          <div className="numbers text-[10px] text-muted">{player.kills}/{player.deaths}/{player.assists}</div>
        </div>
        <div className={classNames("shrink-0 rounded-md px-1 py-0.5 text-[9px] font-semibold", weaponBadgeClasses(player.weaponType))}>
          [{player.weaponLabel}]
        </div>
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface">
        <div className={classNames("h-full rounded-full", tone.bar)} style={{ width: `${player.alive ? player.hp : 0}%` }} />
      </div>
      <div className={classNames("mt-1 flex items-center justify-between gap-1 text-[10px]", reverse && "flex-row-reverse")}>
        <span className="text-muted">{player.alive ? `${player.hp} HP` : "OUT"}</span>
        <span style={{ color: getRatingColor(player.rating) }} className="numbers">{player.rating}</span>
      </div>
    </div>
  );
}

function sideToneClasses(side) {
  return side === "CT"
    ? {
        border: "border-sky-500/25",
        bg: "bg-sky-500/10",
        text: "text-sky-300",
        bar: "bg-sky-400",
      }
    : {
        border: "border-accent/25",
        bg: "bg-accent/10",
        text: "text-accent",
        bar: "bg-accent",
      };
}

function shortRoleLabel(role) {
  switch (role) {
    case "Entry Fragger":
      return "ENTRY";
    case "AWPer":
      return "AWP";
    case "Lurker":
      return "LURK";
    case "Support":
      return "SUP";
    case "IGL":
      return "IGL";
    default:
      return role.toUpperCase();
  }
}

function roundTypeLabel(value) {
  switch (value) {
    case "antiEco":
      return "anti";
    case "full":
      return "full";
    case "force":
      return "force";
    case "eco":
      return "eco";
    case "pistol":
      return "pistol";
    default:
      return value ?? "n/a";
  }
}

function weaponBadgeClasses(weaponType) {
  if (weaponType === "rifle") {
    return "bg-accent/15 text-accent";
  }

  if (weaponType === "awp") {
    return "bg-teal-500/15 text-teal-300";
  }

  if (weaponType === "smg") {
    return "bg-emerald-500/15 text-emerald-300";
  }

  return "bg-white/10 text-white";
}

function BroadcastTeamColumn({ team, score, side, players, coach, timeoutsRemaining, reverse = false }) {
  const tone = sideToneClasses(side);
  const totalMoney = players.reduce((sum, player) => sum + player.money, 0);

  return (
    <section className="panel page-enter flex h-full min-h-0 flex-col overflow-hidden rounded-2xl p-3">
      <div className={classNames("rounded-2xl border px-4 py-3", tone.border, tone.bg)}>
        <div className={classNames("flex items-center justify-between gap-3", reverse && "flex-row-reverse text-right")}>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-surface">
            {renderLogo(team.logo, team.tag.slice(0, 1))}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-3xl text-text">{team.tag}</div>
            <div className={classNames("text-[11px] uppercase tracking-[0.22em]", tone.text)}>{side}-Side</div>
          </div>
          <div className={classNames("shrink-0 text-right", reverse && "text-left")}>
            <div className="numbers text-4xl text-text">{score}</div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted">TO {timeoutsRemaining}</div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-border bg-surface/80 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted">Bank</div>
            <div className="mt-1 numbers text-sm text-text">{formatMoney(totalMoney)}</div>
          </div>
          <div className="rounded-xl border border-border bg-surface/80 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted">Coach</div>
            <div className="mt-1 truncate text-sm text-text">{coach.nickname}</div>
          </div>
        </div>
      </div>
      <div className="mt-3 grid min-h-0 flex-1 grid-rows-5 gap-2">
        {players.map((player) => (
          <BroadcastPlayerCard key={player.id} player={player} side={side} reverse={reverse} />
        ))}
      </div>
    </section>
  );
}

function BroadcastPlayerCard({ player, side, reverse = false }) {
  const tone = sideToneClasses(side);

  return (
    <div
      className={classNames(
        "flex min-h-0 flex-col rounded-2xl border px-3 py-2.5",
        player.alive ? classNames(tone.border, "bg-card/75") : "border-border bg-surface/60 opacity-70"
      )}
    >
      <div className={classNames("flex items-start justify-between gap-2", reverse && "flex-row-reverse text-right")}>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate font-display text-xl text-text">{player.nickname}</div>
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-muted">
              {shortRoleLabel(player.role)}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted">
            <span>HP {player.alive ? player.hp : "OUT"}</span>
            <span>Armor {player.armor ? (player.helmet ? "H+K" : "K") : "No"}</span>
            <span>Util {player.utilityCount}</span>
          </div>
        </div>
        <div className={classNames("shrink-0 text-right", reverse && "text-left")}>
          <div className={classNames("rounded-lg px-2.5 py-1 text-[11px] font-semibold", weaponBadgeClasses(player.weaponType))}>
            [{player.weaponLabel}]
          </div>
          <div className="mt-2 numbers text-xs text-text">{formatMoney(player.money)}</div>
        </div>
      </div>
      <div className="mt-2 flex-1">
        <div className="h-2 overflow-hidden rounded-full bg-surface">
          <div
            className={classNames("h-full rounded-full transition-all", tone.bar)}
            style={{ width: `${player.alive ? player.hp : 0}%` }}
          />
        </div>
      </div>
      <div className={classNames("mt-2 flex items-center justify-between gap-3 text-[11px]", reverse && "flex-row-reverse")}>
        <span className="numbers text-text">
          {player.kills}/{player.deaths}/{player.assists}
        </span>
        <span className="numbers text-muted">{player.alive ? `${player.hp} HP` : "Eliminated"}</span>
        <span style={{ color: getRatingColor(player.rating) }} className="numbers text-text">
          {player.rating}
        </span>
      </div>
    </div>
  );
}

function LeaderCard({ title, nickname, rating, side }) {
  const tone = sideToneClasses(side);

  return (
    <div className={classNames("rounded-2xl border p-3", tone.border, "bg-card/60")}>
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Top Rating {title}</div>
      <div className="mt-1 font-display text-2xl text-text">{nickname}</div>
      <div className={classNames("numbers text-lg", tone.text)}>{rating}</div>
    </div>
  );
}

function RadarImageStage({
  src,
  alt,
  mapName,
  level = "upper",
  markers,
  sideLookup,
  compact = false,
  expanded = false,
  label = "Upper",
}) {
  const areaRef = useRef(null);
  const viewBox = getRadarViewBox(mapName, level);
  const [imageFrame, setImageFrame] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useLayoutEffect(() => {
    const areaNode = areaRef.current;
    if (!areaNode || typeof window === "undefined") {
      return undefined;
    }

    const syncFrame = () => {
      const areaRect = areaNode.getBoundingClientRect();
      const aspectRatio = viewBox.width / viewBox.height;
      let width = areaRect.width;
      let height = width / aspectRatio;

      if (height > areaRect.height) {
        height = areaRect.height;
        width = height * aspectRatio;
      }

      setImageFrame({
        left: (areaRect.width - width) / 2,
        top: (areaRect.height - height) / 2,
        width,
        height,
      });
    };

    syncFrame();
    const observer = new ResizeObserver(syncFrame);
    observer.observe(areaNode);
    window.addEventListener("resize", syncFrame);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncFrame);
    };
  }, [compact, expanded, markers.length, viewBox.height, viewBox.width]);

  return (
    <div ref={areaRef} className="relative h-full w-full">
      <div
        className="absolute overflow-hidden rounded-xl"
        style={{
          left: imageFrame.left,
          top: imageFrame.top,
          width: imageFrame.width,
          height: imageFrame.height,
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable="false"
          className="pointer-events-none absolute select-none"
          style={{
            left: `${(-viewBox.left / viewBox.width) * 100}%`,
            top: `${(-viewBox.top / viewBox.height) * 100}%`,
            width: `${(1 / viewBox.width) * 100}%`,
            height: `${(1 / viewBox.height) * 100}%`,
            maxWidth: "none",
          }}
        />
      </div>
      <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-border bg-surface/80 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-muted">
        {label}
      </div>
      {markers.map((marker) => (
        <RadarDeathMarker
          key={marker.id}
          marker={marker}
          victimSide={marker.victimSide ?? sideLookup[marker.victimTeamKey]}
          compact={compact}
          expanded={expanded}
          imageFrame={imageFrame}
          viewBox={viewBox}
        />
      ))}
    </div>
  );
}

function RadarPanel({
  mapName,
  markers,
  latestMarker,
  sideLookup,
  compact = false,
  expanded = false,
  showSidebar = !compact,
}) {
  const assets = RADAR_ASSETS[mapName];
  const upperMarkers = markers.filter((marker) => marker.level !== "lower");
  const lowerMarkers = markers.filter((marker) => marker.level === "lower");
  const compactStage = compact || !showSidebar;

  if (!assets?.upper) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border px-4 text-center text-sm text-muted">
        Radar asset is missing for {mapName}.
      </div>
    );
  }

  return (
    <div
      className={classNames(
        "grid h-full min-h-0 gap-3",
        compact || !showSidebar
          ? "grid-cols-1 grid-rows-[minmax(0,1fr)_auto]"
          : expanded
            ? "grid-cols-[minmax(0,1fr)_260px]"
            : "grid-cols-[minmax(0,1fr)_176px]"
      )}
    >
      <div className="flex min-h-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-[#050608] p-3">
        <div className={classNames("relative h-full w-full", compactStage ? "max-w-[460px]" : "", expanded ? "max-h-[78vh]" : "")}>
          <RadarImageStage
            src={assets.upper}
            alt={`${mapName} radar`}
            mapName={mapName}
            level="upper"
            markers={upperMarkers}
            sideLookup={sideLookup}
            compact={compact}
            expanded={expanded}
            label="Upper"
          />
          {assets.lower && (
            <div className={classNames("absolute overflow-hidden rounded-xl border border-border bg-[#050608] shadow-2xl", expanded ? "bottom-4 right-4 h-[38%] w-[38%]" : "bottom-3 right-3 h-[42%] w-[42%]")}>
              <RadarImageStage
                src={assets.lower}
                alt={`${mapName} lower radar`}
                mapName={mapName}
                level="lower"
                markers={lowerMarkers}
                sideLookup={sideLookup}
                compact
                expanded={expanded}
                label="Lower"
              />
            </div>
          )}
        </div>
      </div>
      {(compact || !showSidebar) && (
        <div className="rounded-2xl border border-border bg-card/60 px-3 py-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted">Last Frag</div>
            <div className="numbers text-xs text-accent">{latestMarker?.clock ?? "Waiting"}</div>
          </div>
          <div className="mt-1 text-sm leading-5 text-text">
            {latestMarker?.label ?? "Kill markers will stay on the radar during live playback."}
          </div>
        </div>
      )}
      {!compact && showSidebar && (
      <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-3">
        <div className="rounded-2xl border border-border bg-card/60 px-3 py-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Last Frag</div>
          <div className="mt-1 font-display text-2xl text-text">{latestMarker?.clock ?? "Waiting"}</div>
          <div className="mt-2 text-sm leading-5 text-muted">
            {latestMarker?.label ?? "Kill markers appear here through the round playback."}
          </div>
        </div>
        <div className="min-h-0 rounded-2xl border border-border bg-card/60 p-3">
          <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted">
            <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-accent">T Frag</span>
            <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-2 py-0.5 text-sky-300">CT Frag</span>
          </div>
          <div className="scrollbar-thin h-full space-y-2 overflow-y-auto pr-1">
            {markers.length ? (
              [...markers].reverse().map((marker) => (
                <div key={`${marker.id}_line`} className="rounded-xl border border-border bg-surface/70 px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="numbers text-xs text-accent">{marker.clock}</div>
                    <div
                      className={classNames(
                        "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.16em]",
                        marker.victimSide === "CT" ? "bg-sky-500/10 text-sky-300" : "bg-accent/10 text-accent"
                      )}
                    >
                      {marker.victimSide === "CT" ? "CT down" : "T down"}
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-text">{marker.zone ?? marker.site ?? "unknown"}</div>
                </div>
              ))
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border px-4 text-center text-sm text-muted">
                No deaths yet on this round.
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

function RadarDeathMarker({ marker, victimSide, compact = false, expanded = false, imageFrame, viewBox }) {
  const victimTone =
    victimSide === "CT"
      ? "text-sky-300 drop-shadow-[0_0_10px_rgba(91,141,217,0.75)]"
      : "text-accent drop-shadow-[0_0_10px_rgba(245,166,35,0.75)]";
  const width = imageFrame?.width ?? 0;
  const height = imageFrame?.height ?? 0;
  if (!width || !height) {
    return null;
  }
  const normalizedX = clamp((marker.x - viewBox.left) / viewBox.width, 0.02, 0.98);
  const normalizedY = clamp((marker.y - viewBox.top) / viewBox.height, 0.02, 0.98);

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: imageFrame.left + normalizedX * width,
        top: imageFrame.top + normalizedY * height,
        transform: "translate(-50%, -50%)",
      }}
      title={marker.label}
    >
      <div
        className={classNames(
          "rounded-full border border-white/10 bg-black/45 backdrop-blur-sm",
          marker.recent ? "scale-110" : "opacity-80"
        )}
      >
        <X
          size={expanded ? (marker.recent ? 28 : 24) : compact ? 15 : marker.recent ? 20 : 17}
          strokeWidth={expanded ? 3.4 : compact ? 2.7 : 3.1}
          className={victimTone}
        />
      </div>
    </div>
  );
}

function RadarExpandedModal({ mapName, markers, latestMarker, sideLookup, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-md">
      <div className="panel flex h-[92vh] w-[min(1520px,96vw)] flex-col rounded-3xl p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-accent">Expanded Radar</div>
            <div className="font-display text-3xl text-text">{mapName}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-border bg-card/70 p-3 text-muted transition hover:border-accent/40 hover:text-text"
            aria-label="Close radar"
          >
            <X size={20} />
          </button>
        </div>
        <div className="min-h-0 flex-1">
          <RadarPanel
            mapName={mapName}
            markers={markers}
            latestMarker={latestMarker}
            sideLookup={sideLookup}
            expanded
          />
        </div>
      </div>
    </div>
  );
}

function ResultsView({ results, mobile = false }) {
  const { t } = useI18n();
  const [statsMode, setStatsMode] = useState("combined");
  const teamAPlayers = results.players.filter((player) => player.teamKey === "teamA");
  const teamBPlayers = results.players.filter((player) => player.teamKey === "teamB");
  return (
    <div className="space-y-6">
      <Panel title={t("series_results")} subtitle="Final scores, player leaders, map breakdowns, and highlight moments.">
        <div className={classNames("grid gap-6", mobile ? "grid-cols-1" : "grid-cols-[1fr_320px]")}>
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
      <div className={classNames("grid gap-6", mobile ? "grid-cols-1" : "grid-cols-[0.8fr_1.2fr]")}>
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
                <div className={classNames("mt-4 grid gap-3 text-sm", mobile ? "grid-cols-1" : "grid-cols-3")}>
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
          <StatsTable players={results.players} showTeam />
        ) : (
          <div className={classNames("grid gap-8", mobile ? "grid-cols-1" : "grid-cols-2")}>
            <div className="min-w-0">
              <div className="mb-3 font-display text-2xl text-text">{results.teamA.name}</div>
              <StatsTable players={teamAPlayers} />
            </div>
            <div className="min-w-0">
              <div className="mb-3 font-display text-2xl text-text">{results.teamB.name}</div>
              <StatsTable players={teamBPlayers} />
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

function StatsTable({ players, showTeam = false }) {
  const { t } = useI18n();
  const columns = showTeam
    ? ["22%", "8%", "13%", "9%", "9%", "10%", "7%", "10%", "6%", "6%"]
    : ["27%", "15%", "10%", "10%", "11%", "8%", "10%", "5%", "4%"];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed text-[13px]">
        <colgroup>
          {columns.map((width, index) => (
            <col key={index} style={{ width }} />
          ))}
        </colgroup>
        <thead className="text-left text-xs uppercase tracking-[0.2em] text-muted">
          <tr>
            <th className="px-3 pb-3">{t("player")}</th>
            {showTeam && <th className="px-3 pb-3">{t("team")}</th>}
            <th className="px-3 pb-3 text-right">K / D / A</th>
            <th className="px-3 pb-3 text-right">{t("rating")}</th>
            <th className="px-3 pb-3 text-right">ADR</th>
            <th className="px-3 pb-3 text-right">KAST%</th>
            <th className="px-3 pb-3 text-right">HS%</th>
            <th className="px-3 pb-3 text-right">Clutches</th>
            <th className="px-3 pb-3 text-right">Openings</th>
            <th className="px-3 pb-3 text-right">Best Round</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={`${player.teamKey}_${player.id}`} className="border-t border-border">
              <td className="truncate px-3 py-3 font-display text-xl text-text">{player.nickname}</td>
              {showTeam && <td className="px-3 py-3 text-muted">{player.teamTag}</td>}
              <td className="px-3 py-3 text-right numbers">
                {player.kills}/{player.deaths}/{player.assists}
              </td>
              <td className="px-3 py-3 text-right numbers" style={{ color: getRatingColor(player.rating) }}>
                {player.rating}
              </td>
              <td className="px-3 py-3 text-right numbers">{player.adr}</td>
              <td className="px-3 py-3 text-right numbers">{player.kastPercent}%</td>
              <td className="px-3 py-3 text-right numbers">{player.hsPercent}%</td>
              <td className="px-3 py-3 text-right numbers">
                {player.clutchesWon}/{player.clutchAttempts}
              </td>
              <td className="px-3 py-3 text-right numbers">{player.openingKills}</td>
              <td className="px-3 py-3 text-right numbers">{player.bestRoundKills}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HistoryView({ filter, onFilterChange, entries, onOpen, onClear, mobile = false }) {
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
              <div className={classNames("gap-4", mobile ? "space-y-3" : "flex items-center justify-between")}>
                <div>
                  <div className="font-display text-2xl text-text">{entry.teams}</div>
                  <div className="mt-1 text-sm text-muted">
                    {new Date(entry.date).toLocaleString()} · MVP {entry.mvp}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">
                    {entry.mapsPlayed}
                  </div>
                </div>
                <div className={classNames("numbers text-3xl text-accent", mobile && "text-left")}>{entry.score}</div>
              </div>
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
}
