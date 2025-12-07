// Achievement Screen - displays achievements
import { ACHIEVEMENTS, checkAchievement } from '../data/AchievementData.js';

export class AchievementScreen {
    constructor(screenManager, progressManager) {
        this.screenManager = screenManager;
        this.progressManager = progressManager;
        this.container = null;
    }

    // Create the achievement screen HTML
    create() {
        this.container = document.createElement('div');
        this.container.id = 'achievement-screen';
        this.container.className = 'screen';
        this.container.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-header">
                    <button class="btn-back" id="achievement-back">
                        <span>←</span>
                    </button>
                    <h2 class="achievement-title">업적</h2>
                    <div class="header-spacer"></div>
                </div>

                <div class="achievement-list" id="achievement-list">
                    <!-- Achievements will be populated here -->
                </div>

                <nav class="bottom-nav">
                    <button class="nav-btn" data-screen="story">
                        <span class="nav-icon">📖</span>
                        <span class="nav-label">스토리</span>
                    </button>
                    <button class="nav-btn" data-screen="lobby">
                        <span class="nav-icon">🏠</span>
                        <span class="nav-label">홈</span>
                    </button>
                    <button class="nav-btn active" data-screen="achievement">
                        <span class="nav-icon">🏆</span>
                        <span class="nav-label">업적</span>
                    </button>
                </nav>
            </div>
        `;
        document.body.appendChild(this.container);
        this.setupEventListeners();
    }

    // Setup event listeners
    setupEventListeners() {
        // Back button
        const backBtn = this.container.querySelector('#achievement-back');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.screenManager.showScreen('lobby');
            });
        }

        // Navigation buttons
        const navBtns = this.container.querySelectorAll('.nav-btn[data-screen]');
        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const screen = btn.getAttribute('data-screen');
                this.screenManager.showScreen(screen);
            });
        });
    }

    // Populate achievement list
    populateAchievements() {
        const list = this.container.querySelector('#achievement-list');
        if (!list) return;

        list.innerHTML = '';
        const progress = this.progressManager.getProgress();

        ACHIEVEMENTS.forEach(achievement => {
            const isClaimed = this.progressManager.isAchievementClaimed(achievement.id);
            const isCompleted = checkAchievement(achievement, progress);

            const item = document.createElement('div');
            // Add 'claimed' class if claimed, 'unlocked' if completed but not claimed
            let statusClass = '';
            if (isClaimed) statusClass = 'claimed';
            else if (isCompleted) statusClass = 'unlocked';

            item.className = `achievement-item ${statusClass}`;

            const iconDisplay = achievement.icon;

            let statusHtml = '';
            if (isClaimed) {
                statusHtml = '<div class="achievement-status">✅</div>';
            } else if (isCompleted) {
                statusHtml = `<button class="btn-claim" data-id="${achievement.id}">보상 받기</button>`;
            } else {
                // Show progress if applicable? For now just lock
                statusHtml = '<div class="achievement-status">🔒</div>';
            }

            item.innerHTML = `
                <div class="achievement-icon">${iconDisplay}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                </div>
                ${statusHtml}
            `;

            // Add click listener for claim button
            const claimBtn = item.querySelector('.btn-claim');
            if (claimBtn) {
                claimBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent item click if any
                    this.handleClaim(achievement);
                });
            }

            list.appendChild(item);
        });
    }

    // Handle claiming an achievement
    handleClaim(achievement) {
        if (this.progressManager.claimAchievement(achievement.id, achievement.reward)) {
            // Show notification
            this.showNotification(achievement);
            // Refresh list
            this.populateAchievements();
        }
    }

    // Show notification
    showNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';

        let rewardText = '';
        if (achievement.reward.type === 'item') {
            const itemNames = { 'remove': '제거 아이템', 'upgrade': '업그레이드 아이템', 'vibration': '진동 아이템' };
            rewardText = `${itemNames[achievement.reward.itemType]} x${achievement.reward.count}`;
        } else if (achievement.reward.type === 'story') {
            rewardText = '새로운 스토리 잠금 해제!';
        }

        notification.innerHTML = `
            <div class="notif-icon">🎉</div>
            <div class="notif-content">
                <div class="notif-title">업적 달성!</div>
                <div class="notif-desc">${achievement.name}</div>
                <div class="notif-reward">${rewardText}</div>
            </div>
        `;

        this.container.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Show the achievement screen
    async show() {
        if (!this.container) {
            this.create();
        }

        this.populateAchievements();
        this.container.classList.add('active');

        // Update active nav button
        const navBtns = this.container.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => btn.classList.remove('active'));
        const achievementBtn = this.container.querySelector('.nav-btn[data-screen="achievement"]');
        if (achievementBtn) achievementBtn.classList.add('active');
    }

    // Hide the achievement screen
    async hide() {
        if (this.container) {
            this.container.classList.remove('active');
        }
    }
}
