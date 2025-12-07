// Title Screen - shows game logo and transitions to lobby

export class TitleScreen {
    constructor(screenManager) {
        this.screenManager = screenManager;
        this.container = null;
        this.autoTransitionDelay = 1000; // 1 second
    }

    // Create the title screen HTML
    create() {
        this.container = document.createElement('div');
        this.container.id = 'title-screen';
        this.container.className = 'screen';
        this.container.innerHTML = `
            <div class="title-content">
                <div class="title-logo">
                    <div class="title-icon">🧩</div>
                    <h1 class="title-name">Life Pieces</h1>
                    <p class="title-subtitle">인생의 조각을 모아가는 여정</p>
                </div>
            </div>
        `;
        document.body.appendChild(this.container);
    }

    // Show the title screen
    async show() {
        if (!this.container) {
            this.create();
        }

        this.container.classList.add('active');

        // Auto transition to lobby after delay
        setTimeout(() => {
            this.screenManager.showScreen('lobby');
        }, this.autoTransitionDelay);
    }

    // Hide the title screen
    async hide() {
        if (this.container) {
            this.container.classList.remove('active');
        }
    }
}
