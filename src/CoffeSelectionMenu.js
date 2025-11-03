import Button from "./Button.js";
import Building from "./Building.js";

export default class CoffeSelectionMenu extends Phaser.Scene {
    constructor() {
        super({ key : "CoffeSelectionMenu" });
    }

    init(data){
        this.Cafeteria = data.Cafeteria;
        this.mainScene = data.mainScene;
    }

    create() {
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);
        this.add.rectangle(400, 300, 400, 500, 0x000000, 1);

        this.add.image(250, 300, "Coffe_display").setScale(0.1);
        this.add.image(550, 300, "Tea_display").setScale(0.1);

        this.coffeeButton = new Button(this, 300, 420, "button", () => {
            this.Building.startTimer(10, this.coffeeButton); 
            this.closeWindow();
        }).setScale(0.25);

        this.teaButton = new Button (this,450, 400, "button", () => {
            this.Building.startTimer(15, this.teaButton);
            this.closeWindow();
        }).setScale(0.25);            

        this.closeButton = new Button(this, 400, 500, "button", () => {
            this.closeWindow();
        }).setScale(0.5);
    }

    closeWindow() {
        this.scene.stop();
        this.mainScene.scene.resume();
    }
}