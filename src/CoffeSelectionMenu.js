import Button from "./Button.js";

export default class CoffeSelectionMenu extends Phaser.Scene {
    constructor() {
        super({ key : "CoffeSelectionMenu" });
    }

    init(data){
        this.cafetera = data.cafetera;
        this.inventory = data.inventory;
        this.mainScene = data.mainScene;
        console.log("Datos recibidos:", data);
    }

    create() {
//Desactivar input en la escena principal mientras el menú está abierto
        if (this.mainScene && this.mainScene.input) {
            this.mainScene.input.enabled = false;
        }


        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);
        this.add.rectangle(400, 300, 400, 500, 0x000000, 1);

        this.add.text(300, 100, `¿Qué quieres hacer?`, {
            fontSize: "20px",
            color: "#fff",
        }).setOrigin(0.25).setScale(1.5);

        this.add.image(250, 200, "Coffe_display").setScale(0.1);
        this.add.image(250, 300, "Tea_display").setScale(0.1);

        if (this.inventory?.processedProducts) {
            const products = Object.values(this.inventory.processedProducts);

            let i = 0
            products.forEach((product, i) => {
            new Button(this, 550, 200 + 100*i, "button", () => {
                this.cafetera.CookingTime(product.time, product);
                this.closeWindow();
                }).setScale(0.4);
            i++;
            });
        }

        else {
            console.warn("Inventario no válido o processedProducts no encontrado:", this.inventory);
        }

        //this.coffeeButton = new Button(this, 550, 200, "button", () => {
        //    this.Cafetera.CookingTime(10, this.inventory.coffeeProcessed);
        //    this.closeWindow();
        //}).setScale(1);
//
//        //this.teaButton = new Button (this,550, 300, "button", () => {
        //    this.Cafetera.CookingTime(15, this.inventory.teaProcessed);
        //    this.closeWindow();
        //}).setScale(1);            

        this.closeButton = new Button(this, 400, 500, "button", () => {
            this.closeWindow();
        }).setScale(0.5);
    }

    closeWindow() {
    // Esperamos un poco antes de cerrar y reactivar input
    this.time.delayedCall(100, () => {
        if (this.mainScene && this.mainScene.input) {
            this.mainScene.input.enabled = true;
        }
        this.scene.resume("MainScene");
        this.scene.stop(); // ahora sí detenemos el menú
    });
}
}