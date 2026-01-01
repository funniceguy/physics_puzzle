# Content Mechanics Specification (ContentSpec)

## 1. 게임 메카닉 (Game Mechanics)

### 1.1 기본 규칙
- **Spawn & Drop**:
    - 대기열: 한 번에 하나의 과일만 대기열(상단)에 존재.
    - 쿨타임: 과일 투하 후 `DROP_COOLDOWN`(약 400ms) 동안 다음 과일 생성 불가.
    - 미리보기: 다음에 나올 과일(`Next Circle`)을 화면 우측 상단 UI에 표시.
- **Merge (합체)**:
    - 동일 Level 과일 충돌 시 발생.
    - `Level N` + `Level N` -> `Level N+1`.
    - **Merge Bonus**: 합체 시 주변 과일들을 밀어내는 폭발력(`Explosion Force`) 발생. 이는 정적인 쌓임을 방지하고 게임의 역동성을 부여함.
- **Game Over**:
    - 데드라인: Y좌표 100 (상단) 기준.
    - 조건: 과일이 데드라인 위에서 0.5초 이상 체류 시(Rolling/Bouncing 제외).
    - 연출: 슬로우 모션 발동 후 결과 화면 진입.

### 1.2 물리 파라미터 튜닝 (Physics Tuning)
레벨이 오를수록 과일의 물리적 성질이 변화하여 난이도를 조절합니다.

| 속성 (Attribute) | 공식 (Formula) | 설명 |
| :--- | :--- | :--- |
| **Radius** (반지름) | $R_{base} \times Scale^{Level}$ | 레벨에 따라 지수적으로 혹은 선형적으로 증가. |
| **Mass** (질량) | Matter.js 자동 계산 (면적 비례) | 무거운 과일일수록 밀기 힘듦. |
| **Restitution** (탄성) | $0.2 + (Level \times 0.08)$ | 레벨이 높을수록(큰 과일) 더 잘 튕겨져 나감(혼돈 요소). Max 1.2. |
| **Friction** (마찰) | $0.3 - (Level \times 0.03)$ | 레벨이 높을수록 표면이 매끄러워 미끄러지기 쉬움. Min 0.0. |
| **Explosion Force** | $(Base + (Level \times 0.05)) \times RadiusScale$ | 합체 시 주변 과일을 밀어내는 힘. 클수록 강함. |

## 2. 콘텐츠 데이터 (Content Data)

### 2.1 과일 레벨 디자인 (Fruit Levels)
| Lv | 이름 | Radius | 점수 | 이미지/상징 |
| :--- | :--- | :--- | :--- | :--- |
| 0 | Cherry | 12px | 10 | 🍒 시작의 씨앗 |
| 1 | Berry | 18px | 20 | 🍓 달콤한 열정 |
| 2 | Grape | 24px | 40 | 🍇 인내의 묶음 |
| 3 | Tangy | 30px | 80 | 🍊 상큼한 활력 |
| 4 | Lemon | 38px | 160 | 🍋 시련의 껍질 |
| 5 | Melon | 46px | 320 | 🍈 성숙의 과육 |
| 6 | Pine | 54px | 640 | 🍍 거친 겉모습 |
| 7 | Peach | 64px | 1280 | 🍑 부드러운 내면 |
| 8 | Apple(G) | 76px | 2560 | 🍏 풋풋한 시절 |
| 9 | Apple(R) | 88px | 5120 | 🍎 결실의 완성 |
| 10 | Watermelon | 104px | 10240 | 🍉 풍요로운 인생 |

### 2.2 아이템 (Items)
플레이어는 게임 중 획득한 아이템을 사용하여 위기를 탈출할 수 있습니다.
- **Remove (삭제)**:
    - 효과: 선택한 과일 하나를 즉시 제거.
    - 비용: 1 Charge.
    - 전략: 꽉 막힌 공간 확보 또는 게임오버 직전 구출.
- **Upgrade (진화)**:
    - 효과: 선택한 과일을 다음 단계로 강제 진화.
    - 제약: 최고 레벨(수박)에는 사용 불가.
    - 비용: 1 Charge.
- **Vibration (흔들기)**:
    - 효과: 화면 전체 혹은 특정 반경의 과일들에 무작위 힘을 가함.
    - 전략: 교착 상태(Stuck) 해결, 틈새 만들기.
    - 비용: 1 Charge.

### 2.3 스토리 시스템 (Story System)
"인생의 조각들"이라는 테마에 맞춰 조건을 달성하면 스토리가 해금됩니다.
- **저장 구조**: `unlockedStories` 배열에 ID 저장.
- **트리거**:
    - **First Merge**: 각 과일을 처음 만들었을 때.
    - **Score Achievement**: 특정 점수 도달 시.
- **UI 표시**: 도감(Archive) 메뉴에서 해금된 스토리 열람 가능.

### 2.4 업적 시스템 (Achievement System)
| ID | 이름 | 조건 | 보상 |
| :--- | :--- | :--- | :--- |
| `first_cherry` | 첫 시작 | 게임 최초 실행 | Story: cherry_1 |
| `merge_master` | 병합의 달인 | 총 1000회 병합 달성 | Item: Upgrade x1 |
| `high_roller` | 고득점자 | 100,000점 달성 | Item: Remove x2 |
| ... | ... | ... | ... |
