export default class GachaBall extends Phaser.GameObjects.Ellipse {
    constructor(scene, x, y, radius, color) {
        super(scene, x, y, radius*2, radius*2, color, 1); // x2 porque pide el diámetro

        scene.add.existing(this);
        this.scene.matter.add.gameObject(this, { circleRadius: radius });

        this.setBounce(0.5);
    }
}