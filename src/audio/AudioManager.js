export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.bgmGain = null;
        this.sfxGain = null;
        this.isMuted = false;
        this.volume = 0.7;
        this.bgmSource = null;
        this.isInitialized = false;

        // Load settings from localStorage
        this.loadSettings();
    }

    async init() {
        if (this.isInitialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create gain nodes
            this.masterGain = this.audioContext.createGain();
            this.bgmGain = this.audioContext.createGain();
            this.sfxGain = this.audioContext.createGain();

            // Connect gain nodes
            this.bgmGain.connect(this.masterGain);
            this.sfxGain.connect(this.masterGain);
            this.masterGain.connect(this.audioContext.destination);

            // Set initial volumes
            this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
            this.bgmGain.gain.value = 0.3;
            this.sfxGain.gain.value = 0.5;

            this.isInitialized = true;

            // Start BGM
            this.playBGM();
        } catch (error) {
            console.warn('Audio initialization failed:', error);
        }
    }

    playBGM() {
        if (!this.isInitialized || this.bgmSource) return;

        const playLoop = () => {
            if (!this.isInitialized) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.bgmGain);

            // Ambient background music (soft, calming)
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(330, this.audioContext.currentTime + 4);
            oscillator.frequency.exponentialRampToValueAtTime(220, this.audioContext.currentTime + 8);

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.5);
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime + 7.5);
            gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 8);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 8);

            oscillator.onended = () => {
                setTimeout(playLoop, 100);
            };

            this.bgmSource = oscillator;
        };

        playLoop();
    }

    play(soundType) {
        if (!this.isInitialized) {
            this.init();
            return;
        }

        const now = this.audioContext.currentTime;

        switch (soundType) {
            case 'drop':
                this.playDrop(now);
                break;
            case 'bounce':
                this.playBounce(now);
                break;
            case 'merge':
                this.playMerge(now);
                break;
            case 'score':
                this.playScore(now);
                break;
            case 'itemUse':
                this.playItemUse(now);
                break;
            case 'levelComplete':
                this.playLevelComplete(now);
                break;
            case 'gameOver':
                this.playGameOver(now);
                break;
        }
    }

    playDrop(now) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    playBounce(now) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'square';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    playMerge(now) {
        // Magical chime sound
        [0, 0.1, 0.2].forEach((delay, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.type = 'sine';
            const freq = [523.25, 659.25, 783.99][i]; // C, E, G
            osc.frequency.setValueAtTime(freq, now + delay);

            gain.gain.setValueAtTime(0.3, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.5);

            osc.start(now + delay);
            osc.stop(now + delay + 0.5);
        });
    }

    playScore(now) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    playItemUse(now) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.2);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    playLevelComplete(now) {
        // Fanfare
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
        notes.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.15);

            gain.gain.setValueAtTime(0.3, now + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.3);

            osc.start(now + i * 0.15);
            osc.stop(now + i * 0.15 + 0.3);
        });
    }

    playGameOver(now) {
        // Descending tone
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.8);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.setValueAtTime(0.3, now + 0.7);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

        osc.start(now);
        osc.stop(now + 0.8);
    }

    setVolume(value) {
        this.volume = value;
        if (this.masterGain && !this.isMuted) {
            this.masterGain.gain.value = value;
        }
        this.saveSettings();
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
        }
        this.saveSettings();
        return this.isMuted;
    }

    saveSettings() {
        localStorage.setItem('gameAudioSettings', JSON.stringify({
            volume: this.volume,
            isMuted: this.isMuted
        }));
    }

    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('gameAudioSettings'));
            if (settings) {
                this.volume = settings.volume ?? 0.7;
                this.isMuted = settings.isMuted ?? false;
            }
        } catch (e) {
            // Use defaults
        }
    }
}
