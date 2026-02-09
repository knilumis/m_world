(function (global) {
  function normalizeInput(value) {
    return value.trim().replace(/\s+/g, " ");
  }

  function randomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function pickRandom(list) {
    return list[randomInt(list.length)];
  }

  function cycle(value, max, direction) {
    return (value + direction + max) % max;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
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

  global.MiuCore = {
    normalizeInput,
    randomInt,
    pickRandom,
    cycle,
    clamp,
    darken
  };
})(window);
