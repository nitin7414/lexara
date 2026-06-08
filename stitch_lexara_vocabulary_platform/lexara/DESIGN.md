---
name: Lexara
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd6f8'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f1ff'
  surface-container: '#f0ebff'
  surface-container-high: '#ebe5ff'
  surface-container-highest: '#e5deff'
  on-surface: '#1b1831'
  on-surface-variant: '#474552'
  inverse-surface: '#302d47'
  inverse-on-surface: '#f3eeff'
  outline: '#787583'
  outline-variant: '#c8c4d4'
  surface-tint: '#5951b4'
  primary: '#574eb1'
  on-primary: '#ffffff'
  primary-container: '#7067cc'
  on-primary-container: '#fffbff'
  inverse-primary: '#c5c0ff'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#62fae3'
  on-secondary-container: '#007165'
  tertiary: '#765700'
  on-tertiary: '#ffffff'
  tertiary-container: '#956e00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e4dfff'
  primary-fixed-dim: '#c5c0ff'
  on-primary-fixed: '#140067'
  on-primary-fixed-variant: '#41379b'
  secondary-fixed: '#62fae3'
  secondary-fixed-dim: '#3cddc7'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#ffdf9f'
  tertiary-fixed-dim: '#f9bd22'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#fcf8ff'
  on-background: '#1b1831'
  surface-variant: '#e5deff'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
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
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1280px
  gutter: 20px
---

## Brand & Style

The design system is engineered for a premium EdTech environment, prioritizing clarity, focus, and a sophisticated academic atmosphere. The brand personality is professional yet encouraging, moving away from the typical "playful" EdTech tropes toward a more refined, structured experience.

The design style is a hybrid of **Minimalism** and **Modern Corporate**, utilizing a flat aesthetic with extremely disciplined use of color. High-quality whitespace and a purple-tinted monochromatic foundation create a calm environment for learning, while vibrant accents are reserved strictly for progress and interaction. Visual interest is generated through structured iconography and precise geometry rather than complex textures or gradients.

## Colors

The palette is built on a deep purple foundation to evoke a sense of wisdom and digital sophistication.

- **Primary (#7F77DD):** Used for primary actions, active states, and brand-critical elements.
- **Success/Teal (#2DD4BF):** Used for completion states, correct answers, and positive progress tracking.
- **Urgency/Amber (#FBBF24):** Used for deadlines, reminders, and cautionary feedback.
- **Surface Light (#F4F3FF):** The main background color for light mode, providing a softer, more premium feel than pure white.
- **Surface Dark (#1A1730):** Used for high-contrast headers, sidebars, or full dark-mode surfaces.

Functional colors should be used sparingly against the tinted neutral backgrounds to maintain a clean, uncluttered interface.

## Typography

The typography utilizes **Plus Jakarta Sans** across all levels to ensure a cohesive, modern, and highly legible experience. 

The scale is designed for high readability in educational contexts. Headlines use a tighter letter-spacing and heavier weights to establish clear hierarchy, while body text maintains generous line heights to prevent cognitive fatigue during long reading sessions. All labels and functional text use a medium or semi-bold weight to ensure they remain distinct from content text.

## Layout & Spacing

This design system follows a **Mobile-First** philosophy that scales into a 12-column fluid grid for desktop. 

- **Mobile:** Single column with 16px side margins and 16px gutters.
- **Tablet:** 8-column grid with 24px margins.
- **Desktop:** 12-column grid centered within a 1280px max-width container. 

Spacing is based on an 8px modular scale. Component internal padding should favor the `md` (16px) unit for a breathable, premium feel. Vertical rhythm between sections should utilize the `xl` (32px) or `2xl` (48px) units to clearly demarcate different learning modules or content blocks.

## Elevation & Depth

The design system utilizes **Tonal Layers** and **Low-contrast outlines** rather than aggressive shadows. 

Hierarchy is established by stacking surfaces. The base background is the primary surface, while cards and containers use a slightly elevated tonal shift or a 1px solid border (10% opacity of the neutral color). 

For interactive elements like buttons, a "subtle elevation" is achieved using a very soft, high-diffusion shadow (`y-offset: 4px, blur: 12px`) with a low-opacity tint of the primary color. This gives elements a slight "lift" without breaking the clean, flat aesthetic of the overall system.

## Shapes

The shape language is defined by the **Rounded-Square** aesthetic. A consistent 8px (0.5rem) radius is applied to standard components, providing a balance between the precision of a square and the friendliness of a circle. 

Larger containers and cards utilize the `rounded-lg` (16px) or `rounded-xl` (24px) tokens to create a softer frame for content. This geometric consistency is a core identifier of the design system, especially in iconography and button treatments.

## Components

### Buttons
Primary buttons are styled as rounded-squares with a solid fill of the primary accent color and white text. They feature a subtle elevation shadow. Secondary buttons use a transparent background with a 1.5px border in the primary color.

### Icons
Icons must use the **Tabler** outline set. Every icon is housed within a "Rounded-Square" box (8px radius). The box should have a 10% opacity fill of the icon's color (e.g., a primary purple icon sits in a light purple box).

### Cards
Cards are the primary container for lessons and modules. They should have a 1px border (`#1A1730` at 5% opacity) and a white or very light tinted fill. No heavy shadows are allowed; depth is suggested through the background color contrast.

### Input Fields
Inputs use the `rounded-md` (8px) token. The border is a neutral grey-purple that shifts to the Primary Accent on focus. Labels sit clearly above the input field using the `label-md` typography level.

### Lists & Progress
Educational lists should use "Success Teal" for completion markers. Progress bars are thin (4px - 8px) with a rounded-pill shape to distinguish them from the predominantly square-rounded functional elements.

### Chips & Tags
Used for categories or subjects. These are small, non-elevated containers with `label-sm` text, using the same "colored box" logic as the icons but with text instead of a glyph.