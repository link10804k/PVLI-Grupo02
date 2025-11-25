import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";

export default class InventoryUI {
    constructor(UIScene){
        EventBus.on(events.INVENTORY_UPDATE, (unprocessedProducts, processedProducts) => { // Por alguna razón llegan todos con cantidad = 0
            this.unprocessedProducts = unprocessedProducts;
            this.processedProducts = processedProducts;
            this.updateInventoryUI();
        });
        this.UIScene = UIScene;
        this.rectangle = this.UIScene.add.rectangle(800, 600, 200, 400, 0x000000, 1).setOrigin(1, 1);

        this.unprocessedProductsCoords = { x: this.rectangle.x - this.rectangle.width + 20, y: this.rectangle.y - this.rectangle.height + 20 };
        this.processedProductsCoords = { x: this.rectangle.x - this.rectangle.width + 20, y: this.rectangle.y - this.rectangle.height / 2 + 20 };
    }

    updateInventoryUI() {
        // TODO: ClearInvetoryUI()

        let unprocessedKeys = Object.keys(this.unprocessedProducts);
        let processedKeys = Object.keys(this.processedProducts);

        unprocessedKeys = unprocessedKeys.filter(key => this.unprocessedProducts[key].quantity > 0);
        processedKeys = processedKeys.filter(key => this.processedProducts[key].quantity > 0);

        unprocessedKeys.forEach((key, index) => {
            let product = this.unprocessedProducts[key];
            let x = this.unprocessedProductsCoords.x + (index % 4) * 20;
            let y = this.unprocessedProductsCoords.y + Math.floor(index / 4) * 20;

            if (product.texture) {
                this.UIScene.add.sprite(x, y, product.texture).setOrigin(0.5).setScale(0.1);
            }
            else {
                this.UIScene.add.text(x, y, product.name, { fontSize: '10px', fill: '#ffffff' }).setOrigin(0.5);
            }
            this.UIScene.add.text(x + 10, y + 10, product.quantity, { fontSize: '10px', fill: '#ffffff' }).setOrigin(0.5);
        });

        processedKeys.forEach((key, index) => {
            let product = this.processedProducts[key];
            let x = this.processedProductsCoords.x + (index % 4) * 20;
            let y = this.processedProductsCoords.y + Math.floor(index / 4) * 20;

            if (product.texture) {
                this.UIScene.add.sprite(x, y, product.texture).setOrigin(0.5).setScale(0.1);
            }
            else {
                this.UIScene.add.text(x, y, product.name, { fontSize: '10px', fill: '#ff0000' }).setOrigin(0.5);
            }
            this.UIScene.add.text(x + 10, y + 10, product.quantity, { fontSize: '10px', fill: '#ffffff' }).setOrigin(0.5);
        });
    }
}