export default class GachaButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, w, h, func, labelText="", labelStyle={}) {
        super(scene, x, y);
        scene.add.existing(this);

        this.func = func;

        this.add(scene.add.rectangle(0, 0, w, h, 0x888888).setOrigin(0.5));

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
            console.log(item);
            item.tint = 0xaaaaaa;
            item.setScale(1.1);
        });
    }
    onPointerOut() {
        this.getAll().forEach(item => {
            item.tint = 0xffffff;
            item.setScale(1);
        });
    }
    onPointerDown() {
        this.getAll().forEach(item => {
            item.tint = 0x777777;
            item.setScale(1);
        });
    }
    onPointerUp() {
        this.getAll().forEach(item => {
            item.tint = 0xffffff;
        });
        this.func();
    }
    disable() {
        this.isActive = false;
        this.disableInteractive();
        this.setAlpha(0);
    }
    enable() {
        this.isActive = true;
        this.setInteractive();
        this.setAlpha(1);
    }
}