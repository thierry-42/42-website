import path from "node:path";

import sharp from "sharp";

const [source, destination, widthValue = "1440", heightValue = "960"] =
  process.argv.slice(2);

if (!source || !destination) {
  throw new Error(
    "Usage: node scripts/optimize-image.mjs <source> <destination> [width] [height]",
  );
}

const width = Number.parseInt(widthValue, 10);
const height = Number.parseInt(heightValue, 10);

if (!Number.isFinite(width) || !Number.isFinite(height)) {
  throw new Error("Width and height must be valid integers.");
}

const result = await sharp(source)
  .resize(width, height, { fit: "cover", position: "centre" })
  .webp({ effort: 6, quality: 88, smartSubsample: true })
  .toFile(destination);

console.log(
  `${path.basename(destination)} ${result.width}x${result.height} ${result.size} bytes`,
);
