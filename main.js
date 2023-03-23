const svg = document.querySelector("svg");

const GLYPH_MAP = {};

async function loadGlyphMap() {
  const res = await fetch("glyphs.txt");
  const text = await res.text();
  const glyphs = text.split("---");
  for (const glyph of glyphs) {
    const lines = glyph.trim().split("\n");
    const name = lines[0];
    const data = lines.slice(1);
    GLYPH_MAP[name] = data;
  }
}

function createRect(svg, x, y, width, height, fill) {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("fill", fill);
  svg.appendChild(rect);
}

function createEllipse(svg, x, y, width, height, fill) {
  const ellipse = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "ellipse"
  );
  ellipse.setAttribute("cx", x + width / 2);
  ellipse.setAttribute("cy", y + height / 2);
  ellipse.setAttribute("rx", width / 4);
  ellipse.setAttribute("ry", height / 4);
  ellipse.setAttribute("fill", fill);
  svg.appendChild(ellipse);
}

let blockWidth = 50;
let blockHeight = 20;
let letterSpacing = 20;

function drawGlyph(glyphName, x, y) {
  const glyph = GLYPH_MAP[glyphName];
  for (let row = 0; row < glyph.length; row++) {
    const line = glyph[row];
    for (let col = 0; col < line.length; col++) {
      const char = line[col];
      if (char === "#") {
        createRect(
          svg,
          x + col * blockWidth,
          y + row * blockHeight,
          blockWidth,
          blockHeight,
          "red"
        );
      } else if (char === ".") {
        createEllipse(
          svg,
          x + col * blockWidth,
          y + row * blockHeight,
          blockWidth,
          blockHeight,
          "blue"
        );
      }
    }
  }
}

function drawText() {
  svg.innerHTML = "";
  const text = "ABC";
  let x = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    drawGlyph(char, x, 0);
    x += blockWidth * 3 + letterSpacing;
  }
}

async function main() {
  await loadGlyphMap();
  drawText();
}

main();

document.querySelector("#slider-block-width").addEventListener("input", (e) => {
  blockWidth = e.target.value;
  drawText();
});

document
  .querySelector("#slider-block-height")
  .addEventListener("input", (e) => {
    blockHeight = e.target.value;
    drawText();
  });
