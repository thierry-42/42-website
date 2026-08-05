# Strategy architecture prototype

This is the editable source for the staging-only **HubSpot Strategy & Consulting** animation proof of concept.

- `animation.json` is the uncompressed, named-layer Lottie source.
- `manifest.json` is the dotLottie v2 manifest.
- `scripts/generate-strategy-card-lottie.mjs` rebuilds both source files, the optimised public `.lottie` package, the SVG poster, and the self-hosted player runtime.
- The composition is 800 × 500, 30 fps, and five seconds long. It contains transparent vector shapes only and no embedded text, audio, raster images, or external assets.

Regenerate it after changing the source script:

```powershell
node scripts/generate-strategy-card-lottie.mjs
```

The card prototype is enabled only for the Services page when `SITE_ENVIRONMENT=staging`. It preserves the existing service image and places this animation above it on fine-pointer hover. The source plays at 1.8x speed for a 2.78-second interaction, then settles. Touch and reduced-motion users retain the original still image.

The strategy service detail page uses a separate, isolated 2.5D CSS scene above the same still-image poster. The scene is dynamically imported near the viewport, pauses offscreen, and is omitted for reduced-motion users. It is the fallback implementation because creating and exporting an original Spline scene requires an authenticated Spline editor session.
