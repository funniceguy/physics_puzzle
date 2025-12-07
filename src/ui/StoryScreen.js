// Story Screen - displays character stories

import { CHARACTERS, getUnlockedCharacters } from '../data/StoryData.js';

export class StoryScreen {
    constructor(screenManager, progressManager) {
        this.screenManager = screenManager;
        this.progressManager = progressManager;
        this.container = null;
        this.currentCharacter = null;
        this.currentStory = null;
    }

    // Create the story screen HTML
    create() {
        this.container = document.createElement('div');
        this.container.id = 'story-screen';
        this.container.className = 'screen';
        this.container.innerHTML = `
            <div class="story-content">
                <div class="story-header">
                    <button class="btn-back" id="story-back">
                        <span>←</span>
                    </button>
                    <h2 class="story-title">인생의 조각들</h2>
                    <div class="header-spacer"></div>
                </div>

                <div class="character-select" id="character-select">
                    <!-- Characters will be populated here -->
                </div>

                <div class="story-viewer hidden" id="story-viewer">
                    <div class="story-viewer-header">
                        <button class="btn-back-to-chars" id="back-to-chars">
                            <span>←</span>
                        </button>
                        <h3 class="character-name" id="character-name"></h3>
                    </div>
                    <div class="story-list" id="story-list">
                        <!-- Stories will be populated here -->
                    </div>
                </div>

                <div class="story-reader hidden" id="story-reader">
                    <div class="story-reader-header">
                        <button class="btn-close-reader" id="close-reader">
                            <span>×</span>
                        </button>
                    </div>
                    <div class="story-reader-content">
                        <div class="story-character-icon" id="reader-icon"></div>
                        <h3 class="story-reader-title" id="reader-title"></h3>
                        <p class="story-reader-text" id="reader-text"></p>
                    </div>
                </div>

                <nav class="bottom-nav">
                    <button class="nav-btn active" data-screen="story">
                        <span class="nav-icon">📖</span>
                        <span class="nav-label">스토리</span>
                    </button>
                    <button class="nav-btn" data-screen="lobby">
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
        // Back button
        const backBtn = this.container.querySelector('#story-back');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.screenManager.showScreen('lobby');
            });
        }

        // Back to characters
        const backToChars = this.container.querySelector('#back-to-chars');
        if (backToChars) {
            backToChars.addEventListener('click', () => {
                this.showCharacterSelect();
            });
        }

        // Close reader
        const closeReader = this.container.querySelector('#close-reader');
        if (closeReader) {
            closeReader.addEventListener('click', () => {
                this.closeStoryReader();
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

    // Populate character select
    populateCharacters() {
        const progress = this.progressManager.getProgress();
        const unlockedChars = getUnlockedCharacters(progress);
        const charSelect = this.container.querySelector('#character-select');

        if (!charSelect) return;

        charSelect.innerHTML = '';

        CHARACTERS.forEach(char => {
            const isUnlocked = unlockedChars.some(c => c.id === char.id);
            const charCard = document.createElement('div');
            charCard.className = `character-card ${isUnlocked ? '' : 'locked'}`;
            charCard.innerHTML = `
                <div class="char-icon">${isUnlocked ? char.emoji : '🔒'}</div>
                <div class="char-info">
                    <div class="char-name">${isUnlocked ? char.name : '???'}</div>
                    <div class="char-title">${isUnlocked ? char.title : '잠김'}</div>
                </div>
            `;

            if (isUnlocked) {
                charCard.addEventListener('click', () => {
                    this.showCharacterStories(char);
                });
            }

            charSelect.appendChild(charCard);
        });
    }

    // Show character stories
    showCharacterStories(character) {
        this.currentCharacter = character;
        const charSelect = this.container.querySelector('#character-select');
        const storyViewer = this.container.querySelector('#story-viewer');
        const charName = this.container.querySelector('#character-name');
        const storyList = this.container.querySelector('#story-list');

        if (!storyViewer || !storyList) return;

        charSelect.classList.add('hidden');
        storyViewer.classList.remove('hidden');

        charName.textContent = `${character.emoji} ${character.name}`;

        // Populate stories
        storyList.innerHTML = '';
        character.stories.forEach(story => {
            const isUnlocked = this.progressManager.isStoryUnlocked(story.id);
            const storyCard = document.createElement('div');
            storyCard.className = `story-card ${isUnlocked ? '' : 'locked'}`;
            storyCard.innerHTML = `
                <div class="story-card-icon">${isUnlocked ? '📄' : '🔒'}</div>
                <div class="story-card-info">
                    <div class="story-card-title">${isUnlocked ? story.title : '???'}</div>
                    <div class="story-card-preview">${isUnlocked ? story.content.substring(0, 30) + '...' : '잠긴 스토리'}</div>
                </div>
            `;

            if (isUnlocked) {
                storyCard.addEventListener('click', () => {
                    this.openStoryReader(story);
                });
            }

            storyList.appendChild(storyCard);
        });
    }

    // Show character select
    showCharacterSelect() {
        const charSelect = this.container.querySelector('#character-select');
        const storyViewer = this.container.querySelector('#story-viewer');

        if (charSelect && storyViewer) {
            charSelect.classList.remove('hidden');
            storyViewer.classList.add('hidden');
        }
        this.currentCharacter = null;
    }

    // Open story reader
    openStoryReader(story) {
        this.currentStory = story;
        const reader = this.container.querySelector('#story-reader');
        const icon = this.container.querySelector('#reader-icon');
        const title = this.container.querySelector('#reader-title');
        const text = this.container.querySelector('#reader-text');

        if (!reader) return;

        icon.textContent = this.currentCharacter.emoji;
        title.textContent = story.title;
        text.textContent = story.content;

        reader.classList.remove('hidden');
    }

    // Close story reader
    closeStoryReader() {
        const reader = this.container.querySelector('#story-reader');
        if (reader) {
            reader.classList.add('hidden');
        }
        this.currentStory = null;
    }

    // Show the story screen
    async show() {
        if (!this.container) {
            this.create();
        }

        this.populateCharacters();
        this.showCharacterSelect();
        this.container.classList.add('active');

        // Update active nav button
        const navBtns = this.container.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => btn.classList.remove('active'));
        const storyBtn = this.container.querySelector('.nav-btn[data-screen="story"]');
        if (storyBtn) storyBtn.classList.add('active');
    }

    // Hide the story screen
    async hide() {
        if (this.container) {
            this.container.classList.remove('active');
            this.closeStoryReader();
            this.showCharacterSelect();
        }
    }
}
