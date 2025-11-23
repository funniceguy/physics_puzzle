import { CIRCLES, PHYSICS } from './Constants.js';

export class Circle {
    static create(x, y, level) {
        const circleData = CIRCLES[level];
        const radius = circleData.radius;

        const body = Matter.Bodies.circle(x, y, radius, {
            restitution: PHYSICS.RESTITUTION,
            friction: PHYSICS.FRICTION,
            density: PHYSICS.DENSITY,
            render: {
                sprite: {
                    texture: circleData.img,
                    xScale: (radius * 2) / 72, // Scale 72px image to diameter
                    yScale: (radius * 2) / 72
                }
            },
            label: 'circle'
        });

        // Attach game data to the body
        body.gameData = {
            level: level,
            hasMerged: false
        };

        return body;
    }
}
