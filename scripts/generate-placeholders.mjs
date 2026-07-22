import { mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const outputRoot = path.resolve("public/images");

const palette = {
  coral: { b: 89, g: 122, r: 255 },
  ink: { b: 16, g: 11, r: 9 },
  inkSoft: { b: 41, g: 32, r: 27 },
  orbit: { b: 255, g: 167, r: 142 },
  paper: { b: 239, g: 245, r: 247 },
  paperSoft: { b: 225, g: 234, r: 238 },
  signal: { b: 74, g: 255, r: 199 },
};

function rectangle(width, height, background, left, top) {
  return {
    input: { create: { background, channels: 3, height, width } },
    left,
    top,
  };
}

function grid(width, height, colour, gap = 72) {
  const layers = [];
  for (let x = gap; x < width; x += gap) {
    layers.push(rectangle(1, height, colour, x, 0));
  }
  for (let y = gap; y < height; y += gap) {
    layers.push(rectangle(width, 1, colour, 0, y));
  }
  return layers;
}

async function createAsset(relativePath, width, height, background, layers) {
  const target = path.join(outputRoot, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await sharp({ create: { background, channels: 3, height, width } })
    .composite(layers)
    .webp({ effort: 5, quality: 82 })
    .toFile(target);
}

const teamFiles = [
  "team/thierry-luc-hero.webp",
  "team/team-02.webp",
  "team/team-03.webp",
  "team/team-04.webp",
  "team/team-05.webp",
  "team/team-06.webp",
];

for (const [index, file] of teamFiles.entries()) {
  const width = 1200;
  const height = 1500;
  const offset = 80 + index * 36;
  await createAsset(file, width, height, palette.ink, [
    ...grid(width, height, { ...palette.paper, alpha: 0.05 }, 96),
    rectangle(560, 980, palette.inkSoft, 320, 280),
    rectangle(
      12,
      980,
      index % 2 ? palette.orbit : palette.signal,
      320 + offset,
      280,
    ),
    rectangle(360, 12, palette.paperSoft, 420, 1040 - offset / 2),
    rectangle(160, 160, index === 0 ? palette.signal : palette.orbit, 120, 110),
  ]);
}

for (let index = 1; index <= 3; index += 1) {
  const width = 1600;
  const height = 1000;
  await createAsset(
    `work/case-study-placeholder-0${index}.webp`,
    width,
    height,
    palette.ink,
    [
      ...grid(width, height, { ...palette.paper, alpha: 0.05 }, 80),
      rectangle(360, 210, palette.inkSoft, 180, 220),
      rectangle(360, 210, palette.inkSoft, 1060, 570),
      rectangle(520, 6, index === 2 ? palette.coral : palette.orbit, 540, 322),
      rectangle(6, 248, palette.signal, 1238, 322),
      rectangle(180, 180, palette.signal, 710, 410),
    ],
  );
}

const insightFiles = [
  "insights/portal-cleanup.webp",
  "insights/implementation-mapping.webp",
  "insights/native-or-custom.webp",
];

for (const [index, file] of insightFiles.entries()) {
  const width = 1200;
  const height = 800;
  await createAsset(file, width, height, palette.paper, [
    ...grid(width, height, { ...palette.ink, alpha: 0.06 }, 64),
    rectangle(14, 520, index === 1 ? palette.orbit : palette.signal, 150, 140),
    rectangle(650, 36, palette.ink, 260, 220),
    rectangle(520, 18, palette.inkSoft, 260, 304),
    rectangle(400, 18, palette.inkSoft, 260, 354),
    rectangle(260, 120, palette.paperSoft, 790, 500),
  ]);
}

await createAsset(
  "placeholders/foundation-grid.webp",
  1600,
  1000,
  palette.ink,
  [
    ...grid(1600, 1000, { ...palette.paper, alpha: 0.055 }, 84),
    rectangle(420, 280, palette.inkSoft, 160, 180),
    rectangle(420, 280, palette.inkSoft, 1020, 540),
    rectangle(440, 8, palette.orbit, 580, 318),
    rectangle(8, 222, palette.signal, 1226, 318),
    rectangle(190, 190, palette.signal, 705, 405),
  ],
);

await createAsset("diagrams/system-overview.webp", 1600, 1000, palette.paper, [
  ...grid(1600, 1000, { ...palette.ink, alpha: 0.06 }, 80),
  rectangle(360, 210, palette.paperSoft, 140, 210),
  rectangle(360, 210, palette.inkSoft, 620, 395),
  rectangle(360, 210, palette.paperSoft, 1100, 580),
  rectangle(120, 7, palette.orbit, 500, 310),
  rectangle(120, 7, palette.signal, 980, 685),
]);
