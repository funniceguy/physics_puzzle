import { CIRCLES, LEVEL_SCORE_THRESHOLDS } from '../game/Constants.js';

export class UIManager {
    constructor() {
        this.scoreElement = document.getElementById('score');
        this.targetScoreElement = document.getElementById('target-score');
        this.levelElement = document.getElementById('level');
        this.nextCircleElement = document.getElementById('next-circle');
        this.scoreIcon = document.getElementById('score-icon');

        this.resultScreen = document.getElementById('result-screen');
        this.resultTitle = document.getElementById('result-title');
        this.resultScore = document.getElementById('result-score');
        this.resultButton = document.getElementById('result-button');

        this.effectsContainer = document.getElementById('effects-container');

        // Item buttons
        this.btnRemove = document.getElementById('btn-remove');
        this.btnUpgrade = document.getElementById('btn-upgrade');
        this.btnVibration = document.getElementById('btn-vibration');

        this.itemButtons = {
            remove: this.btnRemove,
            upgrade: this.btnUpgrade,
            vibration: this.btnVibration
        };

        this.currentDisplayedScore = 0;
        this.targetScore = 0;
        this.scoreAnimationId = null;
    }

    updateScore(score, level) {
        // Start animation
        this.targetScore = score;
        if (!this.scoreAnimationId) {
            this.animateScore();
        }

        const target = LEVEL_SCORE_THRESHOLDS[level] || 'MAX';
        this.targetScoreElement.textContent = target;
    }

    animateScore() {
        if (this.currentDisplayedScore < this.targetScore) {
            // Calculate increment based on difference to make it faster for large gaps
            const diff = this.targetScore - this.currentDisplayedScore;
            const increment = Math.ceil(diff / 10); // Adjust divisor for speed

            this.currentDisplayedScore += increment;
            this.scoreElement.textContent = this.currentDisplayedScore;

            this.scoreAnimationId = requestAnimationFrame(() => this.animateScore());
        } else {
            this.currentDisplayedScore = this.targetScore;
            this.scoreElement.textContent = this.currentDisplayedScore;
            this.scoreAnimationId = null;
        }
    }

    updateLevel(level) {
        this.levelElement.textContent = level;
    }

    updateNextCircle(level) {
        const circleData = CIRCLES[level];
        this.nextCircleElement.innerHTML = '';

        const img = document.createElement('img');
        img.src = circleData.img;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        this.nextCircleElement.appendChild(img);
    }

    showResult(score, isWin) {
        this.resultScreen.style.display = 'flex';
        this.resultTitle.textContent = isWin ? 'MISSION COMPLETE!' : 'GAME OVER';
        this.resultScore.textContent = `Final Score: ${score}`;
        this.resultTitle.style.color = isWin ? '#00FF00' : '#FF0000';

        this.resultButton.textContent = 'Play Again';
        this.resultButton.onclick = () => location.reload();
    }

    showMissionComplete(level, score, acquiredItem, onNextLevel) {
        this.resultScreen.style.display = 'flex';
        this.resultTitle.textContent = `LEVEL ${level} CLEARED!`;
        this.resultTitle.style.color = '#00FFFF';

        // Display acquired item
        const itemIcons = {
            remove: '🗑️',
            upgrade: '⬆️',
            vibration: '📳'
        };
        const itemNames = {
            remove: 'Remove',
            upgrade: 'Upgrade',
            vibration: 'Vibration'
        };

        this.resultScore.innerHTML = `Current Score: ${score}<br><br>🎁 Acquired: ${itemIcons[acquiredItem]} ${itemNames[acquiredItem]}`;

        this.resultButton.textContent = 'Next Level';
        this.resultButton.onclick = () => {
            this.resultScreen.style.display = 'none';
            onNextLevel();
        };
    }

    toggleItemActive(itemType, isActive) {
        Object.values(this.itemButtons).forEach(btn => btn.classList.remove('active'));

        if (isActive && this.itemButtons[itemType]) {
            this.itemButtons[itemType].classList.add('active');
        }
    }

    setupItemListeners(callback) {
        this.btnRemove.onclick = () => callback('remove');
        this.btnUpgrade.onclick = () => callback('upgrade');
        this.btnVibration.onclick = () => callback('vibration');
    }

    updateItemCount(itemType, count) {
        const button = this.itemButtons[itemType];
        if (!button) return;

        let badge = button.querySelector('.item-count');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'item-count';
            button.appendChild(badge);
        }
        badge.textContent = count;

        // Disable button if count is 0
        if (count <= 0) {
            button.classList.add('disabled');
        } else {
            button.classList.remove('disabled');
        }
    }

    updateAllItemCounts(inventory) {
        this.updateItemCount('remove', inventory.remove);
        this.updateItemCount('upgrade', inventory.upgrade);
        this.updateItemCount('vibration', inventory.vibration);
    }

    spawnMergeEffect(x, y, score) {
        // Get target position (score icon)
        const iconRect = this.scoreIcon.getBoundingClientRect();
        const gameRect = document.getElementById('game-container').getBoundingClientRect();

        // Calculate target relative to game container
        // Note: effects container is inside game container
        const targetX = iconRect.left - gameRect.left + iconRect.width / 2;
        const targetY = iconRect.top - gameRect.top + iconRect.height / 2;

        for (let i = 0; i < 5; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.textContent = '⭐';
            star.style.left = (x + (Math.random() * 40 - 20)) + 'px';
            star.style.top = (y + (Math.random() * 40 - 20)) + 'px';

            const animation = star.animate([
                { transform: 'scale(0.5) rotate(0deg)', opacity: 1, left: star.style.left, top: star.style.top },
                { transform: 'scale(0.2) rotate(360deg)', opacity: 0, left: targetX + 'px', top: targetY + 'px' }
            ], {
                duration: 800 + Math.random() * 400,
                easing: 'ease-in',
                fill: 'forwards'
            });

            this.effectsContainer.appendChild(star);

            animation.onfinish = () => {
                star.remove();
                this.triggerScoreFlash();
            };
        }
    }

    triggerScoreFlash() {
        this.scoreIcon.classList.remove('flash');
        void this.scoreIcon.offsetWidth; // Trigger reflow
        this.scoreIcon.classList.add('flash');
    }
}
