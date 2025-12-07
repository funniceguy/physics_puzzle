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
            const diff = this.targetScore - this.currentDisplayedScore;
            const increment = Math.ceil(diff / 10);

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
        this.resultButton.onclick = (event) => {
            event.stopPropagation(); // Prevent click from bubbling to game container
            location.reload();
        };
    }

    showMissionComplete(level, score, acquiredItem, onNextLevel) {
        this.resultScreen.style.display = 'flex';
        this.resultTitle.textContent = `LEVEL ${level} CLEARED!`;
        this.resultTitle.style.color = '#00FFFF';

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
        this.resultButton.onclick = (event) => {
            event.stopPropagation(); // Prevent click from bubbling to game container
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
        const iconRect = this.scoreIcon.getBoundingClientRect();
        const gameRect = document.getElementById('game-container').getBoundingClientRect();

        const targetX = iconRect.left - gameRect.left + iconRect.width / 2;
        const targetY = iconRect.top - gameRect.top + iconRect.height / 2;

        // Reduced to 3 stars for performance
        for (let i = 0; i < 3; i++) {
            const star = document.createElement('div');
            star.className = 'particle star';
            star.textContent = '⭐';
            star.style.left = (x + (Math.random() * 40 - 20)) + 'px';
            star.style.top = (y + (Math.random() * 40 - 20)) + 'px';

            const animation = star.animate([
                { transform: 'scale(0.5)', opacity: 1, left: star.style.left, top: star.style.top },
                { transform: 'scale(0.2)', opacity: 0, left: targetX + 'px', top: targetY + 'px' }
            ], {
                duration: 500,
                easing: 'ease-in',
                fill: 'forwards'
            });

            this.effectsContainer.appendChild(star);
            animation.onfinish = () => {
                star.remove();
                if (i === 0) this.triggerScoreFlash();
            };
        }

        // Simplified explosion
        this.spawnExplosionParticles(x, y);
    }

    spawnExplosionParticles(x, y) {
        // Reduced to 6 particles
        const particles = ['💥', '✨'];
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle explosion';
            particle.textContent = particles[i % 2];
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';

            const angle = (Math.PI * 2 * i) / 6;
            const distance = 50;
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance;

            const animation = particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${endX - x}px, ${endY - y}px) scale(0)`, opacity: 0 }
            ], {
                duration: 350,
                easing: 'ease-out'
            });

            this.effectsContainer.appendChild(particle);
            animation.onfinish = () => particle.remove();
        }
    }

    spawnBounceEffect(x, y) {
        // Single puff
        const puff = document.createElement('div');
        puff.className = 'particle puff';
        puff.textContent = '💨';
        puff.style.left = x + 'px';
        puff.style.top = y + 'px';

        const animation = puff.animate([
            { transform: 'scale(0.3)', opacity: 0.5 },
            { transform: 'scale(1)', opacity: 0 }
        ], {
            duration: 200,
            easing: 'ease-out'
        });

        this.effectsContainer.appendChild(puff);
        animation.onfinish = () => puff.remove();
    }

    spawnItemEffect(x, y, itemType) {
        const effects = {
            remove: '🗑️',
            upgrade: '⬆️',
            vibration: '📳'
        };

        // Reduced to 4 sparkles
        for (let i = 0; i < 4; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'particle sparkle';
            sparkle.textContent = '✨';
            sparkle.style.left = (x + (Math.random() * 50 - 25)) + 'px';
            sparkle.style.top = (y + (Math.random() * 50 - 25)) + 'px';

            const animation = sparkle.animate([
                { transform: 'scale(0)', opacity: 1 },
                { transform: 'scale(1)', opacity: 0 }
            ], {
                duration: 350,
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
            { transform: 'scale(1.5)', opacity: 1 },
            { transform: 'scale(0)', opacity: 0 }
        ], {
            duration: 400,
            easing: 'ease-out'
        });

        this.effectsContainer.appendChild(icon);
        iconAnim.onfinish = () => icon.remove();
    }

    spawnLevelCompleteEffect() {
        const confetti = ['🎊', '🎉', '✨', '⭐'];

        // Reduced to 12 confetti
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const piece = document.createElement('div');
                piece.className = 'particle confetti';
                piece.textContent = confetti[Math.floor(Math.random() * confetti.length)];
                piece.style.left = (Math.random() * 100) + '%';
                piece.style.top = '-20px';

                const animation = piece.animate([
                    { transform: 'translateY(0)', opacity: 1 },
                    { transform: `translateY(${window.innerHeight}px)`, opacity: 0.5 }
                ], {
                    duration: 1200,
                    easing: 'ease-in'
                });

                document.body.appendChild(piece);
                animation.onfinish = () => piece.remove();
            }, i * 100);
        }
    }

    triggerScoreFlash() {
        this.scoreIcon.classList.remove('flash');
        void this.scoreIcon.offsetWidth;
        this.scoreIcon.classList.add('flash');
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification show';
        notification.innerHTML = `
            <div class="notif-icon">${achievement.icon}</div>
            <div class="notif-content">
                <div class="notif-title">업적 달성!</div>
                <div class="notif-desc">${achievement.name}</div>
            </div>
        `;

        // Ensure it's on top of everything
        notification.style.zIndex = '2000';
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500); // Wait for transition
        }, 3000);
    }
}
