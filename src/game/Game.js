import { PhysicsWorld } from './PhysicsWorld.js';
import { Circle } from './Circle.js';
import { CIRCLES, GAME_WIDTH, GAME_HEIGHT, WALL_THICKNESS, MERGE_EXPLOSION_FORCE, PHYSICS, PHYSICS_SCALE, LEVEL_SCORE_THRESHOLDS, TOP_LINE_Y, DROP_COOLDOWN } from './Constants.js';
import { UIManager } from '../ui/UIManager.js';
import { AudioManager } from '../audio/AudioManager.js';

export class Game {
    constructor() {
        this.physics = new PhysicsWorld('world');
        this.ui = new UIManager();
        this.audio = new AudioManager();

        this.score = 0;
        this.level = 1;
        this.nextCircleLevel = 0;
        this.currentCircle = null;
        this.canDrop = true;
        this.isGameOver = false;
        this.isMissionComplete = false;

        this.activeItem = null;
        this.activeVibrations = [];
        this.itemInventory = {
            remove: 3,
            upgrade: 3,
            vibration: 3
        };

        this.setupInput();
        this.setupUI();
        this.setupCollision();
        this.setupGameLoop();
        this.spawnNextCircle();

        this.ui.updateScore(this.score, this.level);
        this.ui.updateAllItemCounts(this.itemInventory);
    }

    setupUI() {
        this.ui.setupItemListeners((itemType) => {
            if (this.activeItem === itemType) {
                this.activeItem = null;
                this.ui.toggleItemActive(itemType, false);
            } else {
                this.activeItem = itemType;
                this.ui.toggleItemActive(itemType, true);
            }
        });
    }

    setupInput() {
        const container = document.getElementById('game-container');

        container.addEventListener('mousemove', (e) => {
            if (this.currentCircle && this.canDrop && !this.isGameOver && !this.isMissionComplete && !this.activeItem) {
                this.updateCurrentCirclePosition(e.clientX);
            }
        });

        container.addEventListener('click', (e) => {
            // Initialize audio on first click
            if (!this.audio.isInitialized) {
                this.audio.init();
            }

            if (this.isGameOver || this.isMissionComplete) return;

            if (this.activeItem) {
                this.handleItemClick(e);
            } else if (this.currentCircle && this.canDrop) {
                this.updateCurrentCirclePosition(e.clientX);
                this.dropCircle();
            }
        });

        // Mobile touch support for audio
        container.addEventListener('touchstart', async () => {
            if (!this.audio.isInitialized) {
                await this.audio.init();
            }
        }, { once: true });
    }

    handleItemClick(e) {
        if (this.itemInventory[this.activeItem] <= 0) {
            this.ui.toggleItemActive(this.activeItem, false);
            this.activeItem = null;
            return;
        }

        const rect = document.getElementById('game-container').getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const bodies = Matter.Query.point(Matter.Composite.allBodies(this.physics.world), { x, y });
        const targetBody = bodies.find(b => b.label === 'circle' && !b.isStatic && !b.isSensor);

        if (targetBody) {
            this.applyItem(targetBody);
            this.itemInventory[this.activeItem]--;
            this.ui.updateItemCount(this.activeItem, this.itemInventory[this.activeItem]);
            this.ui.toggleItemActive(this.activeItem, false);
            this.audio.play('itemUse');
            this.activeItem = null;
        }
    }

    applyItem(body) {
        switch (this.activeItem) {
            case 'remove':
                this.physics.removeBody(body);
                this.ui.spawnItemEffect(body.position.x, body.position.y, 'remove');
                break;
            case 'upgrade':
                if (body.gameData.level < CIRCLES.length - 1) {
                    const newLevel = body.gameData.level + 1;
                    const { x, y } = body.position;
                    this.physics.removeBody(body);
                    const newCircle = Circle.create(x, y, newLevel);
                    this.applyLevelPhysics(newCircle);
                    this.physics.addBody(newCircle);
                    this.ui.spawnItemEffect(x, y, 'upgrade');
                }
                break;
            case 'vibration':
                this.applyVibration(body);
                this.ui.spawnItemEffect(body.position.x, body.position.y, 'vibration');
                break;
        }
    }

    applyVibration(centerBody) {
        this.activeVibrations.push({
            body: centerBody,
            startTime: Date.now(),
            duration: 3000
        });
    }

    createParticles(x, y, char) {
        this.ui.spawnMergeEffect(x, y, 0);
    }

    updateCurrentCirclePosition(clientX) {
        const container = document.getElementById('game-container');
        const rect = container.getBoundingClientRect();
        let x = clientX - rect.left;

        const radius = this.currentCircle.circleRadius;
        const containerWidth = container.clientWidth;
        x = Math.max(radius + WALL_THICKNESS / 2, Math.min(x, containerWidth - radius - WALL_THICKNESS / 2));

        Matter.Body.setPosition(this.currentCircle, { x: x, y: 50 });
    }

    spawnNextCircle() {
        if (this.isGameOver || this.isMissionComplete) return;

        const level = this.nextCircleLevel;
        const container = document.getElementById('game-container');
        const containerWidth = container.clientWidth;
        this.currentCircle = Circle.create(containerWidth / 2, 50, level);
        this.currentCircle.isSensor = true;
        this.currentCircle.isStatic = true;

        this.physics.addBody(this.currentCircle);

        this.nextCircleLevel = Math.floor(Math.random() * 3);
        this.ui.updateNextCircle(this.nextCircleLevel);
        this.canDrop = true;
    }

    dropCircle() {
        this.canDrop = false;
        this.currentCircle.isSensor = false;
        this.currentCircle.isStatic = false;

        this.applyLevelPhysics(this.currentCircle);

        Matter.Body.setVelocity(this.currentCircle, { x: 0, y: 5 });
        this.currentCircle = null;

        this.audio.play('drop');

        setTimeout(() => {
            this.spawnNextCircle();
        }, DROP_COOLDOWN);
    }

    applyLevelPhysics(body) {
        const levelIndex = this.level - 1;
        body.restitution = Math.min(1.2, PHYSICS.RESTITUTION + (levelIndex * PHYSICS_SCALE.RESTITUTION_PER_LEVEL));
        body.friction = Math.max(0.0, PHYSICS.FRICTION + (levelIndex * PHYSICS_SCALE.FRICTION_PER_LEVEL));
    }

    setupCollision() {
        Matter.Events.on(this.physics.engine, 'collisionStart', (event) => {
            const pairs = event.pairs;

            for (let i = 0; i < pairs.length; i++) {
                const bodyA = pairs[i].bodyA;
                const bodyB = pairs[i].bodyB;

                if (bodyA.gameData && bodyB.gameData) {
                    this.handleMerge(bodyA, bodyB);
                }
            }
        });
    }

    handleMerge(bodyA, bodyB) {
        if (bodyA.gameData.level === bodyB.gameData.level &&
            !bodyA.gameData.hasMerged &&
            !bodyB.gameData.hasMerged) {

            bodyA.gameData.hasMerged = true;
            bodyB.gameData.hasMerged = true;

            const newLevel = bodyA.gameData.level + 1;
            const midX = (bodyA.position.x + bodyB.position.x) / 2;
            const midY = (bodyA.position.y + bodyB.position.y) / 2;

            this.physics.removeBody(bodyA);
            this.physics.removeBody(bodyB);

            this.addScore(CIRCLES[bodyA.gameData.level].score * 2);

            this.ui.spawnMergeEffect(midX, midY, CIRCLES[bodyA.gameData.level].score * 2);
            this.audio.play('merge');

            this.applyExplosion(midX, midY, CIRCLES[bodyA.gameData.level].radius, false);

            if (newLevel < CIRCLES.length) {
                const newCircle = Circle.create(midX, midY, newLevel);
                this.applyLevelPhysics(newCircle);
                this.physics.addBody(newCircle);
            } else {
                this.addScore(CIRCLES[bodyA.gameData.level].score * 4);
            }
        }
    }

    applyExplosion(x, y, radius, isItem = false) {
        const bodies = Matter.Composite.allBodies(this.physics.world);
        const levelIndex = this.level - 1;
        const baseForce = MERGE_EXPLOSION_FORCE;

        let scaledForce;
        if (isItem) {
            scaledForce = 0.5;
        } else {
            scaledForce = (baseForce + (levelIndex * PHYSICS_SCALE.EXPLOSION_PER_LEVEL)) * (radius / 20);
        }

        bodies.forEach(body => {
            if (body.isStatic) return;

            const vector = { x: body.position.x - x, y: body.position.y - y };
            const distance = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

            const range = isItem ? 400 : 300;

            if (distance < range && distance > 0) {
                const force = {
                    x: (vector.x / distance) * scaledForce * body.mass,
                    y: (vector.y / distance) * scaledForce * body.mass
                };
                Matter.Body.applyForce(body, body.position, force);
            }
        });
    }

    addScore(points) {
        this.score += points;
        this.ui.updateScore(this.score, this.level);
        this.audio.play('score');

        const nextLevelThreshold = LEVEL_SCORE_THRESHOLDS[this.level];
        if (this.score >= nextLevelThreshold && !this.isMissionComplete) {
            this.missionComplete();
        }
    }

    missionComplete() {
        this.isMissionComplete = true;

        // Reward a random item and get which one
        const acquiredItem = this.rewardRandomItem();

        this.ui.spawnLevelCompleteEffect();
        this.audio.play('levelComplete');

        this.ui.showMissionComplete(this.level, this.score, acquiredItem, () => {
            this.nextLevel();
        });
    }

    rewardRandomItem() {
        const items = ['remove', 'upgrade', 'vibration'];
        const randomItem = items[Math.floor(Math.random() * items.length)];
        this.itemInventory[randomItem]++;
        this.ui.updateItemCount(randomItem, this.itemInventory[randomItem]);
        return randomItem;
    }

    nextLevel() {
        this.level++;
        this.ui.updateLevel(this.level);
        this.ui.updateScore(this.score, this.level);
        this.isMissionComplete = false;
        this.isGameOver = false;

        if (this.currentCircle) {
            this.physics.removeBody(this.currentCircle);
            this.currentCircle = null;
        }

        // Add 1-second delay before allowing fruit drops
        this.canDrop = false;
        setTimeout(() => {
            if (!this.isGameOver) {
                this.spawnNextCircle();
            }
        }, 1000);
    }

    setupGameLoop() {
        Matter.Events.on(this.physics.engine, 'afterUpdate', () => {
            if (this.isGameOver) return;

            const bodies = Matter.Composite.allBodies(this.physics.world);

            // Process Vibrations
            const now = Date.now();
            this.activeVibrations = this.activeVibrations.filter(vib => {
                if (now - vib.startTime > vib.duration) {
                    if (vib.body && vib.body.isStatic) {
                        Matter.Body.setStatic(vib.body, false);
                    }
                    return false;
                }

                if (vib.body && !vib.body.isStatic) {
                    Matter.Body.setStatic(vib.body, true);
                }

                if (vib.body) {
                    Matter.Body.setAngularVelocity(vib.body, 0.15);
                }

                bodies.forEach(body => {
                    if (body.isStatic || body.isSensor || body === vib.body) return;

                    const dx = body.position.x - vib.body.position.x;
                    const dy = body.position.y - vib.body.position.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 250) {
                        const forceMagnitude = 0.003 * body.mass;
                        Matter.Body.applyForce(body, body.position, {
                            x: (Math.random() - 0.5) * forceMagnitude,
                            y: (Math.random() - 0.5) * forceMagnitude
                        });
                    }
                });

                return true;
            });

            // Check game over condition - fruits above deadline
            for (const body of bodies) {
                if (body.isStatic || body.isSensor) continue;

                // Game over if fruit is above the line
                if (body.position.y < TOP_LINE_Y) {
                    // Give a small grace period for bouncing (500ms)
                    if (!body.gameData.deadlineWarningTime) {
                        body.gameData.deadlineWarningTime = Date.now();
                    } else if (Date.now() - body.gameData.deadlineWarningTime > 500) {
                        // If fruit stays above line for 500ms, trigger slow motion game over
                        this.triggerSlowMotionGameOver();
                        break;
                    }
                } else {
                    // Reset warning if fruit goes back below line
                    body.gameData.deadlineWarningTime = null;
                }
            }
        });
    }

    triggerSlowMotionGameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;

        // Slow down physics engine
        const originalTimeScale = this.physics.engine.timing.timeScale;
        let currentTimeScale = originalTimeScale;
        const slowDownDuration = 800; // 0.8 seconds to slow down
        const slowMotionDuration = 600; // 0.6 seconds at slow speed
        const speedUpDuration = 400; // 0.4 seconds to speed back up
        const minTimeScale = 0.2; // Slow to 20% speed

        const startTime = Date.now();

        const slowMotionEffect = () => {
            const elapsed = Date.now() - startTime;

            if (elapsed < slowDownDuration) {
                // Slow down phase
                const progress = elapsed / slowDownDuration;
                currentTimeScale = originalTimeScale - (originalTimeScale - minTimeScale) * progress;
                this.physics.engine.timing.timeScale = currentTimeScale;
                requestAnimationFrame(slowMotionEffect);
            } else if (elapsed < slowDownDuration + slowMotionDuration) {
                // Stay at slow motion
                this.physics.engine.timing.timeScale = minTimeScale;
                requestAnimationFrame(slowMotionEffect);
            } else if (elapsed < slowDownDuration + slowMotionDuration + speedUpDuration) {
                // Speed back up phase
                const speedUpElapsed = elapsed - (slowDownDuration + slowMotionDuration);
                const progress = speedUpElapsed / speedUpDuration;
                currentTimeScale = minTimeScale + (originalTimeScale - minTimeScale) * progress;
                this.physics.engine.timing.timeScale = currentTimeScale;
                requestAnimationFrame(slowMotionEffect);
            } else {
                // Reset to normal speed and show game over
                this.physics.engine.timing.timeScale = originalTimeScale;
                this.gameOver();
            }
        };

        slowMotionEffect();
    }

    gameOver() {
        if (this.isGameOver) return; // Prevent double trigger
        this.isMissionComplete = false;
        this.audio.play('gameOver');
        this.ui.showResult(this.score, false);
    }
}
