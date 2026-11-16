---
name: Next Move
colors:
  surface: '#101319'
  surface-dim: '#101319'
  surface-bright: '#36393f'
  surface-container-lowest: '#0b0e13'
  surface-container-low: '#191c21'
  surface-container: '#1d2025'
  surface-container-high: '#272a30'
  surface-container-highest: '#32353b'
  on-surface: '#e1e2ea'
  on-surface-variant: '#dec1b1'
  inverse-surface: '#e1e2ea'
  inverse-on-surface: '#2d3036'
  outline: '#a58c7d'
  outline-variant: '#574237'
  surface-tint: '#ffb689'
  primary: '#ffb689'
  on-primary: '#512300'
  primary-container: '#e97619'
  on-primary-container: '#4e2200'
  inverse-primary: '#984800'
  secondary: '#bac8dc'
  on-secondary: '#243141'
  secondary-container: '#3a4859'
  on-secondary-container: '#a8b6ca'
  tertiary: '#b6c7e5'
  on-tertiary: '#203149'
  tertiary-container: '#8697b3'
  on-tertiary-container: '#1e2f47'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbc8'
  primary-fixed-dim: '#ffb689'
  on-primary-fixed: '#321300'
  on-primary-fixed-variant: '#743500'
  secondary-fixed: '#d6e4f9'
  secondary-fixed-dim: '#bac8dc'
  on-secondary-fixed: '#0f1c2c'
  on-secondary-fixed-variant: '#3a4859'
  tertiary-fixed: '#d4e3ff'
  tertiary-fixed-dim: '#b6c7e5'
  on-tertiary-fixed: '#091c33'
  on-tertiary-fixed-variant: '#374860'
  background: '#101319'
  on-background: '#e1e2ea'
  surface-variant: '#32353b'
typography:
  display:
    fontFamily: Syne
    fontSize: 4.5rem
    fontWeight: '800'
    lineHeight: 4.75rem
    letterSpacing: -0.04em
  display-mobile:
    fontFamily: Syne
    fontSize: 2.75rem
    fontWeight: '800'
    lineHeight: 3rem
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Syne
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.25rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Syne
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Syne
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Syne
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: '0'
  title:
    fontFamily: Syne
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: '0'
  body-md:
    fontFamily: Geist
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: '0'
  body-sm:
    fontFamily: Geist
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: '0'
  label-md:
    fontFamily: Geist
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Geist
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.12em
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2.5rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
---

## Brand & Style

This design system establishes an avant-garde, high-stakes aesthetic for elite chess coaching. Drawing inspiration from brutalist precision and architectural grid framing, it treats the board not as a casual pastime, but as a discipline of structural calculation, sharp strategy, and intellectual supremacy. 

The personality is unyielding, calculated, and uncompromising. Designed for competitive grandmaster aspirants, analytical thinkers, and tactical theorists, the emotional tone pivots around tension, absolute focus, and clarity under pressure. 

Visual markers include razor-sharp 0px geometry, stark dark-mode backgrounds, technical monospaced notation accents, and razor-fine borders that echo chess ranks and files. Expressive display typography collides with clean utilitarian data layouts to balance tension with deep analytical legibility.

## Colors

The palette operates on a high-contrast dark spectrum engineered for intense cognitive focus during long analysis sessions:

- **Primary (`#E97619`)**: An incandescent, burning amber. Reserved strictly for tactical imperatives: active moves, primary CTAs, decisive evaluation spikes, and threat indicators.
- **Secondary (`#0D1B2A`)**: A nocturnal abyssal navy. Used for elevated technical surfaces, card modules, navigation rails, and board framing.
- **Tertiary (`#2A3B53`)**: A slate-cast blue used for geometric borders, file/rank grid coordinates, inactive squares, and structural bounding boxes.
- **Neutral (`#080B10`)**: An uncompromising obsidian black acting as the master void canvas.

### Surface System
- Canvas Base: `#080B10`
- Surface Tier 1 (Panels, Nav): `#0D1B2A`
- Surface Tier 2 (Analyzers, Move Logs): `#132238`
- Surface Tier 3 (Flyouts, Active Cells): `#1B2D4A`

### High-Contrast Accessibility
- Primary text on dark surfaces: `#FFFFFF` (High emphasis)
- Secondary text & algebraic notation: `#94A3B8` (Medium emphasis)
- Text on Primary (`#E97619`): `#080B10` (Darkest obsidian, guaranteeing minimum 7:1 contrast ratio)
- Warning/Mistake: `#DC2626`
- Accuracy/Brilliant: `#10B981`

## Typography

Typography reinforces the tension between avant-garde audacity and scientific precision. 

- **Headlines (`Syne`)**: Deployed for section entries, move titles, and strategic mantras. Syne’s idiosyncratic geometry communicates tactical boldness and high-tier mastery. Headings should lean on tight tracking and deliberate scale contrasts.
- **Body & Labels (`Geist`)**: Used for game transcripts, engine evaluations, annotations, and system navigation. Highly technical with neutral, proportional numerals and pristine micro-legibility at 11px and 12px.
- **Labels**: Render all label styles (`label-md`, `label-sm`) in uppercase with expanded tracking for coordinate notations (e.g., `Nf3`, `c5`, `d4xe5`).

## Layout & Spacing

The layout model is anchored to a rigid 12-column architectural grid on desktop, scaling to 6 columns on tablet and 4 columns on mobile. The system emulates board geometry: strict planar sections divided by hairline rule lines without floating islands.

- **Breakpoints**: 
  - Mobile: < 768px (4 columns, `margin-mobile: 1.25rem`, `gutter-sm: 1rem`)
  - Tablet: 768px – 1199px (6 columns, `margin: 2rem`, `gutter: 1.5rem`)
  - Desktop: >= 1200px (12 columns, `margin: 2.5rem`, `gutter: 1.5rem`, max-width: 1440px)

- **Structural Rhythms**: Component paddings and layouts use base-4 increments. Spacing is tight and deliberate (`space-sm` for move pairs, `space-md` for interactive controls) to support high data density.

## Elevation & Depth

This design system avoids soft organic drop shadows entirely. Depth is achieved through a technical construct of **low-contrast architectural outlines and hard planar layering**:

1. **Flat Structural Borders**: Surfaces are outlined with a crisp 1px border (`#2A3B53`). Depth levels do not blur into space; they sit flush like inlaid wood or machine-cut stone.
2. **Surface Stratification**: Interactive elements elevate by shifting up the neutral tonal scale: base `#080B10` to surface container `#0D1B2A`, rising to active container `#132238`.
3. **Hard Offset Shadows**: Where functional elevation is vital (e.g., dragged chess pieces, dropdown panels), use hard, unblurred directional shadows: `2px 2px 0px 0px #000000` or `4px 4px 0px 0px #E97619`.
4. **Tactical Illumination**: Selected squares or active drill alerts use hard inner borders or 1px perimeter highlights in `#E97619` without radial light bleeds.

## Shapes

Every component features a sharp **0px corner radius**. 

There are zero rounded corners in this design system. Cards, buttons, modals, input containers, avatar frames, and tooltips are formed by pure rectangles and right angles. This architectural discipline reinforces the concept of the 64-square board, mathematical precision, and uncompromising pedagogical rigor.

## Components

### Buttons
- **Primary CTA**: Sharp rectangular solid fill `#E97619` with obsidian black `#080B10` text (`Geist`, medium, uppercase, tracking `0.08em`). Zero radius. Hover state transitions fill to white `#FFFFFF` with black text. Active state triggers a 1px interior inset border.
- **Secondary Button**: 1px solid border `#2A3B53`, background `#0D1B2A`, text `#FFFFFF`. Hover state swaps border to `#E97619` with text taking on primary amber.
- **Ghost/Tertiary**: Text-only with an underline offset of 4px. On hover, reveals a trailing ASCII arrow (`->`).

### Cards & Analytical Panels
- Bound by 1px solid `#2A3B53`.
- Background `#0D1B2A`.
- Header areas feature a hairline bottom divider (`1px solid #2A3B53`) with uppercase technical labels (`label-sm`) in `#94A3B8`.
- Nested stat modules use `#080B10` background with flush right-angle docking.

### Input Fields & Selectors
- Background `#080B10` inset within a `#0D1B2A` card.
- 1px border `#2A3B53`.
- Active focus state: border shifts immediately to 1px `#E97619` without glow or halo.
- Placeholder text in `#64748B`. Monospaced numeral alignment for time and move entry.

### Chips & Tactical Tags
- Zero radius, 1px border.
- Tactical tags (e.g., `BLUNDER`, `BRILLIANT`, `INACCURACY`, `BOOK`):
  - Inactive: `#132238` background, `#94A3B8` text, `#2A3B53` border.
  - Active / Critical: `#E97619` solid background, `#080B10` text.
  - Height fixed at 24px with horizontal padding `space-sm`.

### Checkboxes & Radios
- Sharp 16x16px boxes (radios remain strictly square to preserve the 0-radius identity).
- Border 1px `#2A3B53`.
- Checked state: fully solid fill `#E97619` with a centered 6x6px black `#080B10` square core.

### Lists & Notation Sheets
- Move notation lists feature alternating subtle zebra striping (`#0D1B2A` and `#080B10`).
- Columns align strictly with fixed fractional widths: Move Number (32px), White Move (flex), Black Move (flex), Evaluation Metric (48px).
- Active move cell: Solid `#E97619` background with `#080B10` bold text.

### Interactive Board Indicators
- Evaluation Bar: Monolithic vertical or horizontal rectangle, split starkly between `#FFFFFF` (White advantage) and `#0D1B2A` (Black advantage), divided by a 1px `#E97619` horizon line.