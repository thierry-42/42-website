# Strategy architecture prototype

This is the editable source for the staging-only **HubSpot Strategy & Consulting** service-card proof of concept.

- `animation.json` is the uncompressed, named-layer Lottie source.
- `manifest.json` is the dotLottie v2 manifest.
- `scripts/generate-strategy-card-lottie.mjs` rebuilds both source files, the optimised public `.lottie` package, the SVG poster, and the self-hosted player runtime.
- The composition is 800 × 500, 30 fps, and five seconds long. It contains vector shapes only and no embedded text, audio, raster images, or external assets.

Regenerate it after changing the source script:

```powershell
node scripts/generate-strategy-card-lottie.mjs
```

The public prototype is enabled only for the Services page when `SITE_ENVIRONMENT=staging`. The existing production `ServiceCard` remains the fallback in every other environment.
