export const GAME_WIDTH = 400;
export const GAME_HEIGHT = 600;
export const WALL_THICKNESS = 50;
export const TOP_LINE_Y = 100; // Game over line

// Using Twemoji for fruits
const BASE_URL = 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/';

export const CIRCLES = [
    { radius: 12, score: 10, img: BASE_URL + '1f352.png' }, // 🍒 Cherry (was 15)
    { radius: 18, score: 20, img: BASE_URL + '1f353.png' }, // 🍓 Strawberry (was 22)
    { radius: 24, score: 40, img: BASE_URL + '1f347.png' }, // 🍇 Grapes (was 30)
    { radius: 30, score: 80, img: BASE_URL + '1f34a.png' }, // 🍊 Tangerine (was 38)
    { radius: 38, score: 160, img: BASE_URL + '1f34b.png' }, // 🍋 Lemon (was 47)
    { radius: 46, score: 320, img: BASE_URL + '1f348.png' }, // 🍈 Melon (was 57)
    { radius: 54, score: 640, img: BASE_URL + '1f34d.png' }, // 🍍 Pineapple (was 68)
    { radius: 64, score: 1280, img: BASE_URL + '1f351.png' }, // 🍑 Peach (was 80)
    { radius: 76, score: 2560, img: BASE_URL + '1f34f.png' }, // 🍏 Green Apple (was 95)
    { radius: 88, score: 5120, img: BASE_URL + '1f34e.png' }, // 🍎 Red Apple (was 110)
    // Custom SVG for Round Watermelon (replacing 1f349.png slice)
    {
        radius: 104,
        score: 10240,
        img: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="72px" height="72px" viewBox="0 0 72 72"%3E%3Ccircle cx="36" cy="36" r="34" fill="%234CAF50" stroke="%231B5E20" stroke-width="1"/%3E%3Cpath d="M36 2 C 42 12 44 24 40 36 C 36 48 34 60 36 70 M 18 8 C 24 16 26 28 22 36 C 18 44 16 56 18 64 M 54 8 C 48 16 46 28 50 36 C 54 44 56 56 54 64" stroke="%231B5E20" stroke-width="4" fill="none" stroke-linecap="round"/%3E%3C/svg%3E'
    } // 🍉 Watermelon (Round)
];

export const PHYSICS = {
    FRICTION: 0.3,
    RESTITUTION: 0.2,
    DENSITY: 0.001
};

// Stronger scaling for "chaos"
export const PHYSICS_SCALE = {
    RESTITUTION_PER_LEVEL: 0.08, // Bouncier
    FRICTION_PER_LEVEL: -0.03,   // More slippery
    EXPLOSION_PER_LEVEL: 0.05    // Stronger explosion
};

export const MERGE_EXPLOSION_FORCE = 0.08; // Base explosion increased

// Mission thresholds (approx 2-3 mins per level)
export const LEVEL_SCORE_THRESHOLDS = [
    0, 3000, 8000, 15000, 25000, 40000, 60000, 85000, 115000, 150000
];

export const DROP_COOLDOWN = 400; // Faster tempo (ms)
export const NEXT_TURN_DELAY = 1000;

export const SLOW_MOTION_EFFECT = {
    SLOW_DOWN_DURATION: 800,
    SLOW_MOTION_DURATION: 600,
    SPEED_UP_DURATION: 400,
    MIN_TIME_SCALE: 0.2
};

export const VIBRATION_CONFIG = {
    DURATION: 3000,
    RANGE: 250,
    FORCE: 0.003
};
