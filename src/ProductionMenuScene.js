import Button from "./Button.js";
import Products from "./Resources/Products.json" with { type: "json"}

export default class ProductionMenuScene extends Phaser.Scene {
    constructor(){
        super({ key: "ProductionMenuScene" });
    }

    init(data){
        this.building = data.building;
        this.mainScene = data.mainScene;
        this.products = data.products;
        
        this.mainScene.sound.play("popUp", { volume: 0.2 }); // Sonido de aparición de menú
    }

    create(){

        //Desactivar input en la escena principal mientras el menú está abierto
        if (this.mainScene && this.mainScene.input) {
            this.mainScene.input.enabled = false;
        }
        //
        //Menu de Producción
        //
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);
       //const menuRect = this.add.rectangle(400, 300, 400, 500, 0x000000, 1);
       const menuRect = this.add.image(400, 300, "menuBackground").setOrigin(0.5).setScale(1.6, 1.4);

        //Guardamos sus límites
    const menuBounds = {
        x: menuRect.x - menuRect.width * menuRect.scaleX / 2,
        y: menuRect.y - menuRect.height * menuRect.scaleY / 2,
        width: menuRect.width * menuRect.scaleX,
        height: menuRect.height * menuRect.scaleY
    };

        this.add.text(410, 90, `Menú de Producción`, {
            fontSize: "28px",
            color: "#fff",
        }).setOrigin(0.5);

        for(let i = 0; i < this.products.length; i++)
        {
            const product = this.products[i];
           const productText = this.add.text(400, 160 + 80 * i, this.products[i].name + ": " + this.products[i].description, {
            fontSize: "16px",
            color: "#fff",
            fontFamily: "Arial",
            align: "center",
            wordWrap: { width: 200 },
            }).setOrigin(0.5);

            this.addButton = new Button(this, 250, 160 + 80 * i, this.products[i].texture, [
                () => this.building.produce(this.products[i]),
                () => this.closeWindow(),
            ]).setScale(4);

             
        //Mostrar ingredientes si el producto es procesado ------------------------
        if (product.neededProducts) {

            const productTextBounds = productText.getBounds();
            let offsetX = productTextBounds.right + 30; // al lado del texto
            const baseY = productTextBounds.centerY; // misma altura que el texto del producto

            let offset = 0;

            for (const requiredKey in product.neededProducts) {

                const amount = product.neededProducts[requiredKey];
            
                const requiredProduct = this.findProductByKey(requiredKey);
                if (!requiredProduct) continue;

                // ICONO 
                this.add.image(offsetX + offset, baseY, requiredProduct.texture)
                    .setScale(2) // ajusta tamaño si quieres
                    .setOrigin(0.5);

                // TEXTO DE CANTIDAD
                this.add.text(offsetX + offset, baseY + 25, "x" + amount, {
                    fontSize: "18px",
                    color: "#fff",
                }).setOrigin(0.5);

                offset += 30; // separa los iconos entre sí
        }
    }
            
        }

        //Boton de Upgrade
        this.tierText = this.add.text(550, 450, `Tier:${this.building.upgradeTier}`, {
            fontSize: "20px",
            stroke: "#000000",
            strokeThickness: 4,
            color: "#2fec00ff",
        }).setOrigin(0.5);

        this.upgradeCostText = this.add.text(520, 530, `Cost: ${this.building.upgradeCost} $`, {
            fontSize: "16px",
            stroke: "#000000",
            strokeThickness: 4,
            color: "#1ba300ff",
        }).setOrigin(0.5);

        // Guardar referencia en el edificio
        this.building.tierText = this.tierText;
        
        this.upgradeButton = new Button(this, 550, 500, "upgradeButton", () =>{ 
        this.building.upgrade();
        this.upgradeCostText.setText(`Cost: ${this.building.upgradeCost} $`);
        }).setScale(1.8);

        //Menu de trabajadores

        //this.add.image(400, 150, "panel").setScale(0.8).setOrigin(0.5).setScale(2);
        
                const text = this.add.text(400, 450, `Workers: ${this.building.assignedWorkers}`, {
                    fontSize: "20px",
                    color: "#fff",
                }).setOrigin(0.5);
        
                this.addWorkerButton = new Button(this, 350, 500, "plus", () => 
                    this.building.addWorker(text))
                    .setScale(2);

                    this.add.image(400, 500, "worker");
        
                this.removeButton = new Button(this, 450, 500, "menos", () => 
                    this.building.removeWorker(text))
                    .setScale(2);
        


                    //cerrar el menú al hacer clic fuera de él
    this.input.on('pointerdown', (pointer) => {
        const { x, y } = pointer;
        const inside =
            x >= menuBounds.x &&
            x <= menuBounds.x + menuBounds.width &&
            y >= menuBounds.y &&
            y <= menuBounds.y + menuBounds.height;

        if (!inside) {
            this.closeWindow();
        }
    });

    }

    closeWindow() {
        // Esperamos un poco antes de cerrar y reactivar input
        this.time.delayedCall(100, () => {
            // Reactivar input de la escena del juego
            if (this.mainScene && this.mainScene.input) {
                this.mainScene.input.enabled = true;
            }

            // Reanudar la escena correcta (puede ser MainScene o TutorialScene)
            if (this.mainScene) {
                const key = this.mainScene.scene.key;
                if (this.scene.isPaused(key)) {
                    this.scene.resume(key);
                }
            }

            // Reanudar la UIScene si estaba pausada
            if (this.scene.isPaused("UIScene")) {
                this.scene.resume("UIScene");
            }

            // Cerrar este menú
            this.scene.stop();
        });
    }

findProductByKey(key) {
    for (const tier in Products.unprocessedProducts) {
        if (Products.unprocessedProducts[tier][key]) {
            return Products.unprocessedProducts[tier][key];
        }
    }

    for (const tier in Products.processedProducts) {
        if (Products.processedProducts[tier][key]) {
            return Products.processedProducts[tier][key];
        }
    }

    return null;
}

}
