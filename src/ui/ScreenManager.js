// Screen Manager - handles navigation between different screens

export class ScreenManager {
    constructor() {
        this.screens = {
            title: null,
            lobby: null,
            game: null,
            story: null,
            achievement: null
        };
        this.currentScreen = null;
        this.previousScreen = null;
    }

    // Register a screen
    registerScreen(name, screen) {
        this.screens[name] = screen;
    }

    // Show a screen
    async showScreen(name, data = {}) {
        // Hide current screen
        if (this.currentScreen && this.screens[this.currentScreen]) {
            await this.screens[this.currentScreen].hide();
        }

        // Update screen history
        this.previousScreen = this.currentScreen;
        this.currentScreen = name;

        // Show new screen
        if (this.screens[name]) {
            await this.screens[name].show(data);
        } else {
            console.error(`Screen '${name}' not found`);
        }
    }

    // Go back to previous screen
    goBack() {
        if (this.previousScreen) {
            this.showScreen(this.previousScreen);
        } else {
            this.showScreen('lobby');
        }
    }

    // Get current screen name
    getCurrentScreen() {
        return this.currentScreen;
    }

    // Check if a screen is currently shown
    isScreenActive(name) {
        return this.currentScreen === name;
    }
}
