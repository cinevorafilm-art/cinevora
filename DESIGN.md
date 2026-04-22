# Cinevora — Design Brief

## Direction

Luxury Premium OTT — deep charcoal canvas with warm gold accents, glassmorphism depth, and cinematic precision for streaming content discovery.

## Tone

Maximalist luxury with restraint — rich visual depth through layered transparency and selective glows, not scattered gradients. Every surface serves the premium content experience.

## Differentiation

Warm, glowing gold accents on deep charcoal with glassmorphism depth creates a premium, cinematic OTT experience without cold corporate tone.

## Color Palette

| Token       | OKLCH              | Role                                |
| ----------- | ------------------ | ----------------------------------- |
| background  | 0.12 0.015 50      | Deep charcoal (near-black warmth)   |
| foreground  | 0.92 0.01 60       | Warm off-white text                 |
| card        | 0.16 0.02 50       | Surface lift from background        |
| primary     | 0.72 0.22 70       | Gold accent (CTAs, highlights)      |
| accent      | 0.65 0.2 45        | Amber (premium badges, indicators)  |
| muted       | 0.21 0.02 50       | Mid-tone secondary UI               |
| destructive | 0.55 0.22 25       | Alert/warning color                 |

## Typography

- Display: **Space Grotesk** — geometric, confident hero & section titles
- Body: **Plus Jakarta Sans** — humanist, clean UI labels & content
- Scale: hero `text-5xl md:text-7xl font-bold`, h2 `text-3xl md:text-5xl font-bold`, label `text-sm font-semibold uppercase`, body `text-base`

## Elevation & Depth

Glassmorphism surfaces with selective glow — card lifted via transparency + subtle shadow, hover states trigger ambient gold glow without harshness.

## Structural Zones

| Zone    | Background    | Border              | Notes                                                 |
| ------- | ------------- | ------------------- | ----------------------------------------------------- |
| Header  | card-bg       | border + gold glow  | Sticky nav with logo, menu, search, profile          |
| Hero    | Card + blur   | None                | Full-width banner with gradient overlay, play button |
| Content | background    | None                | Section alternation: section bg-muted/30 every 2nd   |
| Cards   | card + glow   | Subtle border       | Movie cards elevated, glow on hover                  |
| Footer  | card-bg       | border-t            | Minimal footer with links                            |

## Spacing & Rhythm

Spacious rhythm (20–24px gaps between sections) with generous card padding (16–20px). Micro-spacing: 8px for button/input padding, 4px for label spacing.

## Component Patterns

- Buttons: 8px radius, gold primary, hover glow + scale lift
- Cards: 12px radius, card bg, subtle border, glow on hover
- Badges: 20px radius (pill), accent bg, gold text
- Inputs: 8px radius, muted-bg, subtle border, gold focus ring

## Motion

- Entrance: Staggered fade-in + slide-up (Motion library) over 0.4s per card
- Hover: Glow intensification + shadow lift (0.3s smooth transition)
- Carousels: Smooth Embla momentum scroll with inertia
- CTAs: Gold glow pulse on hover, brief scale touch-up

## Constraints

- No sharp edges — all radii >= 8px
- No harsh shadows — prefer glow/transparency depth
- Gold accent used sparingly (CTAs, badges, hover states only)
- Mobile-first responsive (sm, md, lg breakpoints)
- Dark mode only (no light theme toggle)

## Signature Detail

Warm gold glow effect on interactive elements that intensifies on hover — creates addictive, premium cinema feel without visual overload.
