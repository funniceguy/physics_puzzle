import { ScreenManager } from './ui/ScreenManager.js';
import { ProgressManager } from './managers/ProgressManager.js';

import { LobbyScreen } from './ui/LobbyScreen.js';
import { StoryScreen } from './ui/StoryScreen.js';
import { AchievementScreen } from './ui/AchievementScreen.js';
import { GameScreen } from './ui/GameScreen.js';

// Set CSS variable for mobile viewport height
function setAppHeight() {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
}

window.addEventListener('resize', () => {
    setAppHeight();
});
window.addEventListener('orientationchange', () => {
    setAppHeight();
});
setAppHeight();

window.addEventListener('DOMContentLoaded', () => {
    const screenManager = new ScreenManager();
    const progressManager = new ProgressManager();

    // Expose for debugging
    window.screenManager = screenManager;
    window.progressManager = progressManager;

    // Create and register screens

    const lobbyScreen = new LobbyScreen(screenManager, progressManager);
    const storyScreen = new StoryScreen(screenManager, progressManager);
    const achievementScreen = new AchievementScreen(screenManager, progressManager);
    const gameScreen = new GameScreen(screenManager, progressManager);


    screenManager.registerScreen('lobby', lobbyScreen);
    screenManager.registerScreen('story', storyScreen);
    screenManager.registerScreen('achievement', achievementScreen);
    screenManager.registerScreen('game', gameScreen);

    // Start with title screen
    screenManager.showScreen('lobby');
});
