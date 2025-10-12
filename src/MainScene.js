Phaser.Scene

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainScene" });
    }

    preload() { // Cargar recursos aquí
        this.load.image("background", "assets/gameAssets/background.jpeg");
    }

    create() { // Crear objetos del juego aquí
        this.add.image(0, 0, "background").setOrigin(0, 0);
    }
}