---
name: Silk
colors:
  surface: '#0b0e19'
  surface-dim: '#0b0e19'
  surface-bright: '#252b43'
  surface-container-lowest: '#000000'
  surface-container-low: '#0f1322'
  surface-container: '#14192a'
  surface-container-high: '#1a1f32'
  surface-container-highest: '#1f243c'
  on-surface: '#e1e4ff'
  on-surface-variant: '#a5aac7'
  inverse-surface: '#fbf8ff'
  inverse-on-surface: '#525462'
  outline: '#6f7490'
  outline-variant: '#414760'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#2724b8'
  primary-container: '#3c3dca'
  on-primary-container: '#e2e0ff'
  inverse-primary: '#494bd7'
  secondary: '#c4c5d7'
  on-secondary: '#3d3f4e'
  secondary-container: '#383b49'
  on-secondary-container: '#bdbed0'
  tertiary: '#af88ff'
  on-tertiary: '#2b0065'
  tertiary-container: '#8342f4'
  on-tertiary-container: '#ffffff'
  error: '#f97386'
  on-error: '#490013'
  error-container: '#871c34'
  on-error-container: '#ff97a3'
  primary-fixed: '#7073ff'
  primary-fixed-dim: '#6366f1'
  on-primary-fixed: '#000000'
  on-primary-fixed-variant: '#010028'
  secondary-fixed: '#e0e1f4'
  secondary-fixed-dim: '#d2d3e5'
  on-secondary-fixed: '#3c3f4d'
  on-secondary-fixed-variant: '#585b6a'
  tertiary-fixed: '#8342f4'
  tertiary-fixed-dim: '#7632e7'
  on-tertiary-fixed: '#ffffff'
  on-tertiary-fixed-variant: '#e5d5ff'
  primary-dim: '#6063ee'
  secondary-dim: '#b6b8c9'
  tertiary-dim: '#8a4cfc'
  error-dim: '#c44b5f'
  background: '#0b0e19'
  on-background: '#e1e4ff'
  surface-variant: '#1f243c'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
---

# Silk — Neomorphic / Soft UI

## North Star: "Extruded Light"
Soft, tactile, and dimensional. Elements appear pressed into or extruded from the surface. In this dark mode iteration, the UI resembles machined synthetic material, where depth is defined by subtle specular highlights and deep recesses.

## Colors
- **Primary (`#6366f1`):** Indigo — interactive elements, focus states, and primary accents.
- **Background:** Deep Charcoal — the dark "synthetic" base from which elements are molded.
- **Tertiary (`#7c3aed`):** Violet — secondary accents and highlights.
- All surfaces share the same color family. Depth comes from light and shadow, not color variation.

## Neomorphic Effect (Core Pattern)
- **Raised elements:** `box-shadow: 6px 6px 12px rgba(0,0,0,0.4), -6px -6px 12px rgba(255,255,255,0.04)`.
- **Pressed/inset:** `box-shadow: inset 4px 4px 8px rgba(0,0,0,0.5), inset -4px -4px 8px rgba(255,255,255,0.03)`.
- Background of element MUST match the parent surface color for the effect to work.
- In dark mode, highlights are much subtler (lower opacity) to prevent a "glowing" edge.

## Typography
- **All fonts:** Plus Jakarta Sans — geometric, friendly, modern.
- Use medium weight for body, semibold for headings. Avoid bold.
- Text color: `on_surface` (near white) for primary, `on_surface_variant` (muted gray) for secondary.

## Components
- **Buttons:** Raised neomorphic style. Active/pressed = inset shadow. Primary = indigo text/icon, raised surface.
- **Cards:** Raised neomorphic surface. Same background color as parent. Generous padding (20-24px).
- **Inputs:** Inset shadow style. Text input appears carved into the surface.
- **Toggles/Sliders:** Raised thumb on inset track.

## Rules
- Surface color must be consistent — the illusion breaks with color changes.
- Minimum 12px border-radius on all neomorphic elements.
- Never use flat design mixed with neomorphic. Commit fully to the style.
- Ensure text contrast ratios meet WCAG AA standards against the dark background.