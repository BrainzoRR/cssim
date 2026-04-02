export const STORAGE_KEY = "cs2sim_state_v1";

export const MAP_POOL = [
  "Mirage",
  "Overpass",
  "Anubis",
  "Inferno",
  "Nuke",
  "Dust",
  "Ancient",
];

export const REGIONS = ["EU", "NA", "CIS", "APAC", "BR", "MENA"];

export const ROLES = [
  "Entry Fragger",
  "AWPer",
  "Lurker",
  "Support",
  "IGL",
];

export const MATCH_FORMATS = ["BO1", "BO3", "BO5"];

export const SPEED_OPTIONS = [
  { id: "instant", label: "Instant", intervalMs: 0 },
  { id: "slow", label: "Slow", intervalMs: 2000 },
  { id: "live", label: "Live", intervalMs: 5000 },
];

export const MAP_CONFIGS = {
  Mirage: {
    baseT: 0.49,
    baseCT: 0.51,
    traits: ["AWP dominant mid", "B rush viable", "Utility-heavy CT setup"],
    awpWeight: 1.08,
    utilityWeight: 1.06,
    entryWeight: 1.02,
    lurkWeight: 1.0,
    gameSenseWeight: 1.0,
  },
  Inferno: {
    baseT: 0.47,
    baseCT: 0.53,
    traits: ["Tight corridors", "Banana control", "Utility choke points"],
    awpWeight: 1.0,
    utilityWeight: 1.12,
    entryWeight: 0.98,
    lurkWeight: 0.96,
    gameSenseWeight: 1.04,
  },
  Nuke: {
    baseT: 0.44,
    baseCT: 0.56,
    traits: ["CT sided", "Rotations", "Coach knowledge heavy"],
    awpWeight: 1.04,
    utilityWeight: 1.06,
    entryWeight: 0.94,
    lurkWeight: 0.96,
    gameSenseWeight: 1.1,
  },
  Overpass: {
    baseT: 0.48,
    baseCT: 0.52,
    traits: ["Long rotations", "Connector control", "Utility-heavy executes"],
    awpWeight: 1.08,
    utilityWeight: 1.08,
    entryWeight: 1.0,
    lurkWeight: 1.04,
    gameSenseWeight: 1.04,
  },
  Dust: {
    baseT: 0.5,
    baseCT: 0.5,
    traits: ["Long AWP duels", "Tunnels entry", "Open timings"],
    awpWeight: 1.12,
    utilityWeight: 0.98,
    entryWeight: 1.08,
    lurkWeight: 0.98,
    gameSenseWeight: 1.0,
  },
  Ancient: {
    baseT: 0.48,
    baseCT: 0.52,
    traits: ["Lurk-heavy", "Game sense premium", "Dense retakes"],
    awpWeight: 1.0,
    utilityWeight: 1.02,
    entryWeight: 1.0,
    lurkWeight: 1.12,
    gameSenseWeight: 1.08,
  },
  Anubis: {
    baseT: 0.5,
    baseCT: 0.5,
    traits: ["A-site executes", "Utility dump", "Fast mid pressure"],
    awpWeight: 0.98,
    utilityWeight: 1.12,
    entryWeight: 1.04,
    lurkWeight: 1.0,
    gameSenseWeight: 1.0,
  },
};

export const MAP_ZONES = {
  Mirage: {
    A: ["A ramp", "palace", "ticket", "jungle"],
    B: ["apartments", "bench", "market", "van"],
    Mid: ["top mid", "window", "connector", "catwalk"],
  },
  Inferno: {
    A: ["short", "library", "pit", "site"],
    B: ["banana", "coffins", "new box", "dark"],
    Mid: ["mid", "arch", "boiler", "lane"],
  },
  Nuke: {
    A: ["outside", "mini", "hut", "heaven"],
    B: ["ramp", "decon", "double doors", "site"],
    Mid: ["outside", "garage", "secret", "lobby"],
  },
  Overpass: {
    A: ["long", "bathrooms", "truck", "site"],
    B: ["monster", "short", "pillar", "site"],
    Mid: ["connector", "fountain", "party", "short"],
  },
  Dust: {
    A: ["long", "catwalk", "A site", "short"],
    B: ["tunnels", "window", "B site", "door"],
    Mid: ["mid", "xbox", "lower tunnels", "top mid"],
  },
  Ancient: {
    A: ["A main", "donut", "temple", "site"],
    B: ["cave", "lane", "back site", "ramp"],
    Mid: ["mid", "donut", "red room", "boost"],
  },
  Anubis: {
    A: ["A main", "heaven", "bridge", "site"],
    B: ["canal", "pillar", "site", "bridge"],
    Mid: ["mid", "connector", "water", "top mid"],
  },
};

const MAP_ROUTE_PRESETS = {
  Mirage: {
    A: {
      entry: ["A ramp", "palace"],
      hold: ["ticket", "jungle"],
      support: ["connector", "top mid"],
      retake: ["ticket", "jungle", "connector"],
      postPlant: ["A ramp", "palace", "jungle"],
    },
    B: {
      entry: ["apartments", "bench"],
      hold: ["market", "van"],
      support: ["catwalk", "window"],
      retake: ["market", "van", "catwalk"],
      postPlant: ["apartments", "bench", "van"],
    },
    Mid: { entry: ["top mid"], hold: ["window", "connector", "catwalk"], support: ["top mid"] },
    lurk: ["window", "connector", "apartments"],
  },
  Inferno: {
    A: {
      entry: ["lane", "boiler", "short"],
      hold: ["site", "pit", "library"],
      support: ["arch", "mid"],
      retake: ["library", "short", "pit", "site"],
      postPlant: ["pit", "short", "site", "library"],
    },
    B: {
      entry: ["banana"],
      hold: ["new box", "dark", "coffins"],
      support: ["arch", "mid"],
      retake: ["coffins", "dark", "banana"],
      postPlant: ["banana", "new box", "dark"],
    },
    Mid: { entry: ["mid"], hold: ["boiler", "arch"], support: ["banana", "short"] },
    lurk: ["boiler", "arch", "banana"],
  },
  Nuke: {
    A: {
      entry: ["lobby", "mini", "hut"],
      hold: ["heaven", "outside"],
      support: ["garage"],
      retake: ["mini", "hut", "heaven"],
      postPlant: ["outside", "hut", "mini"],
    },
    B: {
      entry: ["ramp", "decon", "double doors"],
      hold: ["site", "secret"],
      support: ["lobby"],
      retake: ["decon", "double doors", "secret"],
      postPlant: ["ramp", "site", "secret"],
    },
    Mid: { entry: ["outside", "garage"], hold: ["secret", "lobby"], support: ["mini"] },
    lurk: ["outside", "garage", "secret"],
  },
  Dust: {
    A: {
      entry: ["long", "catwalk", "short"],
      hold: ["A site"],
      support: ["top mid", "xbox"],
      retake: ["short", "catwalk", "A site"],
      postPlant: ["long", "catwalk", "A site"],
    },
    B: {
      entry: ["tunnels", "door"],
      hold: ["B site", "window"],
      support: ["lower tunnels"],
      retake: ["door", "window", "B site"],
      postPlant: ["tunnels", "window", "B site"],
    },
    Mid: { entry: ["top mid", "mid"], hold: ["xbox", "catwalk", "lower tunnels"], support: ["door"] },
    lurk: ["xbox", "lower tunnels", "catwalk"],
  },
  Overpass: {
    A: {
      entry: ["long", "bathrooms"],
      hold: ["truck", "site"],
      support: ["connector", "fountain"],
      retake: ["truck", "site", "bathrooms"],
      postPlant: ["long", "bathrooms", "site"],
    },
    B: {
      entry: ["monster", "short"],
      hold: ["pillar", "site"],
      support: ["connector"],
      retake: ["short", "pillar", "site"],
      postPlant: ["monster", "pillar", "site"],
    },
    Mid: { entry: ["party", "fountain"], hold: ["connector", "short"], support: ["bathrooms"] },
    lurk: ["connector", "party", "bathrooms"],
  },
  Ancient: {
    A: {
      entry: ["A main", "ramp", "donut"],
      hold: ["site", "temple"],
      support: ["mid"],
      retake: ["donut", "temple", "site"],
      postPlant: ["A main", "donut", "site"],
    },
    B: {
      entry: ["cave", "lane"],
      hold: ["back site", "ramp"],
      support: ["mid"],
      retake: ["ramp", "back site", "lane"],
      postPlant: ["cave", "lane", "back site"],
    },
    Mid: { entry: ["mid", "red room"], hold: ["boost", "donut"], support: ["A main"] },
    lurk: ["red room", "donut", "mid"],
  },
  Anubis: {
    A: {
      entry: ["A main", "bridge", "heaven"],
      hold: ["site"],
      support: ["connector", "top mid"],
      retake: ["bridge", "heaven", "site"],
      postPlant: ["A main", "bridge", "site"],
    },
    B: {
      entry: ["canal", "bridge", "pillar"],
      hold: ["site"],
      support: ["water"],
      retake: ["bridge", "pillar", "site"],
      postPlant: ["canal", "pillar", "site"],
    },
    Mid: { entry: ["top mid", "mid"], hold: ["connector", "water"], support: ["bridge"] },
    lurk: ["connector", "water", "bridge"],
  },
};

function uniqueZones(zones) {
  return [...new Set(zones.filter(Boolean))];
}

function oppositeSite(site) {
  return site === "A" ? "B" : "A";
}

function getZoneBuckets(mapName, site) {
  const zones = MAP_ZONES[mapName]?.[site] ?? [];
  if (site === "Mid") {
    return {
      entries: zones.slice(0, 2),
      pivots: zones.slice(2),
      all: zones,
    };
  }

  return {
    entries: zones.slice(0, 2),
    anchors: zones.slice(2),
    all: zones,
  };
}

function buildRoundZonePlan(mapName, strategy, plantSite) {
  const presets = MAP_ROUTE_PRESETS[mapName];
  if (presets) {
    const target = presets[plantSite];
    const opposite = presets[oppositeSite(plantSite)];
    const mid = presets.Mid;
    const fake = strategy.id === "fake" ? presets[strategy.site] : target;
    if (target && opposite && mid) {
      const targetRetake = uniqueZones(target.retake ?? [...target.hold, ...target.support]);
      const targetPostPlant = uniqueZones(target.postPlant ?? [...target.hold, ...target.support]);
      if (strategy.id === "split") {
        return {
          early: uniqueZones([...mid.entry, ...mid.hold, ...target.entry.slice(0, 1)]),
          utility: uniqueZones([...mid.hold, ...target.entry, ...target.support]),
          mid: uniqueZones([...mid.hold, ...target.support]),
          hit: uniqueZones([...target.entry, ...target.hold, ...target.support, ...mid.hold.slice(0, 1)]),
          retake: uniqueZones([...targetRetake, ...mid.hold]),
          postPlant: uniqueZones([...targetPostPlant, ...mid.hold.slice(0, 1)]),
          lurk: uniqueZones([...(presets.lurk ?? []), ...opposite.entry.slice(0, 1)]),
        };
      }

      if (strategy.id === "midControl") {
        return {
          early: uniqueZones([...mid.entry, ...mid.hold]),
          utility: uniqueZones([...mid.hold, ...target.entry.slice(0, 1)]),
          mid: uniqueZones([...mid.hold, ...mid.support]),
          hit: uniqueZones([...target.support, ...target.entry, ...target.hold]),
          retake: uniqueZones([...targetRetake, ...mid.hold.slice(0, 1)]),
          postPlant: targetPostPlant,
          lurk: uniqueZones([...(presets.lurk ?? []), ...opposite.entry.slice(0, 1)]),
        };
      }

      if (strategy.id === "fake") {
        return {
          early: uniqueZones([...fake.entry, ...mid.entry]),
          utility: uniqueZones([...fake.entry, ...fake.support, ...mid.hold]),
          mid: uniqueZones([...mid.hold, ...mid.support]),
          hit: uniqueZones([...target.entry, ...target.hold, ...target.support]),
          retake: uniqueZones([...targetRetake, ...mid.hold.slice(0, 1)]),
          postPlant: targetPostPlant,
          lurk: uniqueZones([...(presets.lurk ?? []), ...fake.entry.slice(0, 1)]),
        };
      }

      return {
        early: uniqueZones([...mid.entry, ...target.entry.slice(0, 1)]),
        utility: uniqueZones([...target.entry, ...target.support]),
        mid: uniqueZones([...mid.hold, ...target.support]),
        hit: uniqueZones([...target.entry, ...target.hold, ...target.support]),
        retake: uniqueZones([...targetRetake, ...mid.hold.slice(0, 1)]),
        postPlant: targetPostPlant,
        lurk: uniqueZones([...(presets.lurk ?? []), ...opposite.entry.slice(0, 1)]),
      };
    }
  }

  const target = getZoneBuckets(mapName, plantSite);
  const opposite = getZoneBuckets(mapName, oppositeSite(plantSite));
  const mid = getZoneBuckets(mapName, "Mid");
  const fakeSite = strategy.id === "fake" ? getZoneBuckets(mapName, strategy.site) : target;

  if (strategy.id === "split") {
    return {
      early: uniqueZones([...mid.entries, ...target.entries]),
      utility: uniqueZones([...mid.pivots, ...target.entries]),
      mid: uniqueZones([...mid.all, ...target.entries]),
      hit: uniqueZones([...target.entries, ...mid.pivots, ...target.anchors]),
      retake: uniqueZones([...target.anchors, ...mid.all]),
      postPlant: uniqueZones([...target.anchors, ...mid.pivots]),
      lurk: uniqueZones([...opposite.entries, ...mid.pivots]),
    };
  }

  if (strategy.id === "midControl") {
    return {
      early: uniqueZones([...mid.entries, ...mid.pivots]),
      utility: uniqueZones(mid.all),
      mid: uniqueZones(mid.all),
      hit: uniqueZones([...target.entries, ...target.anchors]),
      retake: uniqueZones([...target.anchors, ...mid.pivots]),
      postPlant: uniqueZones([...target.anchors, ...target.entries.slice(0, 1)]),
      lurk: uniqueZones([...mid.pivots, ...opposite.entries]),
    };
  }

  if (strategy.id === "fake") {
    return {
      early: uniqueZones([...fakeSite.entries, ...mid.entries]),
      utility: uniqueZones([...fakeSite.entries, ...mid.pivots]),
      mid: uniqueZones(mid.all),
      hit: uniqueZones([...target.entries, ...target.anchors]),
      retake: uniqueZones([...target.anchors, ...target.entries]),
      postPlant: uniqueZones([...target.anchors, ...target.entries.slice(0, 1)]),
      lurk: uniqueZones([...mid.pivots, ...fakeSite.entries]),
    };
  }

  return {
    early: uniqueZones([...mid.entries, ...target.entries.slice(0, 1)]),
    utility: uniqueZones([...target.entries, ...target.anchors.slice(0, 1)]),
    mid: uniqueZones([...mid.pivots, ...target.entries]),
    hit: uniqueZones([...target.entries, ...target.anchors]),
    retake: uniqueZones([...target.anchors, ...target.entries.slice(1), ...mid.pivots]),
    postPlant: uniqueZones([...target.anchors, ...target.entries.slice(0, 1)]),
    lurk: uniqueZones([...mid.pivots, ...opposite.entries.slice(0, 1)]),
  };
}

const LOSS_BONUSES = [1400, 1900, 2400, 2900, 3400];

const WIN_PAYOUTS = {
  t_explode: 3500,
  t_elimination: 3250,
  ct_elimination: 3250,
  ct_defuse: 3500,
  ct_time: 3250,
};

const ARMOR_COSTS = {
  kevlar: 650,
  helmet: 1000,
};

const UTILITY_COSTS = {
  he: 300,
  smoke: 300,
  flash: 200,
  molotov: 400,
  incendiary: 600,
  decoy: 50,
  kit: 400,
};

const MAP_ORDER_WEIGHTS = [1, 0.92, 0.84, 0.74, 0.62, 0.5, 0.38];

let uidCounter = 1;

export function uid(prefix = "id") {
  uidCounter += 1;
  return `${prefix}_${uidCounter}`;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function average(values) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

export function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function compositeRating(player) {
  return round(
    player.aim * 0.25 +
      player.gameSense * 0.22 +
      player.clutch * 0.15 +
      player.utility * 0.13 +
      player.entry * 0.15 +
      player.consistency * 0.1,
    0
  );
}

export function getCompositeColor(value) {
  if (value >= 75) {
    return "green";
  }

  if (value >= 55) {
    return "yellow";
  }

  return "red";
}

export function getRatingColor(value) {
  if (value >= 1.2) {
    return "#f5a623";
  }

  if (value >= 1) {
    return "#4ade80";
  }

  if (value >= 0.8) {
    return "#f5f5f5";
  }

  return "#e63950";
}

export function formatMoney(value) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export function formatElapsed(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.max(0, Math.floor(seconds % 60));
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function rand(min = 0, max = 1) {
  return min + Math.random() * (max - min);
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function weightedPick(items, weightFn) {
  const weighted = items
    .map((item) => ({ item, weight: Math.max(0.01, weightFn(item)) }))
    .filter((entry) => entry.weight > 0);

  const total = sum(weighted.map((entry) => entry.weight));
  let roll = Math.random() * total;

  for (const entry of weighted) {
    roll -= entry.weight;

    if (roll <= 0) {
      return entry.item;
    }
  }

  return weighted[weighted.length - 1]?.item ?? items[0];
}

const WEAPON_CATALOG = {
  GLOCK: {
    id: "GLOCK",
    name: "Glock-18",
    label: "GLOCK",
    type: "pistol",
    cost: 0,
    killReward: 300,
    tier: 1,
    quality: 0.62,
  },
  USP: {
    id: "USP",
    name: "USP-S",
    label: "USP",
    type: "pistol",
    cost: 0,
    killReward: 300,
    tier: 1,
    quality: 0.62,
  },
  P250: {
    id: "P250",
    name: "P250",
    label: "P250",
    type: "pistol",
    cost: 300,
    killReward: 300,
    tier: 2,
    quality: 0.68,
  },
  TEC9: {
    id: "TEC9",
    name: "Tec-9",
    label: "TEC-9",
    type: "pistol",
    cost: 500,
    killReward: 300,
    tier: 2,
    quality: 0.72,
  },
  FIVESEVEN: {
    id: "FIVESEVEN",
    name: "Five-SeveN",
    label: "57",
    type: "pistol",
    cost: 500,
    killReward: 300,
    tier: 2,
    quality: 0.72,
  },
  DEAGLE: {
    id: "DEAGLE",
    name: "Desert Eagle",
    label: "DEAGLE",
    type: "pistol",
    cost: 700,
    killReward: 300,
    tier: 3,
    quality: 0.78,
  },
  MAC10: {
    id: "MAC10",
    name: "MAC-10",
    label: "MAC-10",
    type: "smg",
    cost: 1050,
    killReward: 600,
    tier: 4,
    quality: 0.82,
  },
  MP9: {
    id: "MP9",
    name: "MP9",
    label: "MP9",
    type: "smg",
    cost: 1250,
    killReward: 600,
    tier: 4,
    quality: 0.84,
  },
  UMP45: {
    id: "UMP45",
    name: "UMP-45",
    label: "UMP",
    type: "smg",
    cost: 1200,
    killReward: 600,
    tier: 4,
    quality: 0.8,
  },
  MP5: {
    id: "MP5",
    name: "MP5-SD",
    label: "MP5",
    type: "smg",
    cost: 1500,
    killReward: 600,
    tier: 4,
    quality: 0.8,
  },
  BIZON: {
    id: "BIZON",
    name: "PP-Bizon",
    label: "BIZON",
    type: "smg",
    cost: 1400,
    killReward: 600,
    tier: 4,
    quality: 0.76,
  },
  GALIL: {
    id: "GALIL",
    name: "Galil AR",
    label: "GALIL",
    type: "rifle",
    cost: 1800,
    killReward: 300,
    tier: 5,
    quality: 0.92,
  },
  FAMAS: {
    id: "FAMAS",
    name: "FAMAS",
    label: "FAMAS",
    type: "rifle",
    cost: 2050,
    killReward: 300,
    tier: 5,
    quality: 0.92,
  },
  AK47: {
    id: "AK47",
    name: "AK-47",
    label: "AK",
    type: "rifle",
    cost: 2700,
    killReward: 300,
    tier: 6,
    quality: 1.0,
  },
  M4: {
    id: "M4",
    name: "M4A4 / M4A1-S",
    label: "M4",
    type: "rifle",
    cost: 3100,
    killReward: 300,
    tier: 6,
    quality: 1.0,
  },
  SG553: {
    id: "SG553",
    name: "SG 553",
    label: "SG553",
    type: "rifle",
    cost: 3000,
    killReward: 300,
    tier: 6,
    quality: 1.02,
  },
  AUG: {
    id: "AUG",
    name: "AUG",
    label: "AUG",
    type: "rifle",
    cost: 3300,
    killReward: 300,
    tier: 6,
    quality: 1.03,
  },
  AWP: {
    id: "AWP",
    name: "AWP",
    label: "AWP",
    type: "awp",
    cost: 4750,
    killReward: 100,
    tier: 7,
    quality: 1.16,
  },
};

const ROLE_ORDER = {
  "Entry Fragger": 0,
  AWPer: 1,
  Lurker: 2,
  Support: 3,
  IGL: 4,
};

function sideDefaultWeapon(side) {
  return side === "CT" ? WEAPON_CATALOG.USP : WEAPON_CATALOG.GLOCK;
}

function inventoryValue(inventory) {
  const utilityCost = inventory.utilityItems.reduce(
    (total, item) => total + (UTILITY_COSTS[item] ?? 0),
    0
  );
  const armorCost = inventory.helmet
    ? ARMOR_COSTS.helmet
    : inventory.armor
      ? ARMOR_COSTS.kevlar
      : 0;

  return (
    (WEAPON_CATALOG[inventory.weaponId]?.cost ?? 0) +
    armorCost +
    utilityCost +
    (inventory.defuseKit ? UTILITY_COSTS.kit : 0)
  );
}

function createInventory(side) {
  const weapon = sideDefaultWeapon(side);

  return {
    weaponId: weapon.id,
    armor: false,
    helmet: false,
    defuseKit: false,
    utilityItems: [],
    weaponLabel: weapon.label,
    weaponType: weapon.type,
    value: inventoryValue({
      weaponId: weapon.id,
      armor: false,
      helmet: false,
      defuseKit: false,
      utilityItems: [],
    }),
  };
}

export function createBlankCoach() {
  return {
    id: uid("coach"),
    name: "",
    nickname: "",
    tacticalRating: 70,
    motivationRating: 70,
    mapKnowledge: 70,
    preferredMaps: [...MAP_POOL],
  };
}

function normalizeMapName(map) {
  if (map === "Dust2") {
    return "Dust";
  }

  if (map === "Vertigo") {
    return "Overpass";
  }

  return map;
}

export function createBlankPlayer(index = 1) {
  return {
    id: uid("player"),
    name: "",
    nickname: `Player${index}`,
    role: ROLES[index % ROLES.length],
    isCaptain: index === 1,
    age: 22,
    nationality: "Unknown",
    aim: 70,
    gameSense: 70,
    clutch: 70,
    utility: 70,
    entry: 70,
    consistency: 70,
  };
}

export function createBlankTeam() {
  const players = Array.from({ length: 5 }, (_, index) =>
    createBlankPlayer(index + 1)
  );

  return normalizeTeam({
    id: uid("team"),
    name: "",
    tag: "NEW",
    logo: "🎯",
    region: "EU",
    coach: createBlankCoach(),
    players,
    captainId: players[0].id,
    preferredMaps: [...MAP_POOL],
  });
}

export function deriveBannedMaps(team) {
  return MAP_POOL.filter((map) => !(team.preferredMaps ?? []).includes(map));
}

export function normalizeTeam(teamInput) {
  const team = deepClone(teamInput);
  team.id ??= uid("team");
  team.name ??= "";
  team.tag = (team.tag ?? "TEAM").slice(0, 5).toUpperCase();
  team.logo ??= "🎯";
  team.region = REGIONS.includes(team.region) ? team.region : "EU";
  team.coach = {
    ...createBlankCoach(),
    ...team.coach,
    id: team.coach?.id ?? uid("coach"),
    preferredMaps:
      team.coach?.preferredMaps
        ?.map(normalizeMapName)
        ?.filter((map) => MAP_POOL.includes(map))
        ?.slice(0, 7) ??
      [...MAP_POOL],
  };

  team.players = (team.players ?? [])
    .map((player, index) => ({
      ...createBlankPlayer(index + 1),
      ...player,
      id: player.id ?? uid("player"),
      role: ROLES.includes(player.role) ? player.role : ROLES[index % ROLES.length],
      age: clamp(Number(player.age ?? 22), 16, 45),
      aim: clamp(Number(player.aim ?? 70), 0, 100),
      gameSense: clamp(Number(player.gameSense ?? 70), 0, 100),
      clutch: clamp(Number(player.clutch ?? 70), 0, 100),
      utility: clamp(Number(player.utility ?? 70), 0, 100),
      entry: clamp(Number(player.entry ?? 70), 0, 100),
      consistency: clamp(Number(player.consistency ?? 70), 0, 100),
    }))
    .slice(0, 5);

  if (!team.players.length) {
    team.players = Array.from({ length: 5 }, (_, index) =>
      createBlankPlayer(index + 1)
    );
  }

  let captainId =
    team.captainId ??
    team.players.find((player) => player.isCaptain)?.id ??
    team.players[0]?.id;

  team.players = team.players.map((player) => ({
    ...player,
    isCaptain: player.id === captainId,
  }));

  if (!team.players.some((player) => player.isCaptain) && team.players[0]) {
    captainId = team.players[0].id;
    team.players[0].isCaptain = true;
  }

  team.captainId = captainId;
  team.preferredMaps =
    team.preferredMaps
      ?.map(normalizeMapName)
      ?.filter((map) => MAP_POOL.includes(map))
      ?.slice(0, 7) ??
    [...MAP_POOL];
  team.bannedMaps = deriveBannedMaps(team);
  return team;
}

function makeSeedPlayer(nickname, role, stats, extras = {}) {
  return {
    id: uid("player"),
    name: extras.name ?? nickname,
    nickname,
    role,
    isCaptain: extras.isCaptain ?? false,
    age: extras.age ?? 23,
    nationality: extras.nationality ?? "Unknown",
    ...stats,
  };
}

function createSeedTeams() {
  return [
    normalizeTeam({
      id: uid("team"),
      name: "NaVi",
      tag: "NAVI",
      logo: "⚡",
      region: "CIS",
      coach: {
        id: uid("coach"),
        name: "Andriy Horodenskyi",
        nickname: "B1ad3",
        tacticalRating: 95,
        motivationRating: 88,
        mapKnowledge: 90,
        preferredMaps: [
          "Nuke",
          "Inferno",
          "Mirage",
          "Vertigo",
          "Ancient",
          "Anubis",
          "Dust2",
        ],
      },
      preferredMaps: [
        "Nuke",
        "Inferno",
        "Mirage",
        "Vertigo",
        "Ancient",
        "Anubis",
        "Dust2",
      ],
      players: [
        makeSeedPlayer(
          "s1mple",
          "AWPer",
          {
            aim: 99,
            gameSense: 97,
            clutch: 98,
            utility: 75,
            entry: 90,
            consistency: 96,
          },
          { isCaptain: true, nationality: "Ukraine", age: 26 }
        ),
        makeSeedPlayer(
          "electronic",
          "Entry Fragger",
          {
            aim: 92,
            gameSense: 88,
            clutch: 84,
            utility: 72,
            entry: 95,
            consistency: 90,
          },
          { nationality: "Russia", age: 25 }
        ),
        makeSeedPlayer(
          "b1t",
          "Entry Fragger",
          {
            aim: 89,
            gameSense: 85,
            clutch: 80,
            utility: 70,
            entry: 92,
            consistency: 87,
          },
          { nationality: "Ukraine", age: 21 }
        ),
        makeSeedPlayer(
          "Perfecto",
          "Support",
          {
            aim: 80,
            gameSense: 88,
            clutch: 76,
            utility: 94,
            entry: 70,
            consistency: 88,
          },
          { nationality: "Russia", age: 24 }
        ),
        makeSeedPlayer(
          "npl",
          "Lurker",
          {
            aim: 82,
            gameSense: 87,
            clutch: 85,
            utility: 78,
            entry: 75,
            consistency: 84,
          },
          { nationality: "Ukraine", age: 20 }
        ),
      ],
    }),
    normalizeTeam({
      id: uid("team"),
      name: "G2",
      tag: "G2",
      logo: "🗡️",
      region: "EU",
      coach: {
        id: uid("coach"),
        name: "Rémy Quoniam",
        nickname: "maLeK",
        tacticalRating: 85,
        motivationRating: 90,
        mapKnowledge: 87,
        preferredMaps: [
          "Mirage",
          "Anubis",
          "Ancient",
          "Inferno",
          "Nuke",
          "Vertigo",
          "Dust2",
        ],
      },
      preferredMaps: [
        "Mirage",
        "Anubis",
        "Ancient",
        "Inferno",
        "Nuke",
        "Vertigo",
        "Dust2",
      ],
      players: [
        makeSeedPlayer(
          "NiKo",
          "Entry Fragger",
          {
            aim: 98,
            gameSense: 93,
            clutch: 91,
            utility: 70,
            entry: 97,
            consistency: 94,
          },
          { isCaptain: true, nationality: "Bosnia and Herzegovina", age: 27 }
        ),
        makeSeedPlayer(
          "ZywOo",
          "AWPer",
          {
            aim: 99,
            gameSense: 96,
            clutch: 95,
            utility: 73,
            entry: 85,
            consistency: 97,
          },
          { nationality: "France", age: 24 }
        ),
        makeSeedPlayer(
          "huNter-",
          "Lurker",
          {
            aim: 90,
            gameSense: 86,
            clutch: 84,
            utility: 68,
            entry: 88,
            consistency: 88,
          },
          { nationality: "Bosnia and Herzegovina", age: 28 }
        ),
        makeSeedPlayer(
          "nexa",
          "IGL",
          {
            aim: 78,
            gameSense: 94,
            clutch: 80,
            utility: 85,
            entry: 72,
            consistency: 89,
          },
          { nationality: "Serbia", age: 27 }
        ),
        makeSeedPlayer(
          "m0NESY",
          "Support",
          {
            aim: 85,
            gameSense: 82,
            clutch: 78,
            utility: 88,
            entry: 80,
            consistency: 85,
          },
          { nationality: "Russia", age: 19 }
        ),
      ],
    }),
    normalizeTeam({
      id: uid("team"),
      name: "FaZe",
      tag: "FAZE",
      logo: "🔥",
      region: "EU",
      coach: {
        id: uid("coach"),
        name: "Danny Sørensen",
        nickname: "NEO",
        tacticalRating: 88,
        motivationRating: 85,
        mapKnowledge: 86,
        preferredMaps: [
          "Mirage",
          "Dust2",
          "Inferno",
          "Ancient",
          "Nuke",
          "Vertigo",
          "Anubis",
        ],
      },
      preferredMaps: [
        "Mirage",
        "Dust2",
        "Inferno",
        "Ancient",
        "Nuke",
        "Vertigo",
        "Anubis",
      ],
      players: [
        makeSeedPlayer(
          "karrigan",
          "IGL",
          {
            aim: 82,
            gameSense: 97,
            clutch: 85,
            utility: 88,
            entry: 75,
            consistency: 91,
          },
          { isCaptain: true, nationality: "Denmark", age: 34 }
        ),
        makeSeedPlayer(
          "rain",
          "Entry Fragger",
          {
            aim: 91,
            gameSense: 87,
            clutch: 86,
            utility: 72,
            entry: 93,
            consistency: 89,
          },
          { nationality: "Norway", age: 30 }
        ),
        makeSeedPlayer(
          "broky",
          "AWPer",
          {
            aim: 93,
            gameSense: 90,
            clutch: 88,
            utility: 74,
            entry: 82,
            consistency: 90,
          },
          { nationality: "Latvia", age: 23 }
        ),
        makeSeedPlayer(
          "ropz",
          "Lurker",
          {
            aim: 90,
            gameSense: 92,
            clutch: 90,
            utility: 76,
            entry: 83,
            consistency: 95,
          },
          { nationality: "Estonia", age: 25 }
        ),
        makeSeedPlayer(
          "Twistzz",
          "Entry Fragger",
          {
            aim: 92,
            gameSense: 85,
            clutch: 83,
            utility: 73,
            entry: 94,
            consistency: 88,
          },
          { nationality: "Canada", age: 25 }
        ),
      ],
    }),
    normalizeTeam({
      id: uid("team"),
      name: "Virtus.pro",
      tag: "VP",
      logo: "🛡️",
      region: "CIS",
      coach: {
        id: uid("coach"),
        name: "Sergey Bezhanov",
        nickname: "lmbt",
        tacticalRating: 82,
        motivationRating: 80,
        mapKnowledge: 83,
        preferredMaps: [
          "Inferno",
          "Nuke",
          "Dust2",
          "Mirage",
          "Vertigo",
          "Ancient",
          "Anubis",
        ],
      },
      preferredMaps: [
        "Inferno",
        "Nuke",
        "Dust2",
        "Mirage",
        "Vertigo",
        "Ancient",
        "Anubis",
      ],
      players: [
        makeSeedPlayer(
          "Buster",
          "Entry Fragger",
          {
            aim: 89,
            gameSense: 84,
            clutch: 82,
            utility: 68,
            entry: 91,
            consistency: 86,
          },
          { isCaptain: true, nationality: "Kazakhstan", age: 24 }
        ),
        makeSeedPlayer(
          "Jame",
          "AWPer",
          {
            aim: 90,
            gameSense: 91,
            clutch: 87,
            utility: 72,
            entry: 78,
            consistency: 92,
          },
          { nationality: "Russia", age: 26 }
        ),
        makeSeedPlayer(
          "fame",
          "Support",
          {
            aim: 83,
            gameSense: 86,
            clutch: 79,
            utility: 91,
            entry: 74,
            consistency: 87,
          },
          { nationality: "Russia", age: 21 }
        ),
        makeSeedPlayer(
          "qikert",
          "Entry Fragger",
          {
            aim: 87,
            gameSense: 82,
            clutch: 80,
            utility: 70,
            entry: 89,
            consistency: 84,
          },
          { nationality: "Kazakhstan", age: 25 }
        ),
        makeSeedPlayer(
          "YEKINDAR",
          "Entry Fragger",
          {
            aim: 88,
            gameSense: 83,
            clutch: 85,
            utility: 71,
            entry: 95,
            consistency: 80,
          },
          { nationality: "Latvia", age: 24 }
        ),
      ],
    }),
  ];
}

export function createInitialAppData() {
  return {
    version: "1.0",
    teams: createCurrentSeedTeams(),
    matchHistory: [],
  };
}

function createCurrentSeedTeams() {
  return [
    normalizeTeam({
      id: uid("team"),
      name: "Vitality",
      tag: "VIT",
      logo: "🐝",
      region: "EU",
      coach: {
        id: uid("coach"),
        name: "XTQZZZ",
        nickname: "XTQZZZ",
        tacticalRating: 94,
        motivationRating: 92,
        mapKnowledge: 93,
        preferredMaps: ["Nuke", "Inferno", "Mirage", "Anubis", "Dust", "Ancient", "Overpass"],
      },
      preferredMaps: ["Nuke", "Inferno", "Mirage", "Anubis", "Dust", "Ancient", "Overpass"],
      players: [
        makeSeedPlayer("ZywOo", "AWPer", { aim: 99, gameSense: 97, clutch: 96, utility: 78, entry: 87, consistency: 97 }, { nationality: "France", age: 25 }),
        makeSeedPlayer("ropz", "Lurker", { aim: 95, gameSense: 95, clutch: 93, utility: 78, entry: 82, consistency: 96 }, { nationality: "Estonia", age: 26 }),
        makeSeedPlayer("flameZ", "Entry Fragger", { aim: 92, gameSense: 88, clutch: 84, utility: 74, entry: 95, consistency: 89 }, { nationality: "Israel", age: 23 }),
        makeSeedPlayer("mezii", "Support", { aim: 84, gameSense: 89, clutch: 78, utility: 91, entry: 74, consistency: 86 }, { nationality: "United Kingdom", age: 27 }),
        makeSeedPlayer("apEX", "IGL", { aim: 80, gameSense: 95, clutch: 84, utility: 88, entry: 79, consistency: 88 }, { isCaptain: true, nationality: "France", age: 33 }),
      ],
    }),
    normalizeTeam({
      id: uid("team"),
      name: "FURIA",
      tag: "FURIA",
      logo: "🐆",
      region: "BR",
      coach: {
        id: uid("coach"),
        name: "sidde",
        nickname: "sidde",
        tacticalRating: 88,
        motivationRating: 86,
        mapKnowledge: 87,
        preferredMaps: ["Anubis", "Dust", "Mirage", "Nuke", "Inferno", "Ancient", "Overpass"],
      },
      preferredMaps: ["Anubis", "Dust", "Mirage", "Nuke", "Inferno", "Ancient", "Overpass"],
      players: [
        makeSeedPlayer("FalleN", "IGL", { aim: 84, gameSense: 96, clutch: 88, utility: 86, entry: 76, consistency: 89 }, { isCaptain: true, nationality: "Brazil", age: 35 }),
        makeSeedPlayer("molodoy", "AWPer", { aim: 90, gameSense: 84, clutch: 80, utility: 70, entry: 78, consistency: 83 }, { nationality: "Kazakhstan", age: 20 }),
        makeSeedPlayer("KSCERATO", "Lurker", { aim: 94, gameSense: 92, clutch: 90, utility: 76, entry: 82, consistency: 94 }, { nationality: "Brazil", age: 26 }),
        makeSeedPlayer("yuurih", "Support", { aim: 90, gameSense: 90, clutch: 84, utility: 89, entry: 80, consistency: 92 }, { nationality: "Brazil", age: 26 }),
        makeSeedPlayer("YEKINDAR", "Entry Fragger", { aim: 92, gameSense: 84, clutch: 83, utility: 71, entry: 97, consistency: 82 }, { nationality: "Latvia", age: 27 }),
      ],
    }),
    normalizeTeam({
      id: uid("team"),
      name: "MOUZ",
      tag: "MOUZ",
      logo: "🐭",
      region: "EU",
      coach: {
        id: uid("coach"),
        name: "sycrone",
        nickname: "sycrone",
        tacticalRating: 90,
        motivationRating: 88,
        mapKnowledge: 89,
        preferredMaps: ["Mirage", "Nuke", "Dust", "Inferno", "Ancient", "Anubis", "Overpass"],
      },
      preferredMaps: ["Mirage", "Nuke", "Dust", "Inferno", "Ancient", "Anubis", "Overpass"],
      players: [
        makeSeedPlayer("Brollan", "IGL", { aim: 88, gameSense: 92, clutch: 84, utility: 82, entry: 88, consistency: 88 }, { isCaptain: true, nationality: "Sweden", age: 23 }),
        makeSeedPlayer("torzsi", "AWPer", { aim: 92, gameSense: 88, clutch: 83, utility: 70, entry: 79, consistency: 90 }, { nationality: "Hungary", age: 24 }),
        makeSeedPlayer("xertioN", "Entry Fragger", { aim: 91, gameSense: 86, clutch: 82, utility: 73, entry: 95, consistency: 86 }, { nationality: "Israel", age: 21 }),
        makeSeedPlayer("Jimpphat", "Lurker", { aim: 89, gameSense: 90, clutch: 85, utility: 77, entry: 81, consistency: 91 }, { nationality: "Finland", age: 19 }),
        makeSeedPlayer("Spinx", "Support", { aim: 90, gameSense: 91, clutch: 86, utility: 88, entry: 81, consistency: 90 }, { nationality: "Israel", age: 25 }),
      ],
    }),
    normalizeTeam({
      id: uid("team"),
      name: "Falcons",
      tag: "FLCN",
      logo: "🦅",
      region: "MENA",
      coach: {
        id: uid("coach"),
        name: "zonic",
        nickname: "zonic",
        tacticalRating: 94,
        motivationRating: 91,
        mapKnowledge: 92,
        preferredMaps: ["Mirage", "Dust", "Nuke", "Inferno", "Ancient", "Anubis", "Overpass"],
      },
      preferredMaps: ["Mirage", "Dust", "Nuke", "Inferno", "Ancient", "Anubis", "Overpass"],
      players: [
        makeSeedPlayer("kyxsan", "IGL", { aim: 82, gameSense: 94, clutch: 84, utility: 88, entry: 76, consistency: 88 }, { isCaptain: true, nationality: "North Macedonia", age: 25 }),
        makeSeedPlayer("NiKo", "Entry Fragger", { aim: 98, gameSense: 95, clutch: 93, utility: 74, entry: 98, consistency: 95 }, { nationality: "Bosnia and Herzegovina", age: 29 }),
        makeSeedPlayer("m0NESY", "AWPer", { aim: 98, gameSense: 92, clutch: 89, utility: 75, entry: 88, consistency: 95 }, { nationality: "Russia", age: 20 }),
        makeSeedPlayer("TeSeS", "Entry Fragger", { aim: 89, gameSense: 86, clutch: 82, utility: 74, entry: 90, consistency: 87 }, { nationality: "Denmark", age: 25 }),
        makeSeedPlayer("kyousuke", "Lurker", { aim: 92, gameSense: 86, clutch: 80, utility: 72, entry: 91, consistency: 82 }, { nationality: "Russia", age: 18 }),
      ],
    }),
  ];
}

function preferenceWeight(list, map) {
  const index = list.indexOf(map);
  if (index === -1) {
    return 0.12;
  }

  return MAP_ORDER_WEIGHTS[index] ?? 0.28;
}

export function getMapPriority(team, map) {
  const captainWeight = preferenceWeight(team.preferredMaps ?? [], map);
  const coachWeight = preferenceWeight(team.coach?.preferredMaps ?? [], map);
  return clamp(captainWeight * 0.58 + coachWeight * 0.42, 0.08, 1);
}

export function getMapModifier(team, map) {
  const captainPrefers = (team.preferredMaps ?? []).includes(map);
  const coachPrefers = (team.coach?.preferredMaps ?? []).includes(map);
  return (
    (captainPrefers ? 1.12 : 0.88) *
    (coachPrefers ? 1.08 : 0.94) *
    (team.coach.mapKnowledge / 100 * 0.1 + 0.9)
  );
}

export function getTeamStrength(team) {
  const playerAverage = average(team.players.map((player) => compositeRating(player)));
  const coachAverage =
    team.coach.tacticalRating * 0.45 +
    team.coach.motivationRating * 0.2 +
    team.coach.mapKnowledge * 0.35;
  return round(playerAverage * 0.82 + coachAverage * 0.18, 2);
}

function buildMapOption(team, map) {
  return {
    map,
    score: getMapPriority(team, map) * getMapModifier(team, map) * rand(0.95, 1.05),
  };
}

function mapStrengthScore(team, map) {
  return getMapPriority(team, map) * getMapModifier(team, map);
}

function mapRankIndex(preferredMaps, map) {
  const index = (preferredMaps ?? []).indexOf(map);
  return index === -1 ? MAP_POOL.length + 1 : index;
}

function blendedMapRank(team, map) {
  return (
    mapRankIndex(team.preferredMaps ?? [], map) * 0.58 +
    mapRankIndex(team.coach?.preferredMaps ?? [], map) * 0.42
  );
}

function buildVetoMapOption(team, opponent, map, action, stepNumber) {
  const ownStrength = mapStrengthScore(team, map);
  const opponentStrength = mapStrengthScore(opponent, map);
  const matchupEdge = ownStrength - opponentStrength;
  const ownPriority = getMapPriority(team, map);
  const ownRank = blendedMapRank(team, map);
  const opponentRank = blendedMapRank(opponent, map);
  const volatility = rand(-0.14, 0.14);
  const lateStepBonus = stepNumber >= 4 ? 0.03 : 0;

  if (action === "pick") {
    let score =
      ownStrength * 1.2 +
      ownPriority * 0.6 +
      matchupEdge * 0.42 +
      volatility;

    if (ownRank <= 2.2) {
      score += 0.16;
    } else if (ownRank >= 4.8) {
      score -= 0.18;
    }

    if (opponentRank <= 2.2) {
      score -= 0.08;
    } else if (opponentRank >= 4.8) {
      score += 0.06;
    }

    score += lateStepBonus;

    return { map, score };
  }

  let riskScore =
    (1.22 - ownStrength) * 0.9 +
    opponentStrength * 0.58 -
    matchupEdge * 0.24 +
    volatility;

  if (ownRank >= 4.8) {
    riskScore += 0.18;
  } else if (ownRank <= 2.2) {
    riskScore -= 0.12;
  }

  if (opponentRank <= 2.2) {
    riskScore += 0.14;
  }

  riskScore += lateStepBonus * 0.75;

  return { map, score: riskScore };
}

function chooseVetoMap(team, opponent, availableMaps, action, stepNumber) {
  const options = availableMaps
    .map((map) => buildVetoMapOption(team, opponent, map, action, stepNumber))
    .sort((left, right) => right.score - left.score);

  const shortlistSize = Math.min(options.length, options.length >= 5 ? 4 : 3);
  const shortlist = options.slice(0, shortlistSize);
  const bestScore = shortlist[0]?.score ?? 0;
  const temperature = action === "pick" ? 0.12 : 0.14;

  return (
    weightedPick(shortlist, (option) =>
      Math.max(0.05, Math.exp((option.score - bestScore) / temperature))
    )?.map ?? pick(availableMaps)
  );
}

export function simulateVeto(teamAInput, teamBInput, format) {
  const teamA = normalizeTeam(teamAInput);
  const teamB = normalizeTeam(teamBInput);
  const availableMaps = [...MAP_POOL];
  const steps = [];
  let stepNumber = 0;

  const ban = (teamKey, team) => {
    stepNumber += 1;
    const opponent = teamKey === "teamA" ? teamB : teamA;
    const map = chooseVetoMap(team, opponent, availableMaps, "ban", stepNumber);
    availableMaps.splice(availableMaps.indexOf(map), 1);
    steps.push({
      id: uid("veto"),
      action: "ban",
      teamKey,
      teamId: team.id,
      teamName: team.name,
      teamTag: team.tag,
      map,
    });
  };

  const pickMap = (teamKey, team) => {
    stepNumber += 1;
    const opponent = teamKey === "teamA" ? teamB : teamA;
    const map = chooseVetoMap(team, opponent, availableMaps, "pick", stepNumber);
    availableMaps.splice(availableMaps.indexOf(map), 1);
    steps.push({
      id: uid("veto"),
      action: "pick",
      teamKey,
      teamId: team.id,
      teamName: team.name,
      teamTag: team.tag,
      map,
    });
  };

  if (format === "BO1") {
    ban("teamA", teamA);
    ban("teamB", teamB);
    ban("teamA", teamA);
    ban("teamB", teamB);
    ban("teamA", teamA);
    ban("teamB", teamB);
  } else if (format === "BO3") {
    ban("teamA", teamA);
    ban("teamB", teamB);
    ban("teamA", teamA);
    ban("teamB", teamB);
    pickMap("teamA", teamA);
    pickMap("teamB", teamB);
  } else {
    ban("teamA", teamA);
    ban("teamB", teamB);
    pickMap("teamA", teamA);
    pickMap("teamB", teamB);
    pickMap("teamA", teamA);
    pickMap("teamB", teamB);
  }

  steps.push({
    id: uid("veto"),
    action: "decider",
    teamKey: null,
    teamId: null,
    teamName: "Decider",
    teamTag: "--",
    map: availableMaps[0],
  });

  const maps = steps
    .filter((step) => step.action === "pick" || step.action === "decider")
    .map((step, index) => ({
      id: uid("seriesmap"),
      order: index + 1,
      name: step.map,
      pickedBy: step.action === "pick" ? step.teamKey : "decider",
      pickedByTeamId: step.teamId,
      isDecider: step.action === "decider",
    }));

  return { steps, maps };
}

function createMatchPlayerState(player, side) {
  return {
    ...deepClone(player),
    money: 800,
    hp: 100,
    alive: true,
    inventory: createInventory(side),
    roundLoadout: createInventory(side),
    roundRewards: 0,
    stats: {
      kills: 0,
      deaths: 0,
      assists: 0,
      damage: 0,
      headshots: 0,
      openingKills: 0,
      entriesWon: 0,
      clutchesWon: 0,
      clutchAttempts: 0,
      flashAssists: 0,
      roundsPlayed: 0,
      kastRounds: 0,
      survivedRounds: 0,
      tradedRounds: 0,
      bestRoundKills: 0,
      recentKillRounds: [],
      adr: 0,
      kastPercent: 0,
      hsPercent: 0,
      impact: 0,
      rating: 1,
    },
  };
}

function createTeamMapState(teamInput, side) {
  const team = normalizeTeam(teamInput);
  return {
    side,
    team,
    lossStreak: 0,
    recentResults: [],
    moraleBoost: 0,
    upsetBoost: 0,
    totalSpent: 0,
    roundTypeWins: {
      pistol: 0,
      eco: 0,
      force: 0,
      full: 0,
      antiEco: 0,
    },
    players: team.players.map((player) => createMatchPlayerState(player, side)),
  };
}

function determineKnifeWinner(teamA, teamB) {
  const strengthA = getTeamStrength(teamA);
  const strengthB = getTeamStrength(teamB);
  const chanceA = strengthA / Math.max(1, strengthA + strengthB);
  return Math.random() < chanceA ? "teamA" : "teamB";
}

function chooseStartingSide(team, mapName) {
  const mapConfig = MAP_CONFIGS[mapName];
  const entryAverage = average(team.players.map((player) => player.entry));
  const tacticalLean = team.coach.tacticalRating + team.coach.mapKnowledge * 0.65;

  if (mapConfig.baseCT >= 0.53) {
    return "CT";
  }

  if (entryAverage >= tacticalLean / 1.7 && mapConfig.baseT >= 0.49) {
    return "T";
  }

  return tacticalLean >= 150 ? "CT" : "T";
}

function buildMapState(teamAInput, teamBInput, mapInfo) {
  const teamA = normalizeTeam(teamAInput);
  const teamB = normalizeTeam(teamBInput);
  const knifeWinner = determineKnifeWinner(teamA, teamB);
  const knifeWinnerTeam = knifeWinner === "teamA" ? teamA : teamB;
  const knifeSide = chooseStartingSide(knifeWinnerTeam, mapInfo.name);
  const startSides =
    knifeWinner === "teamA"
      ? { teamA: knifeSide, teamB: knifeSide === "CT" ? "T" : "CT" }
      : { teamB: knifeSide, teamA: knifeSide === "CT" ? "T" : "CT" };

  return {
    id: mapInfo.id,
    mapName: mapInfo.name,
    order: mapInfo.order,
    pickedBy: mapInfo.pickedBy,
    pickedByTeamId: mapInfo.pickedByTeamId,
    isDecider: mapInfo.isDecider,
    knifeWinner,
    knifeWinnerTeamId: knifeWinnerTeam.id,
    startSides,
    initialSides: { ...startSides },
    roundNumber: 1,
    overtimeNumber: 0,
    upcomingOtRound: 0,
    score: { teamA: 0, teamB: 0 },
    halftimeDone: false,
    nextReset: null,
    finished: false,
    winnerKey: null,
    winnerId: null,
    rounds: [],
    allLogs: [],
    economyHistory: [],
    highlights: [],
    teamAState: createTeamMapState(teamA, startSides.teamA),
    teamBState: createTeamMapState(teamB, startSides.teamB),
    lastRoundSummary: null,
  };
}

function mapsNeededToWin(format) {
  if (format === "BO1") {
    return 1;
  }

  if (format === "BO3") {
    return 2;
  }

  return 3;
}

export function createMatchFromSetup(teamAInput, teamBInput, settings) {
  const teamA = normalizeTeam(teamAInput);
  const teamB = normalizeTeam(teamBInput);
  const veto = simulateVeto(teamA, teamB, settings.format);

  return {
    id: uid("match"),
    createdAt: new Date().toISOString(),
    status: "veto",
    teamA,
    teamB,
    format: settings.format,
    speed: settings.speed,
    showDetailedLogs: Boolean(settings.showDetailedLogs),
    veto,
    maps: veto.maps.map((mapInfo) => buildMapState(teamA, teamB, mapInfo)),
    currentMapIndex: 0,
    seriesScore: { teamA: 0, teamB: 0 },
    timeoutsRemaining: { teamA: 4, teamB: 4 },
    results: null,
    latestRound: null,
  };
}

export function startMatch(matchInput) {
  const match = deepClone(matchInput);
  match.status = "live";
  return match;
}

function calculateDerivedStats(stats) {
  const roundsPlayed = Math.max(1, stats.roundsPlayed);
  const kpr = stats.kills / roundsPlayed;
  const dpr = stats.deaths / roundsPlayed;
  const adr = stats.damage / roundsPlayed;
  const kast = stats.kastRounds / roundsPlayed;
  const impact =
    (2 * kpr +
      2.5 * (stats.entriesWon / roundsPlayed) +
      stats.openingKills / roundsPlayed) /
    3;
  const rawRating =
    (kpr * 0.73 +
      (0.44 - dpr) * 0.54 +
      (adr / 100) * 0.38 +
      kast * 0.16 +
      impact * 0.1) *
    1.08;
  const sampleWeight = clamp((roundsPlayed - 1) / 8, 0.14, 1);
  const stabilizedRating = 1 + (rawRating - 1) * sampleWeight;

  return {
    adr: round(adr, 1),
    kastPercent: round(kast * 100, 0),
    hsPercent: round((stats.headshots / Math.max(1, stats.kills)) * 100, 0),
    impact: round(impact, 2),
    rating: round(
      clamp(stabilizedRating, 0.35, 2.08),
      2
    ),
  };
}

function getWeapon(weaponId) {
  return WEAPON_CATALOG[weaponId] ?? WEAPON_CATALOG.GLOCK;
}

function updateInventoryMeta(inventory) {
  const weapon = getWeapon(inventory.weaponId);
  return {
    ...inventory,
    weaponLabel: weapon.label,
    weaponType: weapon.type,
    value: inventoryValue(inventory),
  };
}

function getRoundType(teamState, opponentState, roundNumber, isOvertime) {
  if (!isOvertime && (roundNumber === 1 || roundNumber === 13)) {
    return "pistol";
  }

  const averageMoney = average(teamState.players.map((player) => player.money));
  const opponentAverageMoney = average(opponentState.players.map((player) => player.money));

  if (opponentAverageMoney < 2000 && averageMoney >= 4000) {
    return "antiEco";
  }

  if (averageMoney < 2000) {
    return "eco";
  }

  if (averageMoney < 4000) {
    return "force";
  }

  return "full";
}

function utilityPriority(role, side) {
  const mollyName = side === "CT" ? "incendiary" : "molotov";

  switch (role) {
    case "Support":
      return ["smoke", "flash", "flash", mollyName, "he"];
    case "Entry Fragger":
      return ["flash", mollyName, "smoke", "he"];
    case "Lurker":
      return ["smoke", "flash", mollyName, "he"];
    case "IGL":
      return ["smoke", "flash", "he", mollyName];
    case "AWPer":
    default:
      return ["smoke", "flash", "he"];
  }
}

function chooseDesiredWeaponId(player, side, roundType, money) {
  const existingTier = getWeapon(player.inventory.weaponId).tier;

  if (roundType === "pistol") {
    if (player.aim >= 90 && money >= 700) {
      return "DEAGLE";
    }

    if (player.role === "Entry Fragger" && money >= 500) {
      return side === "CT" ? "FIVESEVEN" : "TEC9";
    }

    if (money >= 300) {
      return "P250";
    }

    return sideDefaultWeapon(side).id;
  }

  if (roundType === "eco") {
    if (existingTier >= 5) {
      return player.inventory.weaponId;
    }

    if (player.aim >= 86 && money >= 700) {
      return "DEAGLE";
    }

    if (money >= 500) {
      return side === "CT" ? "FIVESEVEN" : "TEC9";
    }

    if (money >= 300) {
      return "P250";
    }

    return sideDefaultWeapon(side).id;
  }

  if (roundType === "force") {
    if (player.role === "AWPer" && existingTier >= 6) {
      return player.inventory.weaponId;
    }

    if (side === "T") {
      if (money >= 1800 && (player.role === "Entry Fragger" || player.entry >= 82)) {
        return "GALIL";
      }

      if (money >= 1050) {
        return "MAC10";
      }

      return "DEAGLE";
    }

    if (money >= 2050 && player.gameSense >= 80) {
      return "FAMAS";
    }

    if (money >= 1250) {
      return "MP9";
    }

    return "DEAGLE";
  }

  if (roundType === "antiEco") {
    if (player.role === "AWPer" && money >= 5250 && player.aim >= 90) {
      return "AWP";
    }

    if (player.role === "Entry Fragger" && money >= 1250) {
      return side === "CT" ? "MP9" : "MAC10";
    }

    if (side === "T") {
      return money >= 2700 ? "AK47" : "GALIL";
    }

    return money >= 3100 ? "M4" : "FAMAS";
  }

  if (player.role === "AWPer") {
    if (player.inventory.weaponId === "AWP") {
      return "AWP";
    }

    if (money >= 5250 || (money >= 4750 && existingTier >= 6)) {
      return "AWP";
    }
  }

  if (side === "T") {
    if (money >= 3000 && player.aim >= 92 && player.role !== "Support") {
      return "SG553";
    }

    if (money >= 2700) {
      return "AK47";
    }

    return "GALIL";
  }

  if (money >= 3300 && player.gameSense >= 90) {
    return "AUG";
  }

  if (money >= 3100) {
    return "M4";
  }

  return "FAMAS";
}

function shouldBuyHelmet(roundType) {
  return roundType === "full" || roundType === "antiEco";
}

function purchasePlayerLoadout(player, side, roundType) {
  const next = deepClone(player);
  let bank = next.money;
  let spent = 0;
  let inventory =
    roundType === "pistol" ? createInventory(side) : deepClone(next.inventory ?? createInventory(side));

  const desiredWeaponId = chooseDesiredWeaponId(next, side, roundType, bank);
  if (desiredWeaponId !== inventory.weaponId) {
    const desiredWeapon = getWeapon(desiredWeaponId);
    if (bank >= desiredWeapon.cost) {
      bank -= desiredWeapon.cost;
      spent += desiredWeapon.cost;
      inventory.weaponId = desiredWeaponId;
    }
  }

  if (roundType === "pistol") {
    if (bank >= ARMOR_COSTS.kevlar && next.role !== "AWPer") {
      bank -= ARMOR_COSTS.kevlar;
      spent += ARMOR_COSTS.kevlar;
      inventory.armor = true;
    }
  } else if (!inventory.helmet && shouldBuyHelmet(roundType) && bank >= ARMOR_COSTS.helmet) {
    bank -= ARMOR_COSTS.helmet;
    spent += ARMOR_COSTS.helmet;
    inventory.armor = true;
    inventory.helmet = true;
  } else if (!inventory.armor && bank >= ARMOR_COSTS.kevlar && roundType !== "eco") {
    bank -= ARMOR_COSTS.kevlar;
    spent += ARMOR_COSTS.kevlar;
    inventory.armor = true;
  }

  const desiredUtilities = utilityPriority(next.role, side);
  const utilitySlots =
    roundType === "eco"
      ? 0
      : clamp(
          Math.round(next.utility / 22) + (next.role === "Support" ? 1 : 0),
          0,
          5
        );

  inventory.utilityItems = [];
  for (const utilityName of desiredUtilities) {
    if (inventory.utilityItems.length >= utilitySlots) {
      break;
    }

    const utilityCost = UTILITY_COSTS[utilityName];
    if (bank < utilityCost) {
      continue;
    }

    bank -= utilityCost;
    spent += utilityCost;
    inventory.utilityItems.push(utilityName);
  }

  if (
    side === "CT" &&
    !inventory.defuseKit &&
    bank >= UTILITY_COSTS.kit &&
    roundType !== "eco" &&
    (next.role === "Support" || next.role === "IGL" || next.gameSense >= 90)
  ) {
    bank -= UTILITY_COSTS.kit;
    spent += UTILITY_COSTS.kit;
    inventory.defuseKit = true;
  }

  inventory = updateInventoryMeta(inventory);
  next.money = bank;
  next.roundLoadout = inventory;
  return { player: next, spent, loadoutValue: inventory.value };
}

function prepareTeamForRound(teamStateInput, opponentState, roundNumber, isOvertime) {
  const teamState = deepClone(teamStateInput);
  const roundType = getRoundType(teamState, opponentState, roundNumber, isOvertime);
  let totalSpent = 0;
  let totalLoadoutValue = 0;

  teamState.players = teamState.players.map((player) => {
    const result = purchasePlayerLoadout(player, teamState.side, roundType);
    totalSpent += result.spent;
    totalLoadoutValue += result.loadoutValue;
    return {
      ...result.player,
      hp: 100,
      alive: true,
      roundRewards: 0,
    };
  });

  teamState.totalSpent += totalSpent;

  return {
    teamState,
    roundType,
    totalSpent,
    totalLoadoutValue,
  };
}

function resetTeamForHalf(teamStateInput, side, money) {
  const teamState = deepClone(teamStateInput);
  teamState.side = side;
  teamState.lossStreak = 0;
  teamState.moraleBoost = 0;
  teamState.upsetBoost = 0;
  teamState.players = teamState.players.map((player) => ({
    ...player,
    money,
    hp: 100,
    alive: true,
    roundRewards: 0,
    inventory: createInventory(side),
    roundLoadout: createInventory(side),
  }));
  return teamState;
}

function scoreKeyToId(match, key) {
  return key === "teamA" ? match.teamA.id : match.teamB.id;
}

function getAlivePlayers(teamState) {
  return teamState.players.filter((player) => player.alive);
}

function teamAverage(teamState, field) {
  return average(teamState.players.map((player) => player[field]));
}

function recentFormScore(teamState) {
  const recent = teamState.recentResults.slice(-3);
  const wins = recent.filter((result) => result === "W").length;
  const losses = recent.filter((result) => result === "L").length;
  return clamp(0.5 + wins * 0.03 - losses * 0.02 + teamState.moraleBoost + teamState.upsetBoost, 0.36, 0.66);
}

function teamMapAdvantage(team, mapName) {
  return clamp(getMapPriority(team, mapName) * getMapModifier(team, mapName), 0.12, 1.25);
}

function teamFirepower(teamState) {
  return average(
    teamState.players.map((player) => {
      const weapon = getWeapon(player.roundLoadout.weaponId);
      return ((player.aim + player.entry) / 200) * weapon.quality;
    })
  );
}

function teamTactical(teamState, mapName) {
  const mapConfig = MAP_CONFIGS[mapName];
  const base =
    (teamAverage(teamState, "gameSense") + teamState.team.coach.tacticalRating / 2) / 100;
  const aliveIgl = teamState.players.some(
    (player) => player.role === "IGL" && player.alive
  );

  return clamp(
    base *
      getMapModifier(teamState.team, mapName) *
      mapConfig.gameSenseWeight *
      (aliveIgl ? 1.05 : 1),
    0.2,
    1.5
  );
}

function economyRatio(teamValue, opponentValue) {
  return clamp(teamValue / Math.max(1, teamValue + opponentValue), 0.08, 0.92);
}

function getTeamRoundProfile(teamState, opponentState, mapName, teamLoadoutValue, opponentLoadoutValue) {
  return {
    firepower: clamp(teamFirepower(teamState), 0.2, 1.4),
    mapAdvantage: teamMapAdvantage(teamState.team, mapName),
    econAdvantage: economyRatio(teamLoadoutValue, opponentLoadoutValue),
    tacticalAdvantage: teamTactical(teamState, mapName),
    momentum: recentFormScore(teamState),
  };
}

function buildTWinProbability(tTeamState, ctTeamState, mapName, tLoadoutValue, ctLoadoutValue) {
  const mapConfig = MAP_CONFIGS[mapName];
  const tProfile = getTeamRoundProfile(
    tTeamState,
    ctTeamState,
    mapName,
    tLoadoutValue,
    ctLoadoutValue
  );
  const ctProfile = getTeamRoundProfile(
    ctTeamState,
    tTeamState,
    mapName,
    ctLoadoutValue,
    tLoadoutValue
  );

  const tScore =
    (tProfile.firepower * 0.3 +
      tProfile.mapAdvantage * 0.2 +
      tProfile.econAdvantage * 0.25 +
      tProfile.tacticalAdvantage * 0.15 +
      tProfile.momentum * 0.1) *
    mapConfig.baseT;
  const ctScore =
    (ctProfile.firepower * 0.3 +
      ctProfile.mapAdvantage * 0.2 +
      ctProfile.econAdvantage * 0.25 +
      ctProfile.tacticalAdvantage * 0.15 +
      ctProfile.momentum * 0.1) *
    mapConfig.baseCT;

  return clamp(tScore / Math.max(0.01, tScore + ctScore), 0.14, 0.86);
}

function chooseStrategy(mapName, tTeamState) {
  const mapConfig = MAP_CONFIGS[mapName];
  const splitSite = Math.random() < 0.5 ? "A" : "B";
  const fakeSite = Math.random() < 0.5 ? "A" : "B";
  const options = [
    { id: "executeA", label: "execute A", site: "A", weight: 1.05 * mapConfig.entryWeight },
    { id: "executeB", label: "execute B", site: "B", weight: 1.04 * mapConfig.utilityWeight },
    { id: "split", label: `split ${splitSite}`, site: splitSite, weight: 0.94 },
    { id: "midControl", label: "mid control", site: "Mid", weight: 0.9 * mapConfig.awpWeight },
    { id: "fake", label: `fake ${fakeSite}`, site: fakeSite, weight: 0.82 * mapConfig.lurkWeight },
  ];

  const weighted = options.map((option) => ({
    ...option,
    weight:
      option.weight *
      (option.id === "midControl" ? average(tTeamState.players.map((player) => player.gameSense)) / 80 : 1) *
      (option.id === "fake" ? average(tTeamState.players.map((player) => player.utility)) / 82 : 1) *
      (option.id === "split" ? average(tTeamState.players.map((player) => player.entry)) / 85 : 1),
  }));

  return weightedPick(weighted, (option) => option.weight);
}

function elapsedLog(logs, elapsed, label, kind = "event", options = {}) {
  const entry = {
    id: uid("log"),
    elapsed,
    clock: formatElapsed(elapsed),
    label,
    kind,
  };
  logs.push(entry);

  if (options.timeline) {
    options.timeline.push({
      ...entry,
      ...(options.meta ?? {}),
      snapshot: options.snapshot ?? null,
    });
  }
}

function pickZone(mapName, site) {
  const zonePool = MAP_ZONES[mapName][site] ?? MAP_ZONES[mapName].Mid;
  return pick(zonePool);
}

function pickPlannedZone(roundPlan, lane, fallbackZones = [], options = {}) {
  const lanePool = roundPlan?.[lane]?.length ? roundPlan[lane] : fallbackZones;
  if (!lanePool.length) {
    return fallbackZones[0] ?? "mid";
  }

  if (
    options.preferTrade &&
    options.lastDeath?.zone &&
    lanePool.includes(options.lastDeath.zone) &&
    Math.random() < 0.6
  ) {
    return options.lastDeath.zone;
  }

  const anchorIndex = Math.min(
    lanePool.length - 1,
    Math.max(0, options.index ?? Math.floor(lanePool.length / 2))
  );
  const anchorZone = lanePool[anchorIndex];
  if (Math.random() < 0.72) {
    return anchorZone;
  }

  return pick(lanePool);
}

function strategyCallLabel(teamName, strategy, mapName, plantSite) {
  if (strategy.id === "midControl") {
    return `${teamName} ${strategy.label} on ${mapName} — pressure through mid before the ${plantSite} split`;
  }

  if (strategy.id === "fake") {
    return `${teamName} ${strategy.label} on ${mapName} — show ${strategy.site} then hit ${plantSite}`;
  }

  return `${teamName} ${strategy.label} on ${mapName} — hit toward ${plantSite}`;
}

function playerPhaseWeight(player, phase, side, range) {
  const role = ROLE_ORDER[player.role] ?? 0;
  let weight = 1 + compositeRating(player) / 100;

  if (phase === "early") {
    weight += player.role === "Entry Fragger" ? 1.1 : 0;
    weight += player.role === "AWPer" && range === "long" ? 1.2 : 0;
  }

  if (phase === "mid") {
    weight += player.role === "Lurker" ? 1.15 : 0;
    weight += player.role === "IGL" ? 0.45 : 0;
  }

  if (phase === "site") {
    weight += player.role === "Entry Fragger" ? 0.9 : 0;
    weight += player.role === "Support" ? 0.4 : 0;
  }

  if (phase === "retake") {
    weight += side === "CT" ? 0.7 : 0;
    weight += player.role === "Support" || player.role === "IGL" ? 0.5 : 0;
  }

  weight += player.alive ? 0.5 : -10;
  weight += role * 0.01;
  return weight;
}

function pickCombatant(teamState, phase, range) {
  return weightedPick(
    getAlivePlayers(teamState),
    (player) => playerPhaseWeight(player, phase, teamState.side, range)
  );
}

function consumeUtility(player, utilityName) {
  const index = player.roundLoadout.utilityItems.indexOf(utilityName);
  if (index !== -1) {
    player.roundLoadout.utilityItems.splice(index, 1);
  }
}

function maybeFlashSupport(teamState) {
  const flashers = getAlivePlayers(teamState).filter((player) =>
    player.roundLoadout.utilityItems.includes("flash")
  );

  if (!flashers.length || Math.random() > average(flashers.map((player) => player.utility)) / 140) {
    return null;
  }

  const flasher = weightedPick(flashers, (player) => player.utility + player.gameSense);
  consumeUtility(flasher, "flash");
  return flasher;
}

function maybeUtilityDamage({
  attackingTeam,
  defendingTeam,
  attackingTeamKey,
  defendingTeamKey,
  teamStates,
  logs,
  timeline,
  elapsed,
  mapName,
  site,
  roundPlan,
  roundFlags,
  firstKillTaken,
  lastDeath,
}) {
  const throwers = getAlivePlayers(attackingTeam).filter(
    (player) =>
      player.roundLoadout.utilityItems.includes("he") ||
      player.roundLoadout.utilityItems.includes("molotov") ||
      player.roundLoadout.utilityItems.includes("incendiary")
  );

  if (!throwers.length || Math.random() > average(throwers.map((player) => player.utility)) / 120) {
    return { firstKillTaken, lastDeath };
  }

  const thrower = weightedPick(throwers, (player) => player.utility + player.gameSense);
  const grenadeType = thrower.roundLoadout.utilityItems.includes("he")
    ? "he"
    : thrower.roundLoadout.utilityItems.includes("molotov")
      ? "molotov"
      : "incendiary";
  consumeUtility(thrower, grenadeType);
  const target = pickCombatant(defendingTeam, "site", "close");
  const utilityZone = pickPlannedZone(roundPlan, "utility", MAP_ZONES[mapName][site] ?? MAP_ZONES[mapName].Mid, {
    lastDeath,
  });
  const damage = Math.round(rand(18, 44) * (thrower.utility / 90));
  target.hp = clamp(target.hp - damage, 0, 100);
  thrower.stats.damage += damage;
  roundFlags[thrower.id].damage += damage;
  elapsedLog(
    logs,
    elapsed,
    `${thrower.nickname} softens up ${target.nickname} with ${grenadeType} utility at ${utilityZone} for ${damage} damage`,
    "utility",
    {
      timeline,
      snapshot: buildPlaybackSnapshot(teamStates),
      meta: {
        actorId: thrower.id,
        victimId: target.id,
        zone: utilityZone,
        site,
      },
    }
  );

  if (target.hp <= 0) {
    target.alive = false;
    target.hp = 0;
    thrower.stats.kills += 1;
    thrower.roundRewards += 300;
    thrower.stats.bestRoundKills = Math.max(
      thrower.stats.bestRoundKills,
      roundFlags[thrower.id].kills + 1
    );
    target.stats.deaths += 1;
    roundFlags[thrower.id].kills += 1;
    roundFlags[thrower.id].gotKill = true;
    roundFlags[target.id].died = true;
    if (!firstKillTaken) {
      thrower.stats.openingKills += 1;
      roundFlags[thrower.id].openingKill = true;
      firstKillTaken = true;
    }
    lastDeath = {
      victimId: target.id,
      killerId: thrower.id,
      teamKey: defendingTeamKey,
      zone: utilityZone,
    };
    elapsedLog(
      logs,
      elapsed + 2,
      `${thrower.nickname} finishes ${target.nickname} with utility at ${utilityZone}`,
      "kill",
      {
        timeline,
        snapshot: buildPlaybackSnapshot(teamStates),
        meta: {
          killerId: thrower.id,
          victimId: target.id,
          killerTeamKey: attackingTeamKey,
          victimTeamKey: defendingTeamKey,
          openingKill: roundFlags[thrower.id].openingKill,
          viaUtility: true,
          victimSide: defendingTeam.side,
          zone: utilityZone,
          site,
        },
      }
    );
  }

  return { firstKillTaken, lastDeath };
}

function consistencyRoll(player) {
  const spread = ((100 - player.consistency) / 100) * 0.38;
  return 1 + (Math.random() * 2 - 1) * spread;
}

function hotStreakBonus(player) {
  return sum(player.stats.recentKillRounds.slice(-2)) >= 3 ? 0.08 : 0;
}

function duelWeaponModifier(attacker, defender, range) {
  const attackerWeapon = getWeapon(attacker.roundLoadout.weaponId);
  const defenderWeapon = getWeapon(defender.roundLoadout.weaponId);
  let modifier = attackerWeapon.quality / Math.max(0.55, defenderWeapon.quality);

  if (attackerWeapon.type === "rifle" && defenderWeapon.type === "pistol") {
    modifier *= 1.4;
  }

  if (attackerWeapon.type === "awp" && range === "long") {
    modifier *= 1.6;
  }

  if (attackerWeapon.type === "awp" && range === "close") {
    modifier *= 0.8;
  }

  if (attackerWeapon.type === "smg" && range === "close") {
    modifier *= 1.3;
  }

  return modifier;
}

function createRoundFlags(teamAState, teamBState) {
  const flags = {};

  [...teamAState.players, ...teamBState.players].forEach((player) => {
    flags[player.id] = {
      kills: 0,
      damage: 0,
      gotKill: false,
      gotAssist: false,
      died: false,
      traded: false,
      openingKill: false,
    };
  });

  return flags;
}

function updateTrade(lastDeath, winnerTeamKey, loser, roundFlags) {
  if (
    lastDeath &&
    lastDeath.teamKey === winnerTeamKey &&
    lastDeath.killerId === loser.id
  ) {
    roundFlags[lastDeath.victimId].traded = true;
    return true;
  }

  return false;
}

function maybeRandomAssist(winnerTeamState, killerId, roundFlags) {
  const candidates = getAlivePlayers(winnerTeamState).filter(
    (player) => player.id !== killerId
  );

  if (!candidates.length || Math.random() > 0.18) {
    return null;
  }

  const assister = weightedPick(candidates, (player) => player.utility + player.gameSense);
  assister.stats.assists += 1;
  roundFlags[assister.id].gotAssist = true;
  return assister;
}

function maybeSupportChipDamage(teamState, excludedPlayerId, target, roundFlags) {
  const helpers = getAlivePlayers(teamState).filter((player) => player.id !== excludedPlayerId);

  if (!helpers.length || Math.random() > 0.6) {
    return null;
  }

  const helper = weightedPick(helpers, (player) => player.utility + player.gameSense + player.aim);
  const chipDamage = Math.round(rand(8, 22) * (helper.aim / 100));
  target.hp = clamp(target.hp - chipDamage, 1, 100);
  helper.stats.damage += chipDamage;
  roundFlags[helper.id].damage += chipDamage;
  roundFlags[helper.id].gotAssist = true;
  return { helper, chipDamage };
}

function getTeamKillCount(teamState, roundFlags) {
  return sum(teamState.players.map((player) => roundFlags[player.id].kills));
}

function resolveDuelEvent({
  attacker,
  defender,
  attackerTeamKey,
  defenderTeamKey,
  teamStates,
  phase,
  range,
  mapName,
  site,
  roundPlan,
  logs,
  elapsed,
  roundFlags,
  firstKillTaken,
  flashSupport,
  lastDeath,
  tacticalPenalty,
  timeline,
  duelIndex = 0,
}) {
  const attackerTeam = teamStates[attackerTeamKey];
  const defenderTeam = teamStates[defenderTeamKey];
  const attackerAlive = getAlivePlayers(attackerTeam).length;
  const defenderAlive = getAlivePlayers(defenderTeam).length;

  let chance =
    attacker.aim / Math.max(1, attacker.aim + defender.aim) +
    (attacker.gameSense - defender.gameSense) / 240;
  chance *= duelWeaponModifier(attacker, defender, range);
  chance *= consistencyRoll(attacker);
  chance /= Math.max(0.7, consistencyRoll(defender));
  chance += hotStreakBonus(attacker) - hotStreakBonus(defender);
  chance += attackerTeam.players.some((player) => player.role === "IGL" && player.alive) ? 0.02 : 0;
  chance -= defenderTeam.players.some((player) => player.role === "IGL" && player.alive) ? 0.02 : 0;
  chance += tacticalPenalty[attackerTeamKey] ?? 0;
  chance -= tacticalPenalty[defenderTeamKey] ?? 0;
  chance += flashSupport ? 0.08 : 0;
  chance += phase === "early" && attacker.role === "Entry Fragger" ? 0.1 : 0;
  chance += phase === "site" && attacker.role === "Entry Fragger" ? 0.05 : 0;
  chance += attacker.role === "AWPer" && range === "long" ? 0.05 : 0;
  chance -= attacker.role === "AWPer" && range === "close" ? 0.06 : 0;
  chance += attackerAlive === 1 && defenderAlive > 1 ? attacker.clutch / 900 : 0;
  chance -= defenderAlive === 1 && attackerAlive > 1 ? defender.clutch / 900 : 0;
  chance = clamp(chance, 0.08, 0.92);

  const attackerWins = Math.random() < chance;
  const winner = attackerWins ? attacker : defender;
  const loser = attackerWins ? defender : attacker;
  const winnerTeam = attackerWins ? attackerTeam : defenderTeam;
  const loserTeam = attackerWins ? defenderTeam : attackerTeam;
  const winnerTeamKey = attackerWins ? attackerTeamKey : defenderTeamKey;
  const loserTeamKey = attackerWins ? defenderTeamKey : attackerTeamKey;
  const headshot = Math.random() < clamp(winner.aim / 150, 0.12, 0.65);
  const damage = Math.round(
    getWeapon(winner.roundLoadout.weaponId).type === "awp"
      ? rand(100, 115)
      : headshot
        ? rand(100, 132)
        : rand(82, 110)
  );
  const returnDamage =
    Math.random() < 0.72 ? Math.round(rand(14, 58) * (loser.aim / 100)) : 0;

  loser.alive = false;
  loser.hp = 0;
  winner.hp = clamp(winner.hp - returnDamage, 1, 100);
  winner.stats.kills += 1;
  winner.stats.damage += damage;
  winner.roundRewards += getWeapon(winner.roundLoadout.weaponId).killReward;
  loser.stats.deaths += 1;
  loser.stats.damage += returnDamage;
  roundFlags[winner.id].kills += 1;
  roundFlags[winner.id].damage += damage;
  roundFlags[winner.id].gotKill = true;
  roundFlags[loser.id].damage += returnDamage;
  roundFlags[loser.id].died = true;

  if (headshot) {
    winner.stats.headshots += 1;
  }

  if (!firstKillTaken) {
    winner.stats.openingKills += 1;
    roundFlags[winner.id].openingKill = true;
  }

  if (
    winner.role === "Entry Fragger" &&
    (phase === "early" || phase === "site" || phase === "retake")
  ) {
    winner.stats.entriesWon += 1;
  }

  if (flashSupport && flashSupport.id !== winner.id) {
    flashSupport.stats.assists += 1;
    flashSupport.stats.flashAssists += 1;
    roundFlags[flashSupport.id].gotAssist = true;
  } else {
    maybeRandomAssist(winnerTeam, winner.id, roundFlags);
  }

  const traded = updateTrade(lastDeath, winnerTeamKey, loser, roundFlags);
  const supportChip = maybeSupportChipDamage(loserTeam, loser.id, winner, roundFlags);
  const lane =
    phase === "early"
      ? "early"
      : phase === "retake"
        ? winnerTeam.side === "CT"
          ? "retake"
          : "postPlant"
        : phase === "mid"
          ? "mid"
          : "hit";
  const zone = pickPlannedZone(roundPlan, lane, MAP_ZONES[mapName][site] ?? MAP_ZONES[mapName].Mid, {
    lastDeath,
    preferTrade: traded || phase === "retake",
    index: duelIndex,
  });
  const prefix = traded ? `${winner.nickname} trades out ${loser.nickname}` : `${winner.nickname} picks off ${loser.nickname}`;
  elapsedLog(
    logs,
    elapsed,
    `${prefix} with ${getWeapon(winner.roundLoadout.weaponId).label} at ${zone}${headshot ? " [HS]" : ""}`,
    "kill",
    {
      timeline,
      snapshot: buildPlaybackSnapshot(teamStates),
      meta: {
        killerId: winner.id,
        victimId: loser.id,
        killerNickname: winner.nickname,
        victimNickname: loser.nickname,
        killerTeamKey: winnerTeamKey,
        victimTeamKey: loserTeamKey,
        victimSide: loserTeam.side,
        openingKill: roundFlags[winner.id].openingKill,
        headshot,
        traded,
        zone,
        site,
        weaponLabel: getWeapon(winner.roundLoadout.weaponId).label,
      },
    }
  );

  if (supportChip) {
    elapsedLog(
      logs,
      elapsed + 1,
      `${supportChip.helper.nickname} tags ${winner.nickname} for ${supportChip.chipDamage} in the trade attempt`,
      "damage",
      {
        timeline,
        snapshot: buildPlaybackSnapshot(teamStates),
        meta: {
          actorId: supportChip.helper.id,
          victimId: winner.id,
        },
      }
    );
  }

  if (loser.role === "IGL" && getTeamKillCount(loserTeam, roundFlags) === 0 && phase === "early") {
    tacticalPenalty[loserTeamKey] = (tacticalPenalty[loserTeamKey] ?? 0) - 0.05;
    elapsedLog(
      logs,
      elapsed + 1,
      `${loser.nickname} falls early and ${loserTeam.team.tag} lose the mid-round call structure`,
      "note",
      {
        timeline,
        snapshot: buildPlaybackSnapshot(teamStates),
      }
    );
  }

  return {
    elapsed: elapsed + Math.round(rand(5, 10)),
    firstKillTaken: true,
    lastDeath: {
      victimId: loser.id,
      killerId: winner.id,
      teamKey: loserTeamKey,
      zone,
    },
    tacticalPenalty,
  };
}

function maybeLurkKill({
  teamKey,
  enemyKey,
  teamStates,
  mapName,
  roundPlan,
  logs,
  timeline,
  elapsed,
  roundFlags,
  firstKillTaken,
  lastDeath,
}) {
  const lurker = getAlivePlayers(teamStates[teamKey]).find((player) => player.role === "Lurker");
  if (!lurker) {
    return { elapsed, firstKillTaken, lastDeath };
  }

  const triggerChance = clamp(
    lurker.gameSense / 170 * MAP_CONFIGS[mapName].lurkWeight,
    0.1,
    0.72
  );

  if (Math.random() > triggerChance) {
    return { elapsed, firstKillTaken, lastDeath };
  }

  const target = pickCombatant(teamStates[enemyKey], "mid", "mid");
  if (!target) {
    return { elapsed, firstKillTaken, lastDeath };
  }

  target.alive = false;
  target.hp = 0;
  lurker.stats.kills += 1;
  lurker.stats.damage += 100;
  lurker.roundRewards += getWeapon(lurker.roundLoadout.weaponId).killReward;
  target.stats.deaths += 1;
  roundFlags[lurker.id].kills += 1;
  roundFlags[lurker.id].damage += 100;
  roundFlags[lurker.id].gotKill = true;
  roundFlags[target.id].died = true;

  if (!firstKillTaken) {
    lurker.stats.openingKills += 1;
    roundFlags[lurker.id].openingKill = true;
  }

  const zone = pickPlannedZone(roundPlan, "lurk", MAP_ZONES[mapName].Mid, {
    lastDeath,
  });

  elapsedLog(
    logs,
    elapsed,
    `${lurker.nickname} slips through the timing and catches ${target.nickname} lurking at ${zone}`,
    "kill",
    {
      timeline,
      snapshot: buildPlaybackSnapshot(teamStates),
      meta: {
        killerId: lurker.id,
        victimId: target.id,
        killerNickname: lurker.nickname,
        victimNickname: target.nickname,
        killerTeamKey: teamKey,
        victimTeamKey: enemyKey,
        victimSide: teamStates[enemyKey].side,
        openingKill: roundFlags[lurker.id].openingKill,
        lurkKill: true,
        zone,
        site: "Mid",
        weaponLabel: getWeapon(lurker.roundLoadout.weaponId).label,
      },
    }
  );

  return {
    elapsed: elapsed + Math.round(rand(4, 8)),
    firstKillTaken: true,
    lastDeath: { victimId: target.id, killerId: lurker.id, teamKey: enemyKey, zone },
  };
}

function highestRatedPlayer(teamState) {
  return [...teamState.players].sort((left, right) => right.stats.rating - left.stats.rating)[0];
}

function winnerPayoutFromReason(winnerSide, reason) {
  if (winnerSide === "T") {
    return reason === "bomb exploded" ? WIN_PAYOUTS.t_explode : WIN_PAYOUTS.t_elimination;
  }

  if (reason === "defuse") {
    return WIN_PAYOUTS.ct_defuse;
  }

  if (reason === "time") {
    return WIN_PAYOUTS.ct_time;
  }

  return WIN_PAYOUTS.ct_elimination;
}

function lossBonus(lossStreak) {
  return LOSS_BONUSES[Math.min(lossStreak, 5) - 1] ?? 1400;
}

function buildPlayerPanel(player) {
  return {
    id: player.id,
    nickname: player.nickname,
    role: player.role,
    weaponLabel: player.roundLoadout.weaponLabel,
    weaponType: player.roundLoadout.weaponType,
    armor: player.roundLoadout.armor,
    helmet: player.roundLoadout.helmet,
    defuseKit: player.roundLoadout.defuseKit,
    utilityCount: player.roundLoadout.utilityItems.length,
    hp: player.hp,
    alive: player.alive,
    kills: player.stats.kills,
    deaths: player.stats.deaths,
    assists: player.stats.assists,
    rating: player.stats.rating,
    money: player.money,
  };
}

function buildPlaybackSnapshot(teamStates) {
  return {
    teamA: teamStates.teamA.players.map(buildPlayerPanel),
    teamB: teamStates.teamB.players.map(buildPlayerPanel),
  };
}

function settleTeamAfterRound(teamStateInput, options) {
  const teamState = deepClone(teamStateInput);
  const {
    won,
    payout,
    roundFlags,
    side,
    winnerRoundType,
    pistolLossBoost,
  } = options;

  teamState.lossStreak = won ? 0 : teamState.lossStreak + 1;
  teamState.recentResults = [...teamState.recentResults.slice(-2), won ? "W" : "L"];
  teamState.moraleBoost = won ? 0 : Math.max(pistolLossBoost, 0);
  teamState.upsetBoost = 0;

  if (won) {
    teamState.roundTypeWins[winnerRoundType] += 1;
  }

  teamState.players = teamState.players.map((player) => {
    const flags = roundFlags[player.id];
    const survived = player.alive;
    const nextMoney = clamp(player.money + player.roundRewards + payout, 0, 16000);
    const nextInventory = survived
      ? updateInventoryMeta({
          ...player.roundLoadout,
          utilityItems: [],
        })
      : createInventory(side);
    const recentKillRounds = [...player.stats.recentKillRounds, flags.kills].slice(-2);
    const updatedStats = {
      ...player.stats,
      roundsPlayed: player.stats.roundsPlayed + 1,
      kastRounds:
        player.stats.kastRounds +
        (flags.gotKill || flags.gotAssist || survived || flags.traded ? 1 : 0),
      survivedRounds: player.stats.survivedRounds + (survived ? 1 : 0),
      tradedRounds: player.stats.tradedRounds + (flags.traded ? 1 : 0),
      bestRoundKills: Math.max(player.stats.bestRoundKills, flags.kills),
      recentKillRounds,
    };

    return {
      ...player,
      money: nextMoney,
      hp: survived ? player.hp : 0,
      inventory: nextInventory,
      roundLoadout: nextInventory,
      roundRewards: 0,
      stats: {
        ...updatedStats,
        ...calculateDerivedStats(updatedStats),
      },
    };
  });

  return teamState;
}

export function simulateRound(teamAStateInput, teamBStateInput, mapName, economy, roundContext) {
  const preparedTeamA = prepareTeamForRound(
    teamAStateInput,
    teamBStateInput,
    roundContext.roundNumber,
    roundContext.isOvertime
  );
  const preparedTeamB = prepareTeamForRound(
    teamBStateInput,
    teamAStateInput,
    roundContext.roundNumber,
    roundContext.isOvertime
  );
  const teamStates = {
    teamA: preparedTeamA.teamState,
    teamB: preparedTeamB.teamState,
  };

  const roundFlags = createRoundFlags(teamStates.teamA, teamStates.teamB);
  const startLoadouts = buildPlaybackSnapshot(teamStates);
  const tKey = teamStates.teamA.side === "T" ? "teamA" : "teamB";
  const ctKey = tKey === "teamA" ? "teamB" : "teamA";
  const logs = [];
  const timeline = [];
  const tacticalPenalty = { teamA: 0, teamB: 0 };
  const clutchState = {
    teamA: null,
    teamB: null,
  };
  const tWinProbability = buildTWinProbability(
    teamStates[tKey],
    teamStates[ctKey],
    mapName,
    tKey === "teamA" ? preparedTeamA.totalLoadoutValue : preparedTeamB.totalLoadoutValue,
    ctKey === "teamA" ? preparedTeamA.totalLoadoutValue : preparedTeamB.totalLoadoutValue
  );
  const strategy = chooseStrategy(mapName, teamStates[tKey]);
  let elapsed = 10;
  let firstKillTaken = false;
  let lastDeath = null;
  let bombPlanted = false;
  let plantSite =
    strategy.id === "fake"
      ? oppositeSite(strategy.site)
      : strategy.site === "Mid"
        ? (Math.random() < 0.5 ? "A" : "B")
        : strategy.site;
  const roundPlan = buildRoundZonePlan(mapName, strategy, plantSite);

  if (roundContext.timeoutCalled === "teamA" || roundContext.timeoutCalled === "teamB") {
    const timeoutTeam = roundContext.timeoutCalled === "teamA" ? teamStates.teamA : teamStates.teamB;
    elapsedLog(
      logs,
      3,
      `TACTICAL TIMEOUT — ${timeoutTeam.team.coach.nickname} draws up the play`,
      "timeout",
      {
        timeline,
        snapshot: buildPlaybackSnapshot(teamStates),
      }
    );
  }

  elapsedLog(
    logs,
    elapsed,
    strategyCallLabel(teamStates[tKey].team.name, strategy, mapName, plantSite),
    "strategy",
    {
      timeline,
      snapshot: buildPlaybackSnapshot(teamStates),
    }
  );

  const ctUtilityAverage = average(teamStates[ctKey].players.map((player) => player.utility));
  if (MAP_CONFIGS[mapName].utilityWeight > 1.04 && ctUtilityAverage >= 82) {
    elapsedLog(
      logs,
      elapsed + 2,
      `${teamStates[ctKey].team.tag} stack utility toward ${plantSite} and make the choke brutal`,
      "utility",
      {
        timeline,
        snapshot: buildPlaybackSnapshot(teamStates),
      }
    );
  }

  const tUtilityResult = maybeUtilityDamage({
    attackingTeam: teamStates[tKey],
    defendingTeam: teamStates[ctKey],
    attackingTeamKey: tKey,
    defendingTeamKey: ctKey,
    teamStates,
    logs,
    timeline,
    elapsed: elapsed + 3,
    mapName,
    site: plantSite,
    roundPlan,
    roundFlags,
    firstKillTaken,
    lastDeath,
  });
  firstKillTaken = tUtilityResult.firstKillTaken;
  lastDeath = tUtilityResult.lastDeath;
  const ctUtilityResult = maybeUtilityDamage({
    attackingTeam: teamStates[ctKey],
    defendingTeam: teamStates[tKey],
    attackingTeamKey: ctKey,
    defendingTeamKey: tKey,
    teamStates,
    logs,
    timeline,
    elapsed: elapsed + 4,
    mapName,
    site: plantSite,
    roundPlan,
    roundFlags,
    firstKillTaken,
    lastDeath,
  });
  firstKillTaken = ctUtilityResult.firstKillTaken;
  lastDeath = ctUtilityResult.lastDeath;

  const earlyRange = MAP_CONFIGS[mapName].awpWeight > 1.05 || strategy.id === "midControl" ? "long" : "mid";
  const earlyAttackerKey =
    Math.random() < clamp(tWinProbability + (teamStates[ctKey].side === "CT" ? -0.02 : 0.02), 0.2, 0.8)
      ? tKey
      : ctKey;
  const earlyDefenderKey = earlyAttackerKey === tKey ? ctKey : tKey;
  const earlyAttacker = pickCombatant(teamStates[earlyAttackerKey], "early", earlyRange);
  const earlyDefender = pickCombatant(teamStates[earlyDefenderKey], "early", earlyRange);

  if (earlyAttacker && earlyDefender) {
    const flashSupport = maybeFlashSupport(teamStates[earlyAttackerKey]);
    if (flashSupport) {
      const flashZone = pickPlannedZone(roundPlan, "early", MAP_ZONES[mapName][plantSite] ?? MAP_ZONES[mapName].Mid, {
        lastDeath,
      });
      elapsedLog(
        logs,
        elapsed + 4,
        `${flashSupport.nickname} flashes ${flashZone}, blinding ${earlyDefender.nickname} for ${round(rand(0.9, 1.6), 1)}s`,
        "flash",
        {
          timeline,
          snapshot: buildPlaybackSnapshot(teamStates),
          meta: {
            actorId: flashSupport.id,
            victimId: earlyDefender.id,
            zone: flashZone,
            site: plantSite,
          },
        }
      );
    }

    const duelResult = resolveDuelEvent({
      attacker: earlyAttacker,
      defender: earlyDefender,
      attackerTeamKey: earlyAttackerKey,
      defenderTeamKey: earlyDefenderKey,
      teamStates,
      phase: "early",
      range: earlyRange,
      mapName,
      site: strategy.site === "Mid" ? plantSite : strategy.site,
      roundPlan,
      logs,
      elapsed: elapsed + 5,
      roundFlags,
      firstKillTaken,
      flashSupport,
      lastDeath,
      tacticalPenalty,
      timeline,
      duelIndex: 0,
    });
    elapsed = duelResult.elapsed;
    firstKillTaken = duelResult.firstKillTaken;
    lastDeath = duelResult.lastDeath;
  }

  const lurkSourceKey = Math.random() < 0.55 ? tKey : ctKey;
  const lurkEnemyKey = lurkSourceKey === tKey ? ctKey : tKey;
  const lurkResult = maybeLurkKill({
    teamKey: lurkSourceKey,
    enemyKey: lurkEnemyKey,
    teamStates,
    mapName,
    roundPlan,
    logs,
    timeline,
    elapsed,
    roundFlags,
    firstKillTaken,
    lastDeath,
  });
  elapsed = lurkResult.elapsed;
  firstKillTaken = lurkResult.firstKillTaken;
  lastDeath = lurkResult.lastDeath;

  const maybeClutch = (teamKey, enemyKey) => {
    const teamAlive = getAlivePlayers(teamStates[teamKey]);
    const enemyAlive = getAlivePlayers(teamStates[enemyKey]);
    if (teamAlive.length === 1 && enemyAlive.length > 1 && !clutchState[teamKey]) {
      clutchState[teamKey] = {
        playerId: teamAlive[0].id,
        nickname: teamAlive[0].nickname,
        size: enemyAlive.length,
      };
      teamAlive[0].stats.clutchAttempts += 1;
      elapsedLog(
        logs,
        elapsed + 1,
        `${teamAlive[0].nickname} goes for the 1v${enemyAlive.length} clutch`,
        "clutch",
        {
          timeline,
          snapshot: buildPlaybackSnapshot(teamStates),
          meta: {
            actorId: teamAlive[0].id,
            clutchAttempt: true,
          },
        }
      );
    }
  };

  maybeClutch(tKey, ctKey);
  maybeClutch(ctKey, tKey);

  const aliveT = getAlivePlayers(teamStates[tKey]).length;
  const aliveCT = getAlivePlayers(teamStates[ctKey]).length;
  const plantChance = clamp(
    tWinProbability +
      (aliveT - aliveCT) * 0.07 +
      (strategy.id.startsWith("execute") ? 0.05 : 0) +
      (teamStates[tKey].team.coach.mapKnowledge - teamStates[ctKey].team.coach.mapKnowledge) /
        300,
    0.16,
    0.88
  );

  if (aliveT > 0 && aliveCT > 0 && Math.random() < plantChance) {
    bombPlanted = true;
    const planter = weightedPick(getAlivePlayers(teamStates[tKey]), (player) =>
      player.role === "Support" || player.role === "IGL" ? 1.5 : 1
    );
    elapsed += Math.round(rand(7, 12));
    elapsedLog(
      logs,
      elapsed,
      `Bomb planted at ${plantSite} by ${planter.nickname}`,
      "bomb",
      {
        timeline,
        snapshot: buildPlaybackSnapshot(teamStates),
        meta: {
          actorId: planter.id,
          bombPlanted: true,
          plantSite,
        },
      }
    );
  }

  const duelLoop =
    (bombPlanted ? 7 : 5) +
    (strategy.id === "split" || strategy.id.startsWith("execute") ? 1 : 0);
  for (let duelIndex = 0; duelIndex < duelLoop; duelIndex += 1) {
    const aliveTs = getAlivePlayers(teamStates[tKey]).length;
    const aliveCTs = getAlivePlayers(teamStates[ctKey]).length;
    if (!aliveTs || !aliveCTs) {
      break;
    }

    maybeClutch(tKey, ctKey);
    maybeClutch(ctKey, tKey);

    const attackBias = bombPlanted
      ? clamp((1 - tWinProbability) + (aliveCTs - aliveTs) * 0.05, 0.25, 0.7)
      : clamp(tWinProbability + (aliveTs - aliveCTs) * 0.04, 0.3, 0.7);
    const attackerKey = Math.random() < attackBias ? (bombPlanted ? ctKey : tKey) : bombPlanted ? tKey : ctKey;
    const defenderKey = attackerKey === tKey ? ctKey : tKey;
    const phase = bombPlanted ? "retake" : "site";
    const range = phase === "retake" ? "close" : duelIndex === 0 ? "mid" : "close";
    const attacker = pickCombatant(teamStates[attackerKey], phase, range);
    const defender = pickCombatant(teamStates[defenderKey], phase, range);

    if (!attacker || !defender) {
      break;
    }

    const flashSupport = maybeFlashSupport(teamStates[attackerKey]);
    if (flashSupport) {
      const flashZone = pickPlannedZone(
        roundPlan,
        bombPlanted ? "retake" : "hit",
        MAP_ZONES[mapName][plantSite] ?? MAP_ZONES[mapName].Mid,
        { lastDeath, index: duelIndex }
      );
      elapsedLog(
        logs,
        elapsed + 1,
        `${flashSupport.nickname} sets up the peek with a pop flash into ${flashZone}`,
        "flash",
        {
          timeline,
          snapshot: buildPlaybackSnapshot(teamStates),
          meta: {
            actorId: flashSupport.id,
            victimId: defender.id,
            zone: flashZone,
            site: plantSite,
          },
        }
      );
    }

    const duelResult = resolveDuelEvent({
      attacker,
      defender,
      attackerTeamKey: attackerKey,
      defenderTeamKey: defenderKey,
      teamStates,
      phase,
      range,
      mapName,
      site: plantSite,
      roundPlan,
      logs,
      elapsed: elapsed + 2,
      roundFlags,
      firstKillTaken,
      flashSupport,
      lastDeath,
      tacticalPenalty,
      timeline,
      duelIndex,
    });

    elapsed = duelResult.elapsed;
    firstKillTaken = duelResult.firstKillTaken;
    lastDeath = duelResult.lastDeath;
  }

  const aliveTPlayers = getAlivePlayers(teamStates[tKey]);
  const aliveCTPlayers = getAlivePlayers(teamStates[ctKey]);

  let winnerKey;
  let reason;

  if (!aliveTPlayers.length && aliveCTPlayers.length) {
    if (bombPlanted) {
      const defuser = [...aliveCTPlayers].sort((left, right) => right.gameSense - left.gameSense)[0];
      const defuseChance = clamp(
        0.44 +
          defuser.gameSense / 220 +
          (defuser.roundLoadout.defuseKit ? 0.16 : 0) -
          Math.max(0, elapsed - 75) / 100,
        0.18,
        0.92
      );
      if (Math.random() < defuseChance) {
        winnerKey = ctKey;
        reason = "defuse";
        elapsedLog(logs, elapsed + 6, `${defuser.nickname} sticks the defuse... success! Round CT`, "bomb", {
          timeline,
          snapshot: buildPlaybackSnapshot(teamStates),
          meta: {
            actorId: defuser.id,
            defuse: true,
          },
        });
      } else {
        winnerKey = tKey;
        reason = "bomb exploded";
        elapsedLog(logs, elapsed + 8, `Bomb explodes on ${plantSite} and ${teamStates[tKey].team.tag} lock it in`, "bomb", {
          timeline,
          snapshot: buildPlaybackSnapshot(teamStates),
          meta: {
            bombExploded: true,
            plantSite,
          },
        });
      }
    } else {
      winnerKey = ctKey;
      reason = "elimination";
    }
  } else if (!aliveCTPlayers.length && aliveTPlayers.length) {
    winnerKey = tKey;
    reason = bombPlanted ? "bomb exploded" : "elimination";
    if (bombPlanted) {
      elapsedLog(logs, elapsed + 4, `Bomb explodes on ${plantSite} with no CTs left in the server`, "bomb", {
        timeline,
        snapshot: buildPlaybackSnapshot(teamStates),
        meta: {
          bombExploded: true,
          plantSite,
        },
      });
    }
  } else if (bombPlanted) {
    const defuser = [...aliveCTPlayers].sort((left, right) => right.gameSense - left.gameSense)[0];
    const retakeChance = clamp(
      (1 - tWinProbability) +
        (aliveCTPlayers.length - aliveTPlayers.length) * 0.06 +
        (defuser ? defuser.gameSense / 280 : 0),
      0.18,
      0.82
    );
    if (Math.random() < retakeChance && defuser) {
      winnerKey = ctKey;
      reason = "defuse";
      elapsedLog(logs, elapsed + 6, `${defuser.nickname} clears the last angle and completes the defuse`, "bomb", {
        timeline,
        snapshot: buildPlaybackSnapshot(teamStates),
        meta: {
          actorId: defuser.id,
          defuse: true,
        },
      });
    } else {
      winnerKey = tKey;
      reason = "bomb exploded";
      elapsedLog(logs, elapsed + 8, `The bomb timer runs out and ${teamStates[tKey].team.tag} convert the post-plant`, "bomb", {
        timeline,
        snapshot: buildPlaybackSnapshot(teamStates),
        meta: {
          bombExploded: true,
          plantSite,
        },
      });
    }
  } else {
    winnerKey =
      Math.random() < clamp(
        (1 - tWinProbability) +
          (aliveCTPlayers.length - aliveTPlayers.length) * 0.08 +
          MAP_CONFIGS[mapName].baseCT -
          0.5,
        0.2,
        0.8
      )
        ? ctKey
        : tKey;
    reason = winnerKey === ctKey ? "time" : "elimination";
    if (winnerKey === ctKey) {
      elapsedLog(logs, elapsed + 7, `Time expires and ${teamStates[ctKey].team.tag} hold the line`, "time", {
        timeline,
        snapshot: buildPlaybackSnapshot(teamStates),
      });
    }
  }

  const loserKey = winnerKey === "teamA" ? "teamB" : "teamA";
  const winnerSide = teamStates[winnerKey].side;
  const winnerPayout = winnerPayoutFromReason(winnerSide, reason);
  const loserBonus = lossBonus(teamStates[loserKey].lossStreak + 1);
  const pistolLossBoost =
    !roundContext.isOvertime && (roundContext.roundNumber === 1 || roundContext.roundNumber === 13)
      ? teamStates[loserKey].team.coach.motivationRating / 2000
      : 0;
  const upset =
    (roundContext.roundType[winnerKey] === "force" || roundContext.roundType[winnerKey] === "eco") &&
    (roundContext.roundType[loserKey] === "full" || roundContext.roundType[loserKey] === "antiEco");

  const clutchWinner = clutchState[winnerKey];
  if (clutchWinner) {
    const clutchPlayer = teamStates[winnerKey].players.find(
      (player) => player.id === clutchWinner.playerId
    );
    if (clutchPlayer) {
      clutchPlayer.stats.clutchesWon += 1;
    }
  }

  const settledWinner = settleTeamAfterRound(teamStates[winnerKey], {
    won: true,
    payout: winnerPayout,
    roundFlags,
    side: teamStates[winnerKey].side,
    winnerRoundType: roundContext.roundType[winnerKey],
    pistolLossBoost: 0,
  });
  const settledLoser = settleTeamAfterRound(teamStates[loserKey], {
    won: false,
    payout: loserBonus,
    roundFlags,
    side: teamStates[loserKey].side,
    winnerRoundType: roundContext.roundType[winnerKey],
    pistolLossBoost,
  });

  settledWinner.upsetBoost = upset ? 0.07 : 0;

  const nextTeamA = winnerKey === "teamA" ? settledWinner : settledLoser;
  const nextTeamB = winnerKey === "teamB" ? settledWinner : settledLoser;
  const scoreAfter = {
    teamA: economy.score.teamA + (winnerKey === "teamA" ? 1 : 0),
    teamB: economy.score.teamB + (winnerKey === "teamB" ? 1 : 0),
  };
  const spectatorLeaders = {
    teamA: highestRatedPlayer(nextTeamA),
    teamB: highestRatedPlayer(nextTeamB),
  };
  const killerPerformance = [...nextTeamA.players, ...nextTeamB.players]
    .map((player) => ({ nickname: player.nickname, kills: roundFlags[player.id].kills }))
    .sort((left, right) => right.kills - left.kills)[0];

  let highlight = null;
  if (clutchWinner) {
    highlight = `${clutchWinner.nickname} won a 1v${clutchWinner.size} clutch on round ${roundContext.roundNumber} of ${mapName}`;
  } else if (killerPerformance?.kills >= 4) {
    highlight = `${killerPerformance.nickname} exploded for ${killerPerformance.kills} kills on round ${roundContext.roundNumber} of ${mapName}`;
  } else if (roundContext.timeoutCalled) {
    const coach = (roundContext.timeoutCalled === "teamA" ? nextTeamA : nextTeamB).team.coach.nickname;
    highlight = `${coach} called a crucial timeout before round ${roundContext.roundNumber} on ${mapName}`;
  } else if (upset) {
    highlight = `${(winnerKey === "teamA" ? nextTeamA : nextTeamB).team.tag} steal an upset ${roundContext.roundType[winnerKey]} round on ${mapName}`;
  }

  return {
    teamAState: nextTeamA,
    teamBState: nextTeamB,
    summary: {
      roundNumber: roundContext.roundNumber,
      displayRound: roundContext.displayRound,
      halfLabel: roundContext.halfLabel,
      mapName,
      winnerKey,
      winnerId: winnerKey === "teamA" ? nextTeamA.team.id : nextTeamB.team.id,
      winnerSide,
      loserKey,
      reason,
      bombPlanted,
      plantSite,
      scoreBefore: economy.score,
      scoreAfter,
      roundType: roundContext.roundType,
      timeoutCalled: roundContext.timeoutCalled,
      logs,
      timeline,
      startLoadouts,
      economy: {
        teamAEquipmentValue: preparedTeamA.totalLoadoutValue,
        teamBEquipmentValue: preparedTeamB.totalLoadoutValue,
        teamATotalMoney: sum(nextTeamA.players.map((player) => player.money)),
        teamBTotalMoney: sum(nextTeamB.players.map((player) => player.money)),
      },
      loadouts: {
        teamA: nextTeamA.players.map(buildPlayerPanel),
        teamB: nextTeamB.players.map(buildPlayerPanel),
      },
      spectatorLeaders: {
        teamA: {
          nickname: spectatorLeaders.teamA.nickname,
          rating: spectatorLeaders.teamA.stats.rating,
        },
        teamB: {
          nickname: spectatorLeaders.teamB.nickname,
          rating: spectatorLeaders.teamB.stats.rating,
        },
      },
      clutch:
        clutchWinner != null
          ? {
              teamKey: winnerKey,
              nickname: clutchWinner.nickname,
              size: clutchWinner.size,
            }
          : null,
      highlight,
      strategy: strategy.label,
    },
  };
}

function displayRoundLabel(map) {
  if (!map.overtimeNumber) {
    return `R${map.roundNumber}`;
  }

  return `OT${map.overtimeNumber}-R${map.upcomingOtRound}`;
}

function halfLabel(map) {
  if (!map.overtimeNumber) {
    return map.roundNumber <= 12 ? "1H" : "2H";
  }

  return map.upcomingOtRound <= 3 ? `OT${map.overtimeNumber} A` : `OT${map.overtimeNumber} B`;
}

function swapSide(side) {
  return side === "CT" ? "T" : "CT";
}

function applyPendingReset(mapInput) {
  const map = deepClone(mapInput);

  if (map.nextReset === "halftime") {
    map.teamAState = resetTeamForHalf(map.teamAState, swapSide(map.teamAState.side), 800);
    map.teamBState = resetTeamForHalf(map.teamBState, swapSide(map.teamBState.side), 800);
    map.halftimeDone = true;
    map.nextReset = null;
    return map;
  }

  if (map.nextReset === "ot-start") {
    const nextOvertime = map.overtimeNumber + 1;
    const useInitialSides = nextOvertime % 2 === 1;
    const teamASide = useInitialSides ? map.initialSides.teamA : swapSide(map.initialSides.teamA);
    const teamBSide = swapSide(teamASide);
    map.overtimeNumber = nextOvertime;
    map.upcomingOtRound = 1;
    map.teamAState = resetTeamForHalf(map.teamAState, teamASide, 10000);
    map.teamBState = resetTeamForHalf(map.teamBState, teamBSide, 10000);
    map.nextReset = null;
    return map;
  }

  if (map.nextReset === "ot-swap") {
    map.teamAState = resetTeamForHalf(map.teamAState, swapSide(map.teamAState.side), 10000);
    map.teamBState = resetTeamForHalf(map.teamBState, swapSide(map.teamBState.side), 10000);
    map.upcomingOtRound = 4;
    map.nextReset = null;
    return map;
  }

  return map;
}

function maybeCallTimeout(teamState, remaining, roundNumber, isOvertime) {
  if (remaining <= 0) {
    return false;
  }

  if (!isOvertime && (roundNumber === 1 || roundNumber === 13)) {
    return false;
  }

  if (teamState.lossStreak < 3) {
    return false;
  }

  return Math.random() < clamp(0.34 + teamState.team.coach.tacticalRating / 180, 0.35, 0.88);
}

function markMapWinner(map, match, winnerKey) {
  map.finished = true;
  map.winnerKey = winnerKey;
  map.winnerId = scoreKeyToId(match, winnerKey);
  return map;
}

export function stepMatch(matchInput) {
  const match = deepClone(matchInput);

  if (match.status !== "live") {
    return match;
  }

  let activeMap = applyPendingReset(match.maps[match.currentMapIndex]);
  const isOvertime = activeMap.overtimeNumber > 0;
  const roundType = {
    teamA: getRoundType(activeMap.teamAState, activeMap.teamBState, activeMap.roundNumber, isOvertime),
    teamB: getRoundType(activeMap.teamBState, activeMap.teamAState, activeMap.roundNumber, isOvertime),
  };

  let timeoutCalled = null;
  if (maybeCallTimeout(activeMap.teamAState, match.timeoutsRemaining.teamA, activeMap.roundNumber, isOvertime)) {
    timeoutCalled = "teamA";
    match.timeoutsRemaining.teamA -= 1;
    activeMap.teamAState.moraleBoost = Math.max(activeMap.teamAState.moraleBoost, 0.05);
  } else if (
    maybeCallTimeout(activeMap.teamBState, match.timeoutsRemaining.teamB, activeMap.roundNumber, isOvertime)
  ) {
    timeoutCalled = "teamB";
    match.timeoutsRemaining.teamB -= 1;
    activeMap.teamBState.moraleBoost = Math.max(activeMap.teamBState.moraleBoost, 0.05);
  }

  const roundResult = simulateRound(
    activeMap.teamAState,
    activeMap.teamBState,
    activeMap.mapName,
    { score: activeMap.score },
    {
      roundNumber: activeMap.roundNumber,
      isOvertime,
      displayRound: displayRoundLabel(activeMap),
      halfLabel: halfLabel(activeMap),
      timeoutCalled,
      roundType,
    }
  );

  activeMap.teamAState = roundResult.teamAState;
  activeMap.teamBState = roundResult.teamBState;
  activeMap.score = roundResult.summary.scoreAfter;
  activeMap.rounds.push(roundResult.summary);
  activeMap.lastRoundSummary = roundResult.summary;
  activeMap.allLogs = [
    ...roundResult.summary.logs.map((log) => ({
      ...log,
      roundNumber: roundResult.summary.roundNumber,
      mapName: activeMap.mapName,
    })),
    ...activeMap.allLogs,
  ].slice(0, 150);
  activeMap.economyHistory.push({
    round: roundResult.summary.roundNumber,
    label: roundResult.summary.displayRound,
    teamA: roundResult.summary.economy.teamAEquipmentValue,
    teamB: roundResult.summary.economy.teamBEquipmentValue,
  });

  if (roundResult.summary.highlight) {
    activeMap.highlights.push({
      text: roundResult.summary.highlight,
      roundNumber: roundResult.summary.roundNumber,
      weight: roundResult.summary.clutch ? 5 : 3,
    });
  }

  const regulationWin =
    !activeMap.overtimeNumber &&
    (activeMap.score.teamA >= 13 || activeMap.score.teamB >= 13);
  const overtimeTarget = 13 + activeMap.overtimeNumber * 3;
  const overtimeWin =
    activeMap.overtimeNumber > 0 &&
    (activeMap.score.teamA >= overtimeTarget || activeMap.score.teamB >= overtimeTarget);

  if (regulationWin || overtimeWin) {
    const winnerKey = activeMap.score.teamA > activeMap.score.teamB ? "teamA" : "teamB";
    activeMap = markMapWinner(activeMap, match, winnerKey);
    match.seriesScore[winnerKey] += 1;
  } else if (!activeMap.overtimeNumber && activeMap.roundNumber === 12) {
    activeMap.roundNumber += 1;
    activeMap.nextReset = "halftime";
  } else if (!activeMap.overtimeNumber && activeMap.roundNumber === 24) {
    activeMap.roundNumber += 1;
    activeMap.nextReset = "ot-start";
  } else if (activeMap.overtimeNumber > 0 && activeMap.upcomingOtRound === 3) {
    activeMap.roundNumber += 1;
    activeMap.nextReset = "ot-swap";
  } else if (activeMap.overtimeNumber > 0 && activeMap.upcomingOtRound === 6) {
    activeMap.roundNumber += 1;
    activeMap.nextReset = "ot-start";
  } else {
    activeMap.roundNumber += 1;
    if (activeMap.overtimeNumber > 0) {
      activeMap.upcomingOtRound += 1;
    }
  }

  match.maps[match.currentMapIndex] = activeMap;
  match.latestRound = roundResult.summary;

  if (activeMap.finished) {
    if (match.seriesScore.teamA >= mapsNeededToWin(match.format) || match.seriesScore.teamB >= mapsNeededToWin(match.format)) {
      match.status = "finished";
      match.results = buildResultsData(match);
      return match;
    }

    match.currentMapIndex += 1;
  }

  return match;
}

export function simulateEntireMatch(matchInput) {
  let next = deepClone(matchInput);
  let safety = 0;

  while (next.status === "live" && safety < 500) {
    next = stepMatch(next);
    safety += 1;
  }

  return next;
}

function mergePlayerStats(target, player) {
  const merged = {
    ...target,
    kills: target.kills + player.stats.kills,
    deaths: target.deaths + player.stats.deaths,
    assists: target.assists + player.stats.assists,
    damage: target.damage + player.stats.damage,
    headshots: target.headshots + player.stats.headshots,
    openingKills: target.openingKills + player.stats.openingKills,
    entriesWon: target.entriesWon + player.stats.entriesWon,
    clutchesWon: target.clutchesWon + player.stats.clutchesWon,
    clutchAttempts: target.clutchAttempts + player.stats.clutchAttempts,
    flashAssists: target.flashAssists + player.stats.flashAssists,
    roundsPlayed: target.roundsPlayed + player.stats.roundsPlayed,
    kastRounds: target.kastRounds + player.stats.kastRounds,
    survivedRounds: target.survivedRounds + player.stats.survivedRounds,
    tradedRounds: target.tradedRounds + player.stats.tradedRounds,
    bestRoundKills: Math.max(target.bestRoundKills, player.stats.bestRoundKills),
  };

  return {
    ...merged,
    ...calculateDerivedStats(merged),
  };
}

function buildHalfBreakdown(map) {
  const firstHalf = { teamA: 0, teamB: 0 };
  const secondHalf = { teamA: 0, teamB: 0 };
  const overtimeMap = {};

  map.rounds.forEach((roundSummary) => {
    if (roundSummary.halfLabel === "1H") {
      firstHalf[roundSummary.winnerKey] += 1;
      return;
    }

    if (roundSummary.halfLabel === "2H") {
      secondHalf[roundSummary.winnerKey] += 1;
      return;
    }

    overtimeMap[roundSummary.halfLabel] ??= { teamA: 0, teamB: 0 };
    overtimeMap[roundSummary.halfLabel][roundSummary.winnerKey] += 1;
  });

  return {
    firstHalf,
    secondHalf,
    overtimes: Object.entries(overtimeMap).map(([label, score]) => ({
      label,
      score,
    })),
  };
}

export function buildResultsData(matchInput) {
  const match = deepClone(matchInput);
  const playedMaps = match.maps.filter((map) => map.rounds.length > 0);
  const aggregatedPlayers = {};

  const registerPlayer = (teamKey, team, player) => {
    const aggregateKey = `${teamKey}:${player.id}`;
    if (!aggregatedPlayers[aggregateKey]) {
      aggregatedPlayers[aggregateKey] = {
        id: player.id,
        teamKey,
        teamId: team.id,
        teamName: team.name,
        teamTag: team.tag,
        nickname: player.nickname,
        role: player.role,
        kills: 0,
        deaths: 0,
        assists: 0,
        damage: 0,
        headshots: 0,
        openingKills: 0,
        entriesWon: 0,
        clutchesWon: 0,
        clutchAttempts: 0,
        flashAssists: 0,
        roundsPlayed: 0,
        kastRounds: 0,
        survivedRounds: 0,
        tradedRounds: 0,
        bestRoundKills: 0,
        adr: 0,
        kastPercent: 0,
        hsPercent: 0,
        impact: 0,
        rating: 1,
      };
    }

    aggregatedPlayers[aggregateKey] = mergePlayerStats(aggregatedPlayers[aggregateKey], player);
  };

  playedMaps.forEach((map) => {
    map.teamAState.players.forEach((player) => registerPlayer("teamA", match.teamA, player));
    map.teamBState.players.forEach((player) => registerPlayer("teamB", match.teamB, player));
  });

  const playerRows = Object.values(aggregatedPlayers).sort((left, right) => right.rating - left.rating);
  const mvp = playerRows[0] ?? null;
  const highlights = playedMaps
    .flatMap((map) =>
      map.highlights.map((highlight) => ({
        ...highlight,
        mapName: map.mapName,
      }))
    )
    .sort((left, right) => right.weight - left.weight)
    .map((highlight) => highlight.text);

  if (highlights.length < 3) {
    playedMaps.forEach((map) => {
      const mapTopPlayer = [...map.teamAState.players, ...map.teamBState.players].sort(
        (left, right) => right.stats.kills - left.stats.kills
      )[0];
      if (mapTopPlayer) {
        highlights.push(`${mapTopPlayer.nickname} finished ${map.mapName} with ${mapTopPlayer.stats.kills} kills`);
      }
    });
  }

  return {
    id: match.id,
    createdAt: match.createdAt,
    finishedAt: new Date().toISOString(),
    format: match.format,
    teamA: {
      id: match.teamA.id,
      name: match.teamA.name,
      tag: match.teamA.tag,
      logo: match.teamA.logo,
    },
    teamB: {
      id: match.teamB.id,
      name: match.teamB.name,
      tag: match.teamB.tag,
      logo: match.teamB.logo,
    },
    seriesScore: match.seriesScore,
    winnerKey: match.seriesScore.teamA > match.seriesScore.teamB ? "teamA" : "teamB",
    maps: playedMaps.map((map) => ({
      id: map.id,
      mapName: map.mapName,
      pickedBy: map.pickedBy,
      knifeWinner: map.knifeWinner,
      winnerKey: map.winnerKey,
      winnerId: map.winnerId,
      score: map.score,
      halfBreakdown: buildHalfBreakdown(map),
      economySpent: {
        teamA: map.teamAState.totalSpent,
        teamB: map.teamBState.totalSpent,
      },
      roundTypeWins: {
        teamA: map.teamAState.roundTypeWins,
        teamB: map.teamBState.roundTypeWins,
      },
      rounds: map.rounds,
      teamAPlayers: map.teamAState.players,
      teamBPlayers: map.teamBState.players,
    })),
    players: playerRows,
    mvp,
    highlights: [...new Set(highlights)].slice(0, 5),
  };
}

export function buildHistoryEntry(results) {
  const teamALabel = `${results.teamA.name}`;
  const teamBLabel = `${results.teamB.name}`;
  return {
    id: results.id,
    date: results.finishedAt ?? results.createdAt,
    teams: `${teamALabel} vs ${teamBLabel}`,
    score: `${results.seriesScore.teamA}-${results.seriesScore.teamB}`,
    mvp: results.mvp?.nickname ?? "n/a",
    mapsPlayed: results.maps.map((map) => map.mapName).join(", "),
    data: results,
  };
}
