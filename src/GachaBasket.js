import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";

const MIN_X = 290;
const MAX_X = 510;

export default class GachaBasket extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        scene.add.existing(this);

        this.createShape();

        this.pointer = this.scene.input.activePointer;

        this.scene.matter.world.on('collisionstart', (event) => {
            event.pairs.forEach((pair) => {
                if (pair.bodyA.label == 'floor') {
                    this.ballCaught(pair.bodyB.gameObject);
                }
                else if (pair.bodyB.label == 'floor') {
                    this.ballCaught(pair.bodyA.gameObject);
                }
            })
        });

        this.enabled = false;
    }
    createShape() {
        const floorValues = {x: 0, y: 10, w: 40, h: 10};
        const leftWallValues = {x: -15, y: -10, w: 10, h: 30};
        const rightWallValues = {x: 15, y: -10, w: 10, h: 30};


        let walls = [];
        walls.push(this.scene.add.rectangle(floorValues.x, floorValues.y, floorValues.w, floorValues.h, 0x654321));
        walls.push(this.scene.add.rectangle(rightWallValues.x, rightWallValues.y, rightWallValues.w, rightWallValues.h, 0x654321));
        walls.push(this.scene.add.rectangle(leftWallValues.x, leftWallValues.y, leftWallValues.w, leftWallValues.h, 0x654321));

        this.add(walls);

        // Posiciones en coordenadas globales
        let floor = Phaser.Physics.Matter.Matter.Bodies.rectangle(floorValues.x + this.x, floorValues.y + this.y, floorValues.w, floorValues.h, {label: 'floor'});
        let rightWall = Phaser.Physics.Matter.Matter.Bodies.rectangle(rightWallValues.x + this.x, rightWallValues.y + this.y, rightWallValues.w, rightWallValues.h);
        let leftWall = Phaser.Physics.Matter.Matter.Bodies.rectangle(leftWallValues.x + this.x, leftWallValues.y + this.y, leftWallValues.w, leftWallValues.h);

        let compundBody = Phaser.Physics.Matter.Matter.Body.create({
            parts: [floor, rightWall, leftWall],
            isStatic: true
        })

        this.scene.matter.add.gameObject(this, compundBody);
    }
    ballCaught(ball) {
        EventBus.emit(events.BALL_CAUGHT, ball);
    }
    preUpdate(t, dt) {
        if (this.enabled) {
            this.x = Phaser.Math.Clamp(this.pointer.position.x, MIN_X, MAX_X);
        }
    }
    setEnabled(enabled) {
        this.enabled = enabled;
    }
}