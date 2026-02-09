(function (global) {
  const MIU_SQUARE_WORLD = {
    id: "miu-square",
    name: "Miu Meydanı",
    vibe: "Sohbet",
    crowd: "68 Miu"
  };

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
  const HALL_WIDTH = 700;
  const HALL_HEIGHT = 430;
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

  const FASHION_SHOP_KEYS = new Set([
    "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "arrowleft", "arrowright",
    "enter", "escape",
    "y", "n", "e", "q"
  ]);
  const FASHION_SHOP_ITEMS = [
    {
      id: "hat-sakura-beret",
      label: "Sakura Bere",
      type: "outfit",
      price: 12,
      rarity: "Nadir",
      description: "Pembe tonlu, yumuşak dokulu şık bir bere."
    },
    {
      id: "hat-neon-cap",
      label: "Neon Kep",
      type: "outfit",
      price: 9,
      rarity: "Yaygın",
      description: "Gece meydanına uygun parlak siperlikli kep."
    },
    {
      id: "hat-cloud-beanie",
      label: "Bulut Bere",
      type: "outfit",
      price: 15,
      rarity: "Destansı",
      description: "Bulut desenli yumuşak örgü bere."
    },
    {
      id: "hat-sunset-fedora",
      label: "Günbatımı Fötr",
      type: "outfit",
      price: 11,
      rarity: "Yaygın",
      description: "İnce şerit detaylı sıcak tonlu fötr şapka."
    },
    {
      id: "acc-star-pin",
      label: "Yıldız Rozet",
      type: "accessory",
      price: 6,
      rarity: "Yaygın",
      description: "Çantaya veya yakaya takılan parlak rozet."
    },
    {
      id: "acc-cat-ear-cap",
      label: "Kedi Kulak Şapka",
      type: "accessory",
      price: 11,
      rarity: "Nadir",
      description: "Sevimli kulak detaylı özel şapka."
    },
    {
      id: "acc-rainbow-tail",
      label: "Gökkuşağı Kuyruk",
      type: "accessory",
      price: 14,
      rarity: "Destansı",
      description: "Renkli, ışıldayan kuyruk aksesuarı."
    },
    {
      id: "acc-moon-glasses",
      label: "Ay Hilali Gözlük",
      type: "accessory",
      price: 10,
      rarity: "Nadir",
      description: "İnce metal çerçeveli, hilal detaylı şık gözlük."
    },
    {
      id: "shoe-mint-sneakers",
      label: "Nane Sneaker",
      type: "shoe",
      price: 8,
      rarity: "Yaygın",
      description: "Günlük kullanım için hafif ve rahat sneaker."
    },
    {
      id: "shoe-neon-boots",
      label: "Neon Bot",
      type: "shoe",
      price: 13,
      rarity: "Nadir",
      description: "Parlak çizgili botlarla adımların dikkat çeker."
    },
    {
      id: "shoe-cloud-slippers",
      label: "Bulut Terlik",
      type: "shoe",
      price: 16,
      rarity: "Destansı",
      description: "Bulut kadar yumuşak, özel seri terlik seti."
    },
    {
      id: "shoe-comet-runners",
      label: "Kuyruklu Yıldız Koşu",
      type: "shoe",
      price: 12,
      rarity: "Nadir",
      description: "Yüksek tabanlı koşu ayakkabısıyla daha enerjik adımlar."
    }
  ];

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

  function createTownHallSceneState() {
    const chairs = [];
    for (let row = 0; row < 2; row += 1) {
      for (let col = 0; col < 5; col += 1) {
        chairs.push({
          id: `chair-${row}-${col}`,
          x: 240 + col * 48,
          y: 170 + row * 46,
          w: 22,
          h: 20
        });
      }
    }

    return {
      width: HALL_WIDTH,
      height: HALL_HEIGHT,
      entryPoint: { x: 350, y: 370 },
      exitZone: { x: 318, y: 390, w: 64, h: 20 },
      blocks: [
        { x: 164, y: 36, w: 372, h: 102 },
        { x: 72, y: 118, w: 92, h: 220 },
        { x: 536, y: 118, w: 92, h: 220 }
      ],
      interactables: [
        { id: "hall-exit", label: "Meydana Dön", x: 318, y: 386, w: 64, h: 20, message: "Meydana dönüş kapısı." }
      ],
      chairs,
      npcs: [],
      taskClaimed: false,
      previousWorldPosition: null
    };
  }

  function createFashionShopState() {
    return {
      open: false,
      selectedCategory: "outfit",
      hoverIndex: -1,
      selectedItemId: "",
      confirm: {
        open: false,
        itemId: "",
        price: 0
      },
      items: FASHION_SHOP_ITEMS.map((item) => ({ ...item }))
    };
  }

  global.MiuWorldMiuSquare = {
    MIU_SQUARE_WORLD,
    WORLD_NPC_DEFS,
    WORLD_PLAYER_SPEED,
    WORLD_NPC_SPEED,
    WORLD_WIDTH,
    WORLD_HEIGHT,
    CAFE_WIDTH,
    CAFE_HEIGHT,
    CLUB_WIDTH,
    CLUB_HEIGHT,
    HALL_WIDTH,
    HALL_HEIGHT,
    WORLD_JOYSTICK_MAX_DISTANCE,
    WORLD_JOYSTICK_DEADZONE,
    WORLD_CONTROL_KEYS,
    WORLD_EXTRA_KEYS,
    CAFE_GAME_KEYS,
    CLUB_DANCE_KEYS,
    CLUB_GAME_KEYS,
    CLUB_DANCE_KEY_TIME_BASE,
    CLUB_DANCE_KEY_TIME_MIN,
    WORLD_START_COLLECTIBLE_COUNT,
    WORLD_MAX_COLLECTIBLE_COUNT,
    WORLD_COLLECTIBLE_RESPAWN_MS,
    FASHION_SHOP_KEYS,
    FASHION_SHOP_ITEMS,
    WORLD_BLOCKS,
    WORLD_ZONES,
    WORLD_AMBIENCE_PROFILES,
    WORLD_EVENT_LIBRARY,
    CAFE_RECIPES,
    CAFE_CUSTOMER_NAMES,
    createCafeSceneState,
    createClubSceneState,
    createTownHallSceneState,
    createFashionShopState
  };
})(window);



