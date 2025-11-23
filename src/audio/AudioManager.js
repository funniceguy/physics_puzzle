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
            this.sfxGain = this.audioContext.createGain();

            // Connect gain nodes (removed BGM)
            this.sfxGain.connect(this.masterGain);
            this.masterGain.connect(this.audioContext.destination);

            // Set initial volumes
            this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
            this.sfxGain.gain.value = 0.6;

            this.isInitialized = true;

            // Resume AudioContext for mobile
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
        } catch (error) {
            console.error('Audio initialization failed:', error);
        }
    }

    async play(soundType) {
        // Auto-initialize if needed
        if (!this.isInitialized) {
            await this.init();
        }

        if (!this.audioContext) return;

        // Always try to resume on mobile
        if (this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
            } catch (e) {
                console.warn('Could not resume audio:', e);
                return;
            }
        }

        const now = this.audioContext.currentTime;

        try {
            switch (soundType) {
                case 'drop':
                    this.playDrop(now);
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
        } catch (error) {
            console.warn('Sound play failed:', error);
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
