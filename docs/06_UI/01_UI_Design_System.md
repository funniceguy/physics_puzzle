# UI Design System

## 1. Design Tokens (디자인 변수)

### 1.1 Colors (색상)
프로젝트 전반에 사용되는 핵심 색상 팔레트입니다.

| Category | Token Name | Value (Hex/Gradient) | Semantic Usage |
|:---:|:---|:---|:---|
| **Primary** | `Color/Cyan` | `#4CC9F0` | 주요 텍스트 강조, 활성 아이콘 효과 |
| **Secondary** | `Color/Purple` | `#7209B7` | 로비 타이틀 그라데이션 (Start) |
| **Background** | `Bg/DeepBlue` | `linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)` | 앱 전체 배경 |
| **Surface** | `Surface/Glass` | `rgba(255, 255, 255, 0.05)` + `blur(10px)` | 상단 바, 아이템 바, 패널 배경 |
| **Success** | `Color/Green` | `linear-gradient(135deg, #4CAF50, #45A049)` | 확인 버튼, Primary 액션 |
| **Danger** | `Color/Red` | `linear-gradient(135deg, #FF6B6B, #EE5A6F)` | 알림 뱃지, 부정적 상태 |
| **Warning** | `Color/Orange` | `linear-gradient(45deg, #FF0055, #FF5500)` | 결과 화면 타이틀, 강조 |

### 1.2 Typography (타이포그래피)
기본 폰트: `'Outfit', 'Segoe UI', sans-serif`

| Token Name | Size | Weight | Line Height | Usage |
|:---|:---|:---|:---|:---|
| **Heading 1** | 48px | Bold (700) | 1.2 | 로비 타이틀 |
| **Heading 2** | 36px | Bold (700) | 1.2 | 결과 화면 타이틀 |
| **Heading 3** | 24px | Bold (700) | 1.4 | 스탯 값, 섹션 헤더 |
| **Body Large** | 18px | Regular (400) / Bold (600) | 1.5 | 버튼 텍스트, 설명문 |
| **Body Medium** | 16px | Regular (400) | 1.5 | 일반 본문, 다이얼로그 내용 |
| **Body Small** | 14px | Regular (400) | 1.4 | 점수 정보, 보조 텍스트 |

### 1.3 Spacing & Sizing (간격 및 크기)

#### Border Radius (표준화 제안)
*   `Radius/Small`: **8px** (캔버스, 작은 컨테이너)
*   `Radius/Medium`: **16px** (일반 버튼, 게임 컨테이너, 패널)
*   `Radius/Large`: **24px** (아이템 바, 대형 패널)
*   `Radius/Pill`: **50% (Circle)** 또는 **30px+** (라운드 버튼)

#### Interface Layout
*   **App Max Width**: 1080px (Main Wrapper)
*   **Game Max Width**: 400px (Mobile Optimized Ratio 2:3)
*   **Item Button Size**: 55px (Desktop) / 50px (Mobile)

---

## 2. Component Library (컴포넌트 명세)

### 2.1 Buttons (버튼)

#### Primary Button (`.btn-primary`, `#result-button`)
*   **Appearance**: Success Green Gradient, Shadow, Rounded Pills.
*   **Interaction**:
    *   Hover: `transform:  translateY(-2px)`, Shadow 확산.
    *   Click: `transform: scale(0.95)` (제안).

#### Secondary/Glass Button (`.btn-secondary`, `.item-btn`)
*   **Appearance**: Glassmorphism (White 10% Opacity), 1px White Border (20% Opacity).
*   **Interaction**:
    *   Hover: Opacity 증가, `transform: translateY(-2px)`.
    *   Active State (`.active`): Cyan Background Tint + Glow Effect.

### 2.2 Panels & Containers (패널)

#### Glass Panel
*   **Class**: `#game-container`, `#item-bar`, `.confirm-box`
*   **Style**:
    *   Background: `rgba(255, 255, 255, 0.05)` ~ `rgba(30, 30, 40, 0.6)`
    *   Backdrop Filter: `blur(10px)`
    *   Border: `1px solid rgba(255, 255, 255, 0.1)`
    *   Shadow: `0 8px 32px rgba(0, 0, 0, 0.37)`

### 2.3 Indicators (인디케이터)

#### Badge (`.item-count`)
*   **Position**: 부모 요소 우상단 (-8px).
*   **Style**: Red Gradient, White Text, 11px Font Size, Box Shadow.

---

## 3. Layout & Structure (레이아웃 및 구조)

### 3.1 Anchor Strategy (반응형 전략)
*   **Desktop**:
    *   `#main-wrapper`: 화면 중앙 정렬 (`justify-content: center`).
    *   `#game-container`: 고정 비율(2:3), 최대 높이 `calc(100vh - 150px)`.
*   **Mobile (< 480px)**:
    *   Padding 축소 (20px -> 5px).
    *   Button Size 축소 (55px -> 50px).
    *   Font Size 축소 (약 80-90% 수준).

### 3.2 Layer Order (Z-Index Hierarchy)
일관된 렌더링 순서를 보장하기 위한 계층 구조입니다.

| Layer Name | Z-Index | Elements |
|:---|:---|:---|
| **Background** | 0 | Canvas (Matter.js World) |
| **Game UI** | 5 | Top Line (데드라인) |
| **HUD** | 10 | Score UI, Top Bar |
| **Effects** | 15 | 파티클, 이펙트 레이어 |
| **Overlays** | 20 | Result Screen, Pause Screen |
| **Popups** | 10000 | Confirm Dialog, Alerts |
| **System** | 99999 | Debug Overlay, System Cursor |

---

## 4. Standardization Recommendations (표준화 제안사항)

1.  **Border Radius 통일**: 현재 코드에 혼재된 `20px`, `24px`, `30px` 등을 위에서 정의한 `Small/Medium/Large` 스케일로 통일할 것을 권장합니다.
2.  **Color Variables**: `style.css` 상단 `:root`에 위에서 정의한 색상들을 CSS 변수(`--color-primary`, `--bg-glass` 등)로 선언하여 재사용성을 높여야 합니다.
3.  **Animations**: `fadeIn`, `slideUp` 등 산재된 키프레임 애니메이션을 유틸리티 클래스로 분리하여 관리할 것을 제안합니다.
