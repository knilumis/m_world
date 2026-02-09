const { PARTS } = window.MiuCharacterConfig;
const { createCharacterScreenModule } = window.MiuCharacter;
const { cycle, normalizeInput } = window.MiuCore;
const {
  CAFE_GAME_KEYS,
  CLUB_GAME_KEYS,
  WORLD_CONTROL_KEYS,
  WORLD_EXTRA_KEYS,
  createInitialWorldState,
  createWorldRuntime
} = window.MiuWorld;
const { WORLD_OPTIONS, getWorldById } = window.MiuWorlds;

const state = {
  body: { style: 0, color: 0 },
  ears: { style: 0, color: 0 },
  arms: { style: 0, color: 0 },
  feet: { style: 0, color: 0 },
  selectedWorldId: WORLD_OPTIONS[0].id,
  username: "",
  miuName: ""
};

const worldState = createInitialWorldState();

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

const characterScreen = createCharacterScreenModule({
  state,
  mainCtx,
  lobbyCtx,
  controlsPanel,
  miuBuildList,
  lobbyMiuName
});

const worldRuntime = createWorldRuntime({
  PARTS,
  state,
  worldState,
  worldCanvas,
  worldCtx,
  worldTitleText,
  worldStatusText,
  worldHelpText,
  worldChatText,
  getWorldById,
  clonePartState: characterScreen.clonePartState,
  createMiuSpriteCanvas: characterScreen.createMiuSpriteCanvas
});

function updateSelectedWorldText() {
  const world = getWorldById(state.selectedWorldId);
  selectedWorldText.textContent = `Seçilen dünya: ${world.name} (${world.vibe})`;
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
  worldRuntime.stopWorldLoop();
  activateScreen(loginScreen);
}

function showCreatorScreen() {
  worldRuntime.stopWorldLoop();
  activateScreen(creatorScreen);
}

function showLobbyScreen() {
  worldRuntime.stopWorldLoop();
  activateScreen(lobbyScreen);
}

function showWorldScreen() {
  activateScreen(worldScreen);
  worldRuntime.ensureWorldAudio();
  worldRuntime.startWorldLoop();
}

function syncUserText() {
  if (!state.username) {
    creatorUserText.textContent = "";
    return;
  }

  creatorUserText.textContent = `${state.username} için karakter oluştur`;
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

  characterScreen.updateControlValues(partKey);
  characterScreen.syncAllMiuViews();
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
      worldRuntime.triggerPlayerEmote();
    }
    return;
  }

  if (worldState.mode === "club" && worldState.club.game.active && CLUB_GAME_KEYS.has(key)) {
    event.preventDefault();
    if (event.repeat) {
      return;
    }

    if (key === "q") {
      worldRuntime.stopClubDanceGame();
      return;
    }

    worldRuntime.resolveClubDanceInput(key);
    return;
  }

  if (worldState.mode === "club" && worldState.club.game.active && WORLD_CONTROL_KEYS.has(key)) {
    event.preventDefault();
    return;
  }

  if (worldState.mode === "cafe" && worldState.cafe.game.active && CAFE_GAME_KEYS.has(key)) {
    event.preventDefault();
    if (key === "q") {
      worldRuntime.stopCafeMiniGame();
      return;
    }

    const choice = Number(key) - 1;
    if (choice >= 0 && choice < 3) {
      worldRuntime.resolveCafeGameChoice(choice);
    }
    return;
  }

  if (!WORLD_CONTROL_KEYS.has(key)) {
    return;
  }

  worldRuntime.ensureWorldAudio();

  if (key === "e") {
    event.preventDefault();
    if (!event.repeat) {
      worldRuntime.interactInWorld();
    }
    return;
  }

  event.preventDefault();
  worldRuntime.setMovementKey(key, true);
});

window.addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();
  if (!worldState.running || !WORLD_CONTROL_KEYS.has(key)) {
    return;
  }

  event.preventDefault();
  worldRuntime.setMovementKey(key, false);
});

window.addEventListener("blur", () => {
  worldState.keys.up = false;
  worldState.keys.down = false;
  worldState.keys.left = false;
  worldState.keys.right = false;
  worldState.mouse.active = false;
});

worldCanvas.addEventListener("mousedown", worldRuntime.handleWorldMouseDown);
worldCanvas.addEventListener("mousemove", worldRuntime.handleWorldMouseMove);
window.addEventListener("mouseup", worldRuntime.handleWorldMouseUp);

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
  characterScreen.randomizeMiuStyle();
});

randomNameButton.addEventListener("click", () => {
  miuNameInput.value = characterScreen.generateRandomMiuName();
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
  characterScreen.syncAllMiuViews();
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

  worldRuntime.initializeMiyuSquareWorld();
  showWorldScreen();
});

worldBackButton.addEventListener("click", () => {
  showLobbyScreen();
});

characterScreen.buildControls();
buildWorldCards();
syncUserText();
characterScreen.syncAllMiuViews();
showLoginScreen();


