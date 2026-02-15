(function (global) {
  const { clamp, pickRandom, randomInt } = global.MiuCore;
  const {
    CAFE_GAME_KEYS,
    CAFE_HEIGHT,
    CAFE_WIDTH,
    CLUB_GAME_KEYS,
    CLUB_HEIGHT,
    CLUB_WIDTH,
    HALL_HEIGHT,
    HALL_WIDTH,
    FASHION_SHOP_ITEMS,
    FASHION_SHOP_KEYS,
    WORLD_BLOCKS,
    WORLD_COLLECTIBLE_RESPAWN_MS,
    WORLD_CONTROL_KEYS,
    WORLD_EVENT_LIBRARY,
    WORLD_EXTRA_KEYS,
    WORLD_HEIGHT,
    WORLD_JOYSTICK_DEADZONE,
    WORLD_JOYSTICK_MAX_DISTANCE,
    WORLD_MAX_COLLECTIBLE_COUNT,
    WORLD_NPC_DEFS,
    WORLD_NPC_SPEED,
    WORLD_PLAYER_SPEED,
    WORLD_START_COLLECTIBLE_COUNT,
    WORLD_WIDTH,
    WORLD_ZONES,
    CAFE_CUSTOMER_NAMES,
    CAFE_RECIPES,
    createCafeSceneState,
    createClubSceneState,
    createTownHallSceneState,
    createFashionShopState
  } = global.MiuWorldMiuSquare;

  function createInitialWorldState() {
    return {
      running: false,
      rafId: null,
      lastTime: 0,
      mode: "square",
      partyStars: 0,
      dailyGiftClaimed: false,
      collectibles: [],
      nextCollectibleRespawnAt: 0,
      emote: { text: "", until: 0 },
      camera: { x: 0, y: 0 },
      currentZoneName: "",
      keys: { up: false, down: false, left: false, right: false },
      mouse: { active: false, x: 0, y: 0, screenX: 0, screenY: 0 },
      player: null,
      npcs: [],
      interactables: [],
      chatText: "",
      chatUntil: 0,
      hintText: "",
      snowDots: [],
      ambience: { context: null, masterGain: null, nextNoteAt: 0, step: 0, profileKey: "default" },
      eventCycle: { dateKey: "", schedule: [], currentHour: -1, currentEvent: null, nextEvent: null },
      cafe: createCafeSceneState(),
      club: createClubSceneState(),
      hall: createTownHallSceneState(),
      fashionShop: createFashionShopState()
    };
  }

  function createWorldRuntime({
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
    clonePartState,
    createMiuSpriteCanvas
  }) {
    function paint(targetCtx, x, y, width, height, color) {
      targetCtx.fillStyle = color;
      targetCtx.fillRect(x, y, width, height);
    }

    function clearMovementIntent() {
      worldState.keys.up = false;
      worldState.keys.down = false;
      worldState.keys.left = false;
      worldState.keys.right = false;
      worldState.mouse.active = false;
    }

    function ensureInventoryState() {
      if (!state.inventory || typeof state.inventory !== "object") {
        state.inventory = {};
      }
      if (!Array.isArray(state.inventory.ownedFashionItemIds)) {
        state.inventory.ownedFashionItemIds = [];
      }
      if (typeof state.inventory.equippedOutfitId !== "string") {
        state.inventory.equippedOutfitId = "";
      }
      if (typeof state.inventory.equippedAccessoryId !== "string") {
        state.inventory.equippedAccessoryId = "";
      }
      if (typeof state.inventory.equippedShoeId !== "string") {
        state.inventory.equippedShoeId = "";
      }

      state.inventory.ownedFashionItemIds = Array.from(
        new Set(
          state.inventory.ownedFashionItemIds.map((itemId) => LEGACY_FASHION_ID_MAP[itemId] || itemId)
        )
      );
      state.inventory.equippedOutfitId = LEGACY_FASHION_ID_MAP[state.inventory.equippedOutfitId] || state.inventory.equippedOutfitId;
    }

    function getCurrentZone(x, y) {
      return WORLD_ZONES.find((zone) => x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h) || null;
    }

    function getCurrentZoneName(x, y) {
      const zone = getCurrentZone(x, y);
      return zone ? zone.name : "Meydan Çevresi";
    }

    function getEventTitle() {
      const hour = new Date().getHours();
      const event = WORLD_EVENT_LIBRARY[hour % WORLD_EVENT_LIBRARY.length];
      return event ? event.title : "Hazırlanıyor";
    }

    function getActiveWorldSize() {
      if (worldState.mode === "cafe") {
        return { width: CAFE_WIDTH, height: CAFE_HEIGHT };
      }
      if (worldState.mode === "club") {
        return { width: CLUB_WIDTH, height: CLUB_HEIGHT };
      }
      if (worldState.mode === "hall") {
        return { width: HALL_WIDTH, height: HALL_HEIGHT };
      }
      return { width: WORLD_WIDTH, height: WORLD_HEIGHT };
    }

    function intersectsRect(a, b) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    function getHitboxAt(x, y) {
      return { x: x - 9, y: y - 7, w: 18, h: 12 };
    }

    function getCafeTableBlocks() {
      if (!worldState.cafe || !Array.isArray(worldState.cafe.tables)) {
        return [];
      }
      return worldState.cafe.tables.map((table) => ({
        x: table.x - 16,
        y: table.y - 12,
        w: 32,
        h: 24
      }));
    }

    function getActiveWorldBlocks() {
      if (worldState.mode === "cafe") {
        return [...(worldState.cafe.counterBlocks || []), ...getCafeTableBlocks()];
      }
      if (worldState.mode === "club") {
        return worldState.club.blocks || [];
      }
      if (worldState.mode === "hall") {
        return worldState.hall.blocks || [];
      }
      return WORLD_BLOCKS;
    }

    function isWorldBlocked(hitbox) {
      const activeSize = getActiveWorldSize();
      if (hitbox.x < 10 || hitbox.y < 10 || hitbox.x + hitbox.w > activeSize.width - 10 || hitbox.y + hitbox.h > activeSize.height - 10) {
        return true;
      }
      return getActiveWorldBlocks().some((block) => intersectsRect(hitbox, block));
    }

    function getRandomSquareSpawnPoint() {
      for (let i = 0; i < 100; i += 1) {
        const x = 24 + randomInt(WORLD_WIDTH - 48);
        const y = 24 + randomInt(WORLD_HEIGHT - 48);
        if (!isWorldBlocked(getHitboxAt(x, y))) {
          return { x, y };
        }
      }
      return { x: 430, y: 350 };
    }

    function createSquareCollectibles(count) {
      const list = [];
      for (let i = 0; i < count; i += 1) {
        const point = getRandomSquareSpawnPoint();
        list.push({ id: `star-${i}-${randomInt(9999)}`, x: point.x, y: point.y, phase: Math.random() * Math.PI * 2 });
      }
      return list;
    }

    function spawnSquareCollectible() {
      if (worldState.collectibles.length >= WORLD_MAX_COLLECTIBLE_COUNT) {
        return;
      }
      const point = getRandomSquareSpawnPoint();
      worldState.collectibles.push({ id: `star-${Date.now()}-${randomInt(9999)}`, x: point.x, y: point.y, phase: Math.random() * Math.PI * 2 });
    }

    function updateSquareCollectibles(now) {
      if (worldState.mode !== "square" || !worldState.player) {
        return;
      }
      let collected = 0;
      worldState.collectibles = worldState.collectibles.filter((item) => {
        if (Math.hypot(item.x - worldState.player.x, item.y - worldState.player.y) > 16) {
          return true;
        }
        collected += 1;
        return false;
      });
      if (collected > 0) {
        worldState.partyStars += collected;
        triggerPlayerEmote("YILDIZ!");
        setWorldChat(`${collected} yıldız topladın. Toplam: ${worldState.partyStars}`, 1300);
      }
      if (now >= worldState.nextCollectibleRespawnAt) {
        spawnSquareCollectible();
        worldState.nextCollectibleRespawnAt = now + WORLD_COLLECTIBLE_RESPAWN_MS;
      }
    }

    function setWorldChat(text, durationMs = 2200) {
      worldState.chatText = text;
      worldState.chatUntil = performance.now() + durationMs;
      worldChatText.textContent = text;
    }

    function buildNpcParts(index) {
      const parts = clonePartState(state);
      Object.keys(PARTS).forEach((partKey) => {
        parts[partKey].style = (index + randomInt(PARTS[partKey].styles.length)) % PARTS[partKey].styles.length;
        parts[partKey].color = (index + randomInt(PARTS[partKey].colors.length)) % PARTS[partKey].colors.length;
      });
      return parts;
    }

    function buildWorldNpcs() {
      const spawn = [
        { x: 218, y: 266 }, { x: 352, y: 286 }, { x: 502, y: 278 },
        { x: 646, y: 268 }, { x: 266, y: 470 }, { x: 486, y: 484 }, { x: 620, y: 470 }
      ];
      return WORLD_NPC_DEFS.map((npcDef, index) => {
        const parts = buildNpcParts(index + 1);
        return {
          name: npcDef.name,
          lines: npcDef.lines || ["Selam!"],
          x: spawn[index].x,
          y: spawn[index].y,
          parts,
          sprite: createMiuSpriteCanvas(parts),
          vx: (Math.random() * 2 - 1) * WORLD_NPC_SPEED,
          vy: (Math.random() * 2 - 1) * WORLD_NPC_SPEED,
          turnAt: 0,
          nextTalkAt: 0
        };
      });
    }

    const HALL_NPC_DEFS = [
      {
        name: "Ayla",
        lines: [
          "Sahne programını yakında buradan duyuracağız.",
          "Görev sistemi açıldığında önce benimle konuşabilirsin."
        ],
        x: 204,
        y: 170
      },
      {
        name: "Bora",
        lines: [
          "Soldaki NPC masası görev başlangıç noktası olacak.",
          "Sahnede etkinlik varken koltuklar hızla doluyor."
        ],
        x: 204,
        y: 286
      },
      {
        name: "Dora",
        lines: [
          "Sağ tarafta günlük görev zinciri için hazırlık yapıyoruz.",
          "Meydana dönmeden önce buradaki NPC'leri kontrol et."
        ],
        x: 496,
        y: 170
      },
      {
        name: "Mert",
        lines: [
          "Yakında görev tamamlayınca yıldız kazanabileceksin.",
          "Sahne önü oturma düzeni etkinlik saatinde değişebilir."
        ],
        x: 496,
        y: 286
      }
    ];

    function buildTownHallNpcs() {
      return HALL_NPC_DEFS.map((npcDef, index) => {
        const parts = buildNpcParts(index + 11);
        return {
          name: npcDef.name,
          lines: npcDef.lines,
          x: npcDef.x,
          y: npcDef.y,
          fixed: true,
          parts,
          sprite: createMiuSpriteCanvas(parts),
          nextTalkAt: 0
        };
      });
    }

    function buildCafeBarista() {
      const parts = buildNpcParts(31);
      return {
        name: "Luna",
        role: "Barista",
        lines: [
          "Hoş geldin! Hazırsan kahve oyunu başlatabiliriz.",
          "Tezgaha yaklaş ve E ile sipariş al."
        ],
        x: 560,
        y: 166,
        fixed: true,
        parts,
        sprite: createMiuSpriteCanvas(parts),
        nextTalkAt: 0
      };
    }

    function populateCafeSeats() {
      if (!worldState.cafe || !Array.isArray(worldState.cafe.seats)) {
        return;
      }
      worldState.cafe.seats.forEach((seat) => {
        seat.occupiedBy = null;
      });

      const candidateSeats = [...worldState.cafe.seats];
      const occupiedTarget = Math.min(candidateSeats.length, 6 + randomInt(4));
      const usedNames = new Set();
      for (let i = 0; i < occupiedTarget; i += 1) {
        if (candidateSeats.length === 0) {
          break;
        }
        const seatIndex = randomInt(candidateSeats.length);
        const seat = candidateSeats.splice(seatIndex, 1)[0];

        let guestName = pickRandom(CAFE_CUSTOMER_NAMES);
        let guard = 0;
        while (usedNames.has(guestName) && guard < 16) {
          guestName = pickRandom(CAFE_CUSTOMER_NAMES);
          guard += 1;
        }
        usedNames.add(guestName);
        seat.occupiedBy = guestName;
      }
    }

    function buildWorldInteractables() {
      return [
        { id: "cafe", label: "Kafe", x: 156, y: 177, w: 32, h: 18, message: "Kafe: Sıcak kakao ve sohbet masaları hazır." },
        { id: "fashion-shop", label: "Moda Dükkanı", x: 150, y: 457, w: 32, h: 18, message: "Moda mağazasına hoş geldin." },
        { id: "town-hall", label: "Meydan Holü", x: 390, y: 470, w: 60, h: 20, message: "Meydan Holü girişindesin." },
        { id: "stage-club", label: "Sahne Kulübü", x: 680, y: 466, w: 36, h: 18, message: "Kulüp girişine geldin." },
        { id: "daily-gift", label: "Sürpriz Kutu", x: 538, y: 306, w: 22, h: 16, message: "Günlük ödül kutusu." },
        { id: "notice-board", label: "Duyuru Panosu", x: 500, y: 235, w: 24, h: 16, message: "Duyuru panosu güncellendi." }
      ];
    }

    function initializeMiyuSquareWorld() {
      ensureInventoryState();
      const worldInfo = getWorldById("miu-square");
      const playerParts = clonePartState(state);
      worldState.mode = "square";
      worldState.partyStars = 0;
      worldState.dailyGiftClaimed = false;
      worldState.collectibles = createSquareCollectibles(WORLD_START_COLLECTIBLE_COUNT);
      worldState.nextCollectibleRespawnAt = performance.now() + WORLD_COLLECTIBLE_RESPAWN_MS;
      worldState.cafe = createCafeSceneState();
      worldState.cafe.barista = buildCafeBarista();
      populateCafeSeats();
      worldState.club = createClubSceneState();
      worldState.hall = createTownHallSceneState();
      worldState.hall.npcs = buildTownHallNpcs();
      worldState.fashionShop = createFashionShopState();
      worldState.player = { name: state.miuName || "Miu", x: 430, y: 350, parts: playerParts, sprite: createMiuSpriteCanvas(playerParts) };
      worldState.npcs = buildWorldNpcs();
      worldState.interactables = buildWorldInteractables();
      worldState.mouse.active = false;
      worldState.mouse.x = worldState.player.x;
      worldState.mouse.y = worldState.player.y;
      worldState.mouse.screenX = worldCanvas.width / 2;
      worldState.mouse.screenY = worldCanvas.height / 2;
      worldState.camera.x = clamp(worldState.player.x - worldCanvas.width / 2, 0, WORLD_WIDTH - worldCanvas.width);
      worldState.camera.y = clamp(worldState.player.y - worldCanvas.height / 2, 0, WORLD_HEIGHT - worldCanvas.height);
      worldState.currentZoneName = getCurrentZoneName(worldState.player.x, worldState.player.y);
      worldTitleText.textContent = worldInfo.name;
      worldHelpText.textContent = "Mouse'u basılı tutup sür veya WASD kullan. E ile etkileşime geç.";
      updateWorldStatus();
      setWorldChat("Miyu Meydanı hazır. Moda dükkanında yeni ürünler var.", 2800);
    }

    function ensureWorldAudio() { return null; }
    function stopWorldAudio() {}

    function triggerPlayerEmote(text = "") {
      if (!worldState.player) { return; }
      worldState.emote.text = text || pickRandom(["SELAM!", "HARİKA!", "MIU!"]);
      worldState.emote.until = performance.now() + 900;
    }

    const FASHION_CATEGORY_LIST = [
      { id: "outfit", label: "Şapka" },
      { id: "accessory", label: "Aksesuar" },
      { id: "shoe", label: "Ayakkabı" }
    ];

    const LEGACY_FASHION_ID_MAP = {
      "outfit-sakura-jacket": "hat-sakura-beret",
      "outfit-neon-hoodie": "hat-neon-cap",
      "outfit-cloud-poncho": "hat-cloud-beanie",
      "outfit-sunset-cardigan": "hat-sunset-fedora"
    };

    function isFashionShopOpen() { return worldState.mode === "square" && worldState.fashionShop.open; }
    function isFashionShopKey(key) { return FASHION_SHOP_KEYS.has(key); }

    function ensureFashionShopState() {
      if (!worldState.fashionShop || typeof worldState.fashionShop !== "object") {
        worldState.fashionShop = createFashionShopState();
      }
      if (typeof worldState.fashionShop.selectedCategory !== "string") {
        worldState.fashionShop.selectedCategory = "outfit";
      }
      if (typeof worldState.fashionShop.selectedItemId !== "string") {
        worldState.fashionShop.selectedItemId = "";
      }
      if (typeof worldState.fashionShop.hoverIndex !== "number") {
        worldState.fashionShop.hoverIndex = -1;
      }
      if (!worldState.fashionShop.confirm || typeof worldState.fashionShop.confirm !== "object") {
        worldState.fashionShop.confirm = { open: false, itemId: "", price: 0 };
      }
    }

    function getEquippedFashionItemId(type) {
      ensureInventoryState();
      if (type === "outfit") {
        return state.inventory.equippedOutfitId;
      }
      if (type === "accessory") {
        return state.inventory.equippedAccessoryId;
      }
      return state.inventory.equippedShoeId;
    }

    function setEquippedFashionItemId(type, itemId) {
      ensureInventoryState();
      if (type === "outfit") {
        state.inventory.equippedOutfitId = itemId;
      } else if (type === "accessory") {
        state.inventory.equippedAccessoryId = itemId;
      } else {
        state.inventory.equippedShoeId = itemId;
      }
    }

    function getEquippedFashionLabel(type) {
      const id = getEquippedFashionItemId(type);
      const item = FASHION_SHOP_ITEMS.find((entry) => entry.id === id);
      return item ? item.label : "-";
    }

    function getFashionTypeLabel(type) {
      if (type === "outfit") {
        return "Şapka";
      }
      if (type === "accessory") {
        return "Aksesuar";
      }
      return "Ayakkabı";
    }

    function getFashionCategoryItems(categoryId) {
      return FASHION_SHOP_ITEMS.filter((item) => item.type === categoryId);
    }

    function ensureFashionShopSelection() {
      ensureFashionShopState();
      const categoryValid = FASHION_CATEGORY_LIST.some((entry) => entry.id === worldState.fashionShop.selectedCategory);
      if (!categoryValid) {
        worldState.fashionShop.selectedCategory = "outfit";
      }
      const items = getFashionCategoryItems(worldState.fashionShop.selectedCategory);
      if (items.length === 0) {
        worldState.fashionShop.selectedItemId = "";
        worldState.fashionShop.hoverIndex = -1;
        return;
      }
      const selectedIndex = items.findIndex((entry) => entry.id === worldState.fashionShop.selectedItemId);
      if (selectedIndex === -1) {
        worldState.fashionShop.selectedItemId = items[0].id;
        worldState.fashionShop.hoverIndex = 0;
        return;
      }
      if (worldState.fashionShop.hoverIndex >= items.length) {
        worldState.fashionShop.hoverIndex = selectedIndex;
      }
    }

    function getSelectedFashionItem() {
      ensureFashionShopSelection();
      const items = getFashionCategoryItems(worldState.fashionShop.selectedCategory);
      if (items.length === 0) {
        return null;
      }
      const selected = items.find((entry) => entry.id === worldState.fashionShop.selectedItemId);
      return selected || items[0];
    }

    function getFashionPreviewLook() {
      const look = {
        outfitId: getEquippedFashionItemId("outfit"),
        accessoryId: getEquippedFashionItemId("accessory"),
        shoeId: getEquippedFashionItemId("shoe")
      };
      const selectedItem = getSelectedFashionItem();
      if (!selectedItem) {
        return look;
      }
      if (selectedItem.type === "outfit") {
        look.outfitId = selectedItem.id;
      } else if (selectedItem.type === "accessory") {
        look.accessoryId = selectedItem.id;
      } else if (selectedItem.type === "shoe") {
        look.shoeId = selectedItem.id;
      }
      return look;
    }

    function getFashionShopPanelRect() {
      const width = 460;
      const height = 252;
      return {
        x: Math.max(8, Math.floor((worldCanvas.width - width) / 2)),
        y: Math.max(8, Math.floor((worldCanvas.height - height) / 2)),
        width,
        height
      };
    }

    function getFashionShopLayout() {
      const panel = getFashionShopPanelRect();
      const previewRect = {
        x: panel.x + 12,
        y: panel.y + 46,
        w: 146,
        h: 194
      };
      const rightX = panel.x + 170;
      const rightW = panel.width - 182;
      const tabs = FASHION_CATEGORY_LIST.map((category, index) => ({
        id: category.id,
        label: category.label,
        x: rightX + index * 92,
        y: panel.y + 46,
        w: 88,
        h: 24
      }));
      const itemsArea = {
        x: rightX,
        y: panel.y + 78,
        w: rightW,
        h: 114
      };
      const actionRect = {
        x: rightX,
        y: panel.y + 198,
        w: rightW,
        h: 24
      };
      const detailRect = {
        x: rightX,
        y: panel.y + 226,
        w: rightW,
        h: 16
      };
      return { panel, previewRect, tabs, itemsArea, actionRect, detailRect };
    }

    function getFashionItemRects(categoryItems, layout) {
      const cardGap = 8;
      const columnCount = 2;
      const cardWidth = Math.floor((layout.itemsArea.w - cardGap) / columnCount);
      const cardHeight = 52;
      return categoryItems.map((item, index) => {
        const row = Math.floor(index / columnCount);
        const col = index % columnCount;
        return {
          item,
          index,
          x: layout.itemsArea.x + col * (cardWidth + cardGap),
          y: layout.itemsArea.y + row * (cardHeight + cardGap),
          w: cardWidth,
          h: cardHeight
        };
      });
    }

    function getFashionConfirmLayout(layout) {
      const dialog = {
        x: layout.panel.x + 106,
        y: layout.panel.y + 88,
        w: 248,
        h: 98
      };
      const yesRect = { x: dialog.x + 18, y: dialog.y + 62, w: 98, h: 24 };
      const noRect = { x: dialog.x + 132, y: dialog.y + 62, w: 98, h: 24 };
      return { dialog, yesRect, noRect };
    }

    function isPointInRect(screenX, screenY, rect) {
      return (
        screenX >= rect.x &&
        screenX <= rect.x + rect.w &&
        screenY >= rect.y &&
        screenY <= rect.y + rect.h
      );
    }

    function getFashionRarityColor(rarity) {
      if (rarity === "Destansı") {
        return "#4c2d87";
      }
      if (rarity === "Nadir") {
        return "#1f5d9f";
      }
      return "#4a5f2d";
    }

    function isFashionItemOwned(itemId) {
      return state.inventory.ownedFashionItemIds.includes(itemId);
    }

    function equipFashionItem(item) {
      setEquippedFashionItemId(item.type, item.id);
    }

    function openPurchaseConfirmation(item) {
      ensureFashionShopState();
      worldState.fashionShop.confirm.open = true;
      worldState.fashionShop.confirm.itemId = item.id;
      worldState.fashionShop.confirm.price = item.price;
    }

    function closePurchaseConfirmation() {
      ensureFashionShopState();
      worldState.fashionShop.confirm.open = false;
      worldState.fashionShop.confirm.itemId = "";
      worldState.fashionShop.confirm.price = 0;
    }

    function confirmFashionPurchase(accepted) {
      ensureFashionShopState();
      if (!worldState.fashionShop.confirm.open) {
        return;
      }

      const item = FASHION_SHOP_ITEMS.find((entry) => entry.id === worldState.fashionShop.confirm.itemId);
      if (!item) {
        closePurchaseConfirmation();
        return;
      }

      if (!accepted) {
        closePurchaseConfirmation();
        setWorldChat("Satın alma iptal edildi.", 1200);
        return;
      }

      if (worldState.partyStars < item.price) {
        closePurchaseConfirmation();
        setWorldChat(`${item.label} için ${item.price} yıldız gerekiyor.`, 1400);
        return;
      }

      worldState.partyStars -= item.price;
      if (!isFashionItemOwned(item.id)) {
        state.inventory.ownedFashionItemIds.push(item.id);
      }
      equipFashionItem(item);
      closePurchaseConfirmation();
      setWorldChat(`${item.label} satın alındı. Kalan yıldız: ${worldState.partyStars}`, 1800);
    }

    function activateSelectedFashionItem() {
      const selectedItem = getSelectedFashionItem();
      if (!selectedItem) {
        return;
      }

      if (isFashionItemOwned(selectedItem.id)) {
        if (getEquippedFashionItemId(selectedItem.type) === selectedItem.id) {
          setWorldChat(`${selectedItem.label} zaten kuşanıldı.`, 1100);
          return;
        }
        equipFashionItem(selectedItem);
        setWorldChat(`${selectedItem.label} kuşanıldı.`, 1200);
        return;
      }

      if (worldState.partyStars < selectedItem.price) {
        setWorldChat(`${selectedItem.label} için ${selectedItem.price} yıldız gerekiyor.`, 1400);
        return;
      }

      openPurchaseConfirmation(selectedItem);
    }

    function setFashionCategory(categoryId) {
      if (!FASHION_CATEGORY_LIST.some((entry) => entry.id === categoryId)) {
        return;
      }
      worldState.fashionShop.selectedCategory = categoryId;
      const items = getFashionCategoryItems(categoryId);
      worldState.fashionShop.selectedItemId = items.length > 0 ? items[0].id : "";
      worldState.fashionShop.hoverIndex = items.length > 0 ? 0 : -1;
    }

    function cycleFashionCategory(direction) {
      ensureFashionShopSelection();
      const currentIndex = FASHION_CATEGORY_LIST.findIndex((entry) => entry.id === worldState.fashionShop.selectedCategory);
      const nextIndex = (currentIndex + direction + FASHION_CATEGORY_LIST.length) % FASHION_CATEGORY_LIST.length;
      setFashionCategory(FASHION_CATEGORY_LIST[nextIndex].id);
    }

    function openFashionShop() {
      ensureInventoryState();
      ensureFashionShopState();
      ensureFashionShopSelection();
      worldState.fashionShop.open = true;
      worldState.mouse.active = false;
      setWorldChat("Moda mağazası açıldı. Kategori seçip ürüne tıkla.", 1800);
    }

    function closeFashionShop(showMessage = true) {
      ensureFashionShopState();
      worldState.fashionShop.open = false;
      worldState.fashionShop.hoverIndex = -1;
      closePurchaseConfirmation();
      worldState.mouse.active = false;
      if (showMessage) { setWorldChat("Moda mağazasından çıktın.", 1200); }
    }

    function resolveFashionShopSelection(index) {
      ensureFashionShopSelection();
      const items = getFashionCategoryItems(worldState.fashionShop.selectedCategory);
      const item = items[index];
      if (!item) {
        return;
      }
      worldState.fashionShop.hoverIndex = index;
      worldState.fashionShop.selectedItemId = item.id;
    }

    function handleFashionShopKey(key) {
      if (!isFashionShopOpen()) { return; }
      ensureFashionShopSelection();

      if (worldState.fashionShop.confirm.open) {
        if (key === "y" || key === "enter" || key === "e") {
          confirmFashionPurchase(true);
        } else if (key === "n" || key === "escape" || key === "q") {
          confirmFashionPurchase(false);
        }
        return;
      }

      if (key === "q" || key === "escape") {
        closeFashionShop();
        return;
      }
      if (key === "arrowleft") {
        cycleFashionCategory(-1);
        return;
      }
      if (key === "arrowright") {
        cycleFashionCategory(1);
        return;
      }
      if (key === "enter" || key === "e") {
        activateSelectedFashionItem();
        return;
      }

      const index = Number(key) - 1;
      if (!Number.isNaN(index)) {
        const items = getFashionCategoryItems(worldState.fashionShop.selectedCategory);
        if (index >= 0 && index < items.length) {
          resolveFashionShopSelection(index);
        }
      }
    }

    function drawFashionPreviewCharacter(targetCtx, previewRect, previewLook) {
      paint(targetCtx, previewRect.x, previewRect.y, previewRect.w, previewRect.h, "#f7f1e4");
      targetCtx.strokeStyle = "rgba(60, 46, 35, 0.45)";
      targetCtx.strokeRect(previewRect.x + 0.5, previewRect.y + 0.5, previewRect.w - 1, previewRect.h - 1);
      paint(targetCtx, previewRect.x + 8, previewRect.y + 10, previewRect.w - 16, previewRect.h - 60, "#e8f4eb");
      targetCtx.textAlign = "left";
      targetCtx.textBaseline = "alphabetic";
      targetCtx.fillStyle = "#2d2723";
      targetCtx.font = '700 10px "Trebuchet MS", "Segoe UI", sans-serif';
      targetCtx.fillText("Karakter Önizleme", previewRect.x + 8, previewRect.y + 10);

      const sprite = worldState.player && worldState.player.sprite
        ? worldState.player.sprite
        : createMiuSpriteCanvas(clonePartState(state));
      const scale = 4;
      const baseSpriteSize = 32;
      const drawSize = baseSpriteSize * scale;
      const drawX = previewRect.x + Math.floor((previewRect.w - drawSize) / 2);
      const drawY = previewRect.y + 16;

      targetCtx.imageSmoothingEnabled = false;
      targetCtx.drawImage(sprite, drawX, drawY, drawSize, drawSize);
      drawFashionOverlayShapes(targetCtx, drawX, drawY, drawSize / baseSpriteSize, previewLook);

      const selectedItem = getSelectedFashionItem();
      targetCtx.textAlign = "left";
      targetCtx.textBaseline = "middle";
      targetCtx.fillStyle = "#2d2723";
      targetCtx.font = '10px "Trebuchet MS", "Segoe UI", sans-serif';
      targetCtx.fillText(`Seçili: ${selectedItem ? selectedItem.label : "-"}`, previewRect.x + 8, previewRect.y + previewRect.h - 42);
      targetCtx.fillText(`Şapka: ${getEquippedFashionLabel("outfit")}`, previewRect.x + 8, previewRect.y + previewRect.h - 30);
      targetCtx.fillText(`Aksesuar: ${getEquippedFashionLabel("accessory")}`, previewRect.x + 8, previewRect.y + previewRect.h - 18);
      targetCtx.fillText(`Ayakkabı: ${getEquippedFashionLabel("shoe")}`, previewRect.x + 8, previewRect.y + previewRect.h - 6);
    }

    function drawFashionCategoryTabs(targetCtx, layout) {
      layout.tabs.forEach((tab) => {
        const active = tab.id === worldState.fashionShop.selectedCategory;
        paint(targetCtx, tab.x, tab.y, tab.w, tab.h, active ? "#d0ece3" : "#efe6d2");
        targetCtx.strokeStyle = active ? "#1f6f53" : "rgba(64, 52, 43, 0.55)";
        targetCtx.strokeRect(tab.x + 0.5, tab.y + 0.5, tab.w - 1, tab.h - 1);
        targetCtx.fillStyle = "#2d2723";
        targetCtx.font = '700 10px "Trebuchet MS", "Segoe UI", sans-serif';
        targetCtx.textAlign = "center";
        targetCtx.textBaseline = "middle";
        targetCtx.fillText(tab.label, tab.x + tab.w / 2, tab.y + tab.h / 2 + 0.5);
      });
    }

    function drawFashionItemList(targetCtx, layout, categoryItems) {
      const selectedItem = getSelectedFashionItem();
      const rects = getFashionItemRects(categoryItems, layout);
      rects.forEach((card) => {
        const owned = isFashionItemOwned(card.item.id);
        const equipped = getEquippedFashionItemId(card.item.type) === card.item.id;
        const selected = selectedItem && selectedItem.id === card.item.id;
        const hovered = worldState.fashionShop.hoverIndex === card.index;

        paint(targetCtx, card.x, card.y, card.w, card.h, owned ? "#d8f0e0" : "#e7edf8");
        targetCtx.strokeStyle = equipped ? "#1f6f53" : selected ? "#7e6118" : hovered ? "#4f6a84" : "rgba(70, 60, 53, 0.6)";
        targetCtx.strokeRect(card.x + 0.5, card.y + 0.5, card.w - 1, card.h - 1);

        targetCtx.textAlign = "left";
        targetCtx.textBaseline = "alphabetic";
        targetCtx.fillStyle = "#2d2723";
        targetCtx.font = '700 10px "Trebuchet MS", "Segoe UI", sans-serif';
        targetCtx.fillText(`[${card.index + 1}] ${card.item.label}`, card.x + 6, card.y + 13);
        targetCtx.font = '10px "Trebuchet MS", "Segoe UI", sans-serif';
        targetCtx.fillStyle = getFashionRarityColor(card.item.rarity);
        targetCtx.fillText(card.item.rarity, card.x + 6, card.y + 27);
        targetCtx.fillStyle = "#2d2723";
        targetCtx.fillText(`${card.item.price} yıldız`, card.x + 6, card.y + 40);
        targetCtx.textAlign = "right";
        targetCtx.fillText(owned ? (equipped ? "Kuşanıldı" : "Sahip") : "Satın Al", card.x + card.w - 6, card.y + 40);
        targetCtx.textAlign = "left";
      });
    }

    function getFashionActionState(selectedItem) {
      if (!selectedItem) {
        return { label: "Ürün seç", enabled: false, tone: "#d1cbc0" };
      }
      const owned = isFashionItemOwned(selectedItem.id);
      const equipped = getEquippedFashionItemId(selectedItem.type) === selectedItem.id;
      if (owned && equipped) {
        return { label: "Kuşanıldı", enabled: false, tone: "#cce8d6" };
      }
      if (owned) {
        return { label: "Kuşan", enabled: true, tone: "#cce8d6" };
      }
      return { label: `Satın Al (${selectedItem.price} Yıldız)`, enabled: true, tone: "#f3ddb9" };
    }

    function drawFashionPrimaryAction(targetCtx, layout, selectedItem) {
      const actionState = getFashionActionState(selectedItem);
      const actionRect = layout.actionRect;
      paint(targetCtx, actionRect.x, actionRect.y, actionRect.w, actionRect.h, actionState.tone);
      targetCtx.strokeStyle = actionState.enabled ? "#2f3d32" : "rgba(70, 60, 53, 0.55)";
      targetCtx.strokeRect(actionRect.x + 0.5, actionRect.y + 0.5, actionRect.w - 1, actionRect.h - 1);
      targetCtx.textAlign = "center";
      targetCtx.textBaseline = "middle";
      targetCtx.fillStyle = "#2d2723";
      targetCtx.font = '700 11px "Trebuchet MS", "Segoe UI", sans-serif';
      targetCtx.fillText(actionState.label, actionRect.x + actionRect.w / 2, actionRect.y + actionRect.h / 2 + 0.5);
    }

    function drawFashionConfirmDialog(targetCtx, layout) {
      if (!worldState.fashionShop.confirm.open) {
        return;
      }
      const selectedItem = FASHION_SHOP_ITEMS.find((entry) => entry.id === worldState.fashionShop.confirm.itemId);
      if (!selectedItem) {
        return;
      }

      const confirmLayout = getFashionConfirmLayout(layout);
      paint(targetCtx, layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height, "rgba(18,22,28,0.45)");
      paint(targetCtx, confirmLayout.dialog.x, confirmLayout.dialog.y, confirmLayout.dialog.w, confirmLayout.dialog.h, "#fff4e5");
      targetCtx.strokeStyle = "#2c2926";
      targetCtx.strokeRect(confirmLayout.dialog.x + 0.5, confirmLayout.dialog.y + 0.5, confirmLayout.dialog.w - 1, confirmLayout.dialog.h - 1);
      targetCtx.textAlign = "center";
      targetCtx.textBaseline = "middle";
      targetCtx.fillStyle = "#2d2723";
      targetCtx.font = '700 12px "Trebuchet MS", "Segoe UI", sans-serif';
      targetCtx.fillText("Satın Alma Onayı", confirmLayout.dialog.x + confirmLayout.dialog.w / 2, confirmLayout.dialog.y + 20);
      targetCtx.font = '11px "Trebuchet MS", "Segoe UI", sans-serif';
      targetCtx.fillText(`${selectedItem.label} ${selectedItem.price} Yıldız'a satın alınacak.`, confirmLayout.dialog.x + confirmLayout.dialog.w / 2, confirmLayout.dialog.y + 42);
      targetCtx.fillText("Emin misin?", confirmLayout.dialog.x + confirmLayout.dialog.w / 2, confirmLayout.dialog.y + 56);

      paint(targetCtx, confirmLayout.yesRect.x, confirmLayout.yesRect.y, confirmLayout.yesRect.w, confirmLayout.yesRect.h, "#cfe8da");
      paint(targetCtx, confirmLayout.noRect.x, confirmLayout.noRect.y, confirmLayout.noRect.w, confirmLayout.noRect.h, "#f0d8d8");
      targetCtx.strokeStyle = "#2c2926";
      targetCtx.strokeRect(confirmLayout.yesRect.x + 0.5, confirmLayout.yesRect.y + 0.5, confirmLayout.yesRect.w - 1, confirmLayout.yesRect.h - 1);
      targetCtx.strokeRect(confirmLayout.noRect.x + 0.5, confirmLayout.noRect.y + 0.5, confirmLayout.noRect.w - 1, confirmLayout.noRect.h - 1);
      targetCtx.font = '700 11px "Trebuchet MS", "Segoe UI", sans-serif';
      targetCtx.fillStyle = "#2d2723";
      targetCtx.fillText("Evet", confirmLayout.yesRect.x + confirmLayout.yesRect.w / 2, confirmLayout.yesRect.y + confirmLayout.yesRect.h / 2 + 0.5);
      targetCtx.fillText("Hayır", confirmLayout.noRect.x + confirmLayout.noRect.w / 2, confirmLayout.noRect.y + confirmLayout.noRect.h / 2 + 0.5);
    }

    function drawFashionShopOverlay(targetCtx) {
      if (!isFashionShopOpen()) { return; }
      ensureFashionShopSelection();
      const selectedItem = getSelectedFashionItem();
      const layout = getFashionShopLayout();
      const panel = layout.panel;

      paint(targetCtx, 0, 0, worldCanvas.width, worldCanvas.height, "rgba(12,17,21,0.78)");
      paint(targetCtx, panel.x, panel.y, panel.width, panel.height, "rgba(248,240,226,0.97)");
      targetCtx.strokeStyle = "#2b2a28";
      targetCtx.strokeRect(panel.x + 1, panel.y + 1, panel.width - 2, panel.height - 2);

      targetCtx.fillStyle = "#2a1d18";
      targetCtx.font = 'bold 13px "Trebuchet MS", "Segoe UI", sans-serif';
      targetCtx.textAlign = "left";
      targetCtx.textBaseline = "alphabetic";
      targetCtx.fillText("MODA MAĞAZASI", panel.x + 12, panel.y + 18);
      targetCtx.font = '11px "Trebuchet MS", "Segoe UI", sans-serif';
      targetCtx.fillText("Kategori seç, ürüne bas ve ardından Satın Al/Kuşan.", panel.x + 12, panel.y + 34);
      targetCtx.textAlign = "right";
      targetCtx.fillText(`Yıldız: ${worldState.partyStars}`, panel.x + panel.width - 12, panel.y + 18);
      targetCtx.fillText("Q/Esc: Kapat  •  ←/→: Kategori  •  1-9: Ürün  •  Enter/E: Onay", panel.x + panel.width - 12, panel.y + 34);

      drawFashionPreviewCharacter(targetCtx, layout.previewRect, getFashionPreviewLook());
      drawFashionCategoryTabs(targetCtx, layout);

      const categoryItems = getFashionCategoryItems(worldState.fashionShop.selectedCategory);
      drawFashionItemList(targetCtx, layout, categoryItems);
      drawFashionPrimaryAction(targetCtx, layout, selectedItem);

      paint(targetCtx, layout.detailRect.x, layout.detailRect.y, layout.detailRect.w, layout.detailRect.h, "rgba(255,255,255,0.72)");
      targetCtx.textAlign = "left";
      targetCtx.textBaseline = "middle";
      targetCtx.fillStyle = "#2d2723";
      targetCtx.font = '10px "Trebuchet MS", "Segoe UI", sans-serif';
      if (selectedItem) {
        targetCtx.fillStyle = getFashionRarityColor(selectedItem.rarity);
        targetCtx.fillText(`${getFashionTypeLabel(selectedItem.type)} • ${selectedItem.rarity}`, layout.detailRect.x + 6, layout.detailRect.y + 8);
        targetCtx.fillStyle = "#2d2723";
        targetCtx.fillText(` - ${selectedItem.description}`, layout.detailRect.x + 88, layout.detailRect.y + 8);
      } else {
        targetCtx.fillText("Bu kategoride ürün bulunamadı.", layout.detailRect.x + 6, layout.detailRect.y + 8);
      }

      drawFashionConfirmDialog(targetCtx, layout);
    }

    function getCafeCupStyle(order, usePrepared) {
      const sourceChoices = usePrepared ? order.selectedChoices : order.expectedChoices;
      return {
        bean: sourceChoices[0] ?? -1,
        milk: sourceChoices[1] ?? -1,
        topping: sourceChoices[2] ?? -1
      };
    }

    function drawCafeCupPreview(targetCtx, x, y, style, label, order) {
      const liquidColors = ["#5a371f", "#8c6643", "#4b2b17"];
      const milkFoam = ["#f6e6cf", "#f3ddbc", "#efe0ca"];
      const liquidColor = style.bean >= 0 ? liquidColors[style.bean % liquidColors.length] : "#a58366";
      const foamColor = style.milk >= 0 ? milkFoam[style.milk % milkFoam.length] : "#dbc8b5";

      paint(targetCtx, x, y, 106, 74, "rgba(230, 237, 250, 0.2)");
      targetCtx.strokeStyle = "rgba(225, 234, 252, 0.45)";
      targetCtx.strokeRect(x + 0.5, y + 0.5, 105, 73);

      targetCtx.fillStyle = "#d5e6ff";
      targetCtx.font = '700 9px "Trebuchet MS", "Segoe UI", sans-serif';
      targetCtx.textAlign = "center";
      targetCtx.textBaseline = "alphabetic";
      targetCtx.fillText(label, x + 53, y + 12);

      paint(targetCtx, x + 34, y + 22, 38, 30, "#f5f5f7");
      targetCtx.strokeStyle = "rgba(47, 56, 78, 0.35)";
      targetCtx.strokeRect(x + 34.5, y + 22.5, 37, 29);
      paint(targetCtx, x + 35, y + 31, 36, 20, liquidColor);
      paint(targetCtx, x + 35, y + 27, 36, 5, foamColor);
      paint(targetCtx, x + 72, y + 30, 8, 13, "#f5f5f7");
      targetCtx.strokeRect(x + 72.5, y + 30.5, 7, 12);

      if (style.topping >= 0) {
        if (style.topping === 0) {
          paint(targetCtx, x + 47, y + 27, 2, 2, "#9b6a3d");
          paint(targetCtx, x + 54, y + 29, 2, 2, "#9b6a3d");
          paint(targetCtx, x + 60, y + 26, 2, 2, "#9b6a3d");
        } else if (style.topping === 1) {
          paint(targetCtx, x + 47, y + 27, 3, 3, "#5f3b23");
          paint(targetCtx, x + 54, y + 29, 3, 3, "#5f3b23");
          paint(targetCtx, x + 61, y + 27, 3, 3, "#5f3b23");
        } else {
          paint(targetCtx, x + 47, y + 26, 16, 4, "#ffffff");
        }
      }

      targetCtx.fillStyle = "#deebff";
      targetCtx.font = '9px "Trebuchet MS", "Segoe UI", sans-serif';
      targetCtx.textAlign = "left";
      const beanLabel = style.bean >= 0 && order.steps[0] ? order.steps[0].options[style.bean] : "-";
      const milkLabel = style.milk >= 0 && order.steps[1] ? order.steps[1].options[style.milk] : "-";
      targetCtx.fillText(`Çekirdek: ${beanLabel}`, x + 6, y + 58);
      targetCtx.fillText(`Süt: ${milkLabel}`, x + 6, y + 68);
    }

    function drawCafeMiniGameOverlay(targetCtx, now) {
      if (worldState.mode !== "cafe" || !worldState.cafe || !worldState.cafe.game) {
        return;
      }
      const game = worldState.cafe.game;
      if (!game.active && !game.introOpen) {
        return;
      }

      if (game.introOpen && !game.active) {
        const guide = { x: 34, y: 28, w: worldCanvas.width - 68, h: 214 };
        paint(targetCtx, 0, 0, worldCanvas.width, worldCanvas.height, "rgba(16,22,30,0.76)");
        paint(targetCtx, guide.x, guide.y, guide.w, guide.h, "rgba(245, 238, 225, 0.98)");
        targetCtx.strokeStyle = "rgba(56, 44, 34, 0.72)";
        targetCtx.strokeRect(guide.x + 0.5, guide.y + 0.5, guide.w - 1, guide.h - 1);

        targetCtx.fillStyle = "#2d1f16";
        targetCtx.textAlign = "left";
        targetCtx.textBaseline = "alphabetic";
        targetCtx.font = '700 13px "Trebuchet MS", "Segoe UI", sans-serif';
        targetCtx.fillText("Barista Rehberi", guide.x + 12, guide.y + 22);
        targetCtx.font = '10px "Trebuchet MS", "Segoe UI", sans-serif';
        targetCtx.fillText("Amaç: Müşterinin istediği kahveyi doğru adımlarla hazırlamak.", guide.x + 12, guide.y + 40);
        targetCtx.fillText("1. Sağ üstteki Hedef Kahve kartını takip et.", guide.x + 12, guide.y + 58);
        targetCtx.fillText("2. Her adımda seçeneklerden birini 1/2/3 ile seç.", guide.x + 12, guide.y + 74);
        targetCtx.fillText("3. Yanlış seçim veya süre bitimi siparişi bozar.", guide.x + 12, guide.y + 90);
        targetCtx.fillText("4. Doğru siparişlerde puan ve yıldız kazanırsın.", guide.x + 12, guide.y + 106);
        targetCtx.fillText("5. Q ile mini oyundan çıkabilirsin.", guide.x + 12, guide.y + 122);

        paint(targetCtx, guide.x + 12, guide.y + 138, guide.w - 24, 38, "#e7d7bf");
        targetCtx.fillStyle = "#3b2a1f";
        targetCtx.font = '700 10px "Trebuchet MS", "Segoe UI", sans-serif';
        targetCtx.fillText("Hazırsan baristanın yanında E tuşuna bas ve oyunu başlat.", guide.x + 22, guide.y + 160);
        targetCtx.fillStyle = "#654732";
        targetCtx.font = '10px "Trebuchet MS", "Segoe UI", sans-serif';
        targetCtx.fillText("İpucu: Önce sipariş adımlarını oku, sonra seçimi yap.", guide.x + 22, guide.y + 173);

        paint(targetCtx, guide.x + 12, guide.y + 184, 96, 22, "#d3e8d7");
        paint(targetCtx, guide.x + 118, guide.y + 184, 120, 22, "#eed4d4");
        targetCtx.strokeStyle = "rgba(56, 44, 34, 0.55)";
        targetCtx.strokeRect(guide.x + 12.5, guide.y + 184.5, 95, 21);
        targetCtx.strokeRect(guide.x + 118.5, guide.y + 184.5, 119, 21);
        targetCtx.fillStyle = "#2c2520";
        targetCtx.textAlign = "center";
        targetCtx.textBaseline = "middle";
        targetCtx.fillText("E: Başlat", guide.x + 60, guide.y + 195);
        targetCtx.fillText("Q: Vazgeç", guide.x + 178, guide.y + 195);
        return;
      }

      const order = game.currentOrder;
      if (!order) {
        return;
      }

      const panel = {
        x: 10,
        y: 10,
        w: worldCanvas.width - 20,
        h: 170
      };
      paint(targetCtx, panel.x, panel.y, panel.w, panel.h, "rgba(16, 25, 36, 0.88)");
      targetCtx.strokeStyle = "rgba(224, 235, 255, 0.5)";
      targetCtx.strokeRect(panel.x + 0.5, panel.y + 0.5, panel.w - 1, panel.h - 1);

      const timeLeftMs = Math.max(0, game.orderEndAt - now);
      const timeLeftSec = Math.ceil(timeLeftMs / 1000);
      const maxDuration = getCafeOrderDurationMs();
      const timeRatio = Math.max(0, Math.min(1, timeLeftMs / maxDuration));
      const currentStep = order.steps[order.stepIndex];

      targetCtx.textAlign = "left";
      targetCtx.textBaseline = "alphabetic";
      targetCtx.fillStyle = "#f1f6ff";
      targetCtx.font = '700 11px "Trebuchet MS", "Segoe UI", sans-serif';
      targetCtx.fillText("BARISTA MİNİ OYUNU", panel.x + 10, panel.y + 16);
      targetCtx.font = '10px "Trebuchet MS", "Segoe UI", sans-serif';
      targetCtx.fillText(`Müşteri: ${order.customerName}  •  Sipariş: ${order.recipeLabel}`, panel.x + 10, panel.y + 31);
      targetCtx.fillText(`Skor: ${game.score}  •  Servis: ${game.served}  •  Seri: ${game.streak}  •  Hata: ${game.misses}`, panel.x + 10, panel.y + 45);
      if (game.lastResult) {
        targetCtx.fillStyle = game.lastResult.startsWith("Doğru") ? "#9fe2ba" : "#ffd7b1";
        targetCtx.fillText(game.lastResult, panel.x + 10, panel.y + 59);
      }

      paint(targetCtx, panel.x + 10, panel.y + 66, 210, 55, "rgba(231, 217, 189, 0.18)");
      targetCtx.strokeStyle = "rgba(227, 215, 188, 0.38)";
      targetCtx.strokeRect(panel.x + 10.5, panel.y + 66.5, 209, 54);
      targetCtx.fillStyle = "#ffeac5";
      targetCtx.font = '700 10px "Trebuchet MS", "Segoe UI", sans-serif';
      targetCtx.fillText("İstenen Tarif", panel.x + 18, panel.y + 78);
      targetCtx.font = '9px "Trebuchet MS", "Segoe UI", sans-serif';
      const step1 = order.steps[0] ? `${order.steps[0].prompt}: ${order.targetLabels[0]}` : "-";
      const step2 = order.steps[1] ? `${order.steps[1].prompt}: ${order.targetLabels[1]}` : "-";
      const step3 = order.steps[2] ? `${order.steps[2].prompt}: ${order.targetLabels[2]}` : "-";
      targetCtx.fillText(`1) ${step1}`, panel.x + 18, panel.y + 92);
      targetCtx.fillText(`2) ${step2}`, panel.x + 18, panel.y + 104);
      targetCtx.fillText(`3) ${step3}`, panel.x + 18, panel.y + 116);

      const targetStyle = getCafeCupStyle(order, false);
      const preparedStyle = getCafeCupStyle(order, true);
      drawCafeCupPreview(targetCtx, panel.x + 230, panel.y + 14, targetStyle, "Hedef Kahve", order);
      drawCafeCupPreview(targetCtx, panel.x + 344, panel.y + 14, preparedStyle, "Hazırlanan", order);

      paint(targetCtx, panel.x + 230, panel.y + 92, 220, 8, "rgba(77, 94, 126, 0.56)");
      paint(targetCtx, panel.x + 230, panel.y + 92, Math.round(220 * timeRatio), 8, timeRatio > 0.35 ? "#79c6a4" : "#df8f78");
      targetCtx.fillStyle = "#e3efff";
      targetCtx.font = '9px "Trebuchet MS", "Segoe UI", sans-serif';
      targetCtx.fillText(`Kalan Süre: ${timeLeftSec}s`, panel.x + 230, panel.y + 109);

      targetCtx.fillStyle = "#fff0cf";
      targetCtx.font = '700 10px "Trebuchet MS", "Segoe UI", sans-serif';
      targetCtx.fillText(`Aktif Adım ${order.stepIndex + 1}/${order.steps.length}: ${currentStep ? currentStep.prompt : "Sipariş tamamlandı"}`, panel.x + 10, panel.y + 136);

      if (currentStep) {
        const optionY = panel.y + 142;
        const optionW = Math.floor((panel.w - 24) / 3);
        for (let optionIndex = 0; optionIndex < 3; optionIndex += 1) {
          const optionX = panel.x + 8 + optionIndex * (optionW + 4);
          const pulse = (Math.sin(now / 180 + optionIndex * 0.8) + 1) / 2;
          const tone = `rgba(120, 168, 229, ${0.3 + pulse * 0.16})`;
          paint(targetCtx, optionX, optionY, optionW, 24, tone);
          targetCtx.strokeStyle = "rgba(232, 243, 255, 0.58)";
          targetCtx.strokeRect(optionX + 0.5, optionY + 0.5, optionW - 1, 23);
          targetCtx.fillStyle = "#eff6ff";
          targetCtx.font = '10px "Trebuchet MS", "Segoe UI", sans-serif';
          targetCtx.fillText(`[${optionIndex + 1}] ${currentStep.options[optionIndex]}`, optionX + 8, optionY + 15.5);
        }
      }

      targetCtx.fillStyle = "#d7e7ff";
      targetCtx.font = '9px "Trebuchet MS", "Segoe UI", sans-serif';
      targetCtx.fillText("Kontroller: 1/2/3 seçim  •  Q mini oyundan çıkış", panel.x + 10, panel.y + panel.h - 6);
    }

    function getFashionShopTabIdFromPoint(screenX, screenY) {
      const layout = getFashionShopLayout();
      const tab = layout.tabs.find((entry) => isPointInRect(screenX, screenY, entry));
      return tab ? tab.id : "";
    }

    function getFashionShopItemIndexFromPoint(screenX, screenY) {
      const layout = getFashionShopLayout();
      const categoryItems = getFashionCategoryItems(worldState.fashionShop.selectedCategory);
      const cards = getFashionItemRects(categoryItems, layout);
      const card = cards.find((entry) => isPointInRect(screenX, screenY, entry));
      return card ? card.index : null;
    }

    function isPointInsideFashionPrimaryAction(screenX, screenY) {
      const layout = getFashionShopLayout();
      return isPointInRect(screenX, screenY, layout.actionRect);
    }

    function getFashionConfirmChoiceFromPoint(screenX, screenY) {
      if (!worldState.fashionShop.confirm.open) {
        return "";
      }
      const layout = getFashionShopLayout();
      const confirmLayout = getFashionConfirmLayout(layout);
      if (isPointInRect(screenX, screenY, confirmLayout.yesRect)) {
        return "yes";
      }
      if (isPointInRect(screenX, screenY, confirmLayout.noRect)) {
        return "no";
      }
      return "";
    }

    function isPointInsideFashionPanel(screenX, screenY) {
      const panel = getFashionShopPanelRect();
      return isPointInRect(screenX, screenY, { x: panel.x, y: panel.y, w: panel.width, h: panel.height });
    }

    function isPlayerNearZone(zone, extraReach = 28) {
      if (!worldState.player || !zone) {
        return false;
      }
      const zoneCenterX = zone.x + zone.w / 2;
      const zoneCenterY = zone.y + zone.h / 2;
      const reach = Math.max(zone.w, zone.h) / 2 + extraReach;
      return Math.hypot(zoneCenterX - worldState.player.x, zoneCenterY - worldState.player.y) <= reach;
    }

    function getCafeSeatById(seatId) {
      if (!seatId || !worldState.cafe || !Array.isArray(worldState.cafe.seats)) {
        return null;
      }
      return worldState.cafe.seats.find((seat) => seat.id === seatId) || null;
    }

    function isPlayerSeatedInCafe() {
      return worldState.mode === "cafe" && Boolean(worldState.cafe && worldState.cafe.seatedSeatId);
    }

    function getNearbyCafeSeat(maxDistance = 24) {
      if (!worldState.player || !worldState.cafe || !Array.isArray(worldState.cafe.seats)) {
        return null;
      }
      let nearestSeat = null;
      let nearestDistance = 9999;

      worldState.cafe.seats.forEach((seat) => {
        const occupiedByOther = seat.occupiedBy && seat.id !== worldState.cafe.seatedSeatId;
        if (occupiedByOther) {
          return;
        }
        const distance = Math.hypot(seat.x - worldState.player.x, seat.y - worldState.player.y);
        if (distance <= maxDistance && distance < nearestDistance) {
          nearestSeat = seat;
          nearestDistance = distance;
        }
      });

      return nearestSeat;
    }

    function syncCafeSeatedPlayerPosition() {
      if (!isPlayerSeatedInCafe() || !worldState.player) {
        return;
      }
      const seat = getCafeSeatById(worldState.cafe.seatedSeatId);
      if (!seat) {
        worldState.cafe.seatedSeatId = null;
        return;
      }
      worldState.player.x = seat.x;
      worldState.player.y = seat.y + 8;
    }

    function standUpFromCafeSeat(showMessage = true) {
      if (!worldState.player || !worldState.cafe || !worldState.cafe.seatedSeatId) {
        return;
      }
      const seat = getCafeSeatById(worldState.cafe.seatedSeatId);
      worldState.cafe.seatedSeatId = null;
      if (!seat) {
        return;
      }
      seat.occupiedBy = null;

      const directionOffset = seat.direction === "n"
        ? { x: 0, y: -16 }
        : seat.direction === "s"
          ? { x: 0, y: 16 }
          : seat.direction === "w"
            ? { x: -16, y: 0 }
            : { x: 16, y: 0 };
      const fallbackOffsets = [
        directionOffset,
        { x: 0, y: 16 },
        { x: 0, y: -16 },
        { x: 16, y: 0 },
        { x: -16, y: 0 }
      ];

      let placed = false;
      fallbackOffsets.forEach((offset) => {
        if (placed) {
          return;
        }
        const nextX = seat.x + offset.x;
        const nextY = seat.y + offset.y;
        if (!isWorldBlocked(getHitboxAt(nextX, nextY))) {
          worldState.player.x = nextX;
          worldState.player.y = nextY;
          placed = true;
        }
      });
      if (!placed) {
        worldState.player.x = seat.x;
        worldState.player.y = seat.y + 14;
      }

      if (showMessage) {
        setWorldChat("Sandalyeden kalktın.", 1000);
      }
    }

    function sitOnCafeSeat(seat) {
      if (!worldState.player || !worldState.cafe || !seat) {
        return false;
      }
      if (seat.occupiedBy && seat.id !== worldState.cafe.seatedSeatId) {
        return false;
      }

      if (worldState.cafe.seatedSeatId && worldState.cafe.seatedSeatId !== seat.id) {
        standUpFromCafeSeat(false);
      }

      seat.occupiedBy = worldState.player.name || "Miu";
      worldState.cafe.seatedSeatId = seat.id;
      syncCafeSeatedPlayerPosition();
      clearMovementIntent();
      setWorldChat("Sandalyeye oturdun. Kalkmak için E'ye bas.", 1300);
      return true;
    }

    function getCafeOrderDurationMs() {
      const served = worldState.cafe && worldState.cafe.game ? worldState.cafe.game.served : 0;
      return Math.max(11000, 18000 - served * 450);
    }

    function createCafeOrder(now = performance.now()) {
      const coffeeRecipes = CAFE_RECIPES.filter((recipe) => recipe.id === "coffee" || recipe.icon === "coffee");
      const recipePool = coffeeRecipes.length > 0 ? coffeeRecipes : CAFE_RECIPES;
      const recipe = pickRandom(recipePool);
      const expectedChoices = recipe.steps.map((step) => randomInt(step.options.length));
      const order = {
        customerName: pickRandom(CAFE_CUSTOMER_NAMES),
        recipeId: recipe.id,
        recipeLabel: recipe.label,
        steps: recipe.steps.map((step) => ({ prompt: step.prompt, options: [...step.options] })),
        expectedChoices,
        targetLabels: recipe.steps.map((step, stepIndex) => step.options[expectedChoices[stepIndex]]),
        selectedChoices: [],
        stepIndex: 0,
        createdAt: now
      };
      worldState.cafe.game.currentOrder = order;
      worldState.cafe.game.orderEndAt = now + getCafeOrderDurationMs();
      return order;
    }

    function beginCafeMiniGame() {
      if (!worldState.cafe || !worldState.cafe.game) {
        return;
      }
      const game = worldState.cafe.game;
      game.introOpen = false;
      if (game.active) {
        setWorldChat("Kahve oyunu zaten açık. 1-2-3 ile devam et, Q ile çık.", 1400);
        return;
      }

      if (isPlayerSeatedInCafe()) {
        standUpFromCafeSeat(false);
      }

      clearMovementIntent();
      game.active = true;
      game.score = 0;
      game.served = 0;
      game.streak = 0;
      game.misses = 0;
      game.lastResult = "";
      createCafeOrder(performance.now());
      game.tutorialShown = true;
      setWorldChat("Sipariş alındı. İstenen tarifi takip ederek 1/2/3 ile hazırla!", 2200);
    }

    function startCafeMiniGame() {
      if (!worldState.cafe || !worldState.cafe.game) {
        return;
      }
      const game = worldState.cafe.game;
      if (game.active) {
        setWorldChat("Kahve oyunu zaten açık. 1-2-3 ile devam et, Q ile çık.", 1400);
        return;
      }
      if (isPlayerSeatedInCafe()) {
        standUpFromCafeSeat(false);
      }
      clearMovementIntent();
      game.introOpen = true;
      setWorldChat("Barista rehberi açıldı. Oku ve hazır olunca E ile başlat.", 2000);
    }

    function updateCafeMiniGame(now) {
      if (worldState.mode !== "cafe" || !worldState.cafe || !worldState.cafe.game || !worldState.cafe.game.active) {
        return;
      }
      const game = worldState.cafe.game;
      if (!game.currentOrder) {
        createCafeOrder(now);
        return;
      }
      if (now < game.orderEndAt) {
        return;
      }
      game.misses += 1;
      game.streak = 0;
      game.score = Math.max(0, game.score - 4);
      game.lastResult = "Süre doldu: Sipariş yenilendi.";
      setWorldChat("Siparişin süresi doldu. Yeni müşteri alındı.", 1400);
      createCafeOrder(now);
    }

    function isPlayerNearCafeBarista() {
      if (!worldState.player || !worldState.cafe || !worldState.cafe.barista) {
        return false;
      }
      const barista = worldState.cafe.barista;
      if (Math.hypot(barista.x - worldState.player.x, barista.y - worldState.player.y) < 56) {
        return true;
      }
      return isPlayerNearZone(worldState.cafe.counterZone, 34);
    }

    function enterCafe() {
      if (!worldState.player) {
        return;
      }
      if (!worldState.cafe.barista) {
        worldState.cafe.barista = buildCafeBarista();
      }
      populateCafeSeats();
      worldState.cafe.game.active = false;
      worldState.cafe.game.introOpen = false;
      worldState.cafe.game.currentOrder = null;
      worldState.cafe.game.orderEndAt = 0;
      worldState.cafe.seatedSeatId = null;
      worldState.cafe.previousWorldPosition = { x: worldState.player.x, y: worldState.player.y };
      worldState.mode = "cafe";
      worldState.player.x = worldState.cafe.entryPoint.x;
      worldState.player.y = worldState.cafe.entryPoint.y;
      worldTitleText.textContent = "Miu Kafe";
      clearMovementIntent();
      updateWorldCamera();
      setWorldChat("Miu Kafe'ye giriş yaptın.", 1400);
    }

    function exitCafe() {
      if (!worldState.player) {
        return;
      }
      standUpFromCafeSeat(false);
      stopCafeMiniGame(false);
      const fallback = { x: 168, y: 214 };
      const previous = worldState.cafe.previousWorldPosition || fallback;
      worldState.mode = "square";
      worldState.player.x = previous.x;
      worldState.player.y = previous.y;
      worldTitleText.textContent = getWorldById("miu-square").name;
      worldState.mouse.active = false;
      updateWorldCamera();
      setWorldChat("Kafeden meydana döndün.", 1300);
    }

    function enterClub() {
      if (!worldState.player) {
        return;
      }
      worldState.club.previousWorldPosition = { x: worldState.player.x, y: worldState.player.y };
      worldState.mode = "club";
      worldState.player.x = worldState.club.entryPoint.x;
      worldState.player.y = worldState.club.entryPoint.y;
      worldTitleText.textContent = "Sahne Kulübü";
      worldState.mouse.active = false;
      updateWorldCamera();
      setWorldChat("Sahne Kulübü'ne giriş yaptın.", 1400);
    }

    function exitClub() {
      if (!worldState.player) {
        return;
      }
      const fallback = { x: 690, y: 510 };
      const previous = worldState.club.previousWorldPosition || fallback;
      worldState.mode = "square";
      worldState.player.x = previous.x;
      worldState.player.y = previous.y;
      worldTitleText.textContent = getWorldById("miu-square").name;
      worldState.mouse.active = false;
      updateWorldCamera();
      setWorldChat("Kulüpten meydana döndün.", 1300);
    }

    function enterTownHall() {
      if (!worldState.player) {
        return;
      }
      if (!Array.isArray(worldState.hall.npcs) || worldState.hall.npcs.length === 0) {
        worldState.hall.npcs = buildTownHallNpcs();
      }
      worldState.hall.previousWorldPosition = { x: worldState.player.x, y: worldState.player.y };
      worldState.mode = "hall";
      worldState.player.x = worldState.hall.entryPoint.x;
      worldState.player.y = worldState.hall.entryPoint.y;
      worldTitleText.textContent = "Meydan Holü";
      worldState.mouse.active = false;
      updateWorldCamera();
      setWorldChat("Meydan Holü'ne giriş yaptın.", 1500);
    }

    function exitTownHall() {
      if (!worldState.player) {
        return;
      }
      const fallback = { x: 420, y: 500 };
      const previous = worldState.hall.previousWorldPosition || fallback;
      worldState.mode = "square";
      worldState.player.x = previous.x;
      worldState.player.y = previous.y;
      worldTitleText.textContent = getWorldById("miu-square").name;
      worldState.mouse.active = false;
      updateWorldCamera();
      setWorldChat("Meydana geri döndün.", 1300);
    }

    function getActiveInteractables() {
      if (worldState.mode === "hall") {
        return worldState.hall.interactables || [];
      }
      if (worldState.mode === "square") {
        return worldState.interactables;
      }
      return [];
    }

    function getNearbyTownHallNpc() {
      if (worldState.mode !== "hall" || !worldState.player || !Array.isArray(worldState.hall.npcs)) {
        return null;
      }
      let nearest = null;
      let minDistance = 9999;
      worldState.hall.npcs.forEach((npc) => {
        const distance = Math.hypot(npc.x - worldState.player.x, npc.y - worldState.player.y);
        if (distance < 44 && distance < minDistance) {
          nearest = npc;
          minDistance = distance;
        }
      });
      return nearest;
    }

    function getNearbyInteractable() {
      if (!worldState.player) { return null; }
      const interactables = getActiveInteractables();
      let nearest = null; let minDistance = 9999;
      interactables.forEach((item) => {
        const cx = item.x + item.w / 2; const cy = item.y + item.h / 2;
        const distance = Math.hypot(cx - worldState.player.x, cy - worldState.player.y);
        if (distance < 46 && distance < minDistance) { nearest = item; minDistance = distance; }
      });
      return nearest;
    }

    function interactInWorld() {
      if (isFashionShopOpen()) { closeFashionShop(); return; }

      if (worldState.mode === "cafe") {
        if (worldState.cafe.game.introOpen) {
          if (isPlayerNearZone(worldState.cafe.exitZone, 28)) {
            exitCafe();
            return;
          }
          if (isPlayerNearCafeBarista()) {
            beginCafeMiniGame();
            return;
          }
          setWorldChat("Rehberi onaylamak için baristanın yanında E'ye bas.", 1300);
          return;
        }

        if (worldState.cafe.game.active) {
          if (isPlayerNearZone(worldState.cafe.exitZone, 28)) {
            exitCafe();
            return;
          }
          setWorldChat("Kahve oyunu aktif: 1/2/3 ile seçim yap, Q ile çık.", 1300);
          return;
        }
        if (isPlayerNearZone(worldState.cafe.exitZone, 28)) {
          exitCafe();
          return;
        }
        if (isPlayerNearCafeBarista()) {
          startCafeMiniGame();
          return;
        }

        const nearbySeat = getNearbyCafeSeat();
        if (nearbySeat) {
          if (worldState.cafe.seatedSeatId === nearbySeat.id) {
            standUpFromCafeSeat();
          } else {
            sitOnCafeSeat(nearbySeat);
          }
          return;
        }

        if (isPlayerSeatedInCafe()) {
          standUpFromCafeSeat();
          return;
        }

        setWorldChat("Kafede etkileşim için barista, sandalye veya çıkış kapısına yaklaş.", 1300);
        return;
      }

      if (worldState.mode === "club") {
        if (isPlayerNearZone(worldState.club.exitZone, 28)) {
          exitClub();
          return;
        }
        if (isPlayerNearZone(worldState.club.danceZone, 26)) {
          setWorldChat("DJ: Ritim oyunu yakında burada başlayacak.", 1700);
          return;
        }
        setWorldChat("Kulüpte etkileşim için dans pisti veya çıkışa yaklaş.", 1300);
        return;
      }

      if (worldState.mode === "hall") {
        const nearbyHallNpc = getNearbyTownHallNpc();
        if (nearbyHallNpc) {
          const now = performance.now();
          if (now < nearbyHallNpc.nextTalkAt) {
            setWorldChat(`${nearbyHallNpc.name}: Birazdan tekrar konuşalım.`, 1200);
          } else {
            nearbyHallNpc.nextTalkAt = now + 1400;
            setWorldChat(`${nearbyHallNpc.name}: ${pickRandom(nearbyHallNpc.lines)}`, 1900);
          }
          return;
        }

        const hallInteractable = getNearbyInteractable();
        if (!hallInteractable) {
          setWorldChat("Yakında etkileşime girecek bir şey yok.", 1200);
          return;
        }
        if (hallInteractable.id === "hall-exit") {
          exitTownHall();
          return;
        }
        setWorldChat(hallInteractable.message, 1800);
        return;
      }

      const interactable = getNearbyInteractable();
      if (!interactable) { setWorldChat("Yakında etkileşime girecek bir şey yok.", 1200); return; }
      if (interactable.id === "cafe") { enterCafe(); return; }
      if (interactable.id === "fashion-shop") { openFashionShop(); return; }
      if (interactable.id === "town-hall") { enterTownHall(); return; }
      if (interactable.id === "stage-club") { enterClub(); return; }
      if (interactable.id === "daily-gift") {
        if (worldState.dailyGiftClaimed) { setWorldChat("Günlük ödülünü aldın.", 1200); return; }
        worldState.dailyGiftClaimed = true;
        const reward = 4 + randomInt(5);
        worldState.partyStars += reward;
        setWorldChat(`Günlük kutudan ${reward} yıldız kazandın.`, 1600);
        return;
      }
      setWorldChat(interactable.message, 1800);
    }

    function handleWorldMouseDown(event) {
      if (!worldState.running || !worldState.player) { return; }
      event.preventDefault();
      if (isFashionShopOpen()) {
        ensureFashionShopSelection();
        worldState.mouse.active = false;
        const rect = worldCanvas.getBoundingClientRect();
        const scaleX = worldCanvas.width / rect.width;
        const scaleY = worldCanvas.height / rect.height;
        const screenX = (event.clientX - rect.left) * scaleX;
        const screenY = (event.clientY - rect.top) * scaleY;

        if (worldState.fashionShop.confirm.open) {
          const confirmChoice = getFashionConfirmChoiceFromPoint(screenX, screenY);
          if (confirmChoice === "yes") {
            confirmFashionPurchase(true);
            return;
          }
          if (confirmChoice === "no") {
            confirmFashionPurchase(false);
            return;
          }
          return;
        }

        const tabId = getFashionShopTabIdFromPoint(screenX, screenY);
        if (tabId) {
          setFashionCategory(tabId);
          return;
        }

        const index = getFashionShopItemIndexFromPoint(screenX, screenY);
        if (index !== null) {
          resolveFashionShopSelection(index);
          return;
        }

        if (isPointInsideFashionPrimaryAction(screenX, screenY) && !worldState.fashionShop.confirm.open) {
          activateSelectedFashionItem();
          return;
        }

        if (!isPointInsideFashionPanel(screenX, screenY)) {
          closeFashionShop();
        }
        return;
      }
      ensureWorldAudio();
      const rect = worldCanvas.getBoundingClientRect();
      const scaleX = worldCanvas.width / rect.width;
      const scaleY = worldCanvas.height / rect.height;
      worldState.mouse.screenX = (event.clientX - rect.left) * scaleX;
      worldState.mouse.screenY = (event.clientY - rect.top) * scaleY;
      worldState.mouse.active = true;
    }

    function handleWorldMouseMove(event) {
      if (!worldState.running || !worldState.player) { return; }
      const rect = worldCanvas.getBoundingClientRect();
      const scaleX = worldCanvas.width / rect.width;
      const scaleY = worldCanvas.height / rect.height;
      const screenX = (event.clientX - rect.left) * scaleX;
      const screenY = (event.clientY - rect.top) * scaleY;
      if (isFashionShopOpen()) {
        if (worldState.fashionShop.confirm.open) {
          worldState.fashionShop.hoverIndex = -1;
          return;
        }
        const hoverIndex = getFashionShopItemIndexFromPoint(screenX, screenY);
        worldState.fashionShop.hoverIndex = hoverIndex === null ? -1 : hoverIndex;
        return;
      }
      if (!worldState.mouse.active) { return; }
      worldState.mouse.screenX = screenX;
      worldState.mouse.screenY = screenY;
    }

    function handleWorldMouseUp() { worldState.mouse.active = false; }

    function setMovementKey(key, value) {
      if (key === "arrowup" || key === "w") { worldState.keys.up = value; }
      else if (key === "arrowdown" || key === "s") { worldState.keys.down = value; }
      else if (key === "arrowleft" || key === "a") { worldState.keys.left = value; }
      else if (key === "arrowright" || key === "d") { worldState.keys.right = value; }
    }

    function getMouseDriveVector() {
      if (!worldState.mouse.active || !worldState.player) { return { x: 0, y: 0, magnitude: 0 }; }
      const px = worldState.player.x - worldState.camera.x;
      const py = worldState.player.y - worldState.camera.y;
      const dx = worldState.mouse.screenX - px;
      const dy = worldState.mouse.screenY - py;
      const distance = Math.hypot(dx, dy);
      if (distance <= WORLD_JOYSTICK_DEADZONE) { return { x: 0, y: 0, magnitude: 0 }; }
      const analog = Math.min(1, (distance - WORLD_JOYSTICK_DEADZONE) / (WORLD_JOYSTICK_MAX_DISTANCE - WORLD_JOYSTICK_DEADZONE));
      return { x: (dx / distance) * analog, y: (dy / distance) * analog, magnitude: analog };
    }

    function updatePlayerMovement(dt) {
      if (!worldState.player || isFashionShopOpen()) { return; }
      if (worldState.mode === "cafe" && worldState.cafe && (worldState.cafe.seatedSeatId || worldState.cafe.game.introOpen)) {
        worldState.mouse.active = false;
        return;
      }
      let keyX = (worldState.keys.right ? 1 : 0) - (worldState.keys.left ? 1 : 0);
      let keyY = (worldState.keys.down ? 1 : 0) - (worldState.keys.up ? 1 : 0);
      if (keyX !== 0 || keyY !== 0) {
        const length = Math.hypot(keyX, keyY);
        keyX /= length; keyY /= length;
      }
      const mouse = getMouseDriveVector();
      const ix = keyX + mouse.x;
      const iy = keyY + mouse.y;
      const inputLen = Math.hypot(ix, iy);
      if (inputLen === 0) { return; }
      const nx = ix / inputLen;
      const ny = iy / inputLen;
      const move = WORLD_PLAYER_SPEED * dt * Math.min(1, inputLen);
      const nextX = worldState.player.x + nx * move;
      const nextY = worldState.player.y + ny * move;
      if (!isWorldBlocked(getHitboxAt(nextX, worldState.player.y))) { worldState.player.x = nextX; }
      if (!isWorldBlocked(getHitboxAt(worldState.player.x, nextY))) { worldState.player.y = nextY; }
    }

    function pickNpcVelocity(speed = WORLD_NPC_SPEED) {
      const angle = Math.random() * Math.PI * 2;
      return {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed
      };
    }

    function maybeTurnNpc(npc, now, speed = WORLD_NPC_SPEED) {
      if (now < npc.turnAt) {
        return;
      }

      const nextVelocity = pickNpcVelocity(speed);
      npc.vx = nextVelocity.vx;
      npc.vy = nextVelocity.vy;
      npc.turnAt = now + 1000 + randomInt(2600);
    }

    function wouldNpcOverlapPlayer(nextX, nextY) {
      if (!worldState.player) {
        return false;
      }
      return Math.hypot(nextX - worldState.player.x, nextY - worldState.player.y) < 22;
    }

    function bounceNpc(npc, axis, now, speed = WORLD_NPC_SPEED) {
      const nextVelocity = pickNpcVelocity(speed);
      if (axis === "x") {
        npc.vx = -npc.vx * 0.7 + nextVelocity.vx * 0.3;
      } else {
        npc.vy = -npc.vy * 0.7 + nextVelocity.vy * 0.3;
      }
      npc.turnAt = now + 500 + randomInt(1400);
    }

    function updateNpcMovement(dt, now) {
      if (worldState.mode !== "square" || worldState.npcs.length === 0) {
        return;
      }

      worldState.npcs.forEach((npc) => {
        maybeTurnNpc(npc, now, WORLD_NPC_SPEED);

        const nextX = npc.x + npc.vx * dt;
        const nextY = npc.y + npc.vy * dt;

        if (!isWorldBlocked(getHitboxAt(nextX, npc.y)) && !wouldNpcOverlapPlayer(nextX, npc.y)) {
          npc.x = nextX;
        } else {
          bounceNpc(npc, "x", now, WORLD_NPC_SPEED);
        }

        if (!isWorldBlocked(getHitboxAt(npc.x, nextY)) && !wouldNpcOverlapPlayer(npc.x, nextY)) {
          npc.y = nextY;
        } else {
          bounceNpc(npc, "y", now, WORLD_NPC_SPEED);
        }
      });
    }

    function updateTownHallNpcMovement() {
      if (worldState.mode !== "hall" || !Array.isArray(worldState.hall.npcs) || worldState.hall.npcs.length === 0) {
        return;
      }
    }

    function updateWorldCamera() {
      if (!worldState.player) { return; }
      const size = getActiveWorldSize();
      const tx = clamp(worldState.player.x - worldCanvas.width / 2, 0, size.width - worldCanvas.width);
      const ty = clamp(worldState.player.y - worldCanvas.height / 2, 0, size.height - worldCanvas.height);
      worldState.camera.x += (tx - worldState.camera.x) * 0.16;
      worldState.camera.y += (ty - worldState.camera.y) * 0.16;
    }

    function updateWorldStatus() {
      if (!worldState.player) { return; }
      const zoneName = worldState.mode === "hall"
        ? "Meydan Holü"
        : worldState.mode === "cafe"
          ? "Miu Kafe"
          : worldState.mode === "club"
            ? "Sahne Kulübü"
            : getCurrentZoneName(worldState.player.x, worldState.player.y);
      worldState.currentZoneName = zoneName;
      const worldInfo = getWorldById("miu-square");
      const eventTitle = worldState.mode === "hall"
        ? "Sahne Hazırlığı"
        : worldState.mode === "cafe"
          ? (worldState.cafe.game.introOpen
            ? "Barista Rehberi"
            : worldState.cafe.game.active
              ? "Kahve Servisi"
              : worldState.cafe.seatedSeatId
                ? "Kafe Molası"
                : "Kafe Buluşması")
          : worldState.mode === "club"
            ? "Dans Provası"
            : getEventTitle();
      const outfit = getEquippedFashionLabel("outfit");
      const accessory = getEquippedFashionLabel("accessory");
      const shoe = getEquippedFashionLabel("shoe");
      worldStatusText.textContent = `${worldState.player.name} • Bölge: ${zoneName} • Etkinlik: ${eventTitle} • Yıldız: ${worldState.partyStars} • Stil: ${outfit} / ${accessory} / ${shoe} • ${worldInfo.crowd} çevrimiçi`;
    }

    function updateWorldHint() {
      if (isFashionShopOpen()) {
        worldHelpText.textContent = "Moda mağazası açık: kategori seç, ürüne tıkla, Satın Al/Kuşan ile onayla. Q/Esc ile kapat.";
        return;
      }
      if (worldState.mode === "cafe") {
        if (worldState.cafe && worldState.cafe.game && worldState.cafe.game.introOpen) {
          worldHelpText.textContent = "Barista Rehberi: Metni oku. E ile oyunu başlat, Q ile iptal et.";
          return;
        }
        if (worldState.cafe && worldState.cafe.game && worldState.cafe.game.active) {
          worldHelpText.textContent = "Kahve Oyunu: 1/2/3 ile adım seç, Q ile mini oyundan çık.";
          return;
        }
        if (isPlayerSeatedInCafe()) {
          worldHelpText.textContent = "Miu Kafe: Şu an oturuyorsun. E ile sandalyeden kalkabilirsin.";
          return;
        }
        worldHelpText.textContent = "Miu Kafe: WASD/mouse ile dolaş, E ile barista, sandalye veya çıkış kapısını kullan.";
        return;
      }
      if (worldState.mode === "club") {
        worldHelpText.textContent = "Sahne Kulübü: WASD/mouse ile dolaş, E ile dans pisti veya çıkışı kullan.";
        return;
      }
      if (worldState.mode === "hall") {
        worldHelpText.textContent = "Meydan Holü: WASD/mouse ile dolaş, E ile NPC'lerle konuş veya çıkış kapısını kullan.";
        return;
      }
      worldHelpText.textContent = `${worldState.currentZoneName}: WASD/mouse ile gez, E ile etkileşime geç.`;
    }

    function drawMapLabel(x, y, text, options = {}) {
      const background = options.background || "rgba(255, 248, 230, 0.9)";
      const textColor = options.textColor || "#2f2823";
      const border = options.border || "rgba(55, 45, 38, 0.42)";
      worldCtx.font = '700 10px "Trebuchet MS", "Segoe UI", sans-serif';
      const width = Math.ceil(worldCtx.measureText(text).width) + 10;
      const left = Math.round(x - width / 2);
      const top = Math.round(y - 13);
      paint(worldCtx, left, top, width, 14, background);
      worldCtx.strokeStyle = border;
      worldCtx.strokeRect(left + 0.5, top + 0.5, width - 1, 13);
      worldCtx.fillStyle = textColor;
      worldCtx.textAlign = "center";
      worldCtx.textBaseline = "middle";
      worldCtx.fillText(text, x, top + 7);
    }

    function drawSquareBuildings() {
      const buildingDefs = [
        {
          name: "Miyu Kafe",
          x: 90,
          y: 82,
          w: 144,
          h: 88,
          roof: "#d27b5e",
          wall: "#f6d6b9",
          door: "#8d5c44",
          window: "#b0e7ff"
        },
        {
          name: "Arcade Pasajı",
          x: 352,
          y: 60,
          w: 138,
          h: 90,
          roof: "#8c6fdf",
          wall: "#ddd5ff",
          door: "#51448f",
          window: "#f6f2ff"
        },
        {
          name: "İskele Ofisi",
          x: 614,
          y: 82,
          w: 144,
          h: 88,
          roof: "#5d92cd",
          wall: "#d4ebff",
          door: "#3f6f9e",
          window: "#edf7ff"
        },
        {
          name: "Moda Dükkanı",
          x: 102,
          y: 356,
          w: 140,
          h: 90,
          roof: "#d96a95",
          wall: "#ffd7e7",
          door: "#8f4664",
          window: "#fff0f8"
        },
        {
          name: "Meydan Holü",
          x: 352,
          y: 390,
          w: 136,
          h: 88,
          roof: "#8a8fa3",
          wall: "#e5e8f4",
          door: "#5d6278",
          window: "#f7f8ff"
        },
        {
          name: "Sahne Kulübü",
          x: 610,
          y: 352,
          w: 150,
          h: 96,
          roof: "#5761b8",
          wall: "#d3d8ff",
          door: "#3b447f",
          window: "#eff1ff"
        }
      ];

      buildingDefs.forEach((building) => {
        const roofHeight = 12;
        paint(worldCtx, building.x, building.y, building.w, building.h, building.wall);
        paint(worldCtx, building.x - 4, building.y - roofHeight, building.w + 8, roofHeight, building.roof);
        paint(worldCtx, building.x, building.y + building.h - 2, building.w, 2, "rgba(53, 40, 31, 0.26)");

        const doorWidth = 16;
        paint(
          worldCtx,
          building.x + Math.floor((building.w - doorWidth) / 2),
          building.y + building.h - 24,
          doorWidth,
          24,
          building.door
        );

        for (let row = 0; row < 2; row += 1) {
          for (let col = 0; col < 3; col += 1) {
            paint(worldCtx, building.x + 18 + col * 35, building.y + 18 + row * 24, 14, 11, building.window);
          }
        }

        drawMapLabel(building.x + Math.floor(building.w / 2), building.y - 14, building.name);
      });
    }

    function drawSquareCenterDetails(now) {
      paint(worldCtx, 398, 246, 64, 64, "#e1f6ff");
      paint(worldCtx, 404, 252, 52, 52, "#c8edff");
      paint(worldCtx, 424, 258, 12, 12, "#7cc8f1");
      paint(worldCtx, 421, 269, 18, 4, "#8fdbff");
      const wave = Math.sin(now / 280) * 2;
      paint(worldCtx, 427, 264 + wave, 6, 10, "#9ee3ff");
      drawMapLabel(430, 238, "Miyu Çeşmesi");
    }

    function drawInteractableMarkers(now) {
      worldCtx.textAlign = "center";
      worldCtx.textBaseline = "middle";
      worldCtx.font = '700 8px "Trebuchet MS", "Segoe UI", sans-serif';

      worldState.interactables.forEach((item, index) => {
        const pulse = (Math.sin(now / 220 + index * 0.8) + 1) / 2;
        const tone = item.id === "fashion-shop"
          ? "rgba(238, 132, 178, 0.82)"
          : item.id === "cafe"
            ? "rgba(245, 176, 102, 0.8)"
            : item.id === "town-hall"
              ? "rgba(124, 146, 196, 0.82)"
            : item.id === "stage-club"
              ? "rgba(114, 129, 234, 0.8)"
              : "rgba(108, 162, 124, 0.78)";

        const markerW = 14;
        const markerH = 12;
        const markerX = Math.round(item.x + item.w / 2 - markerW / 2);
        const markerY = Math.round(item.y + item.h / 2 - markerH / 2);

        paint(worldCtx, markerX, markerY, markerW, markerH, tone);
        worldCtx.strokeStyle = `rgba(34, 26, 19, ${0.45 + pulse * 0.4})`;
        worldCtx.strokeRect(markerX + 0.5, markerY + 0.5, markerW - 1, markerH - 1);
        worldCtx.fillStyle = "#fff8ec";
        worldCtx.fillText("E", markerX + markerW / 2, markerY + markerH / 2 + 0.5);

        drawMapLabel(item.x + item.w / 2, markerY - 5, item.label, {
          background: "rgba(255, 250, 240, 0.88)"
        });
      });
    }

    function drawTownHallInteractables(now) {
      const interactables = worldState.hall.interactables || [];
      worldCtx.font = '700 8px "Trebuchet MS", "Segoe UI", sans-serif';
      worldCtx.textAlign = "center";
      worldCtx.textBaseline = "middle";

      interactables.forEach((item, index) => {
        const pulse = (Math.sin(now / 240 + index) + 1) / 2;
        const tone = item.id === "hall-exit"
          ? "rgba(118, 198, 160, 0.82)"
          : "rgba(124, 154, 214, 0.82)";
        const markerW = 16;
        const markerH = 12;
        const markerX = Math.round(item.x + item.w / 2 - markerW / 2);
        const markerY = Math.round(item.y + item.h / 2 - markerH / 2);

        paint(worldCtx, markerX, markerY, markerW, markerH, tone);
        worldCtx.strokeStyle = `rgba(33, 28, 24, ${0.5 + pulse * 0.35})`;
        worldCtx.strokeRect(markerX + 0.5, markerY + 0.5, markerW - 1, markerH - 1);
        worldCtx.fillStyle = "#fff8ec";
        worldCtx.fillText("E", markerX + markerW / 2, markerY + markerH / 2 + 0.5);
        drawMapLabel(item.x + item.w / 2, markerY - 7, item.label, {
          background: "rgba(250, 248, 243, 0.92)"
        });
      });
    }

    function drawCafeMap(now) {
      const cafe = worldState.cafe;
      paint(worldCtx, 0, 0, cafe.width, cafe.height, "#f4eadb");
      paint(worldCtx, 0, 42, cafe.width, cafe.height - 42, "#efe3d2");
      paint(worldCtx, 0, cafe.height - 34, cafe.width, 34, "#c0ad91");
      paint(worldCtx, 0, 0, cafe.width, 20, "#9c7654");
      paint(worldCtx, 0, 20, cafe.width, 14, "#d8b58f");

      paint(worldCtx, 440, 72, 168, 62, "#b48561");
      paint(worldCtx, 448, 80, 152, 46, "#d0a27e");
      paint(worldCtx, 524, 136, 84, 58, "#9c7253");
      paint(worldCtx, 532, 146, 26, 15, "#f1dfc8");
      paint(worldCtx, 558, 148, 10, 6, "#2e3d48");
      paint(worldCtx, 571, 145, 24, 18, "#8b6548");
      paint(worldCtx, 575, 149, 8, 8, "#d2edf4");
      drawMapLabel(522, 62, "Kasa & Barista", {
        background: "rgba(255, 248, 232, 0.92)"
      });

      (cafe.tables || []).forEach((table, index) => {
        const pulse = (Math.sin(now / 260 + index) + 1) / 2;
        worldCtx.fillStyle = index % 2 === 0 ? "#c69571" : "#b9855f";
        worldCtx.beginPath();
        worldCtx.ellipse(table.x, table.y, 22, 14, 0, 0, Math.PI * 2);
        worldCtx.fill();
        worldCtx.fillStyle = `rgba(255, 238, 212, ${0.42 + pulse * 0.25})`;
        worldCtx.beginPath();
        worldCtx.ellipse(table.x, table.y - 1, 16, 8, 0, 0, Math.PI * 2);
        worldCtx.fill();
      });

      (cafe.seats || []).forEach((seat) => {
        const isPlayerSeat = seat.id === cafe.seatedSeatId;
        const seatColor = isPlayerSeat ? "#5f8fcb" : seat.occupiedBy ? "#7f945a" : "#8c6b50";
        paint(worldCtx, seat.x - 6, seat.y - 5, 12, 10, seatColor);
        if (seat.occupiedBy) {
          const headColor = isPlayerSeat ? "#d8efff" : "#f8d8b3";
          paint(worldCtx, seat.x - 2, seat.y - 8, 4, 4, headColor);
        }
      });

      drawMapLabel(306, 116, "Masa ve Oturma Alanı", {
        background: "rgba(255, 248, 232, 0.88)"
      });

      const barista = cafe.barista;
      if (barista) {
        drawMapLabel(barista.x, barista.y - 42, `${barista.name} • Barista`, {
          background: "rgba(255, 245, 230, 0.9)"
        });
      }

      paint(worldCtx, cafe.exitZone.x, cafe.exitZone.y, cafe.exitZone.w, cafe.exitZone.h, "#8ac7a0");
      drawMapLabel(cafe.exitZone.x + cafe.exitZone.w / 2, cafe.exitZone.y - 8, "Meydana Çıkış", {
        background: "rgba(245, 255, 248, 0.9)"
      });

      worldCtx.font = '700 8px "Trebuchet MS", "Segoe UI", sans-serif';
      worldCtx.textAlign = "center";
      worldCtx.textBaseline = "middle";

      const pulseExit = (Math.sin(now / 220) + 1) / 2;
      const exitMarkerW = 16;
      const exitMarkerH = 12;
      const exitMarkerX = Math.round(cafe.exitZone.x + cafe.exitZone.w / 2 - exitMarkerW / 2);
      const exitMarkerY = Math.round(cafe.exitZone.y + cafe.exitZone.h / 2 - exitMarkerH / 2);
      paint(worldCtx, exitMarkerX, exitMarkerY, exitMarkerW, exitMarkerH, "rgba(118, 198, 160, 0.82)");
      worldCtx.strokeStyle = `rgba(33, 28, 24, ${0.5 + pulseExit * 0.35})`;
      worldCtx.strokeRect(exitMarkerX + 0.5, exitMarkerY + 0.5, exitMarkerW - 1, exitMarkerH - 1);
      worldCtx.fillStyle = "#fff8ec";
      worldCtx.fillText("E", exitMarkerX + exitMarkerW / 2, exitMarkerY + exitMarkerH / 2 + 0.5);

      const pulseCounter = (Math.sin(now / 210 + 0.6) + 1) / 2;
      const counterMarkerW = 16;
      const counterMarkerH = 12;
      const counterMarkerX = Math.round(cafe.counterZone.x + cafe.counterZone.w / 2 - counterMarkerW / 2);
      const counterMarkerY = Math.round(cafe.counterZone.y + cafe.counterZone.h - counterMarkerH / 2 - 2);
      const counterTone = cafe.game.active ? "rgba(123, 174, 240, 0.86)" : "rgba(228, 152, 112, 0.84)";
      paint(worldCtx, counterMarkerX, counterMarkerY, counterMarkerW, counterMarkerH, counterTone);
      worldCtx.strokeStyle = `rgba(33, 28, 24, ${0.5 + pulseCounter * 0.35})`;
      worldCtx.strokeRect(counterMarkerX + 0.5, counterMarkerY + 0.5, counterMarkerW - 1, counterMarkerH - 1);
      worldCtx.fillStyle = "#fff8ec";
      worldCtx.fillText("E", counterMarkerX + counterMarkerW / 2, counterMarkerY + counterMarkerH / 2 + 0.5);
      const counterLabel = cafe.game.active
        ? "Sipariş Aktif"
        : cafe.game.introOpen
          ? "Rehber Açık"
          : "Barista ile Konuş";
      drawMapLabel(cafe.counterZone.x + cafe.counterZone.w / 2, cafe.counterZone.y - 8, counterLabel, {
        background: "rgba(255, 248, 232, 0.9)"
      });

      if (!cafe.game.active && !cafe.game.introOpen) {
        const seatHint = getNearbyCafeSeat();
        if (seatHint) {
          const seatPulse = (Math.sin(now / 210 + 1.2) + 1) / 2;
          const seatMarkerX = Math.round(seatHint.x - 8);
          const seatMarkerY = Math.round(seatHint.y - 18);
          paint(worldCtx, seatMarkerX, seatMarkerY, 16, 12, "rgba(131, 159, 213, 0.84)");
          worldCtx.strokeStyle = `rgba(33, 28, 24, ${0.46 + seatPulse * 0.36})`;
          worldCtx.strokeRect(seatMarkerX + 0.5, seatMarkerY + 0.5, 15, 11);
          worldCtx.fillStyle = "#fff8ec";
          worldCtx.fillText("E", seatHint.x, seatMarkerY + 6.5);
          drawMapLabel(seatHint.x, seatMarkerY - 6, seatHint.id === cafe.seatedSeatId ? "Kalk" : "Otur", {
            background: "rgba(246, 248, 255, 0.9)"
          });
        }
      }
    }

    function drawClubMap(now) {
      const club = worldState.club;
      paint(worldCtx, 0, 0, club.width, club.height, "#1d2030");
      paint(worldCtx, 0, 0, club.width, 28, "#2c3148");
      paint(worldCtx, 0, 96, club.width, club.height - 96, "#25283a");
      paint(worldCtx, 0, club.height - 32, club.width, 32, "#353048");

      paint(worldCtx, club.boothZone.x, club.boothZone.y, club.boothZone.w, club.boothZone.h, "#4f587e");
      paint(worldCtx, club.boothZone.x + 10, club.boothZone.y + 12, club.boothZone.w - 20, club.boothZone.h - 24, "#7a86c5");
      drawMapLabel(club.boothZone.x + club.boothZone.w / 2, club.boothZone.y - 8, "DJ Kabini", {
        background: "rgba(240, 244, 255, 0.86)"
      });

      paint(worldCtx, club.danceZone.x, club.danceZone.y, club.danceZone.w, club.danceZone.h, "#34406a");
      for (let i = 0; i < 6; i += 1) {
        const alpha = 0.2 + ((Math.sin(now / 220 + i * 0.8) + 1) / 2) * 0.22;
        paint(worldCtx, club.danceZone.x + 12 + i * 40, club.danceZone.y + 14, 18, club.danceZone.h - 28, `rgba(130, 188, 255, ${alpha})`);
      }
      drawMapLabel(club.danceZone.x + club.danceZone.w / 2, club.danceZone.y - 8, "Dans Pisti", {
        background: "rgba(238, 242, 255, 0.88)"
      });

      (club.seats || []).forEach((seat) => {
        paint(worldCtx, seat.x - 9, seat.y - 8, 18, 16, "#4e5166");
      });

      paint(worldCtx, club.exitZone.x, club.exitZone.y, club.exitZone.w, club.exitZone.h, "#8ac7a0");
      drawMapLabel(club.exitZone.x + club.exitZone.w / 2, club.exitZone.y - 8, "Meydana Çıkış", {
        background: "rgba(245, 255, 248, 0.9)"
      });

      const pulse = (Math.sin(now / 220 + 0.6) + 1) / 2;
      const markerW = 16;
      const markerH = 12;
      const markerX = Math.round(club.exitZone.x + club.exitZone.w / 2 - markerW / 2);
      const markerY = Math.round(club.exitZone.y + club.exitZone.h / 2 - markerH / 2);
      paint(worldCtx, markerX, markerY, markerW, markerH, "rgba(118, 198, 160, 0.82)");
      worldCtx.strokeStyle = `rgba(33, 28, 24, ${0.5 + pulse * 0.35})`;
      worldCtx.strokeRect(markerX + 0.5, markerY + 0.5, markerW - 1, markerH - 1);
      worldCtx.fillStyle = "#fff8ec";
      worldCtx.font = '700 8px "Trebuchet MS", "Segoe UI", sans-serif';
      worldCtx.textAlign = "center";
      worldCtx.textBaseline = "middle";
      worldCtx.fillText("E", markerX + markerW / 2, markerY + markerH / 2 + 0.5);
    }

    function drawTownHallMap(now) {
      const hall = worldState.hall;
      paint(worldCtx, 0, 0, hall.width, hall.height, "#e0d4c1");
      paint(worldCtx, 0, 132, hall.width, hall.height - 132, "#f3ead7");
      paint(worldCtx, 0, 0, hall.width, 24, "#7a5d46");
      paint(worldCtx, 0, hall.height - 26, hall.width, 26, "#c9b598");

      const stage = { x: 184, y: 36, w: 332, h: 92 };
      paint(worldCtx, stage.x, stage.y, stage.w, stage.h, "#8a5d3c");
      paint(worldCtx, stage.x + 8, stage.y + 8, stage.w - 16, stage.h - 16, "#b37a4e");
      paint(worldCtx, stage.x, stage.y + stage.h, stage.w, 10, "#6f472d");
      for (let plank = 0; plank < 7; plank += 1) {
        paint(worldCtx, stage.x + 18 + plank * 44, stage.y + 12, 4, stage.h - 24, "rgba(111,71,45,0.32)");
      }

      const lightPulse = (Math.sin(now / 260) + 1) / 2;
      worldCtx.fillStyle = `rgba(255, 236, 186, ${0.22 + lightPulse * 0.18})`;
      worldCtx.beginPath();
      worldCtx.arc(stage.x + 72, stage.y + 34, 20, 0, Math.PI * 2);
      worldCtx.fill();
      worldCtx.beginPath();
      worldCtx.arc(stage.x + stage.w - 72, stage.y + 34, 20, 0, Math.PI * 2);
      worldCtx.fill();
      drawMapLabel(stage.x + stage.w / 2, stage.y - 8, "Sahne", {
        background: "rgba(255, 247, 228, 0.9)"
      });

      const leftNpcArea = { x: 170, y: 132, w: 102, h: 216 };
      const rightNpcArea = { x: 428, y: 132, w: 102, h: 216 };
      paint(worldCtx, leftNpcArea.x, leftNpcArea.y, leftNpcArea.w, leftNpcArea.h, "#dbc8ae");
      paint(worldCtx, rightNpcArea.x, rightNpcArea.y, rightNpcArea.w, rightNpcArea.h, "#dbc8ae");
      paint(worldCtx, leftNpcArea.x + 8, leftNpcArea.y + 50, leftNpcArea.w - 16, 9, "#987252");
      paint(worldCtx, leftNpcArea.x + 8, leftNpcArea.y + 152, leftNpcArea.w - 16, 9, "#987252");
      paint(worldCtx, rightNpcArea.x + 8, rightNpcArea.y + 50, rightNpcArea.w - 16, 9, "#987252");
      paint(worldCtx, rightNpcArea.x + 8, rightNpcArea.y + 152, rightNpcArea.w - 16, 9, "#987252");
      drawMapLabel(leftNpcArea.x + leftNpcArea.w / 2, leftNpcArea.y - 8, "Görev NPC", {
        background: "rgba(250, 241, 225, 0.9)"
      });
      drawMapLabel(rightNpcArea.x + rightNpcArea.w / 2, rightNpcArea.y - 8, "Görev NPC", {
        background: "rgba(250, 241, 225, 0.9)"
      });

      paint(worldCtx, 222, 148, 256, 146, "rgba(197, 174, 141, 0.32)");
      (hall.chairs || []).forEach((chair, index) => {
        const seatColor = index % 2 === 0 ? "#a17756" : "#946b4d";
        paint(worldCtx, chair.x + 2, chair.y, chair.w - 4, 7, "#c69a74");
        paint(worldCtx, chair.x, chair.y + 7, chair.w, chair.h - 7, seatColor);
        paint(worldCtx, chair.x + 2, chair.y + chair.h - 1, 2, 6, "#6b4b34");
        paint(worldCtx, chair.x + chair.w - 4, chair.y + chair.h - 1, 2, 6, "#6b4b34");
      });
      drawMapLabel(350, 156, "Oturma Alanı", {
        background: "rgba(255, 252, 245, 0.88)"
      });

      paint(worldCtx, hall.exitZone.x, hall.exitZone.y, hall.exitZone.w, hall.exitZone.h, "#8ac7a0");
      drawMapLabel(hall.exitZone.x + hall.exitZone.w / 2, hall.exitZone.y - 8, "Meydana Çıkış", {
        background: "rgba(245, 255, 248, 0.9)"
      });

      drawTownHallInteractables(now);
    }

    function drawMap(now) {
      if (worldState.mode === "cafe") {
        drawCafeMap(now);
        return;
      }
      if (worldState.mode === "club") {
        drawClubMap(now);
        return;
      }
      if (worldState.mode === "hall") {
        drawTownHallMap(now);
        return;
      }
      paint(worldCtx, 0, 0, WORLD_WIDTH, WORLD_HEIGHT, "#d5ebff");
      paint(worldCtx, 0, 142, WORLD_WIDTH, WORLD_HEIGHT - 142, "#d8f0da");
      paint(worldCtx, 0, 250, WORLD_WIDTH, 62, "#f6ead2");
      paint(worldCtx, 401, 0, 58, WORLD_HEIGHT, "#f6ead2");
      paint(worldCtx, 140, 236, 160, 32, "#f6ead2");
      paint(worldCtx, 560, 236, 160, 32, "#f6ead2");
      paint(worldCtx, 404, 406, 52, 120, "#f6ead2");
      drawSquareBuildings();
      drawSquareCenterDetails(now);
      worldCtx.strokeStyle = "rgba(73, 55, 42, 0.38)";
      WORLD_BLOCKS.forEach((block) => worldCtx.strokeRect(block.x + 0.5, block.y + 0.5, block.w - 1, block.h - 1));
      worldState.collectibles.forEach((item, index) => {
        const bob = Math.sin(now / 230 + item.phase + index * 0.3) * 1.8;
        paint(worldCtx, item.x - 1, item.y + bob - 4, 2, 8, "#f8c95f");
        paint(worldCtx, item.x - 4, item.y + bob - 1, 8, 2, "#f8c95f");
      });
      drawInteractableMarkers(now);
    }

    function drawFashionOverlayShapes(targetCtx, topX, topY, scale, look) {
      const drawRect = (x, y, w, h, color) => {
        paint(
          targetCtx,
          Math.round(topX + x * scale),
          Math.round(topY + y * scale),
          Math.max(1, Math.round(w * scale)),
          Math.max(1, Math.round(h * scale)),
          color
        );
      };

      if (look.outfitId === "hat-sakura-beret") {
        drawRect(8, 7, 16, 5, "rgba(242,151,185,0.9)");
        drawRect(6, 12, 20, 2, "rgba(188,74,122,0.9)");
        drawRect(10, 8, 12, 1, "rgba(255,205,226,0.9)");
      } else if (look.outfitId === "hat-neon-cap") {
        drawRect(8, 8, 16, 4, "rgba(175,255,128,0.9)");
        drawRect(7, 12, 18, 1, "#305f1f");
        drawRect(21, 12, 6, 1, "rgba(135,238,89,0.92)");
      } else if (look.outfitId === "hat-cloud-beanie") {
        drawRect(7, 6, 18, 6, "rgba(178,216,255,0.9)");
        drawRect(6, 12, 20, 2, "rgba(120,162,214,0.88)");
        drawRect(12, 7, 8, 1, "rgba(228,244,255,0.98)");
      } else if (look.outfitId === "hat-sunset-fedora") {
        drawRect(10, 7, 12, 5, "rgba(255,177,120,0.92)");
        drawRect(6, 12, 20, 2, "rgba(244,112,98,0.86)");
        drawRect(10, 10, 12, 1, "rgba(255,234,172,0.95)");
      }

      if (look.accessoryId === "acc-star-pin") {
        drawRect(18, 21, 2, 4, "#f8cd55");
        drawRect(17, 22, 4, 2, "#f8cd55");
      } else if (look.accessoryId === "acc-cat-ear-cap") {
        drawRect(10, 6, 4, 3, "#4b4b52");
        drawRect(20, 6, 4, 3, "#4b4b52");
        drawRect(11, 7, 2, 1, "#ffd4dd");
        drawRect(21, 7, 2, 1, "#ffd4dd");
      } else if (look.accessoryId === "acc-rainbow-tail") {
        drawRect(3, 22, 5, 1, "#ff6b6b");
        drawRect(2, 23, 6, 1, "#ffb156");
        drawRect(1, 24, 6, 1, "#f4ec61");
        drawRect(2, 25, 6, 1, "#66d287");
        drawRect(3, 26, 5, 1, "#56a7e2");
      } else if (look.accessoryId === "acc-moon-glasses") {
        drawRect(11, 15, 4, 1, "rgba(68,74,92,0.9)");
        drawRect(11, 15, 1, 3, "rgba(68,74,92,0.9)");
        drawRect(14, 15, 1, 3, "rgba(68,74,92,0.9)");
        drawRect(11, 17, 4, 1, "rgba(68,74,92,0.9)");
        drawRect(17, 15, 4, 1, "rgba(68,74,92,0.9)");
        drawRect(17, 15, 1, 3, "rgba(68,74,92,0.9)");
        drawRect(20, 15, 1, 3, "rgba(68,74,92,0.9)");
        drawRect(17, 17, 4, 1, "rgba(68,74,92,0.9)");
        drawRect(15, 16, 2, 1, "rgba(68,74,92,0.85)");
      }

      if (look.shoeId === "shoe-mint-sneakers") {
        drawRect(10, 26, 5, 3, "#8adbc2");
        drawRect(17, 26, 5, 3, "#8adbc2");
        drawRect(10, 28, 5, 1, "#4a8b76");
        drawRect(17, 28, 5, 1, "#4a8b76");
      } else if (look.shoeId === "shoe-neon-boots") {
        drawRect(9, 25, 6, 4, "#9ba7ff");
        drawRect(17, 25, 6, 4, "#9ba7ff");
        drawRect(10, 24, 4, 1, "#d0f961");
        drawRect(18, 24, 4, 1, "#d0f961");
      } else if (look.shoeId === "shoe-cloud-slippers") {
        drawRect(9, 26, 6, 3, "#f4f8ff");
        drawRect(17, 26, 6, 3, "#f4f8ff");
        drawRect(10, 27, 4, 1, "#b7c4df");
        drawRect(18, 27, 4, 1, "#b7c4df");
      } else if (look.shoeId === "shoe-comet-runners") {
        drawRect(9, 26, 6, 3, "#7bc1ff");
        drawRect(17, 26, 6, 3, "#7bc1ff");
        drawRect(10, 25, 4, 1, "#ffffff");
        drawRect(18, 25, 4, 1, "#ffffff");
        drawRect(9, 28, 6, 1, "#3d6da3");
        drawRect(17, 28, 6, 1, "#3d6da3");
      }
    }

    function drawPlayerFashionOverlay(topX, topY) {
      const look = {
        outfitId: getEquippedFashionItemId("outfit"),
        accessoryId: getEquippedFashionItemId("accessory"),
        shoeId: getEquippedFashionItemId("shoe")
      };
      drawFashionOverlayShapes(worldCtx, topX, topY, 34 / 32, look);
    }

    function drawCharacter(entity, isPlayer) {
      const spriteWidth = 34;
      const spriteHeight = 34;
      const topX = Math.round(entity.x - spriteWidth / 2);
      const topY = Math.round(entity.y - spriteHeight);
      worldCtx.beginPath();
      worldCtx.fillStyle = "rgba(40,50,50,0.2)";
      worldCtx.ellipse(entity.x, entity.y + 1, 12, 5, 0, 0, Math.PI * 2);
      worldCtx.fill();
      if (entity.sprite) { worldCtx.drawImage(entity.sprite, topX, topY, spriteWidth, spriteHeight); }
      if (isPlayer) {
        drawPlayerFashionOverlay(topX, topY);
      }
      worldCtx.fillStyle = isPlayer ? "#123d35" : "#1f2b25";
      worldCtx.font = 'bold 12px "Trebuchet MS", "Segoe UI", sans-serif';
      worldCtx.textAlign = "center";
      worldCtx.textBaseline = "bottom";
      worldCtx.fillText(entity.name, entity.x, topY - 3);
    }

    function renderWorld(now) {
      const cameraX = Math.round(worldState.camera.x);
      const cameraY = Math.round(worldState.camera.y);
      worldCtx.save();
      worldCtx.clearRect(0, 0, worldCanvas.width, worldCanvas.height);
      worldCtx.translate(-cameraX, -cameraY);
      drawMap(now);
      let entities = [];
      if (worldState.mode === "hall") {
        entities = [...(worldState.hall.npcs || [])];
      } else if (worldState.mode === "square") {
        entities = [...worldState.npcs];
      } else if (worldState.mode === "cafe" && worldState.cafe.barista) {
        entities = [worldState.cafe.barista];
      }
      if (worldState.player) {
        entities.push(worldState.player);
      }
      entities.sort((a, b) => a.y - b.y);
      entities.forEach((entity) => drawCharacter(entity, entity === worldState.player));
      worldCtx.restore();
      drawFashionShopOverlay(worldCtx);
      drawCafeMiniGameOverlay(worldCtx, now);
    }

    function updateWorldFrame(dt, now) {
      updatePlayerMovement(dt);
      syncCafeSeatedPlayerPosition();
      updateNpcMovement(dt, now);
      updateTownHallNpcMovement(dt, now);
      updateCafeMiniGame(now);
      updateSquareCollectibles(now);
      updateWorldCamera();
      updateWorldStatus();
      updateWorldHint();
      if (worldState.chatUntil > now) { worldChatText.textContent = worldState.chatText; } else { worldChatText.textContent = ""; }
    }

    function worldLoop(now) {
      if (!worldState.running) { return; }
      const dt = Math.min((now - worldState.lastTime) / 1000, 0.05);
      worldState.lastTime = now;
      updateWorldFrame(dt, now);
      renderWorld(now);
      worldState.rafId = requestAnimationFrame(worldLoop);
    }

    function startWorldLoop() {
      if (worldState.running) { return; }
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
      closeFashionShop(false);
      worldState.mode = "square";
      stopWorldAudio();
      if (worldState.rafId) { cancelAnimationFrame(worldState.rafId); worldState.rafId = null; }
    }

    function resolveCafeGameChoice(choiceIndex) {
      if (worldState.mode !== "cafe" || !worldState.cafe || !worldState.cafe.game.active) {
        return;
      }
      const game = worldState.cafe.game;
      if (!game.currentOrder) {
        createCafeOrder(performance.now());
      }
      const order = game.currentOrder;
      if (!order) {
        return;
      }
      const step = order.steps[order.stepIndex];
      if (!step) {
        return;
      }
      if (choiceIndex < 0 || choiceIndex >= step.options.length) {
        return;
      }

      const expectedChoice = order.expectedChoices[order.stepIndex];
      if (choiceIndex !== expectedChoice) {
        game.misses += 1;
        game.streak = 0;
        game.score = Math.max(0, game.score - 3);
        const expectedLabel = step.options[expectedChoice];
        game.lastResult = `Yanlış seçim: Doğrusu "${expectedLabel}" olmalıydı.`;
        setWorldChat(`${order.customerName}: Bu seçim tutmadı, yeni sipariş alalım.`, 1500);
        createCafeOrder(performance.now());
        return;
      }

      order.selectedChoices.push(choiceIndex);
      order.stepIndex += 1;
      game.lastResult = `Doğru seçim: ${step.options[choiceIndex]}`;

      if (order.stepIndex < order.steps.length) {
        const nextStep = order.steps[order.stepIndex];
        setWorldChat(`Doğru seçim! Sıradaki adım: ${nextStep.prompt}`, 1200);
        return;
      }

      game.served += 1;
      game.streak += 1;
      const scoreGain = 10 + Math.min(12, game.streak * 2);
      const starReward = 1 + Math.min(2, Math.floor(game.streak / 3));
      game.score += scoreGain;
      worldState.partyStars += starReward;
      game.lastResult = `Sipariş tamamlandı! +${scoreGain} puan, +${starReward} yıldız`;

      setWorldChat(`${order.customerName}: Mükemmel! +${scoreGain} puan, +${starReward} yıldız.`, 1900);
      createCafeOrder(performance.now());
    }

    function stopCafeMiniGame(showMessage = true) {
      if (!worldState.cafe || !worldState.cafe.game) {
        return;
      }
      const game = worldState.cafe.game;
      const played = game.active;
      const inGuide = game.introOpen;
      game.active = false;
      game.introOpen = false;
      game.currentOrder = null;
      game.orderEndAt = 0;
      game.lastResult = "";
      clearMovementIntent();

      if (!showMessage) {
        return;
      }
      if (inGuide && !played) {
        setWorldChat("Barista rehberi kapatıldı.", 1100);
        return;
      }
      if (!played) {
        setWorldChat("Kafe mini oyunu kapalı.", 1000);
        return;
      }
      setWorldChat(`Kafe oyunundan çıktın. Skor: ${game.score}, servis: ${game.served}.`, 1400);
    }
    function resolveClubDanceInput() {}
    function stopClubDanceGame(showMessage = true) { worldState.club.game.active = false; if (showMessage) { setWorldChat("Kulüp oyunundan çıktın.", 1000); } }

    return {
      initializeMiyuSquareWorld,
      ensureWorldAudio,
      triggerPlayerEmote,
      interactInWorld,
      closeFashionShop,
      isFashionShopOpen,
      isFashionShopKey,
      handleFashionShopKey,
      handleWorldMouseDown,
      handleWorldMouseMove,
      handleWorldMouseUp,
      setMovementKey,
      resolveCafeGameChoice,
      stopCafeMiniGame,
      resolveClubDanceInput,
      stopClubDanceGame,
      startWorldLoop,
      stopWorldLoop
    };
  }

  global.MiuWorld = {
    CAFE_GAME_KEYS,
    CLUB_GAME_KEYS,
    WORLD_CONTROL_KEYS,
    WORLD_EXTRA_KEYS,
    createInitialWorldState,
    createWorldRuntime
  };
})(window);










