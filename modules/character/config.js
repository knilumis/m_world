(function (global) {
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

  global.MiuCharacterConfig = {
    SHARED_COLORS,
    PARTS,
    MIU_NAME_PREFIXES,
    MIU_NAME_SUFFIXES
  };
})(window);
