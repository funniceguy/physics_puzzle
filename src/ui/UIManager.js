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
        const targetX = iconRect.left - gameRect.left + iconRect.width / 2;
        const targetY = iconRect.top - gameRect.top + iconRect.height / 2;

        // Flying stars to score
        for (let i = 0; i < 8; i++) {
            const star = document.createElement('div');
            star.className = 'particle star';
            star.textContent = '⭐';
            star.style.left = (x + (Math.random() * 60 - 30)) + 'px';
            star.style.top = (y + (Math.random() * 60 - 30)) + 'px';

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

        // Explosion particles
        this.spawnExplosionParticles(x, y);
    }

    spawnExplosionParticles(x, y) {
        const particles = ['💥', '✨', '💫', '⭐'];
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle explosion';
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';

            const angle = (Math.PI * 2 * i) / 12;
            const distance = 80 + Math.random() * 40;
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance;

            const animation = particle.animate([
                { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
                { transform: `translate(${endX - x}px, ${endY - y}px) scale(0) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: 600 + Math.random() * 400,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });

            this.effectsContainer.appendChild(particle);
            animation.onfinish = () => particle.remove();
        }
    }

    spawnBounceEffect(x, y) {
        for (let i = 0; i < 3; i++) {
            const puff = document.createElement('div');
            puff.className = 'particle puff';
            puff.textContent = '💨';
            puff.style.left = (x + (Math.random() * 20 - 10)) + 'px';
            puff.style.top = (y + (Math.random() * 20 - 10)) + 'px';

            const animation = puff.animate([
                { transform: 'scale(0.3)', opacity: 0.6 },
                { transform: 'scale(1.5)', opacity: 0 }
            ], {
                duration: 300,
                easing: 'ease-out'
            });

            this.effectsContainer.appendChild(puff);
            animation.onfinish = () => puff.remove();
        }
    }

    spawnItemEffect(x, y, itemType) {
        const effects = {
            remove: '🗑️',
            upgrade: '⬆️',
            vibration: '📳'
        };

        for (let i = 0; i < 10; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'particle sparkle';
            sparkle.textContent = '✨';
            sparkle.style.left = (x + (Math.random() * 80 - 40)) + 'px';
            sparkle.style.top = (y + (Math.random() * 80 - 40)) + 'px';

            const animation = sparkle.animate([
                { transform: 'scale(0) rotate(0deg)', opacity: 1 },
                { transform: `scale(1.5) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: 500 + Math.random() * 300,
                easing: 'ease-out'
            });

            this.effectsContainer.appendChild(sparkle);
            animation.onfinish = () => sparkle.remove();
        }

        // Center icon
        const icon = document.createElement('div');
        icon.className = 'particle item-icon';
        icon.textContent = effects[itemType];
        icon.style.left = x + 'px';
        icon.style.top = y + 'px';

        const iconAnim = icon.animate([
            { transform: 'scale(2)', opacity: 1 },
            { transform: 'scale(0)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        });

        this.effectsContainer.appendChild(icon);
        iconAnim.onfinish = () => icon.remove();
    }

    spawnLevelCompleteEffect() {
        const confetti = ['🎊', '🎉', '✨', '⭐', '🌟'];

        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const piece = document.createElement('div');
                piece.className = 'particle confetti';
                piece.textContent = confetti[Math.floor(Math.random() * confetti.length)];
                piece.style.left = (Math.random() * 100) + '%';
                piece.style.top = '-20px';

                const animation = piece.animate([
                    { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                    { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 720}deg)`, opacity: 0.5 }
                ], {
                    duration: 2000 + Math.random() * 1000,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                });

                document.body.appendChild(piece);
                animation.onfinish = () => piece.remove();
            }, i * 50);
        }
    }

    triggerScoreFlash() {
        this.scoreIcon.classList.remove('flash');
        void this.scoreIcon.offsetWidth; // Trigger reflow
        this.scoreIcon.classList.add('flash');
    }
}
