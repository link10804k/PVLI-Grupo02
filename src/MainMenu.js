Phaser.Scene

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenu" });
    }

    init() {

    }

    preload() { // Cargar recursos aquí
        this.load.image("background", "assets/gameAssets/background.jpeg");
    }

    create() { // Crear objetos del juego aquí
        this.add.image(400, 300, "background").setOrigin(0.5, 0.5);
    }

    update() {

    }
}