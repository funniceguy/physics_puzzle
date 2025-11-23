import { Game } from './game/Game.js';

// Set CSS variable for mobile viewport height
function setAppHeight() {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
}

window.addEventListener('resize', setAppHeight);
window.addEventListener('orientationchange', setAppHeight);
setAppHeight();

window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();

    // Audio controls
    const muteBtn = document.getElementById('mute-btn');
    const volumeSlider = document.getElementById('volume-slider');

    muteBtn.addEventListener('click', () => {
        const isMuted = game.audio.toggleMute();
        muteBtn.textContent = isMuted ? '🔇' : '🔊';
    });

    volumeSlider.addEventListener('input', (e) => {
        game.audio.setVolume(e.target.value / 100);
    });

    // Set initial mute button state
    if (game.audio.isMuted) {
        muteBtn.textContent = '🔇';
    }
});
