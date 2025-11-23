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
    { radius: 104, score: 10240, img: BASE_URL + '1f349.png' } // 🍉 Watermelon (was 130)
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
