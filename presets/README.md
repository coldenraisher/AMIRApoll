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

## What it does (v3)

| Section | Adjustment | Effect |
|---|---|---|
| White Balance | Temp +12, Tint +5 (incremental) | Warmer cast, slight magenta |
| Tone | Contrast +5, Whites +2, Blacks +2 | Gentle contrast, soft endpoints |
| Tone | Highlights −25, Shadows +20 | Softer roll-off both ends |
| Presence | Clarity +3, Texture +6, Dehaze +2 | Defined but not crunchy |
| Presence | Vibrance +25, Saturation +5 | Strong color pop |
| HSL — Reds | Sat +15, Hue −5 | Deeper, warmer reds |
| HSL — Oranges | Sat +25, Lum +8 | Glowing golden surfaces / skin |
| HSL — Yellows | Sat +20, Hue −10, Lum −3 | Rich golden tones |
| HSL — Greens | Sat −15, Hue −8, Lum −10 | Slightly muted natural green |
| HSL — Blues | Sat +20, Hue −10, Lum −5 | Deep vibrant azure |
| Camera Calibration | Blue Primary Sat +20, Red Primary Sat +15 | Boosts color richness at the base |
| Color Grading | Subtle warm tint across shadows/mids/highlights | Cohesive sunset palette without flattening |
| Tone Curve | Soft toe & shoulder, near-flat midtones | Film-like roll-off, gentle contrast |
| Effects | Vignette −10, Grain 8 | Subtle film feel |

## Tweaking after import

The preset uses **incremental** Temp/Tint so it adds to your photo's existing white balance rather than overriding it.

Common tweaks:
- **Skin too orange** → reduce `Orange` saturation by 5–10 in HSL.
- **Greens still too green** → push `Green Hue` further negative (toward yellow), e.g. −25.
- **Greens looking muddy** → raise `Green` saturation back toward 0.
- **Blues not popping enough** → push `Blue` saturation higher in HSL or in Camera Calibration.
- **Too contrasty for an overcast photo** → drop `Contrast` to 0 and raise `Shadows`.

## Version history

- **v1** — Too matte and desaturated.
- **v2** — Restored contrast and color vibrancy, flipped blues to saturated, pushed golds.
- **v3** — v2 was too contrasty. Softened the tone curve (gentle toe + shoulder roll-off, near-flat midtones), reduced Contrast slider from +12 to +5, eased Highlights and Shadows for softer endpoints. Green hue shift pulled from −15 to −8 so greens read as slightly muted *green* rather than yellow-olive.

## Notes on accuracy

This preset was modeled from visual analysis of a reference photo (sunset Golden Gate Bridge) without a matched neutral source of the same scene. Treat it as a starting point — different lighting conditions in your source photo will need small tweaks to land the same feel.
