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
        let walls = [];
        walls.push(this.scene.add.rectangle(0, 20, 40, 10, 0x654321).setOrigin(0.5));
        walls.push(this.scene.add.rectangle(15, 0, 10, 30, 0x654321).setOrigin(0.5));
        walls.push(this.scene.add.rectangle(-15, 0, 10, 30, 0x654321).setOrigin(0.5));

        this.add(walls);

        let floor = Phaser.Physics.Matter.Matter.Bodies.rectangle(walls[0].x + this.x, walls[0].y + this.y, walls[0].width, walls[0].height, {label: 'floor'});
        let rightWall = Phaser.Physics.Matter.Matter.Bodies.rectangle(walls[1].x + this.x, walls[1].y + this.y, walls[1].width, walls[1].height);
        let leftWall = Phaser.Physics.Matter.Matter.Bodies.rectangle(walls[2].x + this.x, walls[2].y + this.y, walls[2].width, walls[2].height);
        
        let compundBody = Phaser.Physics.Matter.Matter.Body.create({
            parts: [floor, rightWall, leftWall],
            isStatic: true
        })

        this.scene.matter.add.gameObject(this, compundBody);

        console.log(this.body.parts);

        console.log(this.body.parts[1]);
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