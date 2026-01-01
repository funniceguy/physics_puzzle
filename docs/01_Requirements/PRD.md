# Product Requirements Document (PRD)

## 1. 프로젝트 개요 (Project Overview)
- **프로젝트명**: Life Pieces (Antigravity)
- **장르**: 물리 기반 머지 퍼즐 게임 (Physics-based Merge Puzzle)
- **플랫폼**: Web (Mobile First, Desktop Compatible)
- **핵심 경험**: 
    - **"떨어뜨리고 합친다"**: 직관적이고 중독성 있는 퍼즐 메카닉.
    - **"인생을 수집한다"**: 과일을 합치며 해금되는 철학적인 스토리.
    - **"쾌적한 조작감"**: 모바일 환경에서도 부드러운 물리 효과와 반응성.

## 2. 유저 페르소나 (Target Audience)
- **Main**: 20-40대 모바일 캐주얼 게이머. 짧은 시간(5-10분) 킬링타임 용도.
- **Sub**: 수집욕이 강하고, 도감 채우기를 좋아하는 게이머. 느긋한 페이스의 게임을 선호하는 유저.

## 3. 핵심 기능 요구사항 (Key Functional Requirements)

### 3.1 게임플레이 (Gameplay)
- **Drag & Drop**: 플레이어는 화면 상단에서 과일을 좌우로 이동시키고, 터치/클릭 해제 시 낙하시킬 수 있어야 한다.
- **Merge Logic**: 같은 단계의 과일 두 개가 충돌하면 즉시 다음 단계의 과일로 합쳐져야 한다.
- **Physics**: 
    - **Gravity**: 모든 물체는 아래로 떨어진다.
    - **Collision**: 물체끼리 충돌 시 밀려나거나 쌓여야 한다.
    - **Dynamics**: 과일의 크기(단계)가 커질수록 무게감(Mass), 탄성(Restitution), 마찰(Friction)이 달라져야 한다.
- **Game Over**: 과일이 "데드라인(Top Line)"을 넘어 일정 시간 이상 머무르면 게임이 종료되어야 한다.

### 3.2 게임 시스템 (Game Systems)
- **Scoring**: 합체 시 점수를 획득하며, 연쇄 합체(Combo)나 고단계 합체일수록 높은 점수를 부여한다.
- **Leveling**: 누적 점수에 따라 게임 내 레벨(Difficulty/Stage)이 상승한다.
- **Items**: 유저가 불리한 상황을 타개할 수 있는 아이템 3종(Remove, Upgrade, Vibration)을 제공한다.
- **Save/Load**: 진행 상황(최고 점수, 아이템 개수, 해금된 스토리)은 브라우저 로컬 스토리지에 자동 저장되어야 한다.

### 3.3 콘텐츠 (Contents)
- **The 11 Fruits**: 1단계(Cherry)부터 11단계(Watermelon)까지 성장하는 과일 11종.
- **Stories**: 특정 조건(새로운 과일 발견, 특정 점수 달성 등) 만족 시 인생에 관한 짧은 스토리(Life Tech)가 해금되어야 한다.
- **Achievements**: 반복적인 플레이 동기를 부여하는 업적 시스템.

## 4. 비기능 요구사항 (Non-Functional Requirements)

### 4.1 성능 (Performance)
- **Mobile Opt**: 모바일 웹 브라우저에서 60fps 유지를 목표로 한다. 과일 개수가 50개 이상일 때도 프레임 드랍을 최소화해야 한다.
- **Resource**: 초기 로딩 속도를 위해 에셋 용량을 최적화한다 (Twemoji 사용, SVG 활용).

### 4.2 UI/UX
- **Responsive**: 다양한 모바일 화면비(Aspect Ratio)에 대응해야 하며, PC에서도 깨지지 않아야 한다.
- **Feedback**: 합체, 아이템 사용, 게임 오버 등 모든 주요 액션에 시각/청각적 피드백(Effect, Sound)이 있어야 한다.

## 5. 데이터 요구사항
- **Local Storage**: 서버 없이 클라이언트 저장소만 사용.
    - Key: `lifepieces_progress`
    - Data: Inventory, HighScore, UnlockedStories, ClaimedAchievements.
