export default class Button extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture="button") {
        super(scene, x, y, texture);

        scene.add.existing(this);

        this.setInteractive();

        this.on("pointerover", () => this.onMouseOver());
        this.on("pointerdown", () => this.onMouseDown());
        this.on("pointerout", () => this.onMouseOut());
    }
    onMouseOver() {}
    onMouseOut() {}
    onMouseDown() {}
}