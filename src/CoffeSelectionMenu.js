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

    update() {
    
        if (this.cafetera.assignedWorkers < 1) {
            this.addButton.setInteractive();
        }
        else {
            if (this.addButton) {
                this.addButton.disableInteractive();
                }
        }

        //if()
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

        this.add.image(250, 200, "Coffee_display").setScale(0.1);
        this.add.image(250, 300, "Tea_display").setScale(0.1);

        if (this.inventory.processedProducts) {
            const products = Object.keys(this.inventory.processedProducts);

            let i = 0;
            products.forEach((product) => {
            new Button(this, 550, 200 + 100*i, "button", () => {
                let realProduct = this.inventory.processedProducts[product];
                this.cafetera.CookingTime(realProduct.time, realProduct);
                this.closeWindow();
                }).setScale(0.4);
                i++;
            });
        }

        else {
            console.warn("Inventario no válido o processedProducts no encontrado:", this.inventory);
        }

        const text = this.add.text(400, 450, `Workers: ${this.cafetera.assignedWorkers}`, {
                fontSize: "20px",
                color: "#fff",
            }).setOrigin(0.5);
        
        this.addButton = new Button(this, 350, 500, "button", () => 
            this.cafetera.addWorker(text))
            .setScale(0.5);
        
        this.removeButton = new Button(this, 450, 500, "menos", () => 
            this.cafetera.removeWorker(text))
            .setScale(0.05);        

        //this.coffeeButton = new Button(this, 550, 200, "button", () => {
        //    this.Cafetera.CookingTime(10, this.inventory.coffeeProcessed);
        //    this.closeWindow();
        //}).setScale(1);
//
//        //this.teaButton = new Button (this,550, 300, "button", () => {
        //    this.Cafetera.CookingTime(15, this.inventory.teaProcessed);
        //    this.closeWindow();
        //}).setScale(1);            

        this.closeButton = new Button(this, 580, 90, "menos", () => {
            this.closeWindow();
        }).setScale(0.05);
    }

    closeWindow() {
    // Esperamos un poco antes de cerrar y reactivar input
    this.time.delayedCall(100, () => {
        if (this.mainScene && this.mainScene.input) {
            this.mainScene.input.enabled = true;
        }
        this.scene.resume("MainScene");
        this.scene.resume("UIScene");
        this.scene.stop(); // ahora sí detenemos el menú
    });

}
}