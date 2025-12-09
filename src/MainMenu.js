import Button from "./Button.js";

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenu" });
    }
    preload() { // Cargar recursos aquí
        // usar rutas relativas al root del servidor (assets/ está en la raíz del proyecto)
        this.load.image("Background", "assets/gameAssets/Background.png");
        this.load.image("Wbutton", "assets/gameAssets/WoodenButton.png");
    }

    create() { // Crear objetos del juego aquí
        this.add.image(400, 300, "Background").setOrigin(0.5, 0.5);
        const btn = new Button(this, 400, 400, "Wbutton", () => this.startMainScene()).setOrigin(0.5, 0.5).setScale(5);
        this.add.text(btn.x, btn.y, "START GAME", {
            fontSize: "44px",
            color: "#b4570aff",
            stroke: "#000000",
            strokeThickness: 5
        }).setOrigin(0.5);
    }
    startMainScene() {
        this.scene.start("MainScene");
    }
}