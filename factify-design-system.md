# Factify Design System

## Brand Colors

### Primary (Brand)

| Token | Hex | Usage |
|-------|-----|-------|
| Brand 100 | `#ecf0ff` | Lightest brand tint, subtle backgrounds |
| Brand 200 | `#c2ceff` | Light brand accent |
| Brand 300 | `#98a9ff` | Hover states for brand elements |
| Brand 400 | `#6e84ff` | Secondary brand accent |
| **Brand 500** | **`#444aff`** | **Primary brand color. Use for primary buttons, links, key interactive elements.** |
| Brand 600 | `#3039dd` | Pressed/active state |
| Brand 700 | `#2025bb` | Darker brand accent |
| Brand 800 | `#171b8d` | Deep brand accent |
| Brand 900 | `#18193d` | Darkest brand accent |

### Neutrals

| Token | Hex | Usage |
|-------|-----|-------|
| Neutral 000 | `#ffffff` | White / background |
| Neutral 100 | `#f9fafc` | Subtle background |
| Neutral 200 | `#f2f5fa` | Card background, alternating rows |
| Neutral 300 | `#e6eaf2` | Borders, dividers |
| Neutral 400 | `#dadfeb` | Disabled borders |
| Neutral 500 | `#c4cbdc` | Placeholder text |
| Neutral 600 | `#878ba4` | Subtle/secondary text |
| Neutral 700 | `#70738a` | Muted text |
| Neutral 800 | `#545666` | Body text |
| Neutral 900 | `#34353d` | Strong text |
| Neutral 950 | `#111214` | Headings / highest contrast text |

### Status Colors

| Status | Light (100) | Medium (500) | Dark (700) | Use case |
|--------|-------------|-------------|------------|----------|
| Red | `#ffeaea` | `#f6554f` | `#bd130e` | Errors, danger, destructive |
| Orange | `#fff6eb` | `#ffa537` | `#ad6610` | Warnings, attention needed |
| Green | `#f4fff4` | `#5ad45a` | `#228322` | Success, confirmed, active |
| Blue | `#edf4ff` | `#4a92ff` | `#2567c9` | Info, links, highlights |

## Typography

| Role | Font Family | Usage |
|------|-------------|-------|
| Headlines | **Satoshi Variable** | All headings (H1 through H6) and subheadings |
| Body | **Inter** | Body text, captions, labels, buttons, inputs |

### Type Scale

| Style | Font | Weight | Size | Line Height | Use case |
|-------|------|--------|------|-------------|----------|
| Headline H1 | Satoshi Variable | 700 | 96px | ~115% | Hero / splash screens |
| Headline H2 | Satoshi Variable | 700 | 68px | ~115% | Page titles |
| Headline H3 | Satoshi Variable | 700 | 54px | ~120% | Section titles |
| Headline H4 | Satoshi Variable | 700 | 40px | ~120% | Card headers |
| Headline H5 | Satoshi Variable | 700 | 28px | ~130% | Subsection titles |
| Headline H6 | Satoshi Variable | 700 | 23px | ~130% | Small section titles |
| Subhead 1 | Satoshi Variable | 700 | 20px | ~140% | Large subheading |
| Subhead 2 | Satoshi Variable | 700 | 18px | ~140% | Small subheading |
| Body Regular 1 | Inter | 400 | 18px | ~155% | Large body text |
| Body Regular 2 | Inter | 400 | 16px | ~150% | Default body text |
| Body Regular 3 | Inter | 400 | 14px | ~145% | Small body text, descriptions |
| Body Bold 1 | Inter | 600 | 18px | ~155% | Emphasized large text |
| Body Bold 2 | Inter | 600 | 16px | ~150% | Emphasized default text |
| Body Bold 3 | Inter | 600 | 14px | ~145% | Labels, button text |
| Body Extra Bold 1 | Inter | 800 | 18px | ~155% | Strong emphasis |
| Body Extra Bold 2 | Inter | 800 | 16px | ~150% | Strong emphasis |
| Body Extra Bold 3 | Inter | 800 | 14px | ~145% | Strong emphasis small |
| Caption | Inter | 400 | 12px | ~130% | Metadata, timestamps |
| Caption Bold | Inter | 600 | 12px | ~130% | Bold metadata |
| Overline | Inter | 400 | 11px | ~130% | Label overlines |
| Tiny | Inter | 400 | 10px | ~130% | Legal text, fine print |

## Spacing Scale

4px base unit system:

| Token | Value | Usage |
|-------|-------|-------|
| 0x | 0px | No spacing |
| 0.25x | 1px | Hairline borders |
| 0.5x | 2px | Tight spacing |
| 1x | 4px | Minimal padding, icon gaps |
| 2x | 8px | Tight padding, small gaps |
| 3x | 12px | Default small padding |
| 4x | 16px | Default padding, standard gaps |
| 5x | 20px | Medium padding |
| 6x | 24px | Large padding |
| 8x | 32px | Section spacing |
| 10x | 40px | Large section spacing |
| 12x | 48px | Extra large spacing |
| 16x | 64px | Major section divisions |
| 20x | 80px | Page level spacing |

## Shadows and Elevation

| Level | Usage |
|-------|-------|
| Elevation Tight | Cards, subtle raised elements |
| Elevation Fluffy | Floating cards, popovers |
| Elevation Overlay | Modals, dialogs, drawers |

Shadow colors use the neutral palette with opacity (e.g., `rgba(84, 86, 102, 0.1)`).

## Border Radii

| Usage | Value |
|-------|-------|
| Extra small (XSM) | 4px |
| Default (CTA) | 8px |
| Popup/Overlay | 12px |
| Large | 16px |
| Full/Circular | 50% |

## Responsive Breakpoints

| Name | Min Width |
|------|-----------|
| xs | 0px |
| sm | 576px |
| md | 768px |
| lg | 992px |
| xl | 1200px |
| xxl | 1440px |

## Component Library

> **Note for Hackathon Participants:** The components below are framework agnostic specifications. You can implement these styles using any CSS framework (Tailwind, plain CSS, etc.) to match the Factify look and feel.

### Group 1: Core Inputs & Actions

#### 1. Buttons
**Sizes:**
- **xsm**: Height 24px, Padding 0 4px, Radius 4px, Font 14px (Body 3)
- **sm**: Height 32px, Padding 0 8px, Radius 8px, Font 16px (Body 2)
- **md** (Default): Height 40px, Padding 0 12px, Radius 8px, Font 16px (Body Bold 2)
- **lg**: Height 48px, Padding 0 16px, Radius 8px, Font 18px (Body Bold 1)

**Variants:**
- **Primary (Bold + Strong)**: Bg `#444aff` (Brand 500), Text `#ffffff`. Hover Bg `#3039dd`. Pressed Bg `#171b8d`.
- **Destructive (Bold + Danger)**: Bg `#bd130e` (Red 700), Text `#ffffff`. Hover Bg `#a7165c`.
- **Secondary (Outlined + Strong)**: Bg `#ffffff`, Border 1px solid `#e6eaf2` (Neutral 300), Text `#111214`. Hover Border `#c4cbdc`.
- **Tertiary (Minimal + Strong)**: Bg `transparent`, Text `#111214`. Hover Bg `#f9fafc`.

**States:**
- **Disabled**: Opacity 0.7, Bg `#dadfeb` (Neutral 400), Text `#c4cbdc`, Cursor `not-allowed`.
- **Focus Visible**: Ring 3px solid `#98a9ff` (Brand 300).
- **Transition**: `background-color 0.2s, box-shadow 0.2s, opacity 0.2s`.

#### 2. Text Inputs & Textarea
**Sizes:** Matches Button heights (`xsm`: 24px, `sm`: 32px, `md`: 40px).

**Styles:**
- **Default**: Bg `#ffffff`, Border 1px solid `#e6eaf2` (Neutral 300), Radius 8px (4px for xsm), Text `#111214`.
- **Placeholder**: Text `#c4cbdc` (Neutral 500).

**States:**
- **Hover**: Border `#c4cbdc` (Neutral 500).
- **Focus**: Border `#98a9ff` (Brand 300), Outline none.
- **Error**: Border `#bd130e` (Red 700).
- **Success**: Border `#228322` (Green 700).
- **Disabled**: Bg `#dadfeb`, Border `#dadfeb`, Text `#c4cbdc`.

#### 3. Selection Controls
**Checkbox:**
- Size: 16x16px (md) or 14x14px (sm).
- **Unchecked**: Border 2px solid `#e6eaf2`, Bg `#f9fafc`, Radius 4px.
- **Checked**: Bg `#444aff` (Brand 500), Border `#444aff`, White check icon.

**Radio Button:**
- Size: 16x16px. Circle (Radius 50%).
- **Unchecked**: Border 2px solid `#e6eaf2`, Bg `#f9fafc`.
- **Checked**: Border 5px solid `#444aff`, Bg `#ffffff` (creates the dot effect).

**Switch (Toggle):**
- Size: 40x24px (md) or 28x16px (sm). Radius 100px.
- **Off**: Bg `#878ba4` (Neutral 600).
- **On**: Bg `#444aff` (Brand 500).
- **Thumb**: White circle, 2px padding from edge.

#### 4. Dropdowns (Select)
- **Trigger**: Same styling as `Input`.
- **Menu**: Bg `#ffffff`, Shadow `0 4px 16px rgba(17, 18, 20, 0.1)` (Elevation Fluffy), Radius 8px.
- **Item**: Height 32px, Padding 0 8px, Hover Bg `#f2f5fa` (Neutral 200).

### Group 2: Feedback & Status

#### 5. Toast & Semantic Messages
**Toast Container**: Max width 460px, Fixed bottom right.

**Styles:**
- **Subtle (Default)**: Bg Semantic Tint (e.g. `#edf4ff` for Info), Radius 8px, Padding 12px.
- **Bold**: Bg Semantic Solid (e.g. `#4a92ff` for Info), Text White, Radius 0.

**Colors:**
- **Info**: Blue (`#4a92ff` / `#edf4ff`).
- **Success**: Green (`#5ad45a` / `#f4fff4`).
- **Warning**: Orange (`#ffa537` / `#fff6eb`).
- **Danger**: Red (`#f6554f` / `#ffeaea`).

#### 6. Badges & Tags
**Tag:**
- Bg Semantic Subtle (e.g., `#f2f5fa` for Natural), Text Default.
- Height 24px (md) or 20px (sm). Radius 4px. Padding 0 8px.

**Chip (Interactive Tag):**
- Similar to Tag but with Hover state (Bg darken) and optional Close icon.
- **Action Chip**: Dashed border `#e6eaf2`.

**Notification Badge:**
- Height 16px, Min width 16px. Radius 8px.
- Bg `#f6554f` (Red 500), Text White, Font 10px.

#### 7. Loading States
**Spinner:**
- SVG with Conic Gradient (`transparent` to `#444aff`). Animation `spin 1s linear infinite`.

**Skeleton:**
- Bg `#e6eaf2`, Animation `pulse` (opacity 0.5 to 1). Radius 4px.

### Group 3: Containers & Overlays

#### 8. Modal & Dialog
- **Overlay**: Bg `rgba(84, 86, 102, 0.5)` (Neutral 800 @ 50%).
- **Dialog**: Bg `#ffffff`, Radius 16px, Shadow `0 0 0 1px rgba(0,0,0,0.05), 0 10px 40px rgba(0,0,0,0.1)`.
- **Mobile**: Full screen, Radius 0.

#### 9. Tooltip
- Bg `#ffffff`, Text `#111214`, Radius 8px, Shadow Elevation Overlay.
- Padding 4px 8px. Font 12px.

#### 10. Glass Container
- Bg `rgba(255, 255, 255, 0.5)`.
- Backdrop Filter: `blur(8px)` (md) or `blur(4px)` (sm).
- Border: Optional 1px solid `rgba(255, 255, 255, 0.2)`.

### Group 4: Data Display

#### 11. Avatar
- **Shape**: Circle (Radius 50%).
- **Sizes**: Min 16px.
- **Fallback**: Bg `#d04aff` (Purple 500), White text (Initials).
