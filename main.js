// . : leeg, breedte constant, hoogte constant
// , : leeg, breedte variabel, hoogte constant
// ? : leeg, breedte constant, hoogte variabel
// ; : leeg, breedte variabel, hoogte variabel

// @ : vol, breedte constant, hoogte constant
// # : vol, breedte variabel, hoogte constant
// ! : vol, breedte constant, hoogte variabel
// $ : vol, breedte variabel, hoogte variabel

// leeg: .,?;
const white = [".", ",", "?", ";"];
// vol: @#!$
const black = ["@", "#", "!", "$"];
// breedte constant: .?@!
const constantWidth = [".", "?", "@", "!"];
// breedte variabel: ,;#$
const variableWidth = [",", ";", "#", "$"];
// hoogte constant: .,@#
const constantHeight = [".", ",", "@", "#"];
// hoogte variabel: ?;!$
const variableHeight = ["?", ";", "!", "$"];

const glyphText = `A
.,@,.
.#.#.
@,.,@
?$!$?
@,.,@
@,.,@
@,.,@
@,.,@
---
B
@##..
@,,@.
@,,.@
!$$!?
@,,.@
@,,.@
@,,.@
@##@.
---
C
..@##
.@.,,
@..,,
!??;;
@..,,
@..,,
@..,,
.@@##
---
D
@##..
@,,@.
@,,.@
!;;?!
@,,.@
@,,.@
@,,.@
@##@.
---
E
.@@##
@..,,
@..,,
?!!$$
@..,,
@..,,
@..,,
.@@##
---
F
.@@##
@..,,
@..,,
?!!$$
@..,,
@..,,
@..,,
@..,,
---
G
..##@
.@,,.
@....
!?$$!
@.,,@
@.,,@
@.,,@
.@##.
---
H
@,.,@
@,.,@
@,.,@
?$!$?
@,.,@
@,.,@
@,.,@
@,.,@
---
I
,,..@
,,..@
,,..@
;;??!
,,..@
,,..@
,,..@
,,..@
---
J
.,,.@
.,,.@
.,,.@
?;;?!
.,,.@
.,,.@
@,,@.
.##..
---
K
@,,.@
@,,@.
@,#..
?$;??
@,#@.
@,,.@
@,,.@
@,,.@
---
L
@,,..
@,,..
@,,..
!;;??
@,,..
@,,..
@,,..
.##@@
---
M
.#.#.
@,@,@
@,@,@
!;!;!
@,@,@
@,@,@
@,@,@
@,@,@
---
N
@#.,@
@,@,@
@,@,@
!;!;!
@,@,@
@,@,@
@,@,@
@,.#@
---
O
.,@,.
.#.#.
@,.,@
!;?;!
@,.,@
@,.,@
.#.#.
.,@,.
---
P
@##..
@,,@.
@,,.@
!$$!?
@,,..
@,,..
@,,..
@,,..
---
Q
.,@,.
.#.#.
@,.,@
!;?;!
@,.,@
@,.,@
.#.#.
.,@,@
---
R
@##..
@,,@.
@,,.@
?$$!?
@#,..
@,#..
@,,@.
@,,.@
---
S
.##@.
@,,.@
@,,..
?$$??
.,,@.
.,,.@
@,,.@
.##@.
---
T
@#.#@
.,@,.
.,@,.
?;!;?
.,@,.
.,@,.
.,@,.
.,@,.
---
U
@,.,@
@,.,@
@,.,@
!;?;!
@,.,@
@,.,@
@,.,@
.#@#.
---
V
@,.,@
@,.,@
@,.,@
!;?;!
@,.,@
@,.,@
.#.#.
.,@,.
---
W
@,.,@
@,.,@
@,.,@
!;!;!
@,@,@
@,@,@
@,@,@
.#.#.
---
X
@,.,@
@,.,@
.#.#.
?;!;?
.#.#.
@,.,@
@,.,@
@,.,@
---
Y
@,.,@
@,.,@
.#.#.
?;!;?
.,@,.
.,@,.
.,@,.
.,@,.
---
Z
@#@#.
.,.,@
.,.#.
?;!;?
.#.,.
@,.,.
@,.,.
.#@#@`;

const svg = document.querySelector("svg");

const GLYPH_MAP = {};

const glyphUpperRight = {};

const SHAPE_TYPES = [
  "rect",
  "roundedrect",
  "ellipse",
  "cross",
  "diamond",
  "plusCross",
];

const CHAR_TO_SHAPE_MAP = {
  ".": null,
  ",": null,
  "?": null,
  ";": null,
  "@": "rect",
  "#": "rect",
  "!": "rect",
  $: "rect",
};

let currentShapeIndex = 0;

//functie om Glyphmap op te laden
async function loadGlyphMap() {
  // const res = await fetch("glyphs.txt");
  const text = glyphText;
  const glyphs = text.split("---");
  for (const glyph of glyphs) {
    const lines = glyph.trim().split("\n");
    const name = lines[0];
    const data = lines.slice(1);
    GLYPH_MAP[name] = data;
  }
}

//functie om rechthoek te creeeren die kan worden gebruikt in Glyphs
function createRect(svg, x, y, width, height, fill) {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("fill", fill);
  svg.appendChild(rect);
  return rect;
}

//functie om ellips te creeeren die kan worden gebruikt in Glyphs
function createEllipse(svg, x, y, width, height, fill) {
  const ellipse = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "ellipse"
  );
  ellipse.setAttribute("cx", x + width / 2);
  ellipse.setAttribute("cy", y + height / 2);
  ellipse.setAttribute("rx", width / 2);
  ellipse.setAttribute("ry", height / 2);
  ellipse.setAttribute("fill", fill);
  svg.appendChild(ellipse);
  return ellipse;
}

function createCross(svg, x, y, width, height, strokeWidth, stroke) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

  const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line1.setAttribute("x1", x);
  line1.setAttribute("y1", y);
  line1.setAttribute("x2", x + width);
  line1.setAttribute("y2", y + height);
  line1.setAttribute("stroke-width", strokeWidth);
  line1.setAttribute("stroke", stroke);
  group.appendChild(line1);

  const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line2.setAttribute("x1", x + width);
  line2.setAttribute("y1", y);
  line2.setAttribute("x2", x);
  line2.setAttribute("y2", y + height);
  line2.setAttribute("stroke-width", strokeWidth);
  line2.setAttribute("stroke", stroke);
  group.appendChild(line2);

  svg.appendChild(group);
  return group;
}

function createRoundedRect(svg, x, y, width, height, rx, ry, fill) {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("rx", rx);
  rect.setAttribute("ry", ry);
  rect.setAttribute("fill", fill);
  svg.appendChild(rect);
  return rect;
}

function createDiamond(svg, x, y, width, height, fill) {
  const diamond = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon"
  );
  const points = `${x + width / 2},${y} ${x + width},${y + height / 2} ${
    x + width / 2
  },${y + height} ${x},${y + height / 2}`;
  diamond.setAttribute("points", points);
  diamond.setAttribute("fill", fill);
  svg.appendChild(diamond);
  return diamond;
}

function createPlusCross(svg, x, y, width, height, strokeWidth, stroke) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

  const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line1.setAttribute("x1", x + width / 2);
  line1.setAttribute("y1", y);
  line1.setAttribute("x2", x + width / 2);
  line1.setAttribute("y2", y + height);
  line1.setAttribute("stroke-width", strokeWidth);
  line1.setAttribute("stroke", stroke);
  group.appendChild(line1);

  const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line2.setAttribute("x1", x);
  line2.setAttribute("y1", y + height / 2);
  line2.setAttribute("x2", x + width);
  line2.setAttribute("y2", y + height / 2);
  line2.setAttribute("stroke-width", strokeWidth);
  line2.setAttribute("stroke", stroke);
  group.appendChild(line2);

  svg.appendChild(group);
  return group;
}

//standaard maten, wanneer ze niet uitgerokken zijn
let blockWidth = 15;
let blockHeight = 15;
let letterSpacing = 25;
let letterSpacing2 = 30;

function changeShapeType(char) {
  const oldShape = CHAR_TO_SHAPE_MAP[char];
  const oldShapeIndex = SHAPE_TYPES.indexOf(oldShape);
  const newShapeIndex = (oldShapeIndex + 1) % SHAPE_TYPES.length;
  const newShape = SHAPE_TYPES[newShapeIndex];
  CHAR_TO_SHAPE_MAP[char] = newShape;
  drawText();
}

//functie om glyph te tekenen
function drawGlyph(glyphIndex, glyphName, x, y) {
  const glyph = GLYPH_MAP[glyphName];
  const glyphElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  glyphElement.setAttribute("id", `glyph-${glyphIndex}`);
  glyphElement.setAttribute("transform", `translate(${x},${y})`);
  let previousRight, previousEnd;
  let left, top, width, height, shape, color;

  previousEnd = 0;
  for (let row = 0; row < glyph.length; row++) {
    const line = glyph[row];
    previousRight = 0;

    for (let col = 0; col < line.length; col++) {
      const lastCol = col === line.length - 1;
      const char = line[col];
      left = previousRight;
      top = previousEnd;

      if (constantWidth.includes(char)) {
        width = 15;
      } else {
        width = blockWidth;
      }

      if (constantHeight.includes(char)) {
        height = 15;
      } else {
        height = blockHeight;
      }

      if (white.includes(char)) {
        color = "white";
        shape = "rect";
      } else {
        color = "black";
      }

      previousRight = left + width;

      shape = CHAR_TO_SHAPE_MAP[char];
      if (!shape) {
        continue;
      }

      let element;
      if (shape === "rect" && color === "black") {
        element = createRect(glyphElement, left, top, width, height, color);
      } else if (shape === "roundedrect") {
        element = createRoundedRect(
          glyphElement,
          left,
          top,
          width,
          height,
          10,
          10,
          color
        );
      } else if (shape === "ellipse") {
        element = createEllipse(glyphElement, left, top, width, height, color);
      } else if (shape === "cross") {
        element = createCross(
          glyphElement,
          left,
          top,
          width,
          height,
          2.5,
          color
        );
      } else if (shape === "diamond") {
        element = createDiamond(glyphElement, left, top, width, height, color);
      } else if (shape === "plusCross") {
        element = createPlusCross(
          glyphElement,
          left,
          top,
          width,
          height,
          7,
          color
        );
      } else {
        console.warn(`Unknown shape ${shape}`);
      }

      // Eventlistener toevoegen aan glyphelement
      element.addEventListener("click", () => {
        changeShapeType(char);
      });
    }

    previousEnd = top + height;
  }

  // Glyphelement toevoegen aan de SVG
  svg.appendChild(glyphElement);
}
// end of row loop

function drawText() {
  const glyphsPerRow = 6;
  svg.innerHTML = "";
  const text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // const text = "A";
  let x = 0;
  for (let i = 0; i < text.length; i++) {
    row = Math.floor(i / glyphsPerRow);
    col = i % glyphsPerRow;

    // 2 variable width, 3 fixed width
    x = col * (blockWidth * 2 + 3 * 15 + letterSpacing);
    // 1 variable height, 7 fixed height
    y = row * (blockHeight + 7 * 15 + letterSpacing2);
    const char = text[i];
    drawGlyph(i, char, x, y);
  }
}

async function main() {
  await loadGlyphMap();
  drawText();
}

main();
document
  .querySelector("#slider-block-height")
  .addEventListener("input", (e) => {
    blockHeight = Number(e.target.value);
    drawText();
  });

const widthRangeInput = document.querySelector("#slider-block-width");
widthRangeInput.value = blockWidth;
widthRangeInput.addEventListener("input", (e) => {
  blockWidth = Number(e.target.value);
  drawText();
});
