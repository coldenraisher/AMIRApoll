# Golden Hour Matte — Lightroom Preset

A Lightroom Develop preset that emulates a warm golden-hour look: punchy contrast, glowing reds/oranges/yellows, deep saturated blues, and slightly muted olive-shifted greens.

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

## What it does (v2)

| Section | Adjustment | Effect |
|---|---|---|
| White Balance | Temp +12, Tint +5 (incremental) | Warmer cast, slight magenta |
| Tone | Contrast +12, Whites +8, Blacks −5 | Punchy, full tonal range |
| Tone | Highlights −15, Shadows +12 | Preserves highlights without going matte |
| Presence | Clarity +5, Texture +8, Dehaze +3 | Crisp, defined |
| Presence | Vibrance +25, Saturation +5 | Strong color pop |
| HSL — Reds | Sat +15, Hue −5 | Deeper, warmer reds |
| HSL — Oranges | Sat +25, Lum +8 | Glowing golden surfaces / skin |
| HSL — Yellows | Sat +20, Hue −10, Lum −3 | Rich golden tones |
| HSL — Greens | Sat −15, Hue −15, Lum −10 | Muted olive (not crushed) |
| HSL — Blues | Sat +20, Hue −10, Lum −5 | Deep vibrant azure |
| Camera Calibration | Blue Primary Sat +20, Red Primary Sat +15 | Boosts color richness at the base |
| Color Grading | Subtle warm tint across shadows/mids/highlights | Cohesive sunset palette without flattening |
| Tone Curve | Gentle S-curve | Contrast lives in the curve, not the slider |
| Effects | Vignette −10, Grain 8 | Subtle film feel |

## Tweaking after import

The preset uses **incremental** Temp/Tint so it adds to your photo's existing white balance rather than overriding it.

Common tweaks:
- **Skin too orange** → reduce `Orange` saturation by 5–10 in HSL.
- **Greens still too green** → push `Green Hue` further negative (toward yellow), e.g. −25.
- **Greens looking muddy** → raise `Green` saturation back toward 0.
- **Blues not popping enough** → push `Blue` saturation higher in HSL or in Camera Calibration.
- **Too contrasty for an overcast photo** → drop `Contrast` to 0 and raise `Shadows`.

## v2 changes (from feedback)

The first version went too matte and desaturated. v2 restores contrast (S-curve + Contrast +12), flips blues from −20 to +20 saturation, pushes oranges/yellows harder, and pulls the green hue shift back so greens stay recognizably green (just less neon).

## Notes on accuracy

This preset was modeled from visual analysis of a reference photo (sunset Golden Gate Bridge) without a matched neutral source of the same scene. Treat it as a starting point — different lighting conditions in your source photo will need small tweaks to land the same feel.
