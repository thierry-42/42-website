import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { deflateRawSync } from "node:zlib";

const projectRoot = process.cwd();
const sourceDirectory = path.join(
  projectRoot,
  "src",
  "animations",
  "strategy-architecture",
);
const publicDirectory = path.join(
  projectRoot,
  "public",
  "animations",
  "strategy-architecture",
);
const runtimeDirectory = path.join(
  projectRoot,
  "public",
  "animations",
  "runtime",
);
const runtimeSource = path.join(
  projectRoot,
  "node_modules",
  "@lottiefiles",
  "dotlottie-web",
  "dist",
  "dotlottie-player.wasm",
);

const frameRate = 30;
const durationFrames = 150;
const canvas = { height: 500, width: 800 };

const colours = {
  background: "#090b10",
  coral: "#ff7a59",
  grid: "#303641",
  inkRaised: "#151922",
  inkSurface: "#10131a",
  offWhite: "#f7f5ef",
  signal: "#c7ff4a",
  slate: "#747c88",
};

function colour(hex) {
  const value = hex.replace("#", "");
  return [
    Number.parseInt(value.slice(0, 2), 16) / 255,
    Number.parseInt(value.slice(2, 4), 16) / 255,
    Number.parseInt(value.slice(4, 6), 16) / 255,
    1,
  ];
}

const easeIn = { x: [0.67], y: [1] };
const easeOut = { x: [0.33], y: [0] };

function animated(values) {
  return {
    a: 1,
    k: values.map((entry, index) => {
      const next = values[index + 1];
      if (!next) return { s: entry.value, t: entry.frame };
      return {
        e: next.value,
        i: easeIn,
        o: easeOut,
        s: entry.value,
        t: entry.frame,
      };
    }),
  };
}

function still(value) {
  return { a: 0, k: value };
}

function transform({
  opacity = still(100),
  position = still([0, 0, 0]),
  rotation = still(0),
  scale = still([100, 100, 100]),
} = {}) {
  return {
    a: still([0, 0, 0]),
    o: opacity,
    p: position,
    r: rotation,
    s: scale,
  };
}

function rectangle({
  fill,
  height,
  name,
  opacity = 100,
  position = [0, 0],
  radius = 0,
  stroke,
  strokeOpacity = 100,
  strokeWidth = 1,
  width,
}) {
  const shapes = [
    {
      d: 1,
      nm: `${name} shape`,
      p: still(position),
      r: still(radius),
      s: still([width, height]),
      ty: "rc",
    },
  ];

  if (fill) {
    shapes.push({
      bm: 0,
      c: still(colour(fill)),
      nm: `${name} fill`,
      o: still(opacity),
      r: 1,
      ty: "fl",
    });
  }

  if (stroke) {
    shapes.push({
      bm: 0,
      c: still(colour(stroke)),
      lc: 2,
      lj: 2,
      ml: 4,
      nm: `${name} stroke`,
      o: still(strokeOpacity),
      w: still(strokeWidth),
      ty: "st",
    });
  }

  return {
    it: [
      ...shapes,
      {
        a: still([0, 0]),
        nm: `${name} transform`,
        o: still(100),
        p: still([0, 0]),
        r: still(0),
        s: still([100, 100]),
        sk: still(0),
        sa: still(0),
        ty: "tr",
      },
    ],
    nm: name,
    np: shapes.length,
    ty: "gr",
  };
}

function ellipse({ fill, name, opacity = 100, position, size, stroke }) {
  const shapes = [
    {
      d: 1,
      nm: `${name} shape`,
      p: still(position),
      s: still([size, size]),
      ty: "el",
    },
  ];

  if (fill) {
    shapes.push({
      bm: 0,
      c: still(colour(fill)),
      nm: `${name} fill`,
      o: still(opacity),
      r: 1,
      ty: "fl",
    });
  }

  if (stroke) {
    shapes.push({
      bm: 0,
      c: still(colour(stroke)),
      lc: 2,
      lj: 2,
      ml: 4,
      nm: `${name} stroke`,
      o: still(opacity),
      w: still(2),
      ty: "st",
    });
  }

  return {
    it: [
      ...shapes,
      {
        a: still([0, 0]),
        nm: `${name} transform`,
        o: still(100),
        p: still([0, 0]),
        r: still(0),
        s: still([100, 100]),
        sk: still(0),
        sa: still(0),
        ty: "tr",
      },
    ],
    nm: name,
    np: shapes.length,
    ty: "gr",
  };
}

function pathShape({
  closed = false,
  name,
  opacity = 100,
  points,
  stroke,
  strokeWidth = 1,
  trim,
}) {
  const pathData = {
    c: closed,
    i: points.map(() => [0, 0]),
    o: points.map(() => [0, 0]),
    v: points,
  };
  const items = [
    { ks: still(pathData), nm: `${name} path`, ty: "sh" },
    {
      bm: 0,
      c: still(colour(stroke)),
      lc: 2,
      lj: 2,
      ml: 4,
      nm: `${name} stroke`,
      o: still(opacity),
      w: still(strokeWidth),
      ty: "st",
    },
  ];

  if (trim) {
    items.push({
      e: animated(trim),
      m: 1,
      nm: `${name} reveal`,
      o: still(0),
      s: still(0),
      ty: "tm",
    });
  }

  items.push({
    a: still([0, 0]),
    nm: `${name} transform`,
    o: still(100),
    p: still([0, 0]),
    r: still(0),
    s: still([100, 100]),
    sk: still(0),
    sa: still(0),
    ty: "tr",
  });

  return { it: items, nm: name, np: items.length - 1, ty: "gr" };
}

let layerIndex = 1;

function shapeLayer({ name, shapes, layerTransform = transform() }) {
  return {
    ao: 0,
    bm: 0,
    ddd: 0,
    ind: layerIndex++,
    ip: 0,
    ks: layerTransform,
    nm: name,
    op: durationFrames,
    shapes,
    sr: 1,
    st: 0,
    ty: 4,
  };
}

const layers = [];

const gridShapes = [];
for (let x = 40; x < canvas.width; x += 40) {
  gridShapes.push(
    pathShape({
      name: `Grid vertical ${x}`,
      opacity: x % 80 === 0 ? 20 : 10,
      points: [
        [x, 35],
        [x, 465],
      ],
      stroke: colours.grid,
      strokeWidth: 1,
    }),
  );
}
for (let y = 40; y < canvas.height; y += 40) {
  gridShapes.push(
    pathShape({
      name: `Grid horizontal ${y}`,
      opacity: y % 80 === 0 ? 20 : 10,
      points: [
        [28, y],
        [772, y],
      ],
      stroke: colours.grid,
      strokeWidth: 1,
    }),
  );
}
layers.push(
  shapeLayer({
    layerTransform: transform({
      position: animated([
        { frame: 0, value: [0, 0, 0] },
        { frame: 75, value: [2, 1, 0] },
        { frame: 150, value: [0, 0, 0] },
      ]),
    }),
    name: "Blueprint grid",
    shapes: gridShapes,
  }),
);

layers.push(
  shapeLayer({
    layerTransform: transform({
      opacity: animated([
        { frame: 0, value: [42] },
        { frame: 70, value: [72] },
        { frame: 120, value: [72] },
        { frame: 150, value: [42] },
      ]),
      position: animated([
        { frame: 0, value: [0, 3, 0] },
        { frame: 75, value: [0, 0, 0] },
        { frame: 150, value: [0, 3, 0] },
      ]),
    }),
    name: "Isometric system plane",
    shapes: [
      pathShape({
        closed: true,
        name: "System plane outline",
        opacity: 48,
        points: [
          [108, 250],
          [400, 82],
          [692, 250],
          [400, 418],
          [108, 250],
        ],
        stroke: colours.slate,
        strokeWidth: 1.5,
      }),
      pathShape({
        name: "Plane axis one",
        opacity: 24,
        points: [
          [108, 250],
          [692, 250],
        ],
        stroke: colours.slate,
      }),
      pathShape({
        name: "Plane axis two",
        opacity: 24,
        points: [
          [400, 82],
          [400, 418],
        ],
        stroke: colours.slate,
      }),
    ],
  }),
);

const nodes = [
  { final: [188, 145, 0], scatter: [92, 82, 0] },
  { final: [400, 118, 0], scatter: [515, 60, 0] },
  { final: [612, 155, 0], scatter: [715, 90, 0] },
  { final: [188, 355, 0], scatter: [80, 425, 0] },
  { final: [400, 382, 0], scatter: [510, 448, 0] },
  { final: [612, 345, 0], scatter: [724, 410, 0] },
];

const connectorTrim = [
  { frame: 0, value: [0] },
  { frame: 45, value: [0] },
  { frame: 78, value: [100] },
  { frame: 120, value: [100] },
  { frame: 146, value: [0] },
  { frame: 150, value: [0] },
];

for (const [index, node] of nodes.entries()) {
  layers.push(
    shapeLayer({
      layerTransform: transform({
        opacity: animated([
          { frame: 0, value: [0] },
          { frame: 30, value: [0] },
          { frame: 52, value: [72] },
          { frame: 125, value: [72] },
          { frame: 149, value: [0] },
        ]),
      }),
      name: `Connector ${index + 1}`,
      shapes: [
        pathShape({
          name: `Connector path ${index + 1}`,
          opacity: 75,
          points: [node.final.slice(0, 2), [400, 250]],
          stroke: index === 2 || index === 3 ? colours.coral : colours.offWhite,
          strokeWidth: index === 2 || index === 3 ? 2 : 1.5,
          trim: connectorTrim,
        }),
      ],
    }),
  );
}

layers.push(
  shapeLayer({
    layerTransform: transform({
      opacity: animated([
        { frame: 0, value: [0] },
        { frame: 32, value: [0] },
        { frame: 58, value: [100] },
        { frame: 128, value: [100] },
        { frame: 149, value: [0] },
      ]),
      position: still([400, 250, 0]),
      scale: animated([
        { frame: 0, value: [92, 92, 100] },
        { frame: 64, value: [100, 100, 100] },
        { frame: 118, value: [100, 100, 100] },
        { frame: 150, value: [92, 92, 100] },
      ]),
    }),
    name: "Central CRM core",
    shapes: [
      rectangle({
        fill: "#050609",
        height: 112,
        name: "Core shadow",
        opacity: 70,
        position: [7, 9],
        radius: 18,
        width: 152,
      }),
      rectangle({
        fill: colours.inkRaised,
        height: 112,
        name: "Core panel",
        position: [0, 0],
        radius: 18,
        stroke: colours.coral,
        strokeOpacity: 82,
        strokeWidth: 2,
        width: 152,
      }),
      rectangle({
        fill: colours.offWhite,
        height: 3,
        name: "Core detail one",
        opacity: 48,
        position: [-42, -34],
        radius: 2,
        width: 28,
      }),
      rectangle({
        fill: colours.offWhite,
        height: 3,
        name: "Core detail two",
        opacity: 32,
        position: [38, 34],
        radius: 2,
        width: 36,
      }),
    ],
  }),
);

const resolvedCoreOpacity = animated([
  { frame: 0, value: [0] },
  { frame: 48, value: [0] },
  { frame: 68, value: [100] },
  { frame: 124, value: [100] },
  { frame: 149, value: [0] },
]);

layers.push(
  shapeLayer({
    layerTransform: transform({
      opacity: resolvedCoreOpacity,
      position: still([400, 250, 0]),
    }),
    name: "Core inner ring",
    shapes: [
      ellipse({
        fill: colours.background,
        name: "Core inner field",
        position: [0, 0],
        size: 52,
        stroke: colours.offWhite,
      }),
    ],
  }),
  shapeLayer({
    layerTransform: transform({
      opacity: resolvedCoreOpacity,
      position: still([400, 250, 0]),
    }),
    name: "Core resolved signal",
    shapes: [
      ellipse({
        fill: colours.signal,
        name: "Core resolved point",
        position: [0, 0],
        size: 13,
      }),
    ],
  }),
);

for (const [index, node] of nodes.entries()) {
  const accent = index === 2 || index === 3 ? colours.coral : colours.signal;
  layers.push(
    shapeLayer({
      layerTransform: transform({
        opacity: animated([
          { frame: 0, value: [0] },
          { frame: 8 + index * 2, value: [0] },
          { frame: 24 + index * 2, value: [100] },
          { frame: 132, value: [100] },
          { frame: 150, value: [0] },
        ]),
        position: animated([
          { frame: 0, value: node.scatter },
          { frame: 20 + index * 2, value: node.scatter },
          { frame: 62 + index * 2, value: node.final },
          { frame: 116, value: node.final },
          { frame: 150, value: node.scatter },
        ]),
        rotation: animated([
          { frame: 0, value: [index % 2 === 0 ? -3 : 3] },
          { frame: 64 + index * 2, value: [0] },
          { frame: 116, value: [0] },
          { frame: 150, value: [index % 2 === 0 ? -3 : 3] },
        ]),
        scale: animated([
          { frame: 0, value: [84, 84, 100] },
          { frame: 64 + index * 2, value: [100, 100, 100] },
          { frame: 116, value: [100, 100, 100] },
          { frame: 150, value: [84, 84, 100] },
        ]),
      }),
      name: `Process module ${index + 1}`,
      shapes: [
        rectangle({
          fill: "#030406",
          height: 64,
          name: `Module ${index + 1} shadow`,
          opacity: 62,
          position: [5, 7],
          radius: 10,
          width: 104,
        }),
        rectangle({
          fill: colours.inkSurface,
          height: 64,
          name: `Module ${index + 1} panel`,
          position: [0, 0],
          radius: 10,
          stroke: colours.slate,
          strokeOpacity: 62,
          width: 104,
        }),
        ellipse({
          fill: accent,
          name: `Module ${index + 1} point`,
          position: [-34, -16],
          size: 9,
        }),
        rectangle({
          fill: colours.offWhite,
          height: 3,
          name: `Module ${index + 1} detail one`,
          opacity: 62,
          position: [12, -16],
          radius: 2,
          width: 42,
        }),
        rectangle({
          fill: colours.offWhite,
          height: 3,
          name: `Module ${index + 1} detail two`,
          opacity: 30,
          position: [4, 1],
          radius: 2,
          width: 58,
        }),
        rectangle({
          fill: colours.offWhite,
          height: 3,
          name: `Module ${index + 1} detail three`,
          opacity: 20,
          position: [-4, 16],
          radius: 2,
          width: 42,
        }),
      ],
    }),
  );
}

for (const [index, node] of nodes.entries()) {
  layers.push(
    shapeLayer({
      layerTransform: transform({
        opacity: animated([
          { frame: 0, value: [0] },
          { frame: 70 + index, value: [0] },
          { frame: 86 + index, value: [100] },
          { frame: 126, value: [100] },
          { frame: 147, value: [0] },
        ]),
        position: still(node.final),
        scale: animated([
          { frame: 70 + index, value: [82, 82, 100] },
          { frame: 95 + index, value: [112, 112, 100] },
          { frame: 120, value: [100, 100, 100] },
        ]),
      }),
      name: `Resolved connection ${index + 1}`,
      shapes: [
        ellipse({
          fill: colours.signal,
          name: `Resolved point ${index + 1}`,
          position: [0, 0],
          size: 10,
        }),
      ],
    }),
  );
}

const animation = {
  assets: [],
  ddd: 0,
  fr: frameRate,
  h: canvas.height,
  ip: 0,
  layers: [...layers].reverse(),
  markers: [
    { cm: "assemble", dr: 58, tm: 18 },
    { cm: "resolved", dr: 40, tm: 80 },
  ],
  nm: "42 Strategy Architecture",
  op: durationFrames,
  v: "5.12.2",
  w: canvas.width,
};

const manifest = {
  animations: [{ id: "strategy-architecture" }],
  generator: "42 strategy service-card proof of concept",
  initial: { animation: "strategy-architecture" },
  version: "2",
};

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function zip(entries) {
  const localRecords = [];
  const centralRecords = [];
  let offset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.name.replaceAll("\\", "/"));
    const source = Buffer.from(entry.content);
    const compressed = deflateRawSync(source, { level: 9 });
    const checksum = crc32(source);

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(8, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(33, 12);
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(source.length, 22);
    localHeader.writeUInt16LE(name.length, 26);
    localHeader.writeUInt16LE(0, 28);
    localRecords.push(localHeader, name, compressed);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(33, 14);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(compressed.length, 20);
    centralHeader.writeUInt32LE(source.length, 24);
    centralHeader.writeUInt16LE(name.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    centralRecords.push(centralHeader, name);

    offset += localHeader.length + name.length + compressed.length;
  }

  const centralDirectory = Buffer.concat(centralRecords);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([...localRecords, centralDirectory, end]);
}

const nodeCards = nodes
  .map(
    (node, index) => `
      <g transform="translate(${node.final[0]} ${node.final[1]})">
        <rect x="-47" y="-25" width="104" height="64" rx="10" fill="#030406" opacity=".62" transform="translate(5 7)"/>
        <rect x="-52" y="-32" width="104" height="64" rx="10" fill="${colours.inkSurface}" stroke="${colours.slate}" stroke-opacity=".62"/>
        <circle cx="-34" cy="-16" r="4.5" fill="${index === 2 || index === 3 ? colours.coral : colours.signal}"/>
        <path d="M-8-16h42M-25 1h58M-25 16h42" stroke="${colours.offWhite}" stroke-linecap="round" stroke-width="3" opacity=".42"/>
      </g>`,
  )
  .join("");

const connectorLines = nodes
  .map(
    (node, index) =>
      `<path d="M${node.final[0]} ${node.final[1]}L400 250" stroke="${index === 2 || index === 3 ? colours.coral : colours.offWhite}" stroke-width="${index === 2 || index === 3 ? 2 : 1.5}" stroke-linecap="round" opacity=".62"/>`,
  )
  .join("");

const poster = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <rect width="800" height="500" fill="${colours.background}"/>
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="${colours.grid}" stroke-width="1" opacity=".42"/>
    </pattern>
  </defs>
  <rect x="28" y="35" width="744" height="430" fill="url(#grid)"/>
  <path d="M108 250L400 82l292 168-292 168z" fill="none" stroke="${colours.slate}" stroke-opacity=".48" stroke-width="1.5"/>
  <path d="M108 250h584M400 82v336" stroke="${colours.slate}" stroke-opacity=".24"/>
  ${connectorLines}
  <g transform="translate(400 250)">
    <rect x="-69" y="-47" width="152" height="112" rx="18" fill="#030406" opacity=".7" transform="translate(7 9)"/>
    <rect x="-76" y="-56" width="152" height="112" rx="18" fill="${colours.inkRaised}" stroke="${colours.coral}" stroke-width="2" stroke-opacity=".82"/>
    <circle r="26" fill="${colours.background}" stroke="${colours.offWhite}" stroke-width="2"/>
    <circle r="6.5" fill="${colours.signal}"/>
    <path d="M-56-34h28M20 34h36" stroke="${colours.offWhite}" stroke-linecap="round" stroke-width="3" opacity=".42"/>
  </g>
${nodeCards}
</svg>`;

await mkdir(sourceDirectory, { recursive: true });
await mkdir(publicDirectory, { recursive: true });
await mkdir(runtimeDirectory, { recursive: true });

const animationJson = `${JSON.stringify(animation, null, 2)}\n`;
const manifestJson = `${JSON.stringify(manifest, null, 2)}\n`;
const dotLottie = zip([
  { content: manifestJson, name: "manifest.json" },
  { content: animationJson, name: "a/strategy-architecture.json" },
]);

await Promise.all([
  copyFile(runtimeSource, path.join(runtimeDirectory, "dotlottie-player.wasm")),
  writeFile(path.join(sourceDirectory, "animation.json"), animationJson),
  writeFile(path.join(sourceDirectory, "manifest.json"), manifestJson),
  writeFile(
    path.join(publicDirectory, "strategy-architecture.lottie"),
    dotLottie,
  ),
  writeFile(
    path.join(publicDirectory, "strategy-architecture-poster.svg"),
    poster,
  ),
]);

console.log(
  JSON.stringify(
    {
      animationBytes: Buffer.byteLength(animationJson),
      dotLottieBytes: dotLottie.length,
      durationSeconds: durationFrames / frameRate,
      frameRate,
      layers: layers.length,
      posterBytes: Buffer.byteLength(poster),
    },
    null,
    2,
  ),
);
