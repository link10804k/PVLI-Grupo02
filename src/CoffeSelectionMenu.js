import Button from "./Button.js";

export default class CoffeSelectionMenu extends Phaser.Scene {
    constructor() {
        super({ key : "CoffeSelectionMenu" });
    }

    init(data){
        this.Cafeteria = data.Cafeteria;
        this.mainScene = data.mainScene;
        console.log("Datos recibidos:", data);
        if (!this.Cafeteria) console.error("No se recibió la Cafeteria en CoffeSelectionMenu");
    }

    create() {

        if (!this.Cafeteria) {
      console.error("Peor: No se recibió la Cafeteria en CoffeSelectionMenu");
      this.scene.stop();
      return;
    }
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);
        this.add.rectangle(400, 300, 400, 500, 0x000000, 1);

        this.add.text(300, 100, `¿Qué quieres hacer?`, {
            fontSize: "20px",
            color: "#fff",
        }).setOrigin(0.25).setScale(1.5);

        this.add.image(250, 200, "Coffe_display").setScale(0.1);
        this.add.image(250, 300, "Tea_display").setScale(0.1);

        this.coffeeButton = new Button(this, 550, 200, "button", () => {
            this.Cafeteria.CookingTime(10, this.Cafeteria.Cafetera, "coffeProcessed");
            this.closeWindow();
        }).setScale(1);

        this.teaButton = new Button (this,550, 300, "button", () => {
            this.Cafeteria.CookingTime(15, this.Cafeteria.Cafetera, "teaProcessed");
            this.closeWindow();
        }).setScale(1);            

        this.closeButton = new Button(this, 400, 500, "button", () => {
            this.closeWindow();
        }).setScale(0.5);
    }

    closeWindow() {
        this.scene.stop();
        this.mainScene.scene.resume();
    }
}