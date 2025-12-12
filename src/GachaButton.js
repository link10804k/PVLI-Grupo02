export default class GachaButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, w, h, func, labelText="", labelStyle={}) {
        super(scene, x, y);
        scene.add.existing(this);

        this.func = func;

        this.add(scene.add.rectangle(0, 0, w, h, 0xFFFF00).setOrigin(0.5));
        this.add(scene.add.text(0, 0, labelText, labelStyle).setOrigin(0.5));

        this.setSize(w, h);
        this.setInteractive();

        this.on("pointerover", () => this.onPointerOver());
        this.on("pointerout", () => this.onPointerOut());
        this.on("pointerdown", () => this.onPointerDown());
        this.on("pointerup", () => this.onPointerUp());
    }
    onPointerOver() {
        this.getAll().forEach(item => {
            item.setScale(1.1);
        });
    }
    onPointerOut() {
        this.getAll().forEach(item => {
            item.setScale(1);
        });
    }
    onPointerDown() {
        this.getAll().forEach(item => {
            item.setScale(0.9);
        });
    }
    onPointerUp() {
        this.getAll().forEach(item => {
            item.setScale(1);
        });
        this.func();
    }
    disable() {
        this.disableInteractive();
        this.setAlpha(0.75);
    }
    enable() {
        this.setInteractive();
        this.setAlpha(1);
    }
}