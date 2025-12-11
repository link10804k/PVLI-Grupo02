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

        const btnTutorial = new Button(this, 400, 525, "Wbutton", () => this.startMainScene());
        btnTutorial.setOrigin(0.5).setScale(3);

        const btnGame = new Button(this, 400, 400, "Wbutton", () => this.startTutorialScene());
        btnGame.setOrigin(0.5).setScale(3);

        this.add.text(btnGame.x, btnGame.y, "TUTORIAL", {
            fontSize: "44px",
            color: "#b4570aff",
            stroke: "#000000",
            strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(btnTutorial.x, btnTutorial.y, "START", {
            fontSize: "44px",
            color: "#b4570aff",
            stroke: "#000000",
            strokeThickness: 5
        }).setOrigin(0.5);
    }
    startMainScene() {
        this.scene.start("MainScene");
    }

    startTutorialScene() {
        this.scene.start("TutorialScene");
    }
}