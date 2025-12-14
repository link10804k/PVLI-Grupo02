import Button from "./Button.js";

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenu" });
    }
    preload() { // Cargar recursos aquí
        // usar rutas relativas al root del servidor (assets/ está en la raíz del proyecto)
        this.load.image("MainMenuBackground", "assets/gameAssets/MenuBackground.png");
        this.load.image("Wbutton", "assets/gameAssets/WoodenButton.png");
        this.load.image("Logo", "assets/gameAssets/FarAwayFromTeaName.png");

        this.load.audio("popUp", "assets/gameAssets/audios/PopUpSFX.mp3"); // Sonido de botón

        this.load.audio("MainMenuMusic", "assets/gameAssets/audios/MainMenuOST.mp3"); // Música de fondo del menú
    }

    create() { // Crear objetos del juego aquí
        
        this.add.image(400, 300, "MainMenuBackground").setOrigin(0.5, 0.5).setScale(8/7);
        this.add.image(400, 200, "Logo").setOrigin(0.5, 0.5).setScale(4);

        const btnTutorial = new Button(this, 400, 525, "Wbutton", () => this.startMainScene());
        btnTutorial.setOrigin(0.5).setScale(3);

        const btnGame = new Button(this, 400, 400, "Wbutton", () => this.startTutorialScene());
        btnGame.setOrigin(0.5).setScale(3);

        this.add.text(btnGame.x, btnGame.y, "TUTORIAL", {
            fontSize: "34px",
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

        this.sound.play("MainMenuMusic", { volume: 0.5 }); // Música de fondo del menú
    }
    startMainScene() {
        this.scene.start("MainScene");
        this.sound.stopAll();
    }

    startTutorialScene() {
        this.scene.start("TutorialScene");
        this.sound.stopAll();
    }
}