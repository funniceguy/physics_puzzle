import { GAME_WIDTH, GAME_HEIGHT, WALL_THICKNESS } from './Constants.js';

export class PhysicsWorld {
    constructor(elementId) {
        this.Engine = Matter.Engine;
        this.Render = Matter.Render;
        this.Runner = Matter.Runner;
        this.Composite = Matter.Composite;
        this.Bodies = Matter.Bodies;
        this.Events = Matter.Events;

        this.engine = this.Engine.create();
        this.world = this.engine.world;

        const canvas = document.getElementById(elementId);
        const container = canvas.parentElement;

        // Get actual container dimensions
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        this.render = this.Render.create({
            canvas: canvas,
            engine: this.engine,
            options: {
                width: containerWidth,
                height: containerHeight,
                wireframes: false,
                background: '#2a2a2a'
            }
        });

        // Store dimensions for boundary creation
        this.gameWidth = containerWidth;
        this.gameHeight = containerHeight;

        this.createBoundaries();
        this.Render.run(this.render);

        // Use default runner for proper physics (fixed timestep was causing issues)
        this.runner = this.Runner.create();
        this.Runner.run(this.runner, this.engine);
    }

    createBoundaries() {
        const ground = this.Bodies.rectangle(
            this.gameWidth / 2,
            this.gameHeight + WALL_THICKNESS / 2,
            this.gameWidth,
            WALL_THICKNESS,
            { isStatic: true, render: { visible: false } }
        );

        const leftWall = this.Bodies.rectangle(
            -WALL_THICKNESS / 2,
            this.gameHeight / 2,
            WALL_THICKNESS,
            this.gameHeight * 2,
            { isStatic: true, render: { visible: false } }
        );

        const rightWall = this.Bodies.rectangle(
            this.gameWidth + WALL_THICKNESS / 2,
            this.gameHeight / 2,
            WALL_THICKNESS,
            this.gameHeight * 2,
            { isStatic: true, render: { visible: false } }
        );

        this.Composite.add(this.world, [ground, leftWall, rightWall]);
    }

    addBody(body) {
        this.Composite.add(this.world, body);
    }

    removeBody(body) {
        this.Composite.remove(this.world, body);
    }
}
