# Design System

The app follows the **Factify Design System**. All theme tokens are defined in `src/app/globals.css` using Tailwind CSS v4's `@theme inline` syntax.

## Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Brand 100 | `#ecf0ff` | Lightest tint, subtle backgrounds |
| Brand 200 | `#c2ceff` | Light accent |
| Brand 300 | `#98a9ff` | Hover states, focus rings |
| Brand 400 | `#6e84ff` | Secondary accent |
| **Brand 500** | **`#444aff`** | **Primary brand — buttons, links, key elements** |
| Brand 600 | `#3039dd` | Pressed/active state |
| Brand 700 | `#2025bb` | Darker accent |
| Brand 800 | `#171b8d` | Deep accent |
| Brand 900 | `#18193d` | Darkest accent |

## Neutral Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Neutral 000 | `#ffffff` | White / page background |
| Neutral 100 | `#f9fafc` | Subtle background |
| Neutral 200 | `#f2f5fa` | Card background, alternating rows |
| Neutral 300 | `#e6eaf2` | Borders, dividers |
| Neutral 400 | `#dadfeb` | Disabled borders |
| Neutral 500 | `#c4cbdc` | Placeholder text |
| Neutral 600 | `#878ba4` | Subtle/secondary text |
| Neutral 700 | `#70738a` | Muted text |
| Neutral 800 | `#545666` | Body text |
| Neutral 900 | `#34353d` | Strong text |
| Neutral 950 | `#111214` | Headings / highest contrast |

## Status Colors

| Status | Light (100) | Medium (500) | Dark (700) |
|--------|-------------|-------------|------------|
| Red | `#ffeaea` | `#f6554f` | `#bd130e` |
| Orange | `#fff6eb` | `#ffa537` | `#ad6610` |
| Green | `#f4fff4` | `#5ad45a` | `#228322` |
| Blue | `#edf4ff` | `#4a92ff` | `#2567c9` |

## Typography

| Role | Font Family | Loaded From |
|------|-------------|-------------|
| Headlines | Satoshi Variable | Fontshare CDN + local woff2 |
| Body | Inter | npm `@fontsource-variable/inter` + next/font/google |

### Type Scale

| Style | Font | Weight | Size | Line Height |
|-------|------|--------|------|-------------|
| H1 | Satoshi | 700 | 96px | ~115% |
| H2 | Satoshi | 700 | 68px | ~115% |
| H3 | Satoshi | 700 | 54px | ~120% |
| H4 | Satoshi | 700 | 40px | ~120% |
| H5 | Satoshi | 700 | 28px | ~130% |
| H6 | Satoshi | 700 | 23px | ~130% |
| Subhead 1 | Satoshi | 700 | 20px | ~140% |
| Subhead 2 | Satoshi | 700 | 18px | ~140% |
| Body Regular 1 | Inter | 400 | 18px | ~155% |
| Body Regular 2 | Inter | 400 | 16px | ~150% |
| Body Regular 3 | Inter | 400 | 14px | ~145% |
| Body Bold 2 | Inter | 600 | 16px | ~150% |
| Body Bold 3 | Inter | 600 | 14px | ~145% |
| Caption | Inter | 400 | 12px | ~130% |
| Caption Bold | Inter | 600 | 12px | ~130% |
| Overline | Inter | 400 | 11px | ~130% |
| Tiny | Inter | 400 | 10px | ~130% |

In practice, the app primarily uses: H5/H6 for page titles, Subhead 1/2 for section headers, Body Regular 2/3 for content, Caption for metadata.

## Spacing

4px base unit system:

| Token | Value | Usage |
|-------|-------|-------|
| 0.5x | 2px | Tight spacing |
| 1x | 4px | Minimal padding, icon gaps |
| 2x | 8px | Tight padding |
| 3x | 12px | Default small padding |
| 4x | 16px | Default padding |
| 5x | 20px | Medium padding |
| 6x | 24px | Large padding |
| 8x | 32px | Section spacing |
| 10x | 40px | Large section spacing |
| 12x | 48px | Extra large |
| 16x | 64px | Major sections |
| 20x | 80px | Page-level spacing |

## Shadows

| Level | CSS | Usage |
|-------|-----|-------|
| Tight | `0 1px 3px rgba(84,86,102,0.1)` | Cards, subtle raised elements |
| Fluffy | `0 4px 16px rgba(17,18,20,0.1)` | Floating cards, popovers |
| Overlay | `0 10px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)` | Modals, dialogs, drawers |

## Border Radii

| Usage | Value |
|-------|-------|
| Extra small (XSM) | 4px |
| Default (CTA) | 8px |
| Popup/Overlay | 12px |
| Large | 16px |
| Full/Circular | 50% / 9999px |

## Button Styles

### Sizes
| Size | Height | Padding | Radius | Font Size |
|------|--------|---------|--------|-----------|
| xsm | 24px | 0 4px | 4px | 14px |
| sm | 32px | 0 8px | 8px | 16px |
| md | 40px | 0 12px | 8px | 16px bold |
| lg | 48px | 0 16px | 8px | 18px bold |

### Variants
| Variant | Background | Text | Hover | Active |
|---------|-----------|------|-------|--------|
| Primary | `#444aff` | white | `#3039dd` | `#171b8d` |
| Secondary | white | `#111214` | border darkens | - |
| Tertiary | transparent | `#111214` | `#f9fafc` | - |
| Destructive | `#bd130e` | white | darker | - |

### States
- **Disabled**: opacity 0.7, bg `#dadfeb`, cursor not-allowed
- **Focus**: 3px ring `#98a9ff` (Brand 300)
- **Transition**: background-color 0.2s, box-shadow 0.2s

## Input Styles

- Default: white bg, 1px `#e6eaf2` border, 8px radius
- Hover: border `#c4cbdc`
- Focus: border `#98a9ff`
- Error: border `#bd130e`
- Disabled: bg `#dadfeb`

## Custom Scrollbar

```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #c4cbdc; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #878ba4; }
```

## Responsive Breakpoints

| Name | Min Width |
|------|-----------|
| xs | 0px |
| sm | 576px |
| md | 768px |
| lg | 992px |
| xl | 1200px |
| xxl | 1440px |

## Animation Patterns

- **Page transitions**: Framer Motion fade + slide
- **Card hover**: Scale 1.01 + shadow elevation
- **Modal**: Fade overlay + scale dialog
- **Toast**: Slide in from right
- **Loading**: Spinner or skeleton pulse
- **Factification**: Gradient border + scanning overlay + floating sparkles
