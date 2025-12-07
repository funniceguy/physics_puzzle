// Progress Manager - handles saving and loading game progress using LocalStorage

export class ProgressManager {
    constructor() {
        this.storageKey = 'lifepieces_progress';
        this.progress = this.load();
    }

    // Get default progress structure
    getDefaultProgress() {
        return {
            // Merge counts for each fruit level (0-10)
            merges: {
                0: 0, 1: 0, 2: 0, 3: 0, 4: 0,
                5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0
            },
            // Level clear counts
            levelClears: {
                1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
                6: 0, 7: 0, 8: 0, 9: 0
            },
            // Unlocked stories
            unlockedStories: ['cherry_1'], // Cherry's first story is always unlocked
            // Total statistics
            totalScore: 0,
            gamesPlayed: 0,
            highestLevel: 1,
            // Item inventory
            inventory: {
                remove: 3,
                upgrade: 3,
                vibration: 3
            },
            // Claimed achievements (rewards collected)
            claimedAchievements: [],
            // Completed achievements (criteria met, notification shown)
            completedAchievements: [],
            // First time flags
            firstTimeTitleScreen: true,
            firstTimeLobby: true,
            firstTimeStory: true,
            firstTimeAchievement: true
        };
    }

    // Load progress from LocalStorage
    load() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const loaded = JSON.parse(saved);
                // Migration: Ensure both arrays exist
                if (!loaded.completedAchievements) {
                    loaded.completedAchievements = loaded.claimedAchievements ? [...loaded.claimedAchievements] : [];
                }
                if (!loaded.claimedAchievements) {
                    loaded.claimedAchievements = [];
                }
                // Merge with default to ensure all fields exist
                return { ...this.getDefaultProgress(), ...loaded };
            }
        } catch (error) {
            console.error('Failed to load progress:', error);
        }
        return this.getDefaultProgress();
    }

    // Save progress to LocalStorage
    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
            return true;
        } catch (error) {
            console.error('Failed to save progress:', error);
            return false;
        }
    }

    // Record a merge
    recordMerge(fruitLevel) {
        if (fruitLevel >= 0 && fruitLevel <= 10) {
            this.progress.merges[fruitLevel] = (this.progress.merges[fruitLevel] || 0) + 1;
            this.save();
        }
    }

    // Record level clear
    recordLevelClear(level) {
        if (level >= 1 && level <= 9) {
            this.progress.levelClears[level] = (this.progress.levelClears[level] || 0) + 1;
            if (level > this.progress.highestLevel) {
                this.progress.highestLevel = level;
            }
            this.save();
        }
    }

    // Mark achievement as completed (criteria met)
    completeAchievement(achievementId) {
        if (!this.progress.completedAchievements.includes(achievementId)) {
            this.progress.completedAchievements.push(achievementId);
            this.save();
            return true; // Newly completed
        }
        return false; // Already completed
    }

    // Add score to total
    addScore(score) {
        this.progress.totalScore += score;
        this.save();
    }

    // Increment games played
    incrementGamesPlayed() {
        this.progress.gamesPlayed++;
        this.save();
    }

    // Unlock a story
    unlockStory(storyId) {
        if (!this.progress.unlockedStories.includes(storyId)) {
            this.progress.unlockedStories.push(storyId);
            this.save();
            return true;
        }
        return false;
    }

    // Check if story is unlocked
    isStoryUnlocked(storyId) {
        return this.progress.unlockedStories.includes(storyId);
    }

    // Claim an achievement and grant reward
    claimAchievement(achievementId, reward) {
        if (!this.progress.claimedAchievements.includes(achievementId)) {
            this.progress.claimedAchievements.push(achievementId);

            // Grant reward
            if (reward) {
                if (reward.type === 'item') {
                    this.addItems(reward.itemType, reward.count);
                } else if (reward.type === 'story') {
                    this.unlockStory(reward.storyId);
                }
            }

            this.save();
            return true;
        }
        return false;
    }

    // Check if achievement is claimed
    isAchievementClaimed(achievementId) {
        return this.progress.claimedAchievements.includes(achievementId);
    }

    // Update inventory
    updateInventory(itemType, count) {
        this.progress.inventory[itemType] = count;
        this.save();
    }

    // Add items to inventory
    addItems(itemType, count) {
        this.progress.inventory[itemType] = (this.progress.inventory[itemType] || 0) + count;
        this.save();
    }

    // Get current progress
    getProgress() {
        return this.progress;
    }

    // Get inventory
    getInventory() {
        return this.progress.inventory;
    }

    // Mark first time flag as seen
    markFirstTimeSeen(flag) {
        if (this.progress[`firstTime${flag}`] !== undefined) {
            this.progress[`firstTime${flag}`] = false;
            this.save();
        }
    }

    // Reset all progress (for testing or user request)
    reset() {
        this.progress = this.getDefaultProgress();
        this.save();
    }

    // Export progress as JSON string
    export() {
        return JSON.stringify(this.progress, null, 2);
    }

    // Import progress from JSON string
    import(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            this.progress = { ...this.getDefaultProgress(), ...imported };
            this.save();
            return true;
        } catch (error) {
            console.error('Failed to import progress:', error);
            return false;
        }
    }
}
