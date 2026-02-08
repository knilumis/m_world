const SHARED_COLORS = [
  { name: "Nane", hex: "#8BE8C7" },
  { name: "Mercan", hex: "#FF9B83" },
  { name: "Limon", hex: "#F7E27A" },
  { name: "Bulut", hex: "#DBE9FF" },
  { name: "Kakao", hex: "#B48562" },
  { name: "Lavanta", hex: "#C9BCFF" }
];

const PARTS = {
  body: {
    label: "Gövde",
    styles: ["Pofuduk", "Uzun", "Kutu"],
    colors: SHARED_COLORS
  },
  ears: {
    label: "Kulaklar",
    styles: ["Kedi", "Yumuşak", "Uzun"],
    colors: SHARED_COLORS
  },
  arms: {
    label: "Kollar",
    styles: ["Kısa", "Uzun", "Mini"],
    colors: SHARED_COLORS
  },
  feet: {
    label: "Ayaklar",
    styles: ["Pati", "Ponçik", "Mini"],
    colors: SHARED_COLORS
  }
};

const WORLD_OPTIONS = [
  { id: "miu-square", name: "Miu Meydanı", vibe: "Sohbet", crowd: "68 Miu" },
  { id: "cloud-port", name: "Bulut İskele", vibe: "Keşif", crowd: "31 Miu" },
  { id: "sunny-forest", name: "Güneşli Orman", vibe: "Mini Oyun", crowd: "52 Miu" }
];

const MIU_NAME_PREFIXES = [
  "Minik",
  "Ponçik",
  "Pofik",
  "Pamuk",
  "Mırmır",
  "Bulut",
  "Boncuk",
  "Lokum",
  "Fındık",
  "Bıcır",
  "Şeker",
  "Pati"
];

const MIU_NAME_SUFFIXES = [
  "Miu",
  "can",
  "toş",
  "kuş",
  "pati",
  "cık",
  "bon",
  "piş",
  "mini",
  "pop",
  "cuk",
  "bebe"
];

const WORLD_NPC_DEFS = [
  {
    name: "Pofi",
    lines: ["Meydan partisine hoş geldin!", "Kafede sıcak kakao efsane olmuş."]
  },
  {
    name: "Lili",
    lines: ["Mini oyun panosu birazdan dolacak.", "Portal tarafı bugün çok hareketli."]
  },
  {
    name: "Bonbon",
    lines: ["Yeni gelen misin? Bence harika görünüyorsun.", "Kulübe dansı 5 dakikaya başlıyormuş."]
  },
  {
    name: "Zuzu",
    lines: ["Sahil yolunda gün batımı çok iyi görünüyor.", "Bugün meydanda konser varmış."]
  },
  {
    name: "Mira",
    lines: ["Moda dükkanında yeni kostümler gelmiş.", "Pet park tarafı çok neşeli."]
  },
  {
    name: "Tekir",
    lines: ["Arcade skor tablosuna adını yazdırabilirsin.", "Meydan turu atarken bana da selam ver."]
  },
  {
    name: "Kaptan",
    lines: ["İskele rotası bakımda ama manzara hala şahane.", "Merkez çeşmede herkes toplanıyor."]
  }
];

const WORLD_PLAYER_SPEED = 108;
const WORLD_NPC_SPEED = 32;
const WORLD_WIDTH = 860;
const WORLD_HEIGHT = 560;
const CAFE_WIDTH = 620;
const CAFE_HEIGHT = 360;
const CLUB_WIDTH = 660;
const CLUB_HEIGHT = 400;
const WORLD_JOYSTICK_MAX_DISTANCE = 92;
const WORLD_JOYSTICK_DEADZONE = 10;
const WORLD_CONTROL_KEYS = new Set(["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", "e"]);
const WORLD_EXTRA_KEYS = new Set(["f"]);
const CAFE_GAME_KEYS = new Set(["1", "2", "3", "q"]);
const CLUB_DANCE_KEYS = ["w", "a", "s", "d"];
const CLUB_GAME_KEYS = new Set([...CLUB_DANCE_KEYS, "q"]);
const CLUB_DANCE_KEY_TIME_BASE = 1650;
const CLUB_DANCE_KEY_TIME_MIN = 760;
const WORLD_START_COLLECTIBLE_COUNT = 12;
const WORLD_MAX_COLLECTIBLE_COUNT = 24;
const WORLD_COLLECTIBLE_RESPAWN_MS = 5200;
const WORLD_BLOCKS = [
  { x: 90, y: 82, w: 144, h: 88 },
  { x: 352, y: 60, w: 138, h: 90 },
  { x: 614, y: 82, w: 144, h: 88 },
  { x: 102, y: 356, w: 140, h: 90 },
  { x: 352, y: 390, w: 136, h: 88 },
  { x: 610, y: 352, w: 150, h: 96 },
  { x: 398, y: 246, w: 64, h: 64 }
];

const WORLD_ZONES = [
  { id: "north-arcade", name: "Kuzey Pasajı", x: 250, y: 20, w: 360, h: 200 },
  { id: "west-lane", name: "Batı Sokağı", x: 20, y: 180, w: 250, h: 240 },
  { id: "center-square", name: "Miyu Çeşme Meydanı", x: 280, y: 188, w: 300, h: 200 },
  { id: "east-lane", name: "Doğu Sokağı", x: 590, y: 180, w: 250, h: 240 },
  { id: "south-park", name: "Güney Parkı", x: 180, y: 392, w: 500, h: 150 }
];

const WORLD_AMBIENCE_PROFILES = {
  "north-arcade": {
    label: "Arcade Synth",
    wave: "triangle",
    base: 246,
    interval: 0.46,
    duration: 0.25,
    volume: 0.026,
    offsets: [0, 4, 7, 11, 7, 4]
  },
  "west-lane": {
    label: "Kafe Uğultusu",
    wave: "sine",
    base: 196,
    interval: 0.72,
    duration: 0.38,
    volume: 0.024,
    offsets: [0, 3, 7, 10]
  },
  "center-square": {
    label: "Meydan Çanı",
    wave: "sine",
    base: 220,
    interval: 0.6,
    duration: 0.28,
    volume: 0.03,
    offsets: [0, 5, 9, 12, 9, 5]
  },
  "east-lane": {
    label: "Portal Rüzgarı",
    wave: "sawtooth",
    base: 174,
    interval: 0.68,
    duration: 0.3,
    volume: 0.02,
    offsets: [0, 2, 7, 2]
  },
  "south-park": {
    label: "Park Ambiyansı",
    wave: "triangle",
    base: 208,
    interval: 0.82,
    duration: 0.42,
    volume: 0.024,
    offsets: [0, 4, 7, 11]
  },
  "cafe-interior": {
    label: "Kafe Cazı",
    wave: "sine",
    base: 262,
    interval: 0.54,
    duration: 0.34,
    volume: 0.036,
    offsets: [0, 4, 7, 11, 7, 4, 2]
  },
  "club-interior": {
    label: "Kulüp Bası",
    wave: "square",
    base: 164,
    interval: 0.34,
    duration: 0.24,
    volume: 0.032,
    offsets: [0, 3, 7, 10, 7, 3]
  },
  default: {
    label: "Meydan Ambiyansı",
    wave: "sine",
    base: 214,
    interval: 0.66,
    duration: 0.32,
    volume: 0.03,
    offsets: [0, 3, 7, 10]
  }
};

const WORLD_EVENT_LIBRARY = [
  {
    title: "Sahne Kulübü Konseri",
    boardText: "Canlı DJ seti başladı, dans pisti açık.",
    npcLine: "Sahne Kulübü tarafında konser başladı, kaçırma."
  },
  {
    title: "Meydan Quiz Saati",
    boardText: "Çeşme yanında 10 soruluk mini bilgi yarışı var.",
    npcLine: "Quiz saati çok eğlenceli, ödül olarak rozet veriyorlar."
  },
  {
    title: "Moda Defilesi",
    boardText: "Moda dükkanında kostüm defilesi başladı.",
    npcLine: "Yeni kostümleri gördün mü, defile çok kalabalık."
  },
  {
    title: "Pet Park Yarışı",
    boardText: "Pet Park mini parkur turu başladı.",
    npcLine: "Pet Park yarışında bu turu birinci bitirmeyi deniyorum."
  },
  {
    title: "Arcade Turnuvası",
    boardText: "Arcade skor turnuvası başladı, liderlik değişebilir.",
    npcLine: "Arcade turnuvasında puanlar çok yakın."
  },
  {
    title: "Kafe Sohbet Buluşması",
    boardText: "Kafe masalarında açık sohbet buluşması var.",
    npcLine: "Kafede herkes bir araya toplanmış, ortam çok iyi."
  }
];

const CAFE_RECIPES = [
  {
    id: "coffee",
    label: "Kahve",
    icon: "coffee",
    steps: [
      { prompt: "Çekirdek tipi seç", options: ["Espresso", "Filtre", "Türk"] },
      { prompt: "Süt oranı seç", options: ["Sade", "Az Süt", "Bol Süt"] },
      { prompt: "Son dokunuşu seç", options: ["Tarçın", "Kakao", "Krema"] }
    ]
  },
  {
    id: "cake",
    label: "Pasta",
    icon: "cake",
    steps: [
      { prompt: "Kek tabanını seç", options: ["Vanilya", "Kakao", "Çilek"] },
      { prompt: "Ara dolguyu seç", options: ["Meyve", "Krem Şanti", "Çikolata"] },
      { prompt: "Süslemeyi seç", options: ["Kiraz", "Badem", "Renkli Şeker"] }
    ]
  }
];

const CAFE_CUSTOMER_NAMES = ["Pofi", "Lili", "Bonbon", "Mira", "Tekir", "Kaptan", "Zuzu", "Momo"];

function createCafeSceneState() {
  const tables = [
    { id: "t1", x: 176, y: 154 },
    { id: "t2", x: 306, y: 154 },
    { id: "t3", x: 436, y: 154 },
    { id: "t4", x: 176, y: 246 },
    { id: "t5", x: 306, y: 246 },
    { id: "t6", x: 436, y: 246 }
  ];

  const seats = [];
  tables.forEach((table) => {
    seats.push({ id: `${table.id}-n`, tableId: table.id, direction: "n", x: table.x, y: table.y - 22, occupiedBy: null });
    seats.push({ id: `${table.id}-s`, tableId: table.id, direction: "s", x: table.x, y: table.y + 22, occupiedBy: null });
    seats.push({ id: `${table.id}-w`, tableId: table.id, direction: "w", x: table.x - 22, y: table.y, occupiedBy: null });
    seats.push({ id: `${table.id}-e`, tableId: table.id, direction: "e", x: table.x + 22, y: table.y, occupiedBy: null });
  });

  return {
    width: CAFE_WIDTH,
    height: CAFE_HEIGHT,
    entryPoint: { x: 306, y: 304 },
    exitZone: { x: 282, y: 320, w: 48, h: 20 },
    counterZone: { x: 456, y: 78, w: 144, h: 54 },
    counterBlocks: [
      { x: 440, y: 72, w: 168, h: 62 },
      { x: 524, y: 136, w: 84, h: 58 }
    ],
    tables,
    seats,
    seatedSeatId: null,
    previousWorldPosition: null,
    barista: null,
    game: {
      active: false,
      score: 0,
      served: 0,
      streak: 0,
      misses: 0,
      currentOrder: null,
      orderEndAt: 0,
      tutorialShown: false
    }
  };
}

function createClubSceneState() {
  const seats = [
    { id: "club-l1", direction: "e", x: 154, y: 126, occupiedBy: null },
    { id: "club-l2", direction: "e", x: 154, y: 182, occupiedBy: null },
    { id: "club-l3", direction: "e", x: 154, y: 238, occupiedBy: null },
    { id: "club-l4", direction: "e", x: 154, y: 294, occupiedBy: null },
    { id: "club-r1", direction: "w", x: 506, y: 126, occupiedBy: null },
    { id: "club-r2", direction: "w", x: 506, y: 182, occupiedBy: null },
    { id: "club-r3", direction: "w", x: 506, y: 238, occupiedBy: null },
    { id: "club-r4", direction: "w", x: 506, y: 294, occupiedBy: null }
  ];

  return {
    width: CLUB_WIDTH,
    height: CLUB_HEIGHT,
    entryPoint: { x: 330, y: 346 },
    exitZone: { x: 304, y: 372, w: 52, h: 18 },
    danceZone: { x: 200, y: 126, w: 260, h: 170 },
    boothZone: { x: 258, y: 46, w: 144, h: 62 },
    blocks: [
      { x: 252, y: 40, w: 156, h: 66 },
      { x: 88, y: 96, w: 44, h: 226 },
      { x: 528, y: 96, w: 44, h: 226 },
      { x: 68, y: 320, w: 72, h: 20 },
      { x: 520, y: 320, w: 72, h: 20 },
      { x: 174, y: 76, w: 20, h: 34 },
      { x: 466, y: 76, w: 20, h: 34 }
    ],
    seats,
    seatedSeatId: null,
    previousWorldPosition: null,
    dj: null,
    game: {
      active: false,
      score: 0,
      streak: 0,
      rounds: 0,
      misses: 0,
      hits: 0,
      sequence: [],
      inputIndex: 0,
      roundEndAt: 0,
      keyEndAt: 0,
      keyDurationMs: 0,
      inputFlashUntil: 0,
      inputFlashKey: "",
      tutorialShown: false
    }
  };
}

const state = {
  body: { style: 0, color: 0 },
  ears: { style: 0, color: 0 },
  arms: { style: 0, color: 0 },
  feet: { style: 0, color: 0 },
  selectedWorldId: WORLD_OPTIONS[0].id,
  username: "",
  miuName: ""
};

const worldState = {
  running: false,
  rafId: null,
  lastTime: 0,
  mode: "square",
  partyStars: 0,
  dailyGiftClaimed: false,
  collectibles: [],
  nextCollectibleRespawnAt: 0,
  emote: {
    text: "",
    until: 0
  },
  camera: {
    x: 0,
    y: 0
  },
  currentZoneName: "",
  keys: {
    up: false,
    down: false,
    left: false,
    right: false
  },
  mouse: {
    active: false,
    x: 0,
    y: 0,
    screenX: 0,
    screenY: 0
  },
  player: null,
  npcs: [],
  interactables: [],
  chatText: "",
  chatUntil: 0,
  hintText: "",
  snowDots: [],
  ambience: {
    context: null,
    masterGain: null,
    nextNoteAt: 0,
    step: 0,
    profileKey: "default"
  },
  eventCycle: {
    dateKey: "",
    schedule: [],
    currentHour: -1,
    currentEvent: null,
    nextEvent: null
  },
  cafe: createCafeSceneState(),
  club: createClubSceneState()
};

const loginScreen = document.getElementById("login-screen");
const creatorScreen = document.getElementById("creator-screen");
const lobbyScreen = document.getElementById("lobby-screen");
const worldScreen = document.getElementById("world-screen");
const mainCanvas = document.getElementById("miu-canvas");
const mainCtx = mainCanvas.getContext("2d");
const lobbyCanvas = document.getElementById("lobby-miu-canvas");
const lobbyCtx = lobbyCanvas.getContext("2d");
const worldCanvas = document.getElementById("world-canvas");
const worldCtx = worldCanvas.getContext("2d");

const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username-input");
const passwordInput = document.getElementById("password-input");
const loginFeedback = document.getElementById("login-feedback");
const creatorUserText = document.getElementById("creator-user-text");

const controlsPanel = document.getElementById("controls-panel");
const startButton = document.getElementById("start-button");
const randomStyleButton = document.getElementById("random-style-button");
const miuNameInput = document.getElementById("miu-name-input");
const randomNameButton = document.getElementById("random-name-button");
const miuNameFeedback = document.getElementById("miu-name-feedback");
const backButton = document.getElementById("back-button");
const worldList = document.getElementById("world-list");
const miuBuildList = document.getElementById("miu-build-list");
const lobbyMiuName = document.getElementById("lobby-miu-name");
const selectedWorldText = document.getElementById("selected-world-text");
const enterWorldButton = document.getElementById("enter-world-button");
const worldTitleText = document.getElementById("world-title-text");
const worldStatusText = document.getElementById("world-status-text");
const worldHelpText = document.getElementById("world-help-text");
const worldChatText = document.getElementById("world-chat-text");
const worldBackButton = document.getElementById("world-back-button");

mainCtx.imageSmoothingEnabled = false;
lobbyCtx.imageSmoothingEnabled = false;
worldCtx.imageSmoothingEnabled = false;

function normalizeInput(value) {
  return value.trim().replace(/\s+/g, " ");
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function pickRandom(list) {
  return list[randomInt(list.length)];
}

function generateRandomMiuName() {
  let candidate = `${pickRandom(MIU_NAME_PREFIXES)}${pickRandom(MIU_NAME_SUFFIXES)}`;
  if (candidate.length > 20) {
    candidate = candidate.slice(0, 20);
  }
  return candidate;
}

function cycle(value, max, direction) {
  return (value + direction + max) % max;
}

function clampChannel(channel) {
  return Math.max(0, Math.min(255, Math.round(channel)));
}

function darken(hexColor, amount) {
  const hex = hexColor.replace("#", "");
  const value = Number.parseInt(hex, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  const factor = 1 - amount;
  const nextRed = clampChannel(red * factor);
  const nextGreen = clampChannel(green * factor);
  const nextBlue = clampChannel(blue * factor);

  return (
    "#" +
    [nextRed, nextGreen, nextBlue]
      .map((channel) => channel.toString(16).padStart(2, "0"))
      .join("")
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getCurrentZone(x, y) {
  return (
    WORLD_ZONES.find((item) => {
      return x >= item.x && x <= item.x + item.w && y >= item.y && y <= item.y + item.h;
    }) || null
  );
}

function getCurrentZoneName(x, y) {
  const zone = getCurrentZone(x, y);
  return zone ? zone.name : "Meydan Çevresi";
}

function getCurrentAmbienceProfile() {
  if (worldState.mode === "cafe") {
    return WORLD_AMBIENCE_PROFILES["cafe-interior"] || WORLD_AMBIENCE_PROFILES.default;
  }
  if (worldState.mode === "club") {
    return WORLD_AMBIENCE_PROFILES["club-interior"] || WORLD_AMBIENCE_PROFILES.default;
  }

  if (!worldState.player) {
    return WORLD_AMBIENCE_PROFILES.default;
  }

  const zone = getCurrentZone(worldState.player.x, worldState.player.y);
  if (!zone) {
    return WORLD_AMBIENCE_PROFILES.default;
  }

  return WORLD_AMBIENCE_PROFILES[zone.id] || WORLD_AMBIENCE_PROFILES.default;
}

function getTodayKey() {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

function getDeterministicSeed(input) {
  let seed = 0;
  for (let i = 0; i < input.length; i += 1) {
    seed = (seed * 31 + input.charCodeAt(i)) % 2147483647;
  }
  return seed || 1;
}

function createSeededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) {
    value += 2147483646;
  }

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function buildDailyEventSchedule(dateKey) {
  const schedule = [];
  const seed = getDeterministicSeed(dateKey);
  const random = createSeededRandom(seed);
  const eventCount = WORLD_EVENT_LIBRARY.length;
  const offset = Math.floor(random() * eventCount);

  for (let hour = 0; hour < 24; hour += 1) {
    const roll = Math.floor(random() * eventCount);
    const eventIndex = (offset + hour * 2 + roll) % eventCount;
    const eventInfo = WORLD_EVENT_LIBRARY[eventIndex];
    schedule.push({
      hour,
      ...eventInfo
    });
  }

  return schedule;
}

function formatHour(hour) {
  return `${String(hour).padStart(2, "0")}:00`;
}

function getNoticeBoardMessage(currentEvent, nextEvent) {
  return `Duyuru Panosu: ${formatHour(currentEvent.hour)} ${currentEvent.title}. ${currentEvent.boardText} Sonraki etkinlik ${formatHour(nextEvent.hour)} ${nextEvent.title}.`;
}

function refreshEventCycle(forceAnnounce = false) {
  const todayKey = getTodayKey();
  if (worldState.eventCycle.dateKey !== todayKey || worldState.eventCycle.schedule.length !== 24) {
    worldState.eventCycle.dateKey = todayKey;
    worldState.eventCycle.schedule = buildDailyEventSchedule(todayKey);
    worldState.eventCycle.currentHour = -1;
  }

  const currentHour = new Date().getHours();
  if (worldState.eventCycle.currentHour === currentHour) {
    return;
  }

  worldState.eventCycle.currentHour = currentHour;
  worldState.eventCycle.currentEvent = worldState.eventCycle.schedule[currentHour];
  worldState.eventCycle.nextEvent = worldState.eventCycle.schedule[(currentHour + 1) % 24];

  const noticeBoard = worldState.interactables.find((item) => item.id === "notice-board");
  if (noticeBoard) {
    noticeBoard.message = getNoticeBoardMessage(
      worldState.eventCycle.currentEvent,
      worldState.eventCycle.nextEvent
    );
  }

  if (!forceAnnounce) {
    return;
  }

  setWorldChat(
    `Etkinlik güncellendi: ${worldState.eventCycle.currentEvent.title} başladı. Sonraki: ${formatHour(worldState.eventCycle.nextEvent.hour)} ${worldState.eventCycle.nextEvent.title}.`,
    3800
  );
}

function ensureWorldAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  if (!worldState.ambience.context) {
    const context = new AudioContextClass();
    const masterGain = context.createGain();
    masterGain.gain.value = 0.0001;
    masterGain.connect(context.destination);

    worldState.ambience.context = context;
    worldState.ambience.masterGain = masterGain;
    worldState.ambience.nextNoteAt = context.currentTime + 0.08;
    worldState.ambience.step = 0;
    worldState.ambience.profileKey = "default";
  }

  if (worldState.ambience.context.state === "suspended") {
    worldState.ambience.context.resume().catch(() => {});
  }

  if (worldState.ambience.masterGain) {
    worldState.ambience.masterGain.gain.setTargetAtTime(
      0.2,
      worldState.ambience.context.currentTime,
      0.12
    );
  }

  return worldState.ambience.context;
}

function stopWorldAudio() {
  if (!worldState.ambience.context || !worldState.ambience.masterGain) {
    return;
  }

  worldState.ambience.masterGain.gain.setTargetAtTime(
    0.0001,
    worldState.ambience.context.currentTime,
    0.08
  );
}

function scheduleAmbienceNote(profile, startAt, step) {
  if (!worldState.ambience.context || !worldState.ambience.masterGain) {
    return;
  }

  const context = worldState.ambience.context;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const offset = profile.offsets[step % profile.offsets.length];
  const frequency = profile.base * Math.pow(2, offset / 12);

  oscillator.type = profile.wave;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.linearRampToValueAtTime(profile.volume, startAt + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + profile.duration);

  oscillator.connect(gain);
  gain.connect(worldState.ambience.masterGain);
  oscillator.start(startAt);
  oscillator.stop(startAt + profile.duration + 0.05);
}

function updateWorldAmbience() {
  if (!worldState.running || !worldState.player) {
    return;
  }

  const context = worldState.ambience.context;
  if (!context) {
    return;
  }

  const zone = getCurrentZone(worldState.player.x, worldState.player.y);
  let profileKey = "default";
  if (worldState.mode === "cafe") {
    profileKey = "cafe-interior";
  } else if (worldState.mode === "club") {
    profileKey = "club-interior";
  } else if (zone) {
    profileKey = zone.id;
  }
  const profile = WORLD_AMBIENCE_PROFILES[profileKey] || WORLD_AMBIENCE_PROFILES.default;
  if (worldState.ambience.profileKey !== profileKey) {
    worldState.ambience.profileKey = profileKey;
    worldState.ambience.step = 0;
    worldState.ambience.nextNoteAt = context.currentTime + 0.04;
  }

  if (worldState.ambience.nextNoteAt < context.currentTime - 2) {
    worldState.ambience.nextNoteAt = context.currentTime + 0.04;
  }

  while (worldState.ambience.nextNoteAt < context.currentTime + 0.12) {
    scheduleAmbienceNote(profile, worldState.ambience.nextNoteAt, worldState.ambience.step);
    worldState.ambience.step += 1;
    worldState.ambience.nextNoteAt += profile.interval;
  }
}

function getNpcEventLine() {
  const currentEvent = worldState.eventCycle.currentEvent;
  if (!currentEvent) {
    return null;
  }
  return currentEvent.npcLine;
}

function getActiveWorldSize() {
  if (worldState.mode === "cafe") {
    return { width: worldState.cafe.width, height: worldState.cafe.height };
  }
  if (worldState.mode === "club") {
    return { width: worldState.club.width, height: worldState.club.height };
  }
  return { width: WORLD_WIDTH, height: WORLD_HEIGHT };
}

function getActiveWorldBlocks() {
  if (worldState.mode === "cafe") {
    const tableBlocks = worldState.cafe.tables.map((table) => ({
      x: table.x - 18,
      y: table.y - 14,
      w: 36,
      h: 28
    }));
    return [...worldState.cafe.counterBlocks, ...tableBlocks];
  }

  if (worldState.mode === "club") {
    return worldState.club.blocks;
  }

  return WORLD_BLOCKS;
}

function getDistanceToZone(zone, x, y) {
  const centerX = zone.x + zone.w / 2;
  const centerY = zone.y + zone.h / 2;
  return Math.hypot(centerX - x, centerY - y);
}

function isPointInsideZone(zone, x, y) {
  return x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h;
}

function getRandomSquareSpawnPoint() {
  for (let attempt = 0; attempt < 90; attempt += 1) {
    const x = 26 + randomInt(WORLD_WIDTH - 52);
    const y = 26 + randomInt(WORLD_HEIGHT - 52);
    const hitbox = getHitboxAt(x, y);
    const blocked = WORLD_BLOCKS.some((block) => intersectsRect(hitbox, block));
    const tooCloseToCenter = Math.hypot(x - 430, y - 280) < 46;
    if (!blocked && !tooCloseToCenter) {
      return { x, y };
    }
  }

  return { x: 430, y: 350 };
}

function createSquareCollectibles(count) {
  const items = [];
  for (let i = 0; i < count; i += 1) {
    const point = getRandomSquareSpawnPoint();
    items.push({
      id: `star-${i}-${randomInt(9999)}`,
      x: point.x,
      y: point.y,
      phase: Math.random() * Math.PI * 2
    });
  }
  return items;
}

function spawnSquareCollectible() {
  if (worldState.collectibles.length >= WORLD_MAX_COLLECTIBLE_COUNT) {
    return;
  }

  const point = getRandomSquareSpawnPoint();
  worldState.collectibles.push({
    id: `star-${Date.now()}-${randomInt(9999)}`,
    x: point.x,
    y: point.y,
    phase: Math.random() * Math.PI * 2
  });
}

function updateSquareCollectibles(now) {
  if (worldState.mode !== "square" || !worldState.player) {
    return;
  }

  let collectedCount = 0;
  worldState.collectibles = worldState.collectibles.filter((item) => {
    const distance = Math.hypot(item.x - worldState.player.x, item.y - worldState.player.y);
    if (distance > 16) {
      return true;
    }

    collectedCount += 1;
    return false;
  });

  if (collectedCount > 0) {
    worldState.partyStars += collectedCount;
    triggerPlayerEmote("YILDIZ!");
    if (collectedCount === 1) {
      setWorldChat(`Bir Miyu Yıldızı topladın. Toplam: ${worldState.partyStars}`, 1300);
    } else {
      setWorldChat(`${collectedCount} yıldız birden topladın. Toplam: ${worldState.partyStars}`, 1500);
    }
  }

  if (now >= worldState.nextCollectibleRespawnAt) {
    spawnSquareCollectible();
    worldState.nextCollectibleRespawnAt = now + WORLD_COLLECTIBLE_RESPAWN_MS;
  }
}

function triggerPlayerEmote(text = "") {
  if (!worldState.player) {
    return;
  }

  if (!text) {
    const pool = worldState.mode === "club" ? ["DANS!", "RITIM!", "KOMBO!"] : ["SELAM!", "HARIKA!", "MIU!"];
    worldState.emote.text = pickRandom(pool);
  } else {
    worldState.emote.text = text;
  }
  worldState.emote.until = performance.now() + 900;
}

function getCafeSeatById(seatId) {
  return worldState.cafe.seats.find((seat) => seat.id === seatId) || null;
}

function getCafeSeatDirection(seat) {
  if (!seat) {
    return "";
  }

  if (seat.direction) {
    return seat.direction;
  }

  const parts = seat.id.split("-");
  return parts[parts.length - 1] || "";
}

function getCafeSeatSitPosition(seat) {
  const direction = getCafeSeatDirection(seat);
  if (direction === "n") {
    return { x: seat.x, y: seat.y - 2 };
  }
  if (direction === "s") {
    return { x: seat.x, y: seat.y + 12 };
  }
  if (direction === "w") {
    return { x: seat.x - 8, y: seat.y + 6 };
  }
  if (direction === "e") {
    return { x: seat.x + 8, y: seat.y + 6 };
  }

  return { x: seat.x, y: seat.y + 12 };
}

function getCafeSeatStandPosition(seat) {
  const direction = getCafeSeatDirection(seat);
  let target = { x: seat.x, y: seat.y + 20 };
  if (direction === "n") {
    target = { x: seat.x, y: seat.y - 16 };
  } else if (direction === "s") {
    target = { x: seat.x, y: seat.y + 20 };
  } else if (direction === "w") {
    target = { x: seat.x - 20, y: seat.y + 8 };
  } else if (direction === "e") {
    target = { x: seat.x + 20, y: seat.y + 8 };
  }

  const activeSize = getActiveWorldSize();
  return {
    x: clamp(target.x, 14, activeSize.width - 14),
    y: clamp(target.y, 14, activeSize.height - 14)
  };
}

function getNearbyCafeSeat() {
  if (!worldState.player || worldState.mode !== "cafe") {
    return null;
  }

  let nearest = null;
  let minDistance = 9999;
  worldState.cafe.seats.forEach((seat) => {
    const distance = Math.hypot(seat.x - worldState.player.x, seat.y - worldState.player.y);
    if (distance < 26 && distance < minDistance) {
      nearest = seat;
      minDistance = distance;
    }
  });
  return nearest;
}

function standFromCafeSeat() {
  const seat = getCafeSeatById(worldState.cafe.seatedSeatId);
  if (!seat || !worldState.player) {
    worldState.cafe.seatedSeatId = null;
    return;
  }

  seat.occupiedBy = null;
  worldState.cafe.seatedSeatId = null;
  const standPosition = getCafeSeatStandPosition(seat);
  worldState.player.x = standPosition.x;
  worldState.player.y = standPosition.y;
}

function sitOnCafeSeat(seat) {
  if (!worldState.player || !seat) {
    return;
  }

  if (seat.occupiedBy && seat.occupiedBy !== "player") {
    setWorldChat("Bu sandalye dolu, başka bir yere otur.", 1600);
    return;
  }

  if (worldState.cafe.seatedSeatId && worldState.cafe.seatedSeatId !== seat.id) {
    standFromCafeSeat();
  }

  worldState.cafe.seatedSeatId = seat.id;
  seat.occupiedBy = "player";
  const sitPosition = getCafeSeatSitPosition(seat);
  worldState.player.x = sitPosition.x;
  worldState.player.y = sitPosition.y;
  setWorldChat("Masaya oturdun. Tekrar E ile ayağa kalkabilirsin.", 1800);
}

function getCafeRecipeById(recipeId) {
  return CAFE_RECIPES.find((recipe) => recipe.id === recipeId) || CAFE_RECIPES[0];
}

function getCafeCurrentOrderStepInfo(order) {
  const recipe = getCafeRecipeById(order.recipeId);
  const stepIndex = clamp(order.stepIndex, 0, recipe.steps.length - 1);
  return {
    recipe,
    stepIndex,
    step: recipe.steps[stepIndex]
  };
}

function getCafeOrderProgress(order) {
  const recipe = getCafeRecipeById(order.recipeId);
  return clamp(order.stepIndex / recipe.steps.length, 0, 1);
}

function createCafeOrder() {
  const recipe = pickRandom(CAFE_RECIPES);
  const customer = pickRandom(CAFE_CUSTOMER_NAMES);
  return {
    customer,
    recipeId: recipe.id,
    recipeLabel: recipe.label,
    recipeIcon: recipe.icon,
    stepIndex: 0,
    targetSteps: recipe.steps.map((step) => randomInt(step.options.length))
  };
}

function createCafeOrderPrompt(order) {
  const stepInfo = getCafeCurrentOrderStepInfo(order);
  const options = stepInfo.step.options.map((option, index) => `[${index + 1}] ${option}`).join(" • ");
  return `Sipariş: ${order.customer} için ${stepInfo.recipe.label}. Aşama ${stepInfo.stepIndex + 1}/${stepInfo.recipe.steps.length}: ${stepInfo.step.prompt}. ${options}`;
}

function prepareNextCafeOrder(delayMs = 0) {
  const game = worldState.cafe.game;
  game.currentOrder = createCafeOrder();
  const now = performance.now();
  const baseDuration = 15600 - Math.min(game.streak, 6) * 1100;
  game.orderEndAt = now + Math.max(9400, baseDuration) + delayMs;
}

function startCafeMiniGame() {
  const game = worldState.cafe.game;
  worldState.mouse.active = false;
  if (!game.active) {
    game.active = true;
    game.streak = 0;
  }

  if (!game.currentOrder) {
    prepareNextCafeOrder();
  }

  const orderText = createCafeOrderPrompt(game.currentOrder);
  if (!game.tutorialShown) {
    game.tutorialShown = true;
    setWorldChat(
      `Oyun başladı. Müşteri siparişi ekranın alt-ortasındaki "SİPARİŞ FİŞİ" panelinde. ${orderText}. 1-2-3 veya kutulara tıklayarak seçim yap, çıkış: Q.`,
      5600
    );
    return;
  }

  setWorldChat(`Yeni sipariş hazır. ${orderText}. 1-2-3 veya kutularla seçim yap.`, 3400);
}

function stopCafeMiniGame(showMessage = true) {
  const game = worldState.cafe.game;
  game.active = false;
  game.currentOrder = null;
  game.orderEndAt = 0;
  if (showMessage) {
    setWorldChat("Hazırlama oyunundan çıktın.", 1400);
  }
}

function resolveCafeGameChoice(choiceIndex) {
  const game = worldState.cafe.game;
  if (!game.active || !game.currentOrder) {
    return;
  }

  const stepInfo = getCafeCurrentOrderStepInfo(game.currentOrder);
  if (choiceIndex < 0 || choiceIndex >= stepInfo.step.options.length) {
    return;
  }

  const selectedLabel = stepInfo.step.options[choiceIndex];
  const correctChoiceIndex = game.currentOrder.targetSteps[stepInfo.stepIndex];
  const correctLabel = stepInfo.step.options[correctChoiceIndex];

  if (choiceIndex === correctChoiceIndex) {
    game.score += 4;
    game.currentOrder.stepIndex += 1;

    const isCompleted = game.currentOrder.stepIndex >= stepInfo.recipe.steps.length;
    if (isCompleted) {
      game.score += 12 + game.streak * 3;
      game.served += 1;
      game.streak += 1;
      setWorldChat(`${game.currentOrder.customer} için ${stepInfo.recipe.label} hazır. Harika servis! Seri x${game.streak}`, 1900);
      prepareNextCafeOrder(360);
      return;
    }

    const nextStepInfo = getCafeCurrentOrderStepInfo(game.currentOrder);
    game.orderEndAt += 1300;
    setWorldChat(`Doğru seçim: ${selectedLabel}. Sonraki adım: ${nextStepInfo.step.prompt}.`, 1550);
    return;
  }

  game.misses += 1;
  game.streak = 0;
  setWorldChat(`Olmadı. Doğru seçim ${correctLabel} olmalıydı.`, 1650);
  prepareNextCafeOrder(220);
}

function updateCafeMiniGame(now) {
  const game = worldState.cafe.game;
  if (!game.active || !game.currentOrder) {
    return;
  }

  if (now > game.orderEndAt) {
    const stepInfo = getCafeCurrentOrderStepInfo(game.currentOrder);
    game.misses += 1;
    game.streak = 0;
    setWorldChat(`Süre doldu. ${game.currentOrder.customer} için ${stepInfo.recipe.label} siparişi kaçtı.`, 1700);
    prepareNextCafeOrder(200);
  }
}

function getCafeGameOverlayLayout() {
  const panelW = 360;
  const panelH = 164;
  const panelX = Math.max(8, Math.floor((worldCanvas.width - panelW) / 2));
  const panelY = worldCanvas.height - panelH - 8;
  const choiceGap = 8;
  const choiceW = Math.floor((panelW - 28 - choiceGap * 2) / 3);
  const choiceH = 48;
  const choiceY = panelY + panelH - choiceH - 10;
  const choiceRects = [];

  for (let index = 0; index < 3; index += 1) {
    choiceRects.push({
      index,
      x: panelX + 10 + index * (choiceW + choiceGap),
      y: choiceY,
      w: choiceW,
      h: choiceH
    });
  }

  return {
    panelX,
    panelY,
    panelW,
    panelH,
    previewX: panelX + 12,
    previewY: panelY + 36,
    previewW: 98,
    previewH: 72,
    choiceRects
  };
}

function getCafeGameChoiceFromPoint(screenX, screenY) {
  const game = worldState.cafe.game;
  if (!game.active || !game.currentOrder) {
    return null;
  }

  const layout = getCafeGameOverlayLayout();
  const choice = layout.choiceRects.find((item) => {
    return screenX >= item.x && screenX <= item.x + item.w && screenY >= item.y && screenY <= item.y + item.h;
  });
  return choice ? choice.index : null;
}

function isPointInsideCafeGamePanel(screenX, screenY) {
  const game = worldState.cafe.game;
  if (!game.active || !game.currentOrder) {
    return false;
  }

  const layout = getCafeGameOverlayLayout();
  return (
    screenX >= layout.panelX &&
    screenX <= layout.panelX + layout.panelW &&
    screenY >= layout.panelY &&
    screenY <= layout.panelY + layout.panelH
  );
}

function enterCafeScene() {
  if (!worldState.player) {
    return;
  }

  stopClubDanceGame(false);
  worldState.cafe.previousWorldPosition = {
    x: worldState.player.x,
    y: worldState.player.y
  };
  worldState.mode = "cafe";
  worldState.cafe.seatedSeatId = null;
  worldState.cafe.seats.forEach((seat) => {
    seat.occupiedBy = null;
  });
  worldState.mouse.active = false;
  worldState.player.x = worldState.cafe.entryPoint.x;
  worldState.player.y = worldState.cafe.entryPoint.y;
  worldState.mouse.x = worldState.player.x;
  worldState.mouse.y = worldState.player.y;
  worldState.mouse.screenX = worldCanvas.width / 2;
  worldState.mouse.screenY = worldCanvas.height / 2;

  const baristaParts = buildNpcParts(13);
  worldState.cafe.barista = {
    name: "Barista Momo",
    x: 548,
    y: 140,
    parts: baristaParts,
    sprite: createMiuSpriteCanvas(baristaParts)
  };

  worldState.camera.x = clamp(worldState.player.x - worldCanvas.width / 2, 0, CAFE_WIDTH - worldCanvas.width);
  worldState.camera.y = clamp(worldState.player.y - worldCanvas.height / 2, 0, CAFE_HEIGHT - worldCanvas.height);
  worldState.currentZoneName = "Miyu Kafe İç Mekanı";
  ensureWorldAudio();
  setWorldChat("Kafeye hoş geldin. Masalara oturabilir, kasada kahve ve pasta hazırlama oyununu oynayabilirsin.", 3400);
}

function exitCafeScene() {
  if (!worldState.player) {
    return;
  }

  if (worldState.cafe.seatedSeatId) {
    standFromCafeSeat();
  }

  stopCafeMiniGame(false);
  worldState.mode = "square";
  worldState.mouse.active = false;

  const previousPosition = worldState.cafe.previousWorldPosition || { x: 130, y: 188 };
  worldState.player.x = previousPosition.x;
  worldState.player.y = previousPosition.y;
  worldState.mouse.x = worldState.player.x;
  worldState.mouse.y = worldState.player.y;
  worldState.mouse.screenX = worldCanvas.width / 2;
  worldState.mouse.screenY = worldCanvas.height / 2;
  worldState.camera.x = clamp(worldState.player.x - worldCanvas.width / 2, 0, WORLD_WIDTH - worldCanvas.width);
  worldState.camera.y = clamp(worldState.player.y - worldCanvas.height / 2, 0, WORLD_HEIGHT - worldCanvas.height);
  setWorldChat("Meydan tarafına geri döndün.", 1600);
}

function getClubSeatById(seatId) {
  return worldState.club.seats.find((seat) => seat.id === seatId) || null;
}

function getClubSeatDirection(seat) {
  if (!seat) {
    return "";
  }
  if (seat.direction) {
    return seat.direction;
  }
  const parts = seat.id.split("-");
  return parts[parts.length - 1] || "";
}

function getClubSeatSitPosition(seat) {
  const direction = getClubSeatDirection(seat);
  if (direction === "n") {
    return { x: seat.x, y: seat.y - 2 };
  }
  if (direction === "s") {
    return { x: seat.x, y: seat.y + 12 };
  }
  if (direction === "w") {
    return { x: seat.x - 8, y: seat.y + 6 };
  }
  if (direction === "e") {
    return { x: seat.x + 8, y: seat.y + 6 };
  }
  return { x: seat.x, y: seat.y + 12 };
}

function getClubSeatStandPosition(seat) {
  const direction = getClubSeatDirection(seat);
  let target = { x: seat.x, y: seat.y + 20 };
  if (direction === "n") {
    target = { x: seat.x, y: seat.y - 16 };
  } else if (direction === "s") {
    target = { x: seat.x, y: seat.y + 20 };
  } else if (direction === "w") {
    target = { x: seat.x - 20, y: seat.y + 8 };
  } else if (direction === "e") {
    target = { x: seat.x + 20, y: seat.y + 8 };
  }

  const activeSize = getActiveWorldSize();
  return {
    x: clamp(target.x, 14, activeSize.width - 14),
    y: clamp(target.y, 14, activeSize.height - 14)
  };
}

function getNearbyClubSeat() {
  if (!worldState.player || worldState.mode !== "club") {
    return null;
  }

  let nearest = null;
  let minDistance = 9999;
  worldState.club.seats.forEach((seat) => {
    const distance = Math.hypot(seat.x - worldState.player.x, seat.y - worldState.player.y);
    if (distance < 28 && distance < minDistance) {
      nearest = seat;
      minDistance = distance;
    }
  });
  return nearest;
}

function standFromClubSeat() {
  const seat = getClubSeatById(worldState.club.seatedSeatId);
  if (!seat || !worldState.player) {
    worldState.club.seatedSeatId = null;
    return;
  }

  seat.occupiedBy = null;
  worldState.club.seatedSeatId = null;
  const standPosition = getClubSeatStandPosition(seat);
  worldState.player.x = standPosition.x;
  worldState.player.y = standPosition.y;
}

function sitOnClubSeat(seat) {
  if (!worldState.player || !seat) {
    return;
  }

  if (seat.occupiedBy && seat.occupiedBy !== "player") {
    setWorldChat("Bu koltuk dolu, kenardaki başka bir yere otur.", 1600);
    return;
  }

  if (worldState.club.seatedSeatId && worldState.club.seatedSeatId !== seat.id) {
    standFromClubSeat();
  }

  worldState.club.seatedSeatId = seat.id;
  seat.occupiedBy = "player";
  const sitPosition = getClubSeatSitPosition(seat);
  worldState.player.x = sitPosition.x;
  worldState.player.y = sitPosition.y;
  setWorldChat("Kulüp kenarındaki koltuğa oturdun. E ile ayağa kalkabilirsin.", 1800);
}

function getClubDanceKeySymbol(key) {
  if (key === "w") {
    return "↑";
  }
  if (key === "a") {
    return "←";
  }
  if (key === "s") {
    return "↓";
  }
  if (key === "d") {
    return "→";
  }
  return "?";
}

function getClubDanceKeyLabel(key) {
  return `${key.toUpperCase()} ${getClubDanceKeySymbol(key)}`;
}

function createClubDanceSequence(length) {
  const sequence = [];
  for (let i = 0; i < length; i += 1) {
    sequence.push(CLUB_DANCE_KEYS[randomInt(CLUB_DANCE_KEYS.length)]);
  }
  return sequence;
}

function getClubDanceCurrentKey() {
  const game = worldState.club.game;
  if (!game.sequence.length || game.inputIndex >= game.sequence.length) {
    return null;
  }
  return game.sequence[game.inputIndex];
}

function getClubDanceKeyDurationMs() {
  const game = worldState.club.game;
  const sequenceLength = Math.max(1, game.sequence.length);
  const perKeyWindow = Math.max(
    CLUB_DANCE_KEY_TIME_MIN,
    CLUB_DANCE_KEY_TIME_BASE - Math.min(10, game.streak) * 55
  );
  return Math.max(3000, perKeyWindow * sequenceLength - Math.min(8, game.streak) * 120);
}

function setClubDanceStepTimer(delayMs = 0) {
  const game = worldState.club.game;
  game.keyDurationMs = getClubDanceKeyDurationMs();
  const now = performance.now();
  game.keyEndAt = now + game.keyDurationMs + delayMs;
  game.roundEndAt = game.keyEndAt;
}

function getClubDanceMsLeft(now = performance.now()) {
  const game = worldState.club.game;
  return Math.max(0, game.keyEndAt - now);
}

function markClubDanceInputFlash(key) {
  const game = worldState.club.game;
  game.inputFlashKey = key;
  game.inputFlashUntil = performance.now() + 220;
}

function prepareNextClubDanceRound(delayMs = 0) {
  const game = worldState.club.game;
  const sequenceLength = 4 + Math.min(4, Math.floor(game.streak / 2));
  game.sequence = createClubDanceSequence(sequenceLength);
  game.inputIndex = 0;
  setClubDanceStepTimer(delayMs);
}

function startClubDanceGame() {
  const game = worldState.club.game;
  worldState.mouse.active = false;
  worldState.keys.up = false;
  worldState.keys.down = false;
  worldState.keys.left = false;
  worldState.keys.right = false;
  if (!game.active) {
    game.active = true;
    game.streak = 0;
  }

  if (!game.sequence.length) {
    prepareNextClubDanceRound();
  }

  const sequencePreview = game.sequence.map((key) => key.toUpperCase()).join(" ");
  if (!game.tutorialShown) {
    game.tutorialShown = true;
    setWorldChat(`Dans oyunu başladı. Sıra panelini takip et: ${sequencePreview}. Tüm sırayı süre barı bitmeden tamamla. Tuşlar W A S D, çıkış: Q.`, 5200);
    return;
  }

  setWorldChat(`Yeni dans sırası: ${sequencePreview}. Süre barı bitmeden tüm sırayı tamamla!`, 2800);
}

function stopClubDanceGame(showMessage = true) {
  const game = worldState.club.game;
  game.active = false;
  game.sequence = [];
  game.inputIndex = 0;
  game.roundEndAt = 0;
  game.keyEndAt = 0;
  game.keyDurationMs = 0;
  game.inputFlashUntil = 0;
  game.inputFlashKey = "";
  if (showMessage) {
    setWorldChat("Dans oyunundan çıktın.", 1400);
  }
}

function resolveClubDanceInput(key) {
  const game = worldState.club.game;
  if (!game.active || !game.sequence.length) {
    return;
  }

  const expected = getClubDanceCurrentKey();
  if (!expected) {
    return;
  }

  markClubDanceInputFlash(key);

  if (key === expected) {
    game.inputIndex += 1;
    game.hits += 1;
    game.score += 3;
    if (game.inputIndex >= game.sequence.length) {
      game.rounds += 1;
      game.streak += 1;
      game.score += 10 + game.streak * 3;
      setWorldChat(`Kombo tamam! Seri x${game.streak}. Yeni sıra geliyor.`, 1600);
      prepareNextClubDanceRound(300);
      return;
    }

    const nextKey = getClubDanceCurrentKey();
    if (nextKey) {
      setWorldChat(`Doğru! Sıradaki: ${getClubDanceKeyLabel(nextKey)}`, 850);
    }
    return;
  }

  game.misses += 1;
  game.rounds += 1;
  game.streak = 0;
  setWorldChat(`Ritim kaçtı. Beklenen ${getClubDanceKeyLabel(expected)} idi.`, 1600);
  prepareNextClubDanceRound(280);
}

function updateClubDanceGame(now) {
  const game = worldState.club.game;
  if (!game.active || !game.sequence.length) {
    return;
  }

  if (now > game.keyEndAt) {
    const expected = getClubDanceCurrentKey();
    game.misses += 1;
    game.rounds += 1;
    game.streak = 0;
    if (expected) {
      setWorldChat(`Süre doldu. Beklenen tuş ${getClubDanceKeyLabel(expected)} idi. Yeni sıra başlıyor.`, 1700);
    } else {
      setWorldChat("Süre doldu. Ritim sıfırlandı, yeni sıra başlıyor.", 1600);
    }
    prepareNextClubDanceRound(250);
  }
}

function enterClubScene() {
  if (!worldState.player) {
    return;
  }

  stopCafeMiniGame(false);
  worldState.club.previousWorldPosition = {
    x: worldState.player.x,
    y: worldState.player.y
  };
  worldState.mode = "club";
  worldState.club.seatedSeatId = null;
  worldState.club.seats.forEach((seat) => {
    seat.occupiedBy = null;
  });
  worldState.mouse.active = false;
  worldState.player.x = worldState.club.entryPoint.x;
  worldState.player.y = worldState.club.entryPoint.y;
  worldState.mouse.x = worldState.player.x;
  worldState.mouse.y = worldState.player.y;
  worldState.mouse.screenX = worldCanvas.width / 2;
  worldState.mouse.screenY = worldCanvas.height / 2;

  const djParts = buildNpcParts(17);
  worldState.club.dj = {
    name: "DJ Tekir",
    x: 330,
    y: 112,
    parts: djParts,
    sprite: createMiuSpriteCanvas(djParts)
  };

  worldState.camera.x = clamp(worldState.player.x - worldCanvas.width / 2, 0, CLUB_WIDTH - worldCanvas.width);
  worldState.camera.y = clamp(worldState.player.y - worldCanvas.height / 2, 0, CLUB_HEIGHT - worldCanvas.height);
  worldState.currentZoneName = "Sahne Kulübü İç Mekanı";
  ensureWorldAudio();
  setWorldChat("Kulübe hoş geldin. Dans pistine girip ritim oyununu başlatabilir, kenardaki koltuklara oturabilirsin.", 3600);
}

function exitClubScene() {
  if (!worldState.player) {
    return;
  }

  if (worldState.club.seatedSeatId) {
    standFromClubSeat();
  }

  stopClubDanceGame(false);
  worldState.club.seatedSeatId = null;
  worldState.club.seats.forEach((seat) => {
    seat.occupiedBy = null;
  });
  worldState.mode = "square";
  worldState.mouse.active = false;

  const previousPosition = worldState.club.previousWorldPosition || { x: 690, y: 468 };
  worldState.player.x = previousPosition.x;
  worldState.player.y = previousPosition.y;
  worldState.mouse.x = worldState.player.x;
  worldState.mouse.y = worldState.player.y;
  worldState.mouse.screenX = worldCanvas.width / 2;
  worldState.mouse.screenY = worldCanvas.height / 2;
  worldState.camera.x = clamp(worldState.player.x - worldCanvas.width / 2, 0, WORLD_WIDTH - worldCanvas.width);
  worldState.camera.y = clamp(worldState.player.y - worldCanvas.height / 2, 0, WORLD_HEIGHT - worldCanvas.height);
  setWorldChat("Meydandaki kulüp girişine geri döndün.", 1600);
}

function paint(targetCtx, x, y, width, height, color) {
  targetCtx.fillStyle = color;
  targetCtx.fillRect(x, y, width, height);
}

function drawRowsWithOutline(targetCtx, { rows, top, centerX, fill, outline }) {
  const outerRows = [rows[0], ...rows, rows[rows.length - 1]];
  outerRows.forEach((rowWidth, index) => {
    const x = Math.floor(centerX - (rowWidth + 2) / 2);
    const y = top - 1 + index;
    paint(targetCtx, x, y, rowWidth + 2, 1, outline);
  });

  rows.forEach((rowWidth, index) => {
    const x = Math.floor(centerX - rowWidth / 2);
    const y = top + index;
    paint(targetCtx, x, y, rowWidth, 1, fill);
  });
}

function drawRowBlock(targetCtx, x, y, width, fill, outline) {
  paint(targetCtx, x - 1, y, width + 2, 1, outline);
  paint(targetCtx, x, y, width, 1, fill);
}

function drawBox(targetCtx, { x, y, width, height, fill, outline }) {
  paint(targetCtx, x - 1, y - 1, width + 2, height + 2, outline);
  paint(targetCtx, x, y, width, height, fill);
}

function clonePartState(source) {
  return {
    body: { ...source.body },
    ears: { ...source.ears },
    arms: { ...source.arms },
    feet: { ...source.feet }
  };
}

function getPartColor(partsState, partKey) {
  return PARTS[partKey].colors[partsState[partKey].color].hex;
}

function drawBackground(targetCtx) {
  paint(targetCtx, 0, 0, 32, 32, "#ECF7EF");
  paint(targetCtx, 0, 28, 32, 4, "#CBE9DA");
  paint(targetCtx, 2, 4, 1, 1, "#D5EEDC");
  paint(targetCtx, 28, 6, 1, 1, "#D5EEDC");
  paint(targetCtx, 24, 2, 1, 1, "#D5EEDC");
  paint(targetCtx, 8, 7, 1, 1, "#D5EEDC");
}

function drawEars(targetCtx, styleIndex, fill, outline) {
  if (styleIndex === 0) {
    const leftRows = [
      { x: 10, w: 1 },
      { x: 9, w: 2 },
      { x: 8, w: 3 },
      { x: 7, w: 4 }
    ];
    leftRows.forEach((row, rowIndex) => {
      drawRowBlock(targetCtx, row.x, 4 + rowIndex, row.w, fill, outline);
      drawRowBlock(targetCtx, 32 - row.x - row.w, 4 + rowIndex, row.w, fill, outline);
    });
    return;
  }

  if (styleIndex === 1) {
    const leftRows = [
      { x: 8, w: 3 },
      { x: 7, w: 4 },
      { x: 7, w: 4 },
      { x: 8, w: 3 }
    ];
    leftRows.forEach((row, rowIndex) => {
      drawRowBlock(targetCtx, row.x, 5 + rowIndex, row.w, fill, outline);
      drawRowBlock(targetCtx, 32 - row.x - row.w, 5 + rowIndex, row.w, fill, outline);
    });
    return;
  }

  const leftRows = [
    { x: 9, w: 2 },
    { x: 8, w: 3 },
    { x: 8, w: 3 },
    { x: 9, w: 2 },
    { x: 9, w: 2 }
  ];
  leftRows.forEach((row, rowIndex) => {
    drawRowBlock(targetCtx, row.x, 3 + rowIndex, row.w, fill, outline);
    drawRowBlock(targetCtx, 32 - row.x - row.w, 3 + rowIndex, row.w, fill, outline);
  });
}

function drawArms(targetCtx, styleIndex, fill, outline) {
  if (styleIndex === 0) {
    drawBox(targetCtx, { x: 5, y: 16, width: 3, height: 6, fill, outline });
    drawBox(targetCtx, { x: 24, y: 16, width: 3, height: 6, fill, outline });
    return;
  }

  if (styleIndex === 1) {
    drawBox(targetCtx, { x: 4, y: 14, width: 3, height: 9, fill, outline });
    drawBox(targetCtx, { x: 25, y: 14, width: 3, height: 9, fill, outline });
    return;
  }

  drawBox(targetCtx, { x: 6, y: 18, width: 2, height: 4, fill, outline });
  drawBox(targetCtx, { x: 24, y: 18, width: 2, height: 4, fill, outline });
}

function drawFeet(targetCtx, styleIndex, fill, outline) {
  if (styleIndex === 0) {
    drawBox(targetCtx, { x: 10, y: 25, width: 5, height: 3, fill, outline });
    drawBox(targetCtx, { x: 17, y: 25, width: 5, height: 3, fill, outline });
    return;
  }

  if (styleIndex === 1) {
    drawBox(targetCtx, { x: 9, y: 24, width: 6, height: 4, fill, outline });
    drawBox(targetCtx, { x: 17, y: 24, width: 6, height: 4, fill, outline });
    return;
  }

  drawBox(targetCtx, { x: 11, y: 26, width: 4, height: 2, fill, outline });
  drawBox(targetCtx, { x: 17, y: 26, width: 4, height: 2, fill, outline });
}

function drawBody(targetCtx, styleIndex, fill, outline) {
  if (styleIndex === 0) {
    drawRowsWithOutline(targetCtx, {
      rows: [8, 10, 12, 14, 16, 16, 16, 16, 16, 16, 14, 12, 10, 8],
      top: 9,
      centerX: 16,
      fill,
      outline
    });
    return;
  }

  if (styleIndex === 1) {
    drawRowsWithOutline(targetCtx, {
      rows: [6, 8, 10, 12, 13, 13, 13, 13, 13, 13, 13, 12, 10, 8, 6],
      top: 8,
      centerX: 16,
      fill,
      outline
    });
    return;
  }

  drawRowsWithOutline(targetCtx, {
    rows: [12, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 12],
    top: 10,
    centerX: 16,
    fill,
    outline
  });
}

function drawFace(targetCtx) {
  paint(targetCtx, 12, 16, 2, 2, "#1F2B25");
  paint(targetCtx, 18, 16, 2, 2, "#1F2B25");
  paint(targetCtx, 14, 20, 4, 1, "#1F2B25");
  paint(targetCtx, 15, 21, 2, 1, "#1F2B25");
  paint(targetCtx, 10, 19, 2, 1, "#F9B4B4");
  paint(targetCtx, 20, 19, 2, 1, "#F9B4B4");
}

function renderMiuWithParts(targetCtx, partsState, includeBackground = true) {
  if (includeBackground) {
    drawBackground(targetCtx);
  } else {
    targetCtx.clearRect(0, 0, 32, 32);
  }

  const feetColor = getPartColor(partsState, "feet");
  const armsColor = getPartColor(partsState, "arms");
  const earsColor = getPartColor(partsState, "ears");
  const bodyColor = getPartColor(partsState, "body");

  drawFeet(targetCtx, partsState.feet.style, feetColor, darken(feetColor, 0.32));
  drawArms(targetCtx, partsState.arms.style, armsColor, darken(armsColor, 0.32));
  drawEars(targetCtx, partsState.ears.style, earsColor, darken(earsColor, 0.32));
  drawBody(targetCtx, partsState.body.style, bodyColor, darken(bodyColor, 0.35));
  drawFace(targetCtx);
}

function renderMiu(targetCtx) {
  renderMiuWithParts(targetCtx, state, true);
}

function updateControlValues(partKey) {
  const partState = state[partKey];
  const config = PARTS[partKey];
  const styleName = config.styles[partState.style];
  const colorInfo = config.colors[partState.color];

  const styleValue = document.getElementById(`${partKey}-style-value`);
  const colorValue = document.getElementById(`${partKey}-color-value`);

  styleValue.textContent = styleName;
  colorValue.innerHTML = `<span class="swatch" style="background:${colorInfo.hex};"></span>${colorInfo.name}`;
}

function buildControls() {
  Object.entries(PARTS).forEach(([partKey, partConfig], index) => {
    const card = document.createElement("section");
    card.className = "part-card";
    card.style.setProperty("--delay", `${index * 70}ms`);
    card.innerHTML = `
      <h2>${partConfig.label}</h2>
      <div class="control-row">
        <button class="arrow-button" data-part="${partKey}" data-type="style" data-dir="-1" type="button" aria-label="${partConfig.label} stil geri">&#9664;</button>
        <div class="control-value"><span class="control-label">Stil</span> <span id="${partKey}-style-value"></span></div>
        <button class="arrow-button" data-part="${partKey}" data-type="style" data-dir="1" type="button" aria-label="${partConfig.label} stil ileri">&#9654;</button>
      </div>
      <div class="control-row">
        <button class="arrow-button" data-part="${partKey}" data-type="color" data-dir="-1" type="button" aria-label="${partConfig.label} renk geri">&#9664;</button>
        <div class="control-value"><span class="control-label">Renk</span> <span id="${partKey}-color-value"></span></div>
        <button class="arrow-button" data-part="${partKey}" data-type="color" data-dir="1" type="button" aria-label="${partConfig.label} renk ileri">&#9654;</button>
      </div>
    `;

    controlsPanel.appendChild(card);
    updateControlValues(partKey);
  });
}

function randomizeMiuStyle() {
  Object.keys(PARTS).forEach((partKey) => {
    state[partKey].style = randomInt(PARTS[partKey].styles.length);
    state[partKey].color = randomInt(PARTS[partKey].colors.length);
    updateControlValues(partKey);
  });
  syncAllMiuViews();
}

function buildMiuSummaryRows() {
  return Object.entries(PARTS).map(([partKey, partConfig]) => {
    const styleName = partConfig.styles[state[partKey].style];
    const colorName = partConfig.colors[state[partKey].color].name;

    return {
      part: partConfig.label,
      detail: `${styleName} / ${colorName}`
    };
  });
}

function renderMiuSummary() {
  const rows = buildMiuSummaryRows();
  miuBuildList.innerHTML = "";

  rows.forEach((row) => {
    const item = document.createElement("li");
    item.innerHTML = `<span class="build-key">${row.part}</span><span class="build-value">${row.detail}</span>`;
    miuBuildList.appendChild(item);
  });
}

function getWorldById(worldId) {
  return WORLD_OPTIONS.find((world) => world.id === worldId);
}

function updateSelectedWorldText() {
  const world = getWorldById(state.selectedWorldId);
  selectedWorldText.textContent = `Seçilen dünya: ${world.name} (${world.vibe})`;
}

function updateMiuNameText() {
  const label = state.miuName || "-";
  lobbyMiuName.textContent = `Miu adı: ${label}`;
}

function setSelectedWorld(worldId) {
  state.selectedWorldId = worldId;
  const cards = worldList.querySelectorAll("[data-world-id]");
  cards.forEach((card) => {
    const isActive = card.dataset.worldId === worldId;
    card.classList.toggle("is-selected", isActive);
    card.setAttribute("aria-selected", String(isActive));
  });
  updateSelectedWorldText();
}

function buildWorldCards() {
  WORLD_OPTIONS.forEach((world) => {
    const card = document.createElement("button");
    card.className = "world-card";
    card.type = "button";
    card.dataset.worldId = world.id;
    card.setAttribute("role", "option");
    card.setAttribute("aria-selected", "false");
    card.innerHTML = `
      <span>
        <span class="world-title">${world.name}</span>
        <span class="world-subtitle">${world.vibe}</span>
      </span>
      <span class="world-badge">${world.crowd}</span>
    `;
    worldList.appendChild(card);
  });

  setSelectedWorld(state.selectedWorldId);
}

function createMiuSpriteCanvas(partsState) {
  const spriteCanvas = document.createElement("canvas");
  spriteCanvas.width = 32;
  spriteCanvas.height = 32;
  const spriteCtx = spriteCanvas.getContext("2d");
  spriteCtx.imageSmoothingEnabled = false;
  renderMiuWithParts(spriteCtx, partsState, false);
  return spriteCanvas;
}

function buildNpcParts(index) {
  const parts = clonePartState(state);
  const partKeys = Object.keys(PARTS);
  partKeys.forEach((partKey) => {
    parts[partKey].style = (index + randomInt(PARTS[partKey].styles.length)) % PARTS[partKey].styles.length;
    parts[partKey].color = (index + 1 + randomInt(PARTS[partKey].colors.length)) % PARTS[partKey].colors.length;
  });
  return parts;
}

function pickNpcDirection() {
  const angle = Math.random() * Math.PI * 2;
  return {
    vx: Math.cos(angle) * WORLD_NPC_SPEED,
    vy: Math.sin(angle) * WORLD_NPC_SPEED
  };
}

function buildWorldNpcs() {
  const spawn = [
    { x: 218, y: 266 },
    { x: 352, y: 286 },
    { x: 502, y: 278 },
    { x: 646, y: 268 },
    { x: 266, y: 470 },
    { x: 486, y: 484 },
    { x: 620, y: 470 }
  ];

  return WORLD_NPC_DEFS.map((npcDef, index) => {
    const parts = buildNpcParts(index + 1);
    const direction = pickNpcDirection();
    return {
      ...npcDef,
      x: spawn[index].x,
      y: spawn[index].y,
      parts,
      sprite: createMiuSpriteCanvas(parts),
      vx: direction.vx,
      vy: direction.vy,
      turnAt: 0,
      nextTalkAt: 0
    };
  });
}

function buildWorldInteractables() {
  return [
    {
      id: "cafe",
      label: "Kafe",
      x: 156,
      y: 177,
      w: 32,
      h: 18,
      message: "Kafe: Sıcak kakao, waffle ve sohbet masaları hazır."
    },
    {
      id: "mini-games-board",
      label: "Mini Oyun Panosu",
      x: 420,
      y: 161,
      w: 34,
      h: 18,
      message: "Mini Oyun Panosu: Kart Yarışı, Buz Kaydırağı ve Kartopu Arenası sırada."
    },
    {
      id: "market",
      label: "Miyu Pazarı",
      x: 291,
      y: 265,
      w: 30,
      h: 18,
      message: "Miyu Pazarı: Kozmetik takas noktası çok yakında açılıyor."
    },
    {
      id: "fountain",
      label: "Merkez Çeşme",
      x: 421,
      y: 266,
      w: 20,
      h: 20,
      message: "Çeşme: Buradan anlık etkinlik duyurularını takip edebilirsin."
    },
    {
      id: "portal",
      label: "Portal Merkezi",
      x: 682,
      y: 178,
      w: 34,
      h: 18,
      message: "Portal Merkezi: Bulut İskele ve Güneşli Orman geçişleri yakında aktif."
    },
    {
      id: "fashion-shop",
      label: "Moda Dükkanı",
      x: 150,
      y: 457,
      w: 32,
      h: 18,
      message: "Moda Dükkanı: Kostüm, şapka ve aksesuar setleri yenilendi."
    },
    {
      id: "pet-park",
      label: "Pet Park",
      x: 414,
      y: 487,
      w: 36,
      h: 18,
      message: "Pet Park: Dostlarınla mini parkur oynayabileceğin alan hazırlanıyor."
    },
    {
      id: "stage-club",
      label: "Sahne Kulübü",
      x: 680,
      y: 466,
      w: 36,
      h: 18,
      message: "Sahne Kulübü: DJ gecesi ve dans partisi etkinliği 20:00'de."
    },
    {
      id: "notice-board",
      label: "Duyuru Panosu",
      x: 500,
      y: 235,
      w: 24,
      h: 16,
      message: "Duyuru Panosu: Bugün 3 sosyal etkinlik planlandı."
    },
    {
      id: "daily-gift",
      label: "Sürpriz Kutu",
      x: 538,
      y: 306,
      w: 22,
      h: 16,
      message: "Sürpriz Kutu: Günlük hediyeni almak için yaklaş."
    }
  ];
}

function buildSnowDots() {
  if (worldState.snowDots.length > 0) {
    return;
  }

  for (let i = 0; i < 190; i += 1) {
    worldState.snowDots.push({
      x: randomInt(WORLD_WIDTH),
      y: randomInt(WORLD_HEIGHT),
      r: Math.random() > 0.8 ? 2 : 1
    });
  }
}

function initializeMiyuSquareWorld() {
  buildSnowDots();
  const playerParts = clonePartState(state);
  const playerSprite = createMiuSpriteCanvas(playerParts);
  const worldInfo = getWorldById("miu-square");
  worldState.mode = "square";
  worldState.partyStars = 0;
  worldState.dailyGiftClaimed = false;
  worldState.collectibles = createSquareCollectibles(WORLD_START_COLLECTIBLE_COUNT);
  worldState.nextCollectibleRespawnAt = performance.now() + WORLD_COLLECTIBLE_RESPAWN_MS;
  worldState.emote.text = "";
  worldState.emote.until = 0;
  worldState.cafe = createCafeSceneState();
  worldState.club = createClubSceneState();

  worldState.player = {
    name: state.miuName || "Miu",
    x: 430,
    y: 350,
    parts: playerParts,
    sprite: playerSprite
  };
  worldState.npcs = buildWorldNpcs();
  worldState.interactables = buildWorldInteractables();
  worldState.keys.up = false;
  worldState.keys.down = false;
  worldState.keys.left = false;
  worldState.keys.right = false;
  worldState.mouse.active = false;
  worldState.mouse.x = worldState.player.x;
  worldState.mouse.y = worldState.player.y;
  worldState.mouse.screenX = worldCanvas.width / 2;
  worldState.mouse.screenY = worldCanvas.height / 2;
  worldState.camera.x = clamp(worldState.player.x - worldCanvas.width / 2, 0, WORLD_WIDTH - worldCanvas.width);
  worldState.camera.y = clamp(worldState.player.y - worldCanvas.height / 2, 0, WORLD_HEIGHT - worldCanvas.height);
  worldState.currentZoneName = getCurrentZoneName(worldState.player.x, worldState.player.y);

  worldTitleText.textContent = worldInfo.name;
  worldStatusText.textContent = `${worldState.player.name} olarak giriş yaptın • ${worldInfo.crowd} çevrimiçi • Bölge: ${worldState.currentZoneName}`;
  worldHelpText.textContent = "Mouse'a basılı tutup joystick gibi sür veya WASD kullan. E ile etkileşime geç, F ile emote yap.";
  refreshEventCycle(false);
  updateWorldStatus();
  setWorldChat("Miyu Meydanı yenilendi: daha kompakt alan, daha fazla bölge ve saatlik etkinlikler seni bekliyor.", 3800);
}

function setWorldChat(text, durationMs = 2200) {
  worldState.chatText = text;
  worldState.chatUntil = performance.now() + durationMs;
  worldChatText.textContent = text;
}

function intersectsRect(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function getHitboxAt(x, y) {
  return {
    x: x - 9,
    y: y - 7,
    w: 18,
    h: 12
  };
}

function isWorldBlocked(hitbox) {
  const activeSize = getActiveWorldSize();
  if (hitbox.x < 10 || hitbox.y < 10 || hitbox.x + hitbox.w > activeSize.width - 10 || hitbox.y + hitbox.h > activeSize.height - 10) {
    return true;
  }

  return getActiveWorldBlocks().some((block) => intersectsRect(hitbox, block));
}

function getInteractableDistance(interactable, x, y) {
  const centerX = interactable.x + interactable.w / 2;
  const centerY = interactable.y + interactable.h / 2;
  return Math.hypot(centerX - x, centerY - y);
}

function getNearbyInteractable() {
  if (!worldState.player || worldState.mode !== "square") {
    return null;
  }

  const { x, y } = worldState.player;
  let nearest = null;
  let minDistance = 9999;

  worldState.interactables.forEach((interactable) => {
    const distance = getInteractableDistance(interactable, x, y);
    if (distance < 44 && distance < minDistance) {
      nearest = interactable;
      minDistance = distance;
    }
  });

  return nearest;
}

function getNearbyNpc() {
  if (!worldState.player || worldState.mode !== "square") {
    return null;
  }

  const { x, y } = worldState.player;
  let nearestNpc = null;
  let minDistance = 9999;

  worldState.npcs.forEach((npc) => {
    const distance = Math.hypot(npc.x - x, npc.y - y);
    if (distance < 42 && distance < minDistance) {
      nearestNpc = npc;
      minDistance = distance;
    }
  });

  return nearestNpc;
}

function interactWithNpc(npc) {
  const eventLine = getNpcEventLine();
  const linePool = eventLine ? [...npc.lines, eventLine] : [...npc.lines];
  setWorldChat(`${npc.name}: ${pickRandom(linePool)}`, 2600);
  npc.nextTalkAt = performance.now() + 4200;
}

function interactWithObject(interactable) {
  if (interactable.id === "cafe") {
    enterCafeScene();
    return;
  }
  if (interactable.id === "stage-club") {
    enterClubScene();
    return;
  }
  if (interactable.id === "daily-gift") {
    if (worldState.dailyGiftClaimed) {
      setWorldChat("Bugünkü sürpriz kutunu zaten açtın. Yarın yine kontrol et.", 1800);
      return;
    }

    const reward = 4 + randomInt(5);
    worldState.dailyGiftClaimed = true;
    worldState.partyStars += reward;
    triggerPlayerEmote("HEDIYE!");
    setWorldChat(`Sürpriz kutudan ${reward} Miyu Yıldızı kazandın. Toplam: ${worldState.partyStars}`, 2200);
    return;
  }

  setWorldChat(interactable.message, 3000);
}

function interactInWorld() {
  if (worldState.mode === "cafe") {
    if (worldState.cafe.seatedSeatId) {
      standFromCafeSeat();
      setWorldChat("Ayağa kalktın.", 1200);
      return;
    }

    const seat = getNearbyCafeSeat();
    if (seat) {
      sitOnCafeSeat(seat);
      return;
    }

    const counterDistance = getDistanceToZone(worldState.cafe.counterZone, worldState.player.x, worldState.player.y);
    if (counterDistance < 74) {
      startCafeMiniGame();
      return;
    }

    const exitDistance = getDistanceToZone(worldState.cafe.exitZone, worldState.player.x, worldState.player.y);
    if (exitDistance < 56) {
      exitCafeScene();
      return;
    }

    setWorldChat("Kafede etkileşim için masalara, kasaya veya çıkış kapısına yaklaş.", 1500);
    return;
  }

  if (worldState.mode === "club") {
    const game = worldState.club.game;
    if (game.active) {
      setWorldChat("Dans oyunu aktif. Sırayı W A S D ile tamamla veya Q ile çık.", 1400);
      return;
    }

    if (worldState.club.seatedSeatId) {
      standFromClubSeat();
      setWorldChat("Ayağa kalktın.", 1200);
      return;
    }

    const seat = getNearbyClubSeat();
    if (seat) {
      sitOnClubSeat(seat);
      return;
    }

    if (isPointInsideZone(worldState.club.danceZone, worldState.player.x, worldState.player.y)) {
      startClubDanceGame();
      return;
    }

    const danceDistance = getDistanceToZone(worldState.club.danceZone, worldState.player.x, worldState.player.y);
    if (danceDistance < 96) {
      setWorldChat("Dans pisti için biraz daha ortaya ilerle ve E bas.", 1300);
      return;
    }

    const exitDistance = getDistanceToZone(worldState.club.exitZone, worldState.player.x, worldState.player.y);
    if (exitDistance < 56) {
      exitClubScene();
      return;
    }

    setWorldChat("Kulüpte etkileşim için koltuklara, dans pistine veya çıkış kapısına yaklaş.", 1500);
    return;
  }

  const interactable = getNearbyInteractable();
  if (interactable) {
    interactWithObject(interactable);
    return;
  }

  const npc = getNearbyNpc();
  if (npc) {
    interactWithNpc(npc);
    return;
  }

  setWorldChat("Yakında etkileşime girecek bir şey yok.", 1500);
}

function getCanvasLocalPoint(event) {
  const rect = worldCanvas.getBoundingClientRect();
  const scaleX = worldCanvas.width / rect.width;
  const scaleY = worldCanvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

function getCanvasPoint(event) {
  const local = getCanvasLocalPoint(event);
  return {
    x: local.x + worldState.camera.x,
    y: local.y + worldState.camera.y
  };
}

function setWorldMousePosition(event) {
  const local = getCanvasLocalPoint(event);
  const point = getCanvasPoint(event);
  const activeSize = getActiveWorldSize();
  worldState.mouse.screenX = local.x;
  worldState.mouse.screenY = local.y;
  worldState.mouse.x = clamp(point.x, 0, activeSize.width);
  worldState.mouse.y = clamp(point.y, 0, activeSize.height);
}

function handleWorldMouseDown(event) {
  if (!worldState.running || !worldState.player) {
    return;
  }

  if (worldState.mode === "club" && worldState.club.game.active) {
    event.preventDefault();
    worldState.mouse.active = false;
    return;
  }

  if (worldState.mode === "cafe" && worldState.cafe.game.active) {
    const localPoint = getCanvasLocalPoint(event);
    const choiceIndex = getCafeGameChoiceFromPoint(localPoint.x, localPoint.y);
    if (choiceIndex !== null) {
      event.preventDefault();
      ensureWorldAudio();
      worldState.mouse.active = false;
      resolveCafeGameChoice(choiceIndex);
      return;
    }

    if (isPointInsideCafeGamePanel(localPoint.x, localPoint.y)) {
      event.preventDefault();
      worldState.mouse.active = false;
      return;
    }
  }

  event.preventDefault();
  ensureWorldAudio();
  setWorldMousePosition(event);
  worldState.mouse.active = true;
}

function handleWorldMouseMove(event) {
  if (!worldState.running || !worldState.player || !worldState.mouse.active) {
    return;
  }

  setWorldMousePosition(event);
}

function handleWorldMouseUp() {
  worldState.mouse.active = false;
}

function setMovementKey(key, value) {
  if (key === "arrowup" || key === "w") {
    worldState.keys.up = value;
  } else if (key === "arrowdown" || key === "s") {
    worldState.keys.down = value;
  } else if (key === "arrowleft" || key === "a") {
    worldState.keys.left = value;
  } else if (key === "arrowright" || key === "d") {
    worldState.keys.right = value;
  }
}

function getMouseDriveVector() {
  if (!worldState.mouse.active || !worldState.player) {
    return { x: 0, y: 0, magnitude: 0 };
  }

  const playerScreenX = worldState.player.x - worldState.camera.x;
  const playerScreenY = worldState.player.y - worldState.camera.y;
  const deltaX = worldState.mouse.screenX - playerScreenX;
  const deltaY = worldState.mouse.screenY - playerScreenY;
  const distance = Math.hypot(deltaX, deltaY);
  if (distance <= WORLD_JOYSTICK_DEADZONE) {
    return { x: 0, y: 0, magnitude: 0 };
  }

  const analogStrength = Math.min(1, (distance - WORLD_JOYSTICK_DEADZONE) / (WORLD_JOYSTICK_MAX_DISTANCE - WORLD_JOYSTICK_DEADZONE));
  return {
    x: (deltaX / distance) * analogStrength,
    y: (deltaY / distance) * analogStrength,
    magnitude: analogStrength
  };
}

function updateNpcMovement(npc, dt, now) {
  if (npc.turnAt <= now) {
    const direction = pickNpcDirection();
    npc.vx = direction.vx;
    npc.vy = direction.vy;
    npc.turnAt = now + 1300 + randomInt(2200);
  }

  const nextX = npc.x + npc.vx * dt;
  const nextY = npc.y + npc.vy * dt;

  const xHitbox = getHitboxAt(nextX, npc.y);
  if (!isWorldBlocked(xHitbox)) {
    npc.x = nextX;
  } else {
    npc.vx *= -1;
  }

  const yHitbox = getHitboxAt(npc.x, nextY);
  if (!isWorldBlocked(yHitbox)) {
    npc.y = nextY;
  } else {
    npc.vy *= -1;
  }
}

function updateNpcs(dt, now) {
  if (worldState.mode !== "square") {
    return;
  }

  worldState.npcs.forEach((npc) => {
    updateNpcMovement(npc, dt, now);
    if (!worldState.player) {
      return;
    }

    const distance = Math.hypot(npc.x - worldState.player.x, npc.y - worldState.player.y);
    if (distance < 40 && npc.nextTalkAt <= now) {
      const eventLine = getNpcEventLine();
      const linePool = eventLine ? [...npc.lines, eventLine] : [...npc.lines];
      setWorldChat(`${npc.name}: ${pickRandom(linePool)}`, 2400);
      npc.nextTalkAt = now + 5200 + randomInt(2600);
    }
  });
}

function updateWorldCamera() {
  if (!worldState.player) {
    return;
  }

  const activeSize = getActiveWorldSize();
  const targetX = clamp(worldState.player.x - worldCanvas.width / 2, 0, activeSize.width - worldCanvas.width);
  const targetY = clamp(worldState.player.y - worldCanvas.height / 2, 0, activeSize.height - worldCanvas.height);

  worldState.camera.x += (targetX - worldState.camera.x) * 0.16;
  worldState.camera.y += (targetY - worldState.camera.y) * 0.16;
}

function updateWorldStatus() {
  if (!worldState.player) {
    return;
  }

  if (worldState.mode === "cafe") {
    worldState.currentZoneName = "Miyu Kafe İç Mekanı";
    const ambience = getCurrentAmbienceProfile();
    const game = worldState.cafe.game;
    let orderLabel = "-";
    if (game.currentOrder) {
      const stepInfo = getCafeCurrentOrderStepInfo(game.currentOrder);
      orderLabel = `${game.currentOrder.customer}: ${stepInfo.recipe.label} (${stepInfo.stepIndex + 1}/${stepInfo.recipe.steps.length})`;
    }
    worldStatusText.textContent = `${worldState.player.name} • Bölge: Miyu Kafe İç Mekanı • Ambiyans: ${ambience.label} • Yıldız: ${worldState.partyStars} • Skor: ${game.score} • Tamamlanan: ${game.served} • Kaçan: ${game.misses} • Sipariş: ${orderLabel}`;
    return;
  }

  if (worldState.mode === "club") {
    worldState.currentZoneName = "Sahne Kulübü İç Mekanı";
    const ambience = getCurrentAmbienceProfile();
    const game = worldState.club.game;
    const nextKey = getClubDanceCurrentKey();
    const nextKeyLabel = nextKey ? getClubDanceKeyLabel(nextKey) : "-";
    const secondsLeft = game.active ? Math.ceil(getClubDanceMsLeft() / 1000) : 0;
    const timeLabel = game.active ? `${secondsLeft}s` : "-";
    worldStatusText.textContent = `${worldState.player.name} • Bölge: Sahne Kulübü • Ambiyans: ${ambience.label} • Yıldız: ${worldState.partyStars} • Skor: ${game.score} • Tur: ${game.rounds} • Seri: x${game.streak} • Kaçan: ${game.misses} • Sıradaki Tuş: ${nextKeyLabel} • Süre: ${timeLabel}`;
    return;
  }

  const zoneInfo = getCurrentZone(worldState.player.x, worldState.player.y);
  const zoneName = zoneInfo ? zoneInfo.name : "Meydan Çevresi";
  worldState.currentZoneName = zoneName;

  const nearbyCount = worldState.npcs.reduce((count, npc) => {
    return Math.hypot(npc.x - worldState.player.x, npc.y - worldState.player.y) < 150 ? count + 1 : count;
  }, 0);

  const worldInfo = getWorldById("miu-square");
  const ambience = getCurrentAmbienceProfile();
  const eventTitle = worldState.eventCycle.currentEvent ? worldState.eventCycle.currentEvent.title : "Hazırlanıyor";
  worldStatusText.textContent = `${worldState.player.name} • Bölge: ${zoneName} • Etkinlik: ${eventTitle} • Ambiyans: ${ambience.label} • Yıldız: ${worldState.partyStars} • Yakınında ${nearbyCount} miu • ${worldInfo.crowd} çevrimiçi`;
}

function updatePlayerMovement(dt) {
  if (!worldState.player) {
    return;
  }

  if (worldState.mode === "cafe" && worldState.cafe.seatedSeatId) {
    return;
  }
  if (worldState.mode === "club" && (worldState.club.seatedSeatId || worldState.club.game.active)) {
    return;
  }

  let keyX = 0;
  let keyY = 0;
  if (worldState.keys.left) {
    keyX -= 1;
  }
  if (worldState.keys.right) {
    keyX += 1;
  }
  if (worldState.keys.up) {
    keyY -= 1;
  }
  if (worldState.keys.down) {
    keyY += 1;
  }

  if (keyX !== 0 || keyY !== 0) {
    const keyLength = Math.hypot(keyX, keyY);
    keyX /= keyLength;
    keyY /= keyLength;
  }

  const mouseVector = getMouseDriveVector();
  const inputX = keyX + mouseVector.x;
  const inputY = keyY + mouseVector.y;
  const inputLength = Math.hypot(inputX, inputY);
  if (inputLength === 0) {
    return;
  }

  const normalizedX = inputX / inputLength;
  const normalizedY = inputY / inputLength;
  const speedFactor = Math.min(1, inputLength);
  const moveDistance = WORLD_PLAYER_SPEED * dt * speedFactor;
  const stepX = normalizedX * moveDistance;
  const stepY = normalizedY * moveDistance;
  let moved = false;

  const nextX = worldState.player.x + stepX;
  const xHitbox = getHitboxAt(nextX, worldState.player.y);
  if (!isWorldBlocked(xHitbox)) {
    worldState.player.x = nextX;
    moved = true;
  }

  const nextY = worldState.player.y + stepY;
  const yHitbox = getHitboxAt(worldState.player.x, nextY);
  if (!isWorldBlocked(yHitbox)) {
    worldState.player.y = nextY;
    moved = true;
  }

  if (!moved) {
    return;
  }
}

function updateWorldHint() {
  if (worldState.mode === "cafe") {
    const game = worldState.cafe.game;
    if (game.active && game.currentOrder) {
      const secondsLeft = Math.max(0, Math.ceil((game.orderEndAt - performance.now()) / 1000));
      const stepInfo = getCafeCurrentOrderStepInfo(game.currentOrder);
      const options = stepInfo.step.options.map((option, index) => `[${index + 1}] ${option}`).join(" • ");
      worldHelpText.textContent = `Sipariş fişi alt-ortada: ${game.currentOrder.customer} ${stepInfo.recipe.label}. ${stepInfo.stepIndex + 1}/${stepInfo.recipe.steps.length} ${stepInfo.step.prompt}. ${options} • ${secondsLeft}s • Çıkış: Q`;
      return;
    }

    if (worldState.cafe.seatedSeatId) {
      worldHelpText.textContent = "Kafede oturuyorsun. E ile ayağa kalkabilirsin.";
      return;
    }

    const seat = getNearbyCafeSeat();
    if (seat) {
      worldHelpText.textContent = "Bu sandalyeye oturmak için E bas.";
      return;
    }

    const counterDistance = getDistanceToZone(worldState.cafe.counterZone, worldState.player.x, worldState.player.y);
    if (counterDistance < 78) {
      worldHelpText.textContent = "Kasa oyunu için E bas. Sipariş fişi alt-ortada açılır; 1-2-3 veya tıklama ile seçim yap.";
      return;
    }

    const exitDistance = getDistanceToZone(worldState.cafe.exitZone, worldState.player.x, worldState.player.y);
    if (exitDistance < 60) {
      worldHelpText.textContent = "Meydana dönmek için E bas.";
      return;
    }

    worldHelpText.textContent = "Kafede WASD veya mouse joystick ile dolaş. E ile otur/oyun/çıkış, F ile emote.";
    return;
  }

  if (worldState.mode === "club") {
    const game = worldState.club.game;
    if (game.active && game.sequence.length) {
      const secondsLeft = Math.ceil(getClubDanceMsLeft() / 1000);
      const sequenceText = game.sequence.map((key, index) => {
        if (index < game.inputIndex) {
          return `[${key.toUpperCase()}]`;
        }
        if (index === game.inputIndex) {
          return `<${key.toUpperCase()}>`;
        }
        return key.toUpperCase();
      }).join(" ");
      const nextKey = getClubDanceCurrentKey();
      worldHelpText.textContent = `Dans sırası: ${sequenceText} • Şimdi: ${nextKey ? getClubDanceKeyLabel(nextKey) : "-"} • Süre barı bitmeden tüm sırayı tamamla (${secondsLeft}s) • Çıkış: Q`;
      return;
    }

    if (worldState.club.seatedSeatId) {
      worldHelpText.textContent = "Kulüpte oturuyorsun. E ile ayağa kalkabilirsin.";
      return;
    }

    const seat = getNearbyClubSeat();
    if (seat) {
      worldHelpText.textContent = "Kenar koltuğuna oturmak için E bas.";
      return;
    }

    if (isPointInsideZone(worldState.club.danceZone, worldState.player.x, worldState.player.y)) {
      worldHelpText.textContent = "Dans pisti aktif: ritim oyununu başlatmak için E bas.";
      return;
    }

    const exitDistance = getDistanceToZone(worldState.club.exitZone, worldState.player.x, worldState.player.y);
    if (exitDistance < 58) {
      worldHelpText.textContent = "Meydana dönmek için E bas.";
      return;
    }

    worldHelpText.textContent = "Kulüpte WASD veya mouse ile dolaş. Piste girip E ile oyuna başla, F ile emote.";
    return;
  }

  if (worldState.mouse.active) {
    worldHelpText.textContent = "Joystick modu aktif: Mouse'u basılı tutup sürükleyerek yön ver.";
    return;
  }

  const nearbyInteractable = getNearbyInteractable();
  if (nearbyInteractable) {
    worldHelpText.textContent = `${nearbyInteractable.label} yanında: E ile etkileşime geç`;
    return;
  }

  const nearbyNpc = getNearbyNpc();
  if (nearbyNpc) {
    worldHelpText.textContent = `${nearbyNpc.name} yakınında: E ile konuş`;
    return;
  }

  worldHelpText.textContent = `${worldState.currentZoneName}: Mouse joystick veya WASD ile gez, E ile etkileşime geç, F ile emote yap.`;
}

function drawWorldBuilding(targetCtx, config) {
  paint(targetCtx, config.x, config.y, config.w, config.h, config.body);
  paint(targetCtx, config.x + 6, config.y + 8, config.w - 12, config.h - 16, config.window);
  paint(targetCtx, config.x, config.y, config.w, 10, config.roof);
  paint(targetCtx, config.doorX, config.y + config.h - 16, 14, 16, "#705041");
  paint(targetCtx, config.doorX + 10, config.y + config.h - 8, 2, 2, "#d9b39a");

  targetCtx.fillStyle = "#1f2b25";
  targetCtx.font = 'bold 11px "Nunito Sans", sans-serif';
  targetCtx.textAlign = "center";
  targetCtx.textBaseline = "middle";
  targetCtx.fillText(config.label, config.x + config.w / 2, config.y + 12);
}

function drawMiyuSquareMap(targetCtx, now) {
  paint(targetCtx, 0, 0, WORLD_WIDTH, WORLD_HEIGHT, "#d5ebff");
  paint(targetCtx, 0, 142, WORLD_WIDTH, WORLD_HEIGHT - 142, "#d8f0da");

  worldState.snowDots.forEach((dot, index) => {
    const twinkle = 0.66 + Math.sin((now + index * 38) / 380) * 0.2;
    targetCtx.fillStyle = `rgba(255,255,255,${twinkle})`;
    targetCtx.fillRect(dot.x, dot.y, dot.r, dot.r);
  });

  paint(targetCtx, 0, 250, WORLD_WIDTH, 62, "#f6ead2");
  paint(targetCtx, 401, 0, 58, WORLD_HEIGHT, "#f6ead2");
  paint(targetCtx, 140, 236, 160, 32, "#f6ead2");
  paint(targetCtx, 560, 236, 160, 32, "#f6ead2");
  paint(targetCtx, 404, 406, 52, 120, "#f6ead2");

  targetCtx.beginPath();
  targetCtx.fillStyle = "#efe2c9";
  targetCtx.arc(430, 280, 66, 0, Math.PI * 2);
  targetCtx.fill();

  drawWorldBuilding(targetCtx, {
    x: 90,
    y: 82,
    w: 144,
    h: 88,
    roof: "#f1a56f",
    body: "#f8d3b4",
    window: "#fff2e4",
    doorX: 154,
    label: "Kafe"
  });
  drawWorldBuilding(targetCtx, {
    x: 352,
    y: 60,
    w: 138,
    h: 90,
    roof: "#80aef0",
    body: "#d4e6ff",
    window: "#f4f9ff",
    doorX: 414,
    label: "Arcade"
  });
  drawWorldBuilding(targetCtx, {
    x: 614,
    y: 82,
    w: 144,
    h: 88,
    roof: "#88d1bd",
    body: "#d5f5ea",
    window: "#f0fffa",
    doorX: 678,
    label: "Portal"
  });
  drawWorldBuilding(targetCtx, {
    x: 102,
    y: 356,
    w: 140,
    h: 90,
    roof: "#f5bf74",
    body: "#ffe0b9",
    window: "#fff4df",
    doorX: 158,
    label: "Moda"
  });
  drawWorldBuilding(targetCtx, {
    x: 352,
    y: 390,
    w: 136,
    h: 88,
    roof: "#92d8c1",
    body: "#def8ef",
    window: "#f3fffa",
    doorX: 414,
    label: "Pet Park"
  });
  drawWorldBuilding(targetCtx, {
    x: 610,
    y: 352,
    w: 150,
    h: 96,
    roof: "#f29bb0",
    body: "#ffd5e1",
    window: "#ffeef3",
    doorX: 676,
    label: "Kulüp"
  });

  targetCtx.beginPath();
  targetCtx.fillStyle = "#bcd5e9";
  targetCtx.arc(430, 280, 31, 0, Math.PI * 2);
  targetCtx.fill();
  targetCtx.beginPath();
  targetCtx.fillStyle = "#72b3df";
  targetCtx.arc(430, 280, 22, 0, Math.PI * 2);
  targetCtx.fill();
  const pulse = 8 + Math.sin(now / 220) * 2;
  targetCtx.beginPath();
  targetCtx.fillStyle = "#a4dcff";
  targetCtx.arc(430, 280, pulse, 0, Math.PI * 2);
  targetCtx.fill();

  for (let i = 0; i < 7; i += 1) {
    const treeX = 56 + i * 110;
    const treeY = i % 2 === 0 ? 216 : 338;
    paint(targetCtx, treeX + 8, treeY + 18, 8, 14, "#7a5942");
    targetCtx.beginPath();
    targetCtx.fillStyle = "#7bc087";
    targetCtx.arc(treeX + 12, treeY + 14, 16, 0, Math.PI * 2);
    targetCtx.fill();
  }

  paint(targetCtx, 286, 330, 46, 8, "#b68d6a");
  paint(targetCtx, 542, 330, 46, 8, "#b68d6a");
  paint(targetCtx, 296, 338, 6, 10, "#8f694f");
  paint(targetCtx, 310, 338, 6, 10, "#8f694f");
  paint(targetCtx, 552, 338, 6, 10, "#8f694f");
  paint(targetCtx, 566, 338, 6, 10, "#8f694f");

  [220, 430, 640].forEach((lampX) => {
    paint(targetCtx, lampX, 220, 4, 42, "#4d5965");
    paint(targetCtx, lampX - 3, 214, 10, 8, "#fff2b0");
    paint(targetCtx, lampX - 11, 224, 26, 14, "rgba(255, 247, 179, 0.2)");
  });

  worldState.interactables.forEach((interactable) => {
    paint(targetCtx, interactable.x, interactable.y, interactable.w, interactable.h, "rgba(255, 255, 255, 0.32)");
    paint(targetCtx, interactable.x + interactable.w / 2 - 4, interactable.y - 8, 8, 6, "#1f2b25");
  });
}

function drawSquareCollectibles(targetCtx, now) {
  worldState.collectibles.forEach((item, index) => {
    const bob = Math.sin(now / 230 + item.phase + index * 0.3) * 1.8;
    const sparkle = 0.45 + Math.sin(now / 170 + item.phase) * 0.3;
    const x = Math.round(item.x);
    const y = Math.round(item.y + bob);

    paint(targetCtx, x - 1, y - 4, 2, 8, "#f8c95f");
    paint(targetCtx, x - 4, y - 1, 8, 2, "#f8c95f");
    paint(targetCtx, x - 2, y - 2, 4, 4, "#ffeeb8");
    paint(targetCtx, x - 1, y - 1, 2, 2, "#fffdf0");

    targetCtx.fillStyle = `rgba(255, 245, 190, ${sparkle})`;
    targetCtx.fillRect(x - 6, y - 6, 1, 1);
    targetCtx.fillRect(x + 5, y + 5, 1, 1);
    targetCtx.fillRect(x + 5, y - 5, 1, 1);
    targetCtx.fillRect(x - 6, y + 5, 1, 1);
  });
}

function drawCafeInteriorMap(targetCtx, now) {
  paint(targetCtx, 0, 0, CAFE_WIDTH, CAFE_HEIGHT, "#f2e6cf");
  paint(targetCtx, 0, 0, CAFE_WIDTH, 54, "#f4d6a2");
  paint(targetCtx, 0, CAFE_HEIGHT - 42, CAFE_WIDTH, 42, "#e1c7a3");

  for (let x = 14; x < CAFE_WIDTH; x += 26) {
    for (let y = 66; y < CAFE_HEIGHT - 48; y += 26) {
      const shade = (x + y) % 52 === 0 ? "#f8f0e2" : "#efe2cd";
      paint(targetCtx, x, y, 20, 20, shade);
    }
  }

  paint(targetCtx, 438, 72, 170, 62, "#b98562");
  paint(targetCtx, 446, 82, 154, 44, "#d8aa86");
  paint(targetCtx, 524, 136, 84, 58, "#b98562");
  paint(targetCtx, 534, 146, 64, 40, "#d8aa86");
  paint(targetCtx, 548, 86, 18, 10, "#8fd0ef");
  paint(targetCtx, 574, 86, 18, 10, "#f5b28b");

  targetCtx.fillStyle = "#2d2118";
  targetCtx.font = 'bold 13px "Nunito Sans", sans-serif';
  targetCtx.textAlign = "left";
  targetCtx.textBaseline = "middle";
  targetCtx.fillText("MIYU CAFE", 24, 30);
  targetCtx.font = 'bold 11px "Nunito Sans", sans-serif';
  targetCtx.fillText("Kasa / Mutfak", 460, 68);
  targetCtx.fillText("Kahve + Pasta Oyunu", 448, 212);

  paint(targetCtx, 450, 220, 20, 14, "#fff7ea");
  paint(targetCtx, 452, 224, 16, 8, "#7c5536");
  paint(targetCtx, 470, 223, 3, 8, "#fff7ea");
  paint(targetCtx, 474, 220, 22, 4, "#f3d6b0");
  paint(targetCtx, 474, 224, 22, 10, "#f7b9cc");
  paint(targetCtx, 482, 217, 6, 4, "#df4f6a");

  if (worldState.cafe.game.active && worldState.cafe.game.currentOrder) {
    const activeOrder = worldState.cafe.game.currentOrder;
    const stepInfo = getCafeCurrentOrderStepInfo(activeOrder);
    paint(targetCtx, 438, 16, 170, 44, "rgba(255, 249, 237, 0.96)");
    paint(targetCtx, 438, 16, 170, 8, "#ffe0a8");
    paint(targetCtx, 438, 16, 170, 1, "#2f2a24");
    paint(targetCtx, 438, 59, 170, 1, "#2f2a24");
    paint(targetCtx, 438, 16, 1, 44, "#2f2a24");
    paint(targetCtx, 607, 16, 1, 44, "#2f2a24");

    targetCtx.fillStyle = "#2d2118";
    targetCtx.textAlign = "left";
    targetCtx.textBaseline = "top";
    targetCtx.font = 'bold 10px "Nunito Sans", sans-serif';
    targetCtx.fillText("MÜŞTERİ SİPARİŞİ", 444, 18);
    targetCtx.font = 'bold 11px "Nunito Sans", sans-serif';
    targetCtx.fillText(`${activeOrder.customer}: ${stepInfo.recipe.label}`, 444, 30);
    targetCtx.font = '10px "Nunito Sans", sans-serif';
    targetCtx.fillText(`Adım ${stepInfo.stepIndex + 1}/${stepInfo.recipe.steps.length} • Fiş paneli altta`, 444, 43);
  }

  worldState.cafe.tables.forEach((table) => {
    targetCtx.beginPath();
    targetCtx.fillStyle = "#d8a46b";
    targetCtx.ellipse(table.x, table.y, 18, 14, 0, 0, Math.PI * 2);
    targetCtx.fill();
    paint(targetCtx, table.x - 3, table.y + 10, 6, 9, "#8f694f");
  });

  worldState.cafe.seats.forEach((seat) => {
    const isOccupied = seat.occupiedBy === "player";
    targetCtx.beginPath();
    targetCtx.fillStyle = isOccupied ? "#86c2a0" : "#f7e8c6";
    targetCtx.arc(seat.x, seat.y, 8, 0, Math.PI * 2);
    targetCtx.fill();
    targetCtx.strokeStyle = "#6e5744";
    targetCtx.lineWidth = 2;
    targetCtx.stroke();
  });

  paint(targetCtx, worldState.cafe.exitZone.x, worldState.cafe.exitZone.y, worldState.cafe.exitZone.w, worldState.cafe.exitZone.h, "#9cc4e8");
  targetCtx.fillStyle = "#17324a";
  targetCtx.font = 'bold 11px "Nunito Sans", sans-serif';
  targetCtx.textAlign = "center";
  targetCtx.textBaseline = "middle";
  targetCtx.fillText("Meydana Çıkış", worldState.cafe.exitZone.x + worldState.cafe.exitZone.w / 2, worldState.cafe.exitZone.y + worldState.cafe.exitZone.h / 2);

  const shine = 0.4 + Math.sin(now / 220) * 0.14;
  paint(targetCtx, worldState.cafe.counterZone.x, worldState.cafe.counterZone.y, worldState.cafe.counterZone.w, worldState.cafe.counterZone.h, `rgba(255,255,255,${shine})`);
}

function drawCafeCoffeePreview(targetCtx, x, y, width, height, progress, now) {
  paint(targetCtx, x, y, width, height, "#f6ecdd");
  paint(targetCtx, x + 12, y + 50, width - 24, 4, "#ceaf8a");

  paint(targetCtx, x + 24, y + 22, 38, 26, "#fff8f2");
  paint(targetCtx, x + 61, y + 27, 6, 14, "#fff8f2");
  paint(targetCtx, x + 61, y + 28, 4, 12, "#f1e2d2");

  const liquidHeight = 7 + Math.floor(progress * 12);
  paint(targetCtx, x + 26, y + 38 - liquidHeight, 34, liquidHeight, "#7d5638");

  if (progress > 0.33) {
    paint(targetCtx, x + 27, y + 23, 32, 4, "#f2dac2");
  }
  if (progress > 0.66) {
    paint(targetCtx, x + 41, y + 22, 6, 3, "#a96f43");
  }

  if (progress > 0.5) {
    const steamShift = Math.sin(now / 160) * 1.6;
    paint(targetCtx, x + 31 + steamShift, y + 10, 2, 6, "rgba(255,255,255,0.78)");
    paint(targetCtx, x + 42 - steamShift, y + 8, 2, 7, "rgba(255,255,255,0.72)");
    paint(targetCtx, x + 52 + steamShift * 0.7, y + 11, 2, 5, "rgba(255,255,255,0.7)");
  }
}

function drawCafeCakePreview(targetCtx, x, y, width, height, progress) {
  paint(targetCtx, x, y, width, height, "#faefe2");
  paint(targetCtx, x + 14, y + 50, width - 28, 4, "#d1b391");
  paint(targetCtx, x + 24, y + 46, 40, 3, "#eee7dc");

  paint(targetCtx, x + 30, y + 40, 28, 7, "#f1d4af");

  if (progress > 0.15) {
    paint(targetCtx, x + 29, y + 34, 30, 7, "#d79f66");
  }
  if (progress > 0.45) {
    paint(targetCtx, x + 28, y + 28, 32, 7, "#fff0d9");
  }
  if (progress > 0.75) {
    paint(targetCtx, x + 27, y + 22, 34, 7, "#f4b3cb");
    paint(targetCtx, x + 42, y + 17, 5, 5, "#d84368");
  }
}

function drawCafeRecipePreview(targetCtx, recipeId, x, y, width, height, progress, now) {
  if (recipeId === "coffee") {
    drawCafeCoffeePreview(targetCtx, x, y, width, height, progress, now);
    return;
  }

  drawCafeCakePreview(targetCtx, x, y, width, height, progress);
}

function drawCafeGameOverlay(targetCtx) {
  const game = worldState.cafe.game;
  if (!game.active || !game.currentOrder) {
    return;
  }

  const layout = getCafeGameOverlayLayout();
  const stepInfo = getCafeCurrentOrderStepInfo(game.currentOrder);
  const secondsLeft = Math.max(0, Math.ceil((game.orderEndAt - performance.now()) / 1000));
  const progress = getCafeOrderProgress(game.currentOrder);
  const dangerPulse = secondsLeft <= 3 ? 0.45 + Math.sin(performance.now() / 90) * 0.3 : 0;

  targetCtx.fillStyle = `rgba(20, 33, 30, ${0.9 + dangerPulse * 0.05})`;
  targetCtx.fillRect(layout.panelX, layout.panelY, layout.panelW, layout.panelH);
  targetCtx.strokeStyle = secondsLeft <= 3 ? "#ffcf9b" : "rgba(244, 255, 248, 0.88)";
  targetCtx.lineWidth = 1.5;
  targetCtx.strokeRect(layout.panelX + 0.75, layout.panelY + 0.75, layout.panelW - 1.5, layout.panelH - 1.5);

  targetCtx.fillStyle = "#f5fffb";
  targetCtx.font = 'bold 12px "Nunito Sans", sans-serif';
  targetCtx.textAlign = "left";
  targetCtx.textBaseline = "top";
  targetCtx.fillText("SİPARİŞ FİŞİ", layout.panelX + 12, layout.panelY + 8);
  targetCtx.font = 'bold 11px "Nunito Sans", sans-serif';
  targetCtx.fillText(`Müşteri: ${game.currentOrder.customer}`, layout.panelX + 12, layout.panelY + 24);
  targetCtx.fillText(`İstenen: ${stepInfo.recipe.label}`, layout.panelX + 124, layout.panelY + 24);

  targetCtx.textAlign = "right";
  targetCtx.fillStyle = secondsLeft <= 3 ? "#ffd4a6" : "#ddf8ee";
  targetCtx.fillText(`Süre ${secondsLeft}s`, layout.panelX + layout.panelW - 12, layout.panelY + 8);
  targetCtx.fillStyle = "#c5e8dc";
  targetCtx.fillText(`Skor ${game.score} • Seri x${game.streak}`, layout.panelX + layout.panelW - 12, layout.panelY + 24);

  drawCafeRecipePreview(
    targetCtx,
    stepInfo.recipe.id,
    layout.previewX,
    layout.previewY,
    layout.previewW,
    layout.previewH,
    progress,
    performance.now()
  );

  const dotsX = layout.panelX + 124;
  const dotsY = layout.panelY + 52;
  for (let i = 0; i < stepInfo.recipe.steps.length; i += 1) {
    targetCtx.beginPath();
    if (i < game.currentOrder.stepIndex) {
      targetCtx.fillStyle = "#86d1b2";
    } else if (i === stepInfo.stepIndex) {
      targetCtx.fillStyle = "#ffe0ae";
    } else {
      targetCtx.fillStyle = "rgba(245, 255, 251, 0.32)";
    }
    targetCtx.arc(dotsX + i * 16, dotsY, 4.5, 0, Math.PI * 2);
    targetCtx.fill();
  }

  targetCtx.fillStyle = "#effff6";
  targetCtx.textAlign = "left";
  targetCtx.font = 'bold 11px "Nunito Sans", sans-serif';
  targetCtx.fillText(
    `Aşama ${stepInfo.stepIndex + 1}/${stepInfo.recipe.steps.length}: ${stepInfo.step.prompt}`,
    layout.panelX + 124,
    layout.panelY + 66
  );
  targetCtx.font = '10px "Nunito Sans", sans-serif';
  targetCtx.fillStyle = "#c7e8da";
  targetCtx.fillText("Seçim: 1-2-3 veya kutuya tıkla", layout.panelX + 124, layout.panelY + 80);

  const optionColors = ["#9fd4f1", "#f0c89e", "#b9e4c2"];
  layout.choiceRects.forEach((card, index) => {
    targetCtx.fillStyle = optionColors[index];
    targetCtx.fillRect(card.x, card.y, card.w, card.h);
    targetCtx.strokeStyle = "#2a3d36";
    targetCtx.lineWidth = 1.5;
    targetCtx.strokeRect(card.x + 0.75, card.y + 0.75, card.w - 1.5, card.h - 1.5);

    targetCtx.fillStyle = "#24352d";
    targetCtx.font = 'bold 10px "Nunito Sans", sans-serif';
    targetCtx.textAlign = "left";
    targetCtx.fillText(`[${index + 1}]`, card.x + 6, card.y + 5);

    targetCtx.textAlign = "center";
    targetCtx.font = 'bold 11px "Nunito Sans", sans-serif';
    targetCtx.fillText(stepInfo.step.options[index], card.x + card.w / 2, card.y + 22);
    targetCtx.font = '10px "Nunito Sans", sans-serif';
    targetCtx.fillText("Seç", card.x + card.w / 2, card.y + 35);
  });
}

function drawClubInteriorMap(targetCtx, now) {
  paint(targetCtx, 0, 0, CLUB_WIDTH, CLUB_HEIGHT, "#1a1624");
  paint(targetCtx, 0, 0, CLUB_WIDTH, 66, "#231d32");
  paint(targetCtx, 0, CLUB_HEIGHT - 36, CLUB_WIDTH, 36, "#1f1a2d");

  for (let x = 0; x < CLUB_WIDTH; x += 30) {
    const alpha = 0.1 + Math.sin((now + x * 9) / 560) * 0.05;
    paint(targetCtx, x, 72, 16, CLUB_HEIGHT - 110, `rgba(255,255,255,${alpha})`);
  }

  const dance = worldState.club.danceZone;
  for (let x = dance.x; x < dance.x + dance.w; x += 24) {
    for (let y = dance.y; y < dance.y + dance.h; y += 24) {
      const cell = Math.floor((x - dance.x) / 24) + Math.floor((y - dance.y) / 24);
      const pulse = Math.sin(now / 180 + cell * 0.7);
      const shade = pulse > 0 ? "#5fe4d4" : "#f86db3";
      paint(targetCtx, x + 1, y + 1, 22, 22, shade);
    }
  }

  paint(targetCtx, dance.x - 6, dance.y - 6, dance.w + 12, 4, "#f8b5e0");
  paint(targetCtx, dance.x - 6, dance.y + dance.h + 2, dance.w + 12, 4, "#8debf6");
  paint(targetCtx, dance.x - 6, dance.y - 6, 4, dance.h + 12, "#8debf6");
  paint(targetCtx, dance.x + dance.w + 2, dance.y - 6, 4, dance.h + 12, "#f8b5e0");

  paint(targetCtx, 252, 40, 156, 66, "#3a2c57");
  paint(targetCtx, 264, 52, 132, 22, "#634b8e");
  paint(targetCtx, 266, 76, 128, 20, "#271f3d");
  paint(targetCtx, 310, 58, 40, 8, "#83f7e5");
  paint(targetCtx, 316, 66, 28, 6, "#f8b6df");
  paint(targetCtx, 174, 76, 20, 34, "#2c2540");
  paint(targetCtx, 466, 76, 20, 34, "#2c2540");
  paint(targetCtx, 178, 84, 12, 18, "#80d5ff");
  paint(targetCtx, 470, 84, 12, 18, "#80d5ff");

  paint(targetCtx, 88, 96, 44, 226, "#4a2e62");
  paint(targetCtx, 528, 96, 44, 226, "#4a2e62");
  paint(targetCtx, 68, 320, 72, 20, "#3d294f");
  paint(targetCtx, 520, 320, 72, 20, "#3d294f");

  worldState.club.seats.forEach((seat) => {
    const isOccupied = seat.occupiedBy === "player";
    targetCtx.beginPath();
    targetCtx.fillStyle = isOccupied ? "#9ef5c8" : "#f6d6ff";
    targetCtx.arc(seat.x, seat.y, 8, 0, Math.PI * 2);
    targetCtx.fill();
    targetCtx.strokeStyle = "#2b2035";
    targetCtx.lineWidth = 2;
    targetCtx.stroke();
  });

  paint(
    targetCtx,
    worldState.club.exitZone.x,
    worldState.club.exitZone.y,
    worldState.club.exitZone.w,
    worldState.club.exitZone.h,
    "#89b8ff"
  );
  targetCtx.fillStyle = "#17253b";
  targetCtx.font = 'bold 11px "Nunito Sans", sans-serif';
  targetCtx.textAlign = "center";
  targetCtx.textBaseline = "middle";
  targetCtx.fillText(
    "Meydana Çıkış",
    worldState.club.exitZone.x + worldState.club.exitZone.w / 2,
    worldState.club.exitZone.y + worldState.club.exitZone.h / 2
  );

  const dancePulse = 0.2 + Math.sin(now / 130) * 0.14;
  paint(
    targetCtx,
    worldState.club.danceZone.x,
    worldState.club.danceZone.y,
    worldState.club.danceZone.w,
    worldState.club.danceZone.h,
    `rgba(255,255,255,${dancePulse})`
  );

  targetCtx.fillStyle = "#f3e8ff";
  targetCtx.font = 'bold 13px "Nunito Sans", sans-serif';
  targetCtx.textAlign = "left";
  targetCtx.textBaseline = "middle";
  targetCtx.fillText("MIYU DANCE CLUB", 22, 30);
  targetCtx.font = 'bold 11px "Nunito Sans", sans-serif';
  targetCtx.fillText("Dans Pisti", dance.x + 8, dance.y - 14);
  targetCtx.fillText("Kenar Oturma Alanı", 48, 84);
  targetCtx.fillText("Kenar Oturma Alanı", 494, 84);
}

function drawClubGameOverlay(targetCtx) {
  const game = worldState.club.game;
  if (!game.active || !game.sequence.length) {
    return;
  }

  const panelW = 392;
  const panelH = 132;
  const panelX = Math.max(8, Math.floor((worldCanvas.width - panelW) / 2));
  const panelY = 8;
  const msLeft = getClubDanceMsLeft();
  const secondsLeft = Math.ceil(msLeft / 1000);
  const expectedKey = getClubDanceCurrentKey();
  const expectedLabel = expectedKey ? getClubDanceKeyLabel(expectedKey) : "-";
  const timeRatio = game.keyDurationMs > 0 ? clamp(msLeft / game.keyDurationMs, 0, 1) : 0;

  targetCtx.fillStyle = "rgba(16, 16, 28, 0.9)";
  targetCtx.fillRect(panelX, panelY, panelW, panelH);
  targetCtx.strokeStyle = secondsLeft <= 2 ? "#ffd1a4" : "rgba(226, 247, 255, 0.88)";
  targetCtx.lineWidth = 1.5;
  targetCtx.strokeRect(panelX + 0.75, panelY + 0.75, panelW - 1.5, panelH - 1.5);

  targetCtx.fillStyle = "#e9fbff";
  targetCtx.textAlign = "left";
  targetCtx.textBaseline = "top";
  targetCtx.font = 'bold 12px "Nunito Sans", sans-serif';
  targetCtx.fillText("DANS KOMBO", panelX + 12, panelY + 8);
  targetCtx.font = '11px "Nunito Sans", sans-serif';
  targetCtx.fillText("Sırayı W A S D ile takip et", panelX + 12, panelY + 24);
  targetCtx.fillText("Süre barı tüm kombo için geçerli", panelX + 12, panelY + 38);
  targetCtx.fillText(`Hedef: ${expectedLabel}`, panelX + 12, panelY + 50);

  targetCtx.textAlign = "right";
  targetCtx.fillStyle = secondsLeft <= 2 ? "#ffd1a4" : "#cbf2ff";
  targetCtx.fillText(`Süre ${secondsLeft}s`, panelX + panelW - 12, panelY + 8);
  targetCtx.fillStyle = "#b8e8ff";
  targetCtx.fillText(`Skor ${game.score} • Seri x${game.streak} • Kaçan ${game.misses}`, panelX + panelW - 12, panelY + 24);
  targetCtx.fillText("Q: oyundan çık", panelX + panelW - 12, panelY + 40);

  const barX = panelX + 12;
  const barY = panelY + 62;
  const barW = panelW - 24;
  const barH = 8;
  let barColor = "#67e8a4";
  if (timeRatio < 0.35) {
    barColor = "#ff9c7c";
  } else if (timeRatio < 0.65) {
    barColor = "#ffd56f";
  }
  paint(targetCtx, barX, barY, barW, barH, "#2d334a");
  paint(targetCtx, barX, barY, Math.max(0, Math.floor(barW * timeRatio)), barH, barColor);
  targetCtx.strokeStyle = "rgba(230, 242, 255, 0.5)";
  targetCtx.lineWidth = 1;
  targetCtx.strokeRect(barX + 0.5, barY + 0.5, barW - 1, barH - 1);

  const tileW = 40;
  const tileH = 44;
  const tileGap = 6;
  const rowWidth = game.sequence.length * tileW + Math.max(0, game.sequence.length - 1) * tileGap;
  const startX = panelX + Math.floor((panelW - rowWidth) / 2);
  const tileY = panelY + 78;

  game.sequence.forEach((key, index) => {
    let fill = "#3a3d5c";
    if (index < game.inputIndex) {
      fill = "#84d89e";
    } else if (index === game.inputIndex) {
      const pulse = 0.72 + Math.sin(performance.now() / 100) * 0.18;
      fill = `rgba(247, 212, 125, ${pulse})`;
    }

    const x = startX + index * (tileW + tileGap);
    paint(targetCtx, x, tileY, tileW, tileH, fill);
    targetCtx.strokeStyle = "#1e2337";
    targetCtx.lineWidth = 1.5;
    targetCtx.strokeRect(x + 0.75, tileY + 0.75, tileW - 1.5, tileH - 1.5);

    targetCtx.fillStyle = "#1f2437";
    targetCtx.textAlign = "center";
    targetCtx.font = 'bold 15px "Nunito Sans", sans-serif';
    targetCtx.fillText(key.toUpperCase(), x + tileW / 2, tileY + 10);
    targetCtx.font = 'bold 13px "Nunito Sans", sans-serif';
    targetCtx.fillText(getClubDanceKeySymbol(key), x + tileW / 2, tileY + 24);
  });
}

function getPlayerDanceOffset(now) {
  if (worldState.mode !== "club") {
    return { x: 0, y: 0, glow: 0 };
  }

  const game = worldState.club.game;
  if (!game.active) {
    return { x: 0, y: 0, glow: 0 };
  }

  let x = Math.sin(now / 120) * 1.2;
  let y = Math.sin(now / 85) * 2.2;
  let glow = 0.55 + Math.sin(now / 95) * 0.22;

  if (game.inputFlashUntil > now) {
    if (game.inputFlashKey === "w") {
      y -= 2.4;
    } else if (game.inputFlashKey === "s") {
      y += 1.8;
    } else if (game.inputFlashKey === "a") {
      x -= 2.1;
    } else if (game.inputFlashKey === "d") {
      x += 2.1;
    }
    glow += 0.25;
  }

  return { x, y, glow: Math.max(0, glow) };
}

function drawCharacter(targetCtx, entity, isPlayer = false, now = performance.now()) {
  let danceOffsetX = 0;
  let danceOffsetY = 0;
  let danceGlow = 0;
  if (isPlayer) {
    const offset = getPlayerDanceOffset(now);
    danceOffsetX = offset.x;
    danceOffsetY = offset.y;
    danceGlow = offset.glow;
  }

  const spriteWidth = 34;
  const spriteHeight = 34;
  const topX = Math.round(entity.x - spriteWidth / 2 + danceOffsetX);
  const topY = Math.round(entity.y - spriteHeight + danceOffsetY);

  targetCtx.beginPath();
  targetCtx.fillStyle = "rgba(40,50,50,0.2)";
  targetCtx.ellipse(
    entity.x + danceOffsetX * 0.5,
    entity.y + 1 + danceOffsetY * 0.12,
    12 + danceGlow * 1.8,
    5 + danceGlow * 0.7,
    0,
    0,
    Math.PI * 2
  );
  targetCtx.fill();

  targetCtx.drawImage(entity.sprite, topX, topY, spriteWidth, spriteHeight);

  if (isPlayer && danceGlow > 0) {
    targetCtx.beginPath();
    targetCtx.strokeStyle = `rgba(132, 237, 255, ${0.25 + danceGlow * 0.2})`;
    targetCtx.lineWidth = 2;
    targetCtx.arc(
      entity.x + danceOffsetX * 0.5,
      entity.y - 6 + danceOffsetY * 0.2,
      10 + danceGlow * 2.5,
      0,
      Math.PI * 2
    );
    targetCtx.stroke();
  }

  targetCtx.fillStyle = isPlayer ? "#123d35" : "#1f2b25";
  targetCtx.font = 'bold 12px "Nunito Sans", sans-serif';
  targetCtx.textAlign = "center";
  targetCtx.textBaseline = "bottom";
  targetCtx.fillText(entity.name, entity.x + danceOffsetX * 0.45, topY - 3);
}

function drawPlayerEmoteBubble(targetCtx, now) {
  if (!worldState.player || !worldState.emote.text || worldState.emote.until <= now) {
    return;
  }

  const life = clamp((worldState.emote.until - now) / 900, 0, 1);
  const x = Math.round(worldState.player.x);
  const y = Math.round(worldState.player.y - 44 - (1 - life) * 4);
  const text = worldState.emote.text;
  const bubbleW = 18 + text.length * 6;
  const bubbleH = 16;

  paint(targetCtx, x - bubbleW / 2, y - bubbleH / 2, bubbleW, bubbleH, `rgba(255,255,255,${0.82 * life})`);
  targetCtx.strokeStyle = `rgba(26, 39, 34, ${0.7 * life})`;
  targetCtx.lineWidth = 1;
  targetCtx.strokeRect(Math.round(x - bubbleW / 2) + 0.5, Math.round(y - bubbleH / 2) + 0.5, bubbleW - 1, bubbleH - 1);
  paint(targetCtx, x - 2, y + bubbleH / 2 - 1, 4, 3, `rgba(255,255,255,${0.82 * life})`);

  targetCtx.fillStyle = `rgba(18, 35, 30, ${0.95 * life})`;
  targetCtx.font = 'bold 10px "Nunito Sans", sans-serif';
  targetCtx.textAlign = "center";
  targetCtx.textBaseline = "middle";
  targetCtx.fillText(text, x, y);
}

function drawMiniMap(targetCtx) {
  const miniW = 126;
  const miniH = 78;
  const margin = 10;
  const mapX = worldCanvas.width - miniW - margin;
  const mapY = margin;
  const scaleX = miniW / WORLD_WIDTH;
  const scaleY = miniH / WORLD_HEIGHT;

  targetCtx.fillStyle = "rgba(24, 40, 35, 0.72)";
  targetCtx.fillRect(mapX, mapY, miniW, miniH);
  targetCtx.strokeStyle = "rgba(245, 255, 251, 0.88)";
  targetCtx.lineWidth = 1;
  targetCtx.strokeRect(mapX + 0.5, mapY + 0.5, miniW - 1, miniH - 1);

  targetCtx.fillStyle = "rgba(246, 234, 210, 0.65)";
  targetCtx.fillRect(mapX + 2, mapY + 2, miniW - 4, miniH - 4);

  WORLD_BLOCKS.forEach((block) => {
    targetCtx.fillStyle = "rgba(110, 90, 75, 0.55)";
    targetCtx.fillRect(
      mapX + block.x * scaleX,
      mapY + block.y * scaleY,
      block.w * scaleX,
      block.h * scaleY
    );
  });

  worldState.npcs.forEach((npc) => {
    targetCtx.fillStyle = "#7fc7ff";
    targetCtx.fillRect(mapX + npc.x * scaleX, mapY + npc.y * scaleY, 2, 2);
  });

  if (worldState.player) {
    targetCtx.fillStyle = "#ff7d5f";
    targetCtx.fillRect(mapX + worldState.player.x * scaleX - 1, mapY + worldState.player.y * scaleY - 1, 4, 4);
  }

  targetCtx.strokeStyle = "#fef7de";
  targetCtx.strokeRect(
    mapX + worldState.camera.x * scaleX,
    mapY + worldState.camera.y * scaleY,
    worldCanvas.width * scaleX,
    worldCanvas.height * scaleY
  );
}

function renderMiyuSquare(now) {
  const cameraX = Math.round(worldState.camera.x);
  const cameraY = Math.round(worldState.camera.y);

  worldCtx.save();
  worldCtx.clearRect(0, 0, worldCanvas.width, worldCanvas.height);
  worldCtx.translate(-cameraX, -cameraY);
  if (worldState.mode === "cafe") {
    drawCafeInteriorMap(worldCtx, now);
  } else if (worldState.mode === "club") {
    drawClubInteriorMap(worldCtx, now);
  } else {
    drawMiyuSquareMap(worldCtx, now);
    drawSquareCollectibles(worldCtx, now);
  }

  if (worldState.player && worldState.mouse.active) {
    const mouseVector = getMouseDriveVector();
    const indicatorX = worldState.player.x + mouseVector.x * 34;
    const indicatorY = worldState.player.y + mouseVector.y * 34;
    const pulse = 5 + Math.sin(now / 120) * 1.2;

    worldCtx.beginPath();
    worldCtx.strokeStyle = "rgba(18, 61, 53, 0.55)";
    worldCtx.lineWidth = 2;
    worldCtx.moveTo(worldState.player.x, worldState.player.y);
    worldCtx.lineTo(indicatorX, indicatorY);
    worldCtx.stroke();

    worldCtx.beginPath();
    worldCtx.strokeStyle = "rgba(31, 43, 37, 0.7)";
    worldCtx.lineWidth = 2;
    worldCtx.arc(indicatorX, indicatorY, pulse, 0, Math.PI * 2);
    worldCtx.stroke();
  }

  const entities = worldState.mode === "square" ? [...worldState.npcs] : [];
  if (worldState.mode === "cafe" && worldState.cafe.barista) {
    entities.push(worldState.cafe.barista);
  }
  if (worldState.mode === "club" && worldState.club.dj) {
    entities.push(worldState.club.dj);
  }
  if (worldState.player) {
    entities.push(worldState.player);
  }
  entities.sort((a, b) => a.y - b.y);

  entities.forEach((entity) => {
    const isPlayer = entity === worldState.player;
    drawCharacter(worldCtx, entity, isPlayer, now);
  });

  drawPlayerEmoteBubble(worldCtx, now);

  worldCtx.restore();
  if (worldState.mode === "square") {
    drawMiniMap(worldCtx);
  } else if (worldState.mode === "cafe") {
    drawCafeGameOverlay(worldCtx);
  } else if (worldState.mode === "club") {
    drawClubGameOverlay(worldCtx);
  }
}

function updateWorldFrame(dt, now) {
  refreshEventCycle(true);
  updatePlayerMovement(dt);
  updateNpcs(dt, now);
  updateSquareCollectibles(now);
  updateCafeMiniGame(now);
  updateClubDanceGame(now);
  updateWorldCamera();
  updateWorldStatus();
  updateWorldAmbience();
  updateWorldHint();

  if (worldState.chatUntil > now) {
    worldChatText.textContent = worldState.chatText;
  } else {
    worldChatText.textContent = "";
  }
}

function worldLoop(now) {
  if (!worldState.running) {
    return;
  }

  const dt = Math.min((now - worldState.lastTime) / 1000, 0.05);
  worldState.lastTime = now;
  updateWorldFrame(dt, now);
  renderMiyuSquare(now);
  worldState.rafId = requestAnimationFrame(worldLoop);
}

function startWorldLoop() {
  if (worldState.running) {
    return;
  }

  worldState.running = true;
  worldState.lastTime = performance.now();
  worldState.rafId = requestAnimationFrame(worldLoop);
}

function stopWorldLoop() {
  worldState.running = false;
  worldState.keys.up = false;
  worldState.keys.down = false;
  worldState.keys.left = false;
  worldState.keys.right = false;
  worldState.mouse.active = false;
  worldState.emote.text = "";
  worldState.emote.until = 0;
  stopCafeMiniGame(false);
  stopClubDanceGame(false);
  worldState.cafe.seatedSeatId = null;
  worldState.cafe.seats.forEach((seat) => {
    seat.occupiedBy = null;
  });
  worldState.club.seatedSeatId = null;
  worldState.club.seats.forEach((seat) => {
    seat.occupiedBy = null;
  });
  worldState.mode = "square";
  stopWorldAudio();

  if (worldState.rafId) {
    cancelAnimationFrame(worldState.rafId);
    worldState.rafId = null;
  }
}

function activateScreen(nextScreen) {
  [loginScreen, creatorScreen, lobbyScreen, worldScreen].forEach((screen) => {
    const isVisible = screen === nextScreen;
    screen.hidden = !isVisible;
    screen.classList.remove("is-active");
  });

  requestAnimationFrame(() => {
    nextScreen.classList.add("is-active");
  });
}

function showLoginScreen() {
  stopWorldLoop();
  activateScreen(loginScreen);
}

function showCreatorScreen() {
  stopWorldLoop();
  activateScreen(creatorScreen);
}

function showLobbyScreen() {
  stopWorldLoop();
  activateScreen(lobbyScreen);
}

function showWorldScreen() {
  activateScreen(worldScreen);
  ensureWorldAudio();
  startWorldLoop();
}

function syncUserText() {
  if (!state.username) {
    creatorUserText.textContent = "";
    return;
  }

  creatorUserText.textContent = `${state.username} için karakter oluştur`;
}

function syncAllMiuViews() {
  renderMiu(mainCtx);
  renderMiu(lobbyCtx);
  renderMiuSummary();
  updateMiuNameText();
}

controlsPanel.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-part]");
  if (!button) {
    return;
  }

  const partKey = button.dataset.part;
  const updateType = button.dataset.type;
  const direction = Number(button.dataset.dir);

  if (updateType === "style") {
    const styleCount = PARTS[partKey].styles.length;
    state[partKey].style = cycle(state[partKey].style, styleCount, direction);
  } else {
    const colorCount = PARTS[partKey].colors.length;
    state[partKey].color = cycle(state[partKey].color, colorCount, direction);
  }

  updateControlValues(partKey);
  syncAllMiuViews();
});

worldList.addEventListener("click", (event) => {
  const card = event.target.closest("button[data-world-id]");
  if (!card) {
    return;
  }
  setSelectedWorld(card.dataset.worldId);
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (!worldState.running) {
    return;
  }

  if (WORLD_EXTRA_KEYS.has(key)) {
    event.preventDefault();
    if (!event.repeat) {
      triggerPlayerEmote();
    }
    return;
  }

  if (worldState.mode === "club" && worldState.club.game.active && CLUB_GAME_KEYS.has(key)) {
    event.preventDefault();
    if (event.repeat) {
      return;
    }

    if (key === "q") {
      stopClubDanceGame();
      return;
    }

    resolveClubDanceInput(key);
    return;
  }

  if (worldState.mode === "club" && worldState.club.game.active && WORLD_CONTROL_KEYS.has(key)) {
    event.preventDefault();
    return;
  }

  if (worldState.mode === "cafe" && worldState.cafe.game.active && CAFE_GAME_KEYS.has(key)) {
    event.preventDefault();
    if (key === "q") {
      stopCafeMiniGame();
      return;
    }

    const choice = Number(key) - 1;
    if (choice >= 0 && choice < 3) {
      resolveCafeGameChoice(choice);
    }
    return;
  }

  if (!WORLD_CONTROL_KEYS.has(key)) {
    return;
  }

  ensureWorldAudio();

  if (key === "e") {
    event.preventDefault();
    if (!event.repeat) {
      interactInWorld();
    }
    return;
  }

  event.preventDefault();
  setMovementKey(key, true);
});

window.addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();
  if (!worldState.running || !WORLD_CONTROL_KEYS.has(key)) {
    return;
  }

  event.preventDefault();
  setMovementKey(key, false);
});

window.addEventListener("blur", () => {
  worldState.keys.up = false;
  worldState.keys.down = false;
  worldState.keys.left = false;
  worldState.keys.right = false;
  worldState.mouse.active = false;
});

worldCanvas.addEventListener("mousedown", handleWorldMouseDown);
worldCanvas.addEventListener("mousemove", handleWorldMouseMove);
window.addEventListener("mouseup", handleWorldMouseUp);

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = normalizeInput(usernameInput.value);
  const password = passwordInput.value.trim();

  if (username.length < 2) {
    loginFeedback.textContent = "Kullanıcı adı en az 2 karakter olmalı.";
    usernameInput.focus();
    return;
  }

  if (password.length < 4) {
    loginFeedback.textContent = "Şifre en az 4 karakter olmalı.";
    passwordInput.focus();
    return;
  }

  state.username = username;
  loginFeedback.textContent = "";
  passwordInput.value = "";
  syncUserText();
  showCreatorScreen();
});

usernameInput.addEventListener("input", () => {
  loginFeedback.textContent = "";
});

passwordInput.addEventListener("input", () => {
  loginFeedback.textContent = "";
});

miuNameInput.addEventListener("input", () => {
  miuNameFeedback.textContent = "";
});

randomStyleButton.addEventListener("click", () => {
  randomizeMiuStyle();
});

randomNameButton.addEventListener("click", () => {
  miuNameInput.value = generateRandomMiuName();
  miuNameFeedback.textContent = "";
  miuNameInput.focus();
});

startButton.addEventListener("click", () => {
  const miuName = normalizeInput(miuNameInput.value);
  if (miuName.length < 2) {
    miuNameFeedback.textContent = "Miu adı en az 2 karakter olmalı.";
    miuNameInput.focus();
    return;
  }

  state.miuName = miuName;
  miuNameInput.value = miuName;
  miuNameFeedback.textContent = "";
  syncAllMiuViews();
  showLobbyScreen();
});

backButton.addEventListener("click", () => {
  showCreatorScreen();
});

enterWorldButton.addEventListener("click", () => {
  const world = getWorldById(state.selectedWorldId);
  if (world.id !== "miu-square") {
    window.alert(`${world.name} henüz yapım aşamasında. Şimdilik Miyu Meydanı'na girebilirsin.`);
    return;
  }

  initializeMiyuSquareWorld();
  showWorldScreen();
});

worldBackButton.addEventListener("click", () => {
  showLobbyScreen();
});

buildControls();
buildWorldCards();
syncUserText();
syncAllMiuViews();
showLoginScreen();




