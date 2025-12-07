// Lobby Screen - main menu with navigation

export class LobbyScreen {
    constructor(screenManager, progressManager) {
        this.screenManager = screenManager;
        this.progressManager = progressManager;
        this.container = null;
    }

    // Create the lobby screen HTML
    create() {
        const progress = this.progressManager.getProgress();

        this.container = document.createElement('div');
        this.container.id = 'lobby-screen';
        this.container.className = 'screen';
        this.container.innerHTML = `
            <div class="lobby-content">
                <div class="lobby-header">
                    <div class="lobby-logo">
                        <div class="lobby-icon">🧩</div>
                        <h1 class="lobby-title">Life Pieces</h1>
                    </div>
                    <div class="lobby-stats">
                        <div class="stat-item">
                            <span class="stat-icon">🏆</span>
                            <span class="stat-value">${progress.claimedAchievements.length}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">📖</span>
                            <span class="stat-value">${progress.unlockedStories.length}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">⭐</span>
                            <span class="stat-value">Lv.${progress.highestLevel}</span>
                        </div>
                    </div>
                </div>

                <div class="lobby-main">
                    <button class="btn-play" id="btn-start-game">
                        <span class="btn-play-icon">▶</span>
                        <span class="btn-play-text">게임 시작</span>
                    </button>
                    <div class="lobby-info">
                        <p class="info-text">과일을 합쳐 인생의 조각을 모아보세요</p>
                    </div>
                </div>

                <nav class="bottom-nav">
                    <button class="nav-btn" data-screen="story">
                        <span class="nav-icon">📖</span>
                        <span class="nav-label">스토리</span>
                    </button>
                    <button class="nav-btn nav-btn-home active">
                        <span class="nav-icon">🏠</span>
                        <span class="nav-label">홈</span>
                    </button>
                    <button class="nav-btn" data-screen="achievement">
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
        // Start game button
        const startBtn = this.container.querySelector('#btn-start-game');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.screenManager.showScreen('game');
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

    // Update lobby stats
    updateStats() {
        const progress = this.progressManager.getProgress();
        const achievementCount = this.container.querySelector('.stat-item:nth-child(1) .stat-value');
        const storyCount = this.container.querySelector('.stat-item:nth-child(2) .stat-value');
        const levelValue = this.container.querySelector('.stat-item:nth-child(3) .stat-value');

        if (achievementCount) achievementCount.textContent = progress.claimedAchievements.length;
        if (storyCount) storyCount.textContent = progress.unlockedStories.length;
        if (levelValue) levelValue.textContent = `Lv.${progress.highestLevel}`;
    }

    // Show the lobby screen
    async show() {
        if (!this.container) {
            this.create();
        }

        this.updateStats();
        this.container.classList.add('active');

        // Update active nav button
        const navBtns = this.container.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => btn.classList.remove('active'));
        const homeBtn = this.container.querySelector('.nav-btn-home');
        if (homeBtn) homeBtn.classList.add('active');
    }

    // Hide the lobby screen
    async hide() {
        if (this.container) {
            this.container.classList.remove('active');
        }
    }
}
