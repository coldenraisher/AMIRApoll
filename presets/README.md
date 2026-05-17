# Golden Hour Matte — Lightroom Preset

A Lightroom Develop preset that emulates the look of a warm, golden-hour photograph: saturated reds and oranges, olive-shifted greens, muted blues, and a lifted-shadow "matte film" tonality.

## Install

**Lightroom Classic (Desktop)**
1. Open Lightroom Classic.
2. Go to the Develop module.
3. In the left panel, right-click `Presets` → `Import Presets...`
4. Select `Golden_Hour_Matte.xmp`.
5. It will appear under `User Presets` → `Golden Hour Matte`.

**Lightroom (Cloud / Mobile)**
1. Desktop: `File` → `Import Profiles & Presets...` → select the `.xmp`.
2. It will sync to mobile automatically once imported.

## What it does

| Section | Adjustment | Effect |
|---|---|---|
| White Balance | Temp +12, Tint +5 (incremental) | Warmer cast, slight magenta |
| Tone | Exposure −0.10, Contrast −8 | Slightly softer overall |
| Tone | Highlights −30, Whites −10 | Preserves golden highlights |
| Tone | Shadows +35, Blacks +18 | Lifted matte shadows |
| Presence | Clarity −8, Dehaze −8 | Soft golden glow / haze |
| Presence | Vibrance +15, Saturation −5 | Color pop without garishness |
| HSL — Greens | Hue −25, Sat −20, Lum −8 | Olive/yellow foliage |
| HSL — Blues | Sat −20 | Muted sky |
| HSL — Oranges | Sat +15, Lum +10 | Glowing skin / warm surfaces |
| Color Grading | Warm shadows/mids/highlights | Cohesive sunset palette |
| Effects | Vignette −10, Grain 8 | Subtle film feel |

## Tweaking after import

The preset uses **incremental** Temp/Tint so it adds to your photo's existing white balance rather than overriding it. If a photo comes out too warm or too cool after applying, adjust `Temp` directly — the preset's offset is preserved relative to your manual tweak.

Common tweaks:
- **Skin too orange** → reduce `Orange` saturation by 5–10 in HSL.
- **Greens too yellow** → reduce `Green Hue` shift (move toward 0).
- **Shadows too lifted** → lower `Blacks` back toward 0.
- **Too hazy** → raise `Dehaze` toward 0.

## Notes on accuracy

This preset was modeled from visual analysis of a reference photo (sunset Golden Gate Bridge, warm matte look) without a matched neutral source of the same scene. Treat it as a starting point — different lighting conditions in your source photo will need small tweaks to land the same feel.
