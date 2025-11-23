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
});
