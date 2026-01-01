# Sequential Implementation Tasks (TASKS)

이 문서는 프로젝트를 처음부터 구축하거나 재정비할 때 따를 수 있는 순차적 가이드입니다. 현재 완료된 항목은 체크(`[x]`)되어 있습니다.

## Phase 1: 프로젝트 셋업 (Project Setup)
- [x] **디렉토리 구조 및 기본 파일**
    - [x] Root, `src`, `docs`, `assets` 폴더.
    - [x] `index.html` (Canvas, UI Layer).
    - [x] `style.css` (Reset, Layout).
    - [x] `package.json` (Optional).
- [x] **에셋 준비**
    - [x] Matter.js 추가.
    - [x] 과일 이미지(Twemoji) 준비.

## Phase 2: 코어 엔진 구현 (Core Engine)
- [x] **물리 월드 (`PhysicsWorld.js`)**
    - [x] Engine, Render, Runner 초기화.
    - [x] Canvas Resizing.
    - [x] Boundaries (Walls, Ground).
- [x] **객체 팩토리 (`Circle.js`)**
    - [x] Body 생성 및 Sprite 매핑.
    - [x] 기본 물리 속성(Friction, Restitution) 설정.
- [x] **Game Loop (`main.js` & `Game.js`)**
    - [x] Main Entry Point.
    - [x] Game Class Initialization.

## Phase 3: 게임 로직 구현 (Game Logic)
- [x] **Input & Drop**
    - [x] Mouse/Touch Position Tracking.
    - [x] Spawn Queue (Static Body).
    - [x] Drop Logic (Dynamic Body).
- [x] **Merge System**
    - [x] Collision Detection (`collisionStart`).
    - [x] Merge Logic (Level N -> N+1).
    - [x] **Explosion Effect** (Applied Force).
- [x] **Physics Tuning**
    - [x] Level-based Radius/Mass.
    - [x] Level-based Bounciness/Friction.

## Phase 4: UI 시스템 구축 (UI System)
- [x] **Screen Management (`ScreenManager.js`)**
    - [x] Screen Switching Logic.
    - [x] Title, Lobby, Game Screens.
- [x] **HUD (`UIManager.js`)**
    - [x] Score Counter.
    - [x] Next Circle Preview.
    - [x] **Visual Effects**: Merge Particles, Popups.
- [x] **Item UI**
    - [x] Item Buttons (Remove, Upgrade, Vibration).
    - [x] Cooldown/Count Logic link to Game.

## Phase 5: 데이터 및 콘텐츠 (Data & Content)
- [x] **Persistence (`ProgressManager.js`)**
    - [x] LocalStorage Adapter.
    - [x] Data Model (Inventory, Score, Unlocks).
- [x] **Story & Achievements**
    - [x] Unlock Triggers (Score/Merge counts).
    - [x] Notification UI.
    - [x] Story Data Structure.

## Phase 6: 폴리싱 및 최적화 (Polish)
- [x] **모바일 최적화**
    - [x] Touch Event Handling.
    - [x] Viewport Height Fix (`--app-height`).
    - [x] Performance Tuning (Particle checks).
- [x] **Audio System**
    - [x] `AudioManager.js`.
    - [x] Sound Effects Hooks.
