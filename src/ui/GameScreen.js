// Game Screen - wraps the main game
import { Game } from '../game/Game.js';

export class GameScreen {
    constructor(screenManager, progressManager) {
        this.screenManager = screenManager;
        this.progressManager = progressManager;
        this.game = null;
        this.container = document.getElementById('game-container');
        this.uiLayer = document.getElementById('ui-layer');
        this.itemBar = document.getElementById('item-bar');

        // Setup home button
        const homeBtn = document.getElementById('btn-home');
        if (homeBtn) {
            console.log('Home button found, attaching listener');
            homeBtn.addEventListener('click', (e) => {
                console.log('Home button clicked');
                e.stopPropagation();
                this.showConfirmDialog();
            });
        } else {
            console.error('Home button not found!');
        }
    }

    showConfirmDialog() {
        // Create confirmation dialog
        const dialog = document.createElement('div');
        dialog.id = 'home-confirm-dialog';
        dialog.innerHTML = `
            <div class="confirm-overlay">
                <div class="confirm-box">
                    <div class="confirm-title">게임 종료</div>
                    <div class="confirm-message">로비로 돌아가시겠습니까?</div>
                    <div class="confirm-buttons">
                        <button class="confirm-btn confirm-yes">확인</button>
                        <button class="confirm-btn confirm-no">취소</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);

        // Handle button clicks
        const yesBtn = dialog.querySelector('.confirm-yes');
        const noBtn = dialog.querySelector('.confirm-no');

        yesBtn.addEventListener('click', () => {
            dialog.remove();
            this.hide();
            this.screenManager.showScreen('lobby');
            this.game = null;
        });

        noBtn.addEventListener('click', () => {
            dialog.remove();
        });
    }

    // Initialize the game
    init() {
        if (!this.game) {
            this.game = new Game(this.progressManager);
        }
    }

    // Show the game screen
    async show() {
        if (!this.game) {
            this.init();
        }

        this.container.style.display = 'block';
        this.uiLayer.style.display = 'flex';
        this.itemBar.style.display = 'flex';

        // Resume game if needed
        if (this.game && this.game.physics && this.game.physics.engine) {
            this.game.physics.engine.enabled = true;
        }
    }

    // Hide the game screen
    async hide() {
        this.container.style.display = 'none';
        this.uiLayer.style.display = 'none';
        this.itemBar.style.display = 'none';

        // Pause game to save resources
        if (this.game && this.game.physics && this.game.physics.engine) {
            this.game.physics.engine.enabled = false;
        }
    }
}
