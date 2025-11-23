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
        this.render = this.Render.create({
            canvas: canvas,
            engine: this.engine,
            options: {
                width: GAME_WIDTH,
                height: GAME_HEIGHT,
                wireframes: false,
                background: '#2a2a2a'
            }
        });

        this.createBoundaries();
        this.Render.run(this.render);

        // Create runner
        this.runner = this.Runner.create();
        this.Runner.run(this.runner, this.engine);
    }

    createBoundaries() {
        const ground = this.Bodies.rectangle(
            GAME_WIDTH / 2,
            GAME_HEIGHT + WALL_THICKNESS / 2,
            GAME_WIDTH,
            WALL_THICKNESS,
            { isStatic: true, render: { visible: false } }
        );

        const leftWall = this.Bodies.rectangle(
            -WALL_THICKNESS / 2,
            GAME_HEIGHT / 2,
            WALL_THICKNESS,
            GAME_HEIGHT * 2,
            { isStatic: true, render: { visible: false } }
        );

        const rightWall = this.Bodies.rectangle(
            GAME_WIDTH + WALL_THICKNESS / 2,
            GAME_HEIGHT / 2,
            WALL_THICKNESS,
            GAME_HEIGHT * 2,
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
