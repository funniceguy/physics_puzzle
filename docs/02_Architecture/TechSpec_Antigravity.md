# Technical Specification: Antigravity & Physics System

## 1. 개요
본 문서는 "Life Pieces" 프로젝트의 핵심인 물리 엔진 시스템(Antigravity)의 기술적 구현 상세를 정의합니다.
프로젝트는 `Matter.js` 2D 물리 엔진을 사용하여 과일의 낙하, 충돌, 합체(Merge) 및 특수 효과를 구현합니다.

## 2. 아키텍처 및 의존성
- **Core Library**: Matter.js
- **Framework**: Vanilla JS (ES6 Modules)
- **Key Modules**:
  - `PhysicsWorld.js`: Matter.js 엔진 초기화, 월드 경계 생성, 렌더러 설정.
  - `Game.js`: 게임 로즈 및 상태 관리, 물리 이벤트(충돌 등) 리스닝.
  - `Circle.js`: 물리 바디(과일) 생성 팩토리.
  - `Constants.js`: 물리 상수 관리 (마찰력, 탄성 계수 등).

## 3. 물리 엔진 설정 (Configuration)
`PhysicsWorld.js`에서 엔진을 초기화합니다.

### 3.1 World Setup
- **Gravity**: Matter.js 기본 중력 ($y=1$) 사용 (필요 시 `engine.world.gravity` 조절).
- **Boundaries**: 화면 밖으로 나가는 것을 방지하기 위해 좌/우/바닥에 정적(Static) 바디 배치.
- **Rendering**: `Matter.Render`를 사용하여 Canvas에 디버그/실제 렌더링 (현재 코드상 렌더러 사용 확인).

## 4. 핵심 메카닉 구현 상세

### 4.1 Dropping (낙하)
- **Spawn**: `Game.js`의 `spawnNextCircle()`에서 생성. 초기엔 `isStatic: true` 및 `isSensor: true`로 설정하여 충돌 없이 마우스 추종.
- **Drop Action**: 클릭 시 `isStatic: false`, `isSensor: false`로 변경하고 초기 속도(`y: 5`)를 부여하여 물리 시뮬레이션에 편입.

### 4.2 Merging (합체)
- **Event**: `Matter.Events.on(engine, 'collisionStart', ...)` 이벤트를 사용하여 충돌 감지.
- **Logic**:
  - 충돌한 두 바디(`bodyA`, `bodyB`)의 `gameData.level`이 같고, 아직 합체 플래그(`hasMerged`)가 없는 경우 실행.
  - 두 바디 제거 (`Composite.remove`).
  - 두 바디의 중간 위치(`midX`, `midY`)에 `level + 1`의 새로운 바디 생성.
  - **Explosion Effect**: 합체 순간 주변 바디들에 힘(`applyForce`)을 가하여 밀어내는 효과 구현.

### 4.3 Physics Properties by Level
`Constants.js` 및 `Game.js`의 `applyLevelPhysics` 참고.
- 레벨이 높을수록(과일이 커질수록) 물리 속성이 변화함.
- **Restitution (탄성)**: `PHYSICS.RESTITUTION + (level * SCALE)` (최대 1.2).
- **Friction (마찰)**: `PHYSICS.FRICTION + (level * SCALE)`.
- 이를 통해 큰 과일일수록 더 묵직하거나 튀는 느낌 조절.

### 4.4 Special Items
- **Remove**: `Composite.remove`로 바디 삭제 및 파티클 이펙트.
- **Upgrade**: 바디 제거 후 같은 위치에 상위 레벨 바디 생성.
- **Vibration**:
  - `Matter.Body.setStatic(body, true)`로 잠시 고정하거나,
  - 랜덤한 방향의 미세한 힘을 지속적으로 가하여(`applyForce`) 뭉친 과일들을 흔듦.

### 5. 모바일 최적화 (Mobile Optimization)
- **Effect Throttling**: 모바일(`isMobile()`) 감지 시 화려한 파티클 이펙트나 사운드 재생을 생략하거나 간소화하여 프레임 드랍 방지.
- **Interaction**: 터치 이벤트를 마우스 좌표로 변환하여 처리.

## 6. 향후 개선 사항 (TODO)
- Matter.js 렌더러 대신 Pixi.js 등 전용 렌더링 엔진 통합 고려 (현재는 Canvas 직접 그리기 또는 Matter 내장 렌더러 사용 추정).
- 물리 연산의 정밀도와 퍼포먼스 튜닝 (Sub-stepping 등).
