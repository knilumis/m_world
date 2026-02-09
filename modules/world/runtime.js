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

    function getActiveWorldBlocks() {
      if (worldState.mode === "cafe") {
        return worldState.cafe.counterBlocks || [];
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
      return worldState.interactables;
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
      if (interactable.id === "fashion-shop") { openFashionShop(); return; }
      if (interactable.id === "town-hall") { enterTownHall(); return; }
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
      const zoneName = worldState.mode === "hall" ? "Meydan Holü" : getCurrentZoneName(worldState.player.x, worldState.player.y);
      worldState.currentZoneName = zoneName;
      const worldInfo = getWorldById("miu-square");
      const eventTitle = worldState.mode === "hall"
        ? "Sahne Hazırlığı"
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
      const entities = worldState.mode === "hall"
        ? [...(worldState.hall.npcs || [])]
        : [...worldState.npcs];
      if (worldState.player) {
        entities.push(worldState.player);
      }
      entities.sort((a, b) => a.y - b.y);
      entities.forEach((entity) => drawCharacter(entity, entity === worldState.player));
      worldCtx.restore();
      drawFashionShopOverlay(worldCtx);
    }

    function updateWorldFrame(dt, now) {
      updatePlayerMovement(dt);
      updateNpcMovement(dt, now);
      updateTownHallNpcMovement(dt, now);
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

    function resolveCafeGameChoice() {}
    function stopCafeMiniGame(showMessage = true) { worldState.cafe.game.active = false; if (showMessage) { setWorldChat("Kafe oyunundan çıktın.", 1000); } }
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










