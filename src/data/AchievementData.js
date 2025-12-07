// Achievement data for Life Pieces game

export const ACHIEVEMENTS = [
    // Merge Achievements
    {
        id: 'merge_cherry_5',
        name: '첫 만남',
        description: '체리를 5번 합치기',
        category: 'merge',
        icon: '🍒',
        requirement: { type: 'merge', fruit: 0, count: 5 },
        reward: { type: 'story', characterId: 'berry', storyId: 'berry_1' },
        completed: false
    },
    {
        id: 'merge_cherry_20',
        name: '체리 마스터',
        description: '체리를 20번 합치기',
        category: 'merge',
        icon: '🍒',
        requirement: { type: 'merge', fruit: 0, count: 20 },
        reward: { type: 'item', itemType: 'remove', count: 1 },
        completed: false
    },
    {
        id: 'merge_berry_10',
        name: '열정의 시작',
        description: '딸기를 10번 합치기',
        category: 'merge',
        icon: '🍓',
        requirement: { type: 'merge', fruit: 1, count: 10 },
        reward: { type: 'story', characterId: 'grape', storyId: 'grape_1' },
        completed: false
    },
    {
        id: 'merge_berry_30',
        name: '딸기 마스터',
        description: '딸기를 30번 합치기',
        category: 'merge',
        icon: '🍓',
        requirement: { type: 'merge', fruit: 1, count: 30 },
        reward: { type: 'item', itemType: 'upgrade', count: 1 },
        completed: false
    },
    {
        id: 'merge_grape_15',
        name: '인내의 열매',
        description: '포도를 15번 합치기',
        category: 'merge',
        icon: '🍇',
        requirement: { type: 'merge', fruit: 2, count: 15 },
        reward: { type: 'story', characterId: 'tangy', storyId: 'tangy_1' },
        completed: false
    },
    {
        id: 'merge_grape_40',
        name: '포도 마스터',
        description: '포도를 40번 합치기',
        category: 'merge',
        icon: '🍇',
        requirement: { type: 'merge', fruit: 2, count: 40 },
        reward: { type: 'item', itemType: 'vibration', count: 1 },
        completed: false
    },
    {
        id: 'merge_tangy_20',
        name: '따뜻한 마음',
        description: '귤을 20번 합치기',
        category: 'merge',
        icon: '🍊',
        requirement: { type: 'merge', fruit: 3, count: 20 },
        reward: { type: 'story', characterId: 'lemon', storyId: 'lemon_2' },
        completed: false
    },
    {
        id: 'merge_lemon_25',
        name: '역경의 극복',
        description: '레몬을 25번 합치기',
        category: 'merge',
        icon: '🍋',
        requirement: { type: 'merge', fruit: 4, count: 25 },
        reward: { type: 'story', characterId: 'melon', storyId: 'melon_1' },
        completed: false
    },
    {
        id: 'merge_melon_30',
        name: '성숙의 지혜',
        description: '멜론을 30번 합치기',
        category: 'merge',
        icon: '🍈',
        requirement: { type: 'merge', fruit: 5, count: 30 },
        reward: { type: 'item', itemType: 'remove', count: 2 },
        completed: false
    },
    {
        id: 'merge_pine_35',
        name: '독특한 존재',
        description: '파인애플을 35번 합치기',
        category: 'merge',
        icon: '🍍',
        requirement: { type: 'merge', fruit: 6, count: 35 },
        reward: { type: 'story', characterId: 'peach', storyId: 'peach_1' },
        completed: false
    },
    {
        id: 'merge_peach_40',
        name: '부드러운 힘',
        description: '복숭아를 40번 합치기',
        category: 'merge',
        icon: '🍑',
        requirement: { type: 'merge', fruit: 7, count: 40 },
        reward: { type: 'item', itemType: 'upgrade', count: 2 },
        completed: false
    },
    {
        id: 'merge_green_45',
        name: '균형의 달인',
        description: '청사과를 45번 합치기',
        category: 'merge',
        icon: '🍏',
        requirement: { type: 'merge', fruit: 8, count: 45 },
        reward: { type: 'story', characterId: 'apple', storyId: 'apple_1' },
        completed: false
    },
    {
        id: 'merge_apple_50',
        name: '지혜의 완성',
        description: '사과를 50번 합치기',
        category: 'merge',
        icon: '🍎',
        requirement: { type: 'merge', fruit: 9, count: 50 },
        reward: { type: 'item', itemType: 'vibration', count: 2 },
        completed: false
    },
    {
        id: 'merge_watermelon_10',
        name: '풍요의 시작',
        description: '수박을 10번 합치기',
        category: 'merge',
        icon: '🍉',
        requirement: { type: 'merge', fruit: 10, count: 10 },
        reward: { type: 'story', characterId: 'watermelon', storyId: 'watermelon_1' },
        completed: false
    },
    {
        id: 'merge_watermelon_25',
        name: '수박 마스터',
        description: '수박을 25번 합치기',
        category: 'merge',
        icon: '🍉',
        requirement: { type: 'merge', fruit: 10, count: 25 },
        reward: { type: 'item', itemType: 'remove', count: 3 },
        completed: false
    },

    // Level Clear Achievements
    {
        id: 'level_1_clear',
        name: '첫 걸음',
        description: '레벨 1 클리어',
        category: 'level',
        icon: '🎯',
        requirement: { type: 'level', level: 1, count: 1 },
        reward: { type: 'story', characterId: 'cherry', storyId: 'cherry_2' },
        completed: false
    },
    {
        id: 'level_2_clear',
        name: '도전의 시작',
        description: '레벨 2 클리어',
        category: 'level',
        icon: '🎯',
        requirement: { type: 'level', level: 2, count: 1 },
        reward: { type: 'story', characterId: 'lemon', storyId: 'lemon_1' },
        completed: false
    },
    {
        id: 'level_3_clear',
        name: '성장의 증거',
        description: '레벨 3 클리어',
        category: 'level',
        icon: '🎯',
        requirement: { type: 'level', level: 3, count: 1 },
        reward: { type: 'story', characterId: 'peach', storyId: 'peach_2' },
        completed: false
    },
    {
        id: 'level_5_clear',
        name: '완성을 향해',
        description: '레벨 5 클리어',
        category: 'level',
        icon: '🎯',
        requirement: { type: 'level', level: 5, count: 1 },
        reward: { type: 'story', characterId: 'apple', storyId: 'apple_2' },
        completed: false
    },
    {
        id: 'level_1_master',
        name: '레벨 1 마스터',
        description: '레벨 1을 5번 클리어',
        category: 'level',
        icon: '⭐',
        requirement: { type: 'level', level: 1, count: 5 },
        reward: { type: 'item', itemType: 'remove', count: 2 },
        completed: false
    },
    {
        id: 'level_2_master',
        name: '레벨 2 마스터',
        description: '레벨 2를 3번 클리어',
        category: 'level',
        icon: '⭐',
        requirement: { type: 'level', level: 2, count: 3 },
        reward: { type: 'item', itemType: 'upgrade', count: 2 },
        completed: false
    },

    // Special Achievements
    {
        id: 'total_score_10000',
        name: '점수 수집가',
        description: '총 10,000점 획득',
        category: 'special',
        icon: '💎',
        requirement: { type: 'totalScore', count: 10000 },
        reward: { type: 'item', itemType: 'vibration', count: 1 },
        completed: false
    },
    {
        id: 'total_score_50000',
        name: '점수 마스터',
        description: '총 50,000점 획득',
        category: 'special',
        icon: '💎',
        requirement: { type: 'totalScore', count: 50000 },
        reward: { type: 'story', characterId: 'watermelon', storyId: 'watermelon_2' },
        completed: false
    },
    {
        id: 'play_10_games',
        name: '꾸준한 플레이어',
        description: '10번 게임 플레이',
        category: 'special',
        icon: '🎮',
        requirement: { type: 'gamesPlayed', count: 10 },
        reward: { type: 'item', itemType: 'remove', count: 1 },
        completed: false
    },
    {
        id: 'play_50_games',
        name: '헌신적인 플레이어',
        description: '50번 게임 플레이',
        category: 'special',
        icon: '🎮',
        requirement: { type: 'gamesPlayed', count: 50 },
        reward: { type: 'story', characterId: 'watermelon', storyId: 'watermelon_3' },
        completed: false
    }
];

// Helper function to check if achievement is completed
export function checkAchievement(achievement, progress) {
    const req = achievement.requirement;

    switch (req.type) {
        case 'merge':
            return (progress.merges[req.fruit] || 0) >= req.count;
        case 'level':
            return (progress.levelClears[req.level] || 0) >= req.count;
        case 'totalScore':
            return (progress.totalScore || 0) >= req.count;
        case 'gamesPlayed':
            return (progress.gamesPlayed || 0) >= req.count;
        default:
            return false;
    }
}

// Get newly completed achievements
export function getNewlyCompletedAchievements(achievements, progress) {
    return achievements.filter(achievement =>
        !progress.completedAchievements.includes(achievement.id) && checkAchievement(achievement, progress)
    );
}

// Get achievements by category
export function getAchievementsByCategory(category) {
    return ACHIEVEMENTS.filter(a => a.category === category);
}
