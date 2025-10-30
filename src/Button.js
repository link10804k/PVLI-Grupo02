export default class Button extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture="button", func) {
        super(scene, x, y, texture);

        this.func = func

        scene.add.existing(this);

        this.setInteractive();

        this.on("pointerover", () => this.onMouseOver());
        this.on("pointerdown", () => this.onMouseDown());
        this.on("pointerout", () => this.onMouseOut());
    }
    onMouseOver() {}
    onMouseOut() {}
    onMouseDown() {
        if(this.func) this.func();
    }
}