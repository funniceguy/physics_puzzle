# UI Architecture Specification (UISystemSpec)

## 1. 개요 (Overview)
Antigravity의 UI 시스템은 **전체 화면 관리(Screen Management)**와 **인게임 HUD 관리(Game UI Management)**로 이원화되어 있습니다. 또한, 일관된 사용자 경험을 위해 통합된 **Design System**을 따릅니다.

## 2. 디자인 시스템 (Design System)

### 2.1 Color Palette
따뜻하고 감성적인 파스텔 톤과 모던한 Dark 네온 스타일을 융합하여 "힐링 게임" 분위기를 조성합니다.

| Token Name | Value | Description |
| :--- | :--- | :--- |
| `Primary` | `#4CC9F0` | Main brand color (Cyan/Blue) |
| `Secondary` | `#7209B7` | Secondary brand color (Purple) |
| `Background` | `linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)` | Deep blue gradient for main background |
| `Surface Glass` | `rgba(255, 255, 255, 0.05)` | Glassmorphism base layer |
| `Success` | `linear-gradient(135deg, #4CAF50, #45A049)` | Success actions, Play button |
| `Danger` | `linear-gradient(135deg, #FF6B6B, #EE5A6F)` | Critical info, warnings |
| `Text White` | `#ffffff` | Primary text color |

### 2.2 Typography
- **Font Family**: Google Fonts `'Outfit'`, sans-serif fallback.
- **Scale**:
    - **H1 (Title)**: `48px`, Bold
    - **H2 (Heading)**: `36px`, Uppercase, Letter-spacing `4px`
    - **Body**: `16px` (Mobile `14px`), Regular
    - **Button**: `28px` (Play), `18px` (Standard)

### 2.3 Component Styles
- **Buttons**:
    - **Play Button**: Capsule shape (`40px` radius), Success Gradient, Shadow `0 10px 25px`. Hover: Scale `1.05`.
    - **Item Button**: Size `55px`, Glassmorphism (`rgba(255,255,255,0.1)`), Square `16px` radius. Active: Cyan Tint + Glow.
- **Panels**:
    - **Game Container**: `aspect-ratio: 2/3`, Border `1px solid rgba(255,255,255,0.1)`, Background `rgba(30,30,40,0.6)` + Blur.
    - **Cards**: Glass background, Slide right on hover.

## 3. Screen Management (`ScreenManager.js`)
애플리케이션의 최상위 레벨 뷰(View)를 제어합니다.

### 3.1 구조
- **Container**: `#app` 또는 `body` 하위의 각 Screen용 `div` 컨테이너.
- **Registry**: `Map<String, ScreenInstance>` 형태로 스크린 객체들을 보유.
- **Transition**: 화면 전환 시 즉시 `display` 속성을 토글. (`.active` 클래스 토글 방식 권장)

### 3.2 구현된 스크린 목록
1. **TitleScreen**: 게임 로고 및 "Start" 트리거.
2. **LobbyScreen**: 메인 메뉴 (Play, Archive, Achievements).
3. **GameScreen**: 실제 게임 플레이 및 HUD.
4. **StoryScreen**: 해금된 스토리 열람.
5. **AchievementScreen**: 업적 목록 확인.

## 4. Game UI Management (`UIManager.js`)
`GameScreen` 내부의 HUD 및 실시간 피드백을 관리합니다.

### 4.1 주요 구성 요소 (Components)
*   **Score Board**: Target Score와 Current Score 표시, 카운팅 애니메이션.
*   **Next Circle**: 다음 과일 미리보기 이미지.
*   **Item Bar**: 3종 아이템 버튼 (Badge 포함, Cool-down 상태 표시).
*   **Notification Area**: 업적 달성 토스트 메시지 (`z-index: 2000`).

### 4.2 이펙트 시스템 (Effect System)
DOM 요소를 생성/삭제하여 시각 효과를 연출합니다 (`effects-container`, `z-index: 15`).
*   **Merge**: 별(`star`) 파티클, 폭발(`explosion`) 애니메이션.
*   **Feedback**: 점수 획득 시 아이콘 Flash, 아이템 사용 시 Sparkle.

## 5. Layout & Structure
### 5.1 Anchor Strategy
- **Vertical**: `height: 100vh` (with `-webkit-fill-available`).
- **Horizontal**: `#main-wrapper` centered (`max-width: 1080px`). `#game-container` limited to `400px` width.
- **Layer Order (Z-Index)**:
    - `0`: Background
    - `5`: Game Canvas
    - `10`: HUD
    - `20`: Overlays (Result, Modals)
    - `2000`: Notifications
