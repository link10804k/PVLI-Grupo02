import Button from "./Button.js";

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

        this.coffe = this.add.image(250, 300, "Coffe_display").setScale(0.5);
        this.tea = this.add.image(550, 300, "Tea_display").setScale(0.5);

        this.CoffeButton = new Button (this, 350, 400, "button", () =>
            this.Cafeteria.startTimer(10))
            this.closeWindow()
            .setScale(0.25);

        this.CoffeButton = new Button (this,450, 400, "button", () =>
            this.Cafeteria.startTimer(15))
            this.closeWindow()
            .setScale(0.25);            
/*
        this.timerText = this.add
            .text(400, 200, "Timer: 0", { fontSize: "32px", color: "#ffffff" })
            .setOrigin(0.5);
*/
        this.closeButton = new Button(this, 400, 500, "button", () => 
            this.closeWindow())
            .setScale(0.5);
    }

    closeWindow() {
        this.scene.stop();
        this.mainScene.scene.resume();
    }
}