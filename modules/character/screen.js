(function (global) {
  const { PARTS, MIU_NAME_PREFIXES, MIU_NAME_SUFFIXES } = global.MiuCharacterConfig;
  const { darken, pickRandom, randomInt } = global.MiuCore;

function createCharacterScreenModule({
  state,
  mainCtx,
  lobbyCtx,
  controlsPanel,
  miuBuildList,
  lobbyMiuName
}) {
  function generateRandomMiuName() {
    let candidate = `${pickRandom(MIU_NAME_PREFIXES)}${pickRandom(MIU_NAME_SUFFIXES)}`;
    if (candidate.length > 20) {
      candidate = candidate.slice(0, 20);
    }
    return candidate;
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

  function updateMiuNameText() {
    const label = state.miuName || "-";
    lobbyMiuName.textContent = `Miu adı: ${label}`;
  }

  function syncAllMiuViews() {
    renderMiu(mainCtx);
    renderMiu(lobbyCtx);
    renderMiuSummary();
    updateMiuNameText();
  }

  function randomizeMiuStyle() {
    Object.keys(PARTS).forEach((partKey) => {
      state[partKey].style = randomInt(PARTS[partKey].styles.length);
      state[partKey].color = randomInt(PARTS[partKey].colors.length);
      updateControlValues(partKey);
    });
    syncAllMiuViews();
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

  return {
    generateRandomMiuName,
    renderMiuWithParts,
    clonePartState,
    createMiuSpriteCanvas,
    updateControlValues,
    buildControls,
    randomizeMiuStyle,
    renderMiuSummary,
    updateMiuNameText,
    syncAllMiuViews
  };
}

  global.MiuCharacter = {
    createCharacterScreenModule
  };
})(window);
