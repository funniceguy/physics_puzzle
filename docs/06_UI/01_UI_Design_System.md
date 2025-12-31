# UI Design System

This document serves as the **Single Source of Truth** for all UI development in the "Life Pieces" project. It is reverse-engineered from the current implementation to ensure consistency.

## 1. Design Tokens

### Colors
| Token Name | Value | Description |
| :--- | :--- | :--- |
| `Primary` | `#4CC9F0` | Main brand color (Cyan/Blue) |
| `Secondary` | `#7209B7` | Secondary brand color (Purple) |
| `Background` | `linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)` | Deep blue gradient for main background |
| `Surface Glass` | `rgba(255, 255, 255, 0.05)` | Glassmorphism base layer |
| `Game Container` | `rgba(30, 30, 40, 0.6)` | Physics area background |
| `Success` | `linear-gradient(135deg, #4CAF50, #45A049)` | Success actions, Play button, Claim button |
| `Danger` | `linear-gradient(135deg, #FF6B6B, #EE5A6F)` | Critical info, warnings |
| `Warning` | `linear-gradient(45deg, #FF0055, #FF5500)` | Highlights, Special text |
| `Text White` | `#ffffff` | Primary text color |
| `Text Dim` | `rgba(255, 255, 255, 0.7)` | Secondary text color |

### Typography
*   **Font Family**: `'Outfit', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`
*   **Scale**:
    *   **H1 (Lobby Title)**: `48px` (Mobile: `32px`) | Bold
    *   **H2 (Result Title)**: `36px` (Mobile: `28px`) | Uppercase | Letter-spacing `4px`
    *   **H3 (Section Title)**: `24px` | Bold
    *   **Body**: `16px` (Mobile: `14px`)
    *   **Button Text**: `28px` (Play) / `18px` (Standard)

### Spacing & Sizing
| Token Name | Value | Description |
| :--- | :--- | :--- |
| `Radius Small` | `8px` | Small elements (canvas, inner containers) |
| `Radius Medium` | `16px` | Buttons, Cards, Game Container |
| `Radius Large` | `24px` | Large containers, Item bar |
| `Game Width` | `400px` | Max width of the physics container |
| `Max App Width` | `1080px` | Max width of the entire layout |

---

## 2. Component Library

### Buttons

#### Play Button (Lobby)
*   **Style**: Capsule shape (`40px` radius), Success Gradient (`--color-success`).
*   **Shadow**: `0 10px 25px rgba(76, 175, 80, 0.4)`.
*   **Interaction**:
    *   **Hover**: Scale `1.05`, Shadow expands to `0 15px 35px`.

#### Standard Button (Confirm / Result)
*   **Style**: Pill shape (`30px` radius), Solid background (Success/Transparent).
*   **Padding**: `12px 35px`.
*   **Interaction**:
    *   **Hover**: detailed transform `translateY(-2px)`.

#### Item Button (In-Game)
*   **Size**: `55x55px` (Mobile: `50px`).
*   **Style**: Glassmorphism (`rgba(255, 255, 255, 0.1)`), Square with `radius-medium`.
*   **State - Active**: Cyan Tint (`rgba(76, 201, 240, 0.3)`), Glow (`box-shadow`).
*   **State - Disabled**: Opacity `0.4`, `cursor: not-allowed`.

#### Nav Button (Bottom Bar)
*   **Style**: Icon + Label, Color `rgba(255,255,255,0.4)`.
*   **Active**: Color `Primary (#4CC9F0)`, Icon `translateY(-5px)`.

### Panels

#### Game Container
*   **Border**: `1px solid rgba(255, 255, 255, 0.1)`.
*   **Background**: `rgba(30,30,40, 0.6)` + `backdrop-filter: blur(10px)`.
*   **Shadow**: `0 8px 32px 0 rgba(0, 0, 0, 0.37)`.

#### Cards (Story/Character)
*   **Style**: Row layout, Glass background (`rgba(255,255,255, 0.05)`).
*   **Hover**: Slide right (`translateX(5px)`), Background lighten.

### Inputs & Sliders
*   **Volume Slider**:
    *   **Track**: `height: 4px`, `bg: rgba(255,255,255, 0.2)`.
    *   **Thumb**: `14px` Circle, `bg: Primary`.

---

## 3. Layout & Structure

### Anchor Strategy
The application uses a **Center-Anchored Flexible Layout**.
*   **Vertical**: `height: 100vh` (with `-webkit-fill-available` fallback). Content acts as a column centered via flexbox.
*   **Horizontal**:
    *   `#main-wrapper` is centered with `max-width: 1080px`.
    *   `#game-container` is strictly sized `max-width: 400px` but responsive (`width: 100%`).
*   **Aspect Ratio**: Game container enforces `aspect-ratio: 2 / 3` ensuring consistent physics simulation coordinates regardless of screen.

### Layer Order (Z-Index)
| Z-Index | Layer | Elements |
| :--- | :--- | :--- |
| `0` | Background | App Background |
| `5` | Game UI | Game Container, Canvas |
| `10` | HUD | Top Bar, Item Bar |
| `15` | Effects | Global Particles (Confetti) |
| `20` | Overlays | Result Screen, Story/Achievement Screens |
| `2000` | Notifications | Achievement Popups |
| `10000` | Popups | Confirmation Dialogs |

---

## 4. Standardized Values & Suggestions
> [!NOTE]
> During reverse engineering, the following standards were applied to unify identified inconsistencies.

1.  **Button Gradients**: Adopted the css variable `--color-success` (`linear-gradient(135deg, #4CAF50, #45A049)`) as the single source for all positive actions (Play, Claim, Result confirm), replacing occasional hardcoded `rgb` values.
2.  **Glassmorphism**: Standardized sidebar/panel backgrounds to use `var(--bg-surface-glass)` instead of varying `rgba` opacity values (0.05 vs 0.1).
3.  **Border Radius**: Enforce `8px`, `16px`, `24px` scale (`--radius-small/medium/large`) to avoid arbitrary values like `20px` or `30px` unless specific to rounded-capsule buttons.
