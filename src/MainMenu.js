import Button from "./Button.js";
//import { events } from "./EventManager.js";

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenu" });

        //this.events.emit(events.MENU_LOADED);
    }
    preload() { // Cargar recursos aquí
        // usar rutas relativas al root del servidor (assets/ está en la raíz del proyecto)
        this.load.image("background", "assets/gameAssets/background.jpeg");
        this.load.image("button", "assets/gameAssets/button.png");
    }

    create() { // Crear objetos del juego aquí
        this.add.image(400, 300, "background").setOrigin(0.5, 0.5);
        new Button(this, 400, 300, "button", () => this.startMainScene()).setOrigin(0.5, 0.5);
    }
    startMainScene() {
        this.scene.start("MainScene");
    }
}