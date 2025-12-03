export default class GachaBall extends Phaser.GameObjects.Ellipse {
    constructor(scene, x, y, radius, color) {
        super(scene, x, y, radius*2, radius*2, color, 1);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCircle(radius);
        this.body.setBounce(0.5);
        this.body.setCollideWorldBounds(true);

        this.body.setMaxVelocity(300, 300);

        this.body.setVelocity(Phaser.Math.Between(-300, 300), Phaser.Math.Between(-200, -400));
    }
}