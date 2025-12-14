import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";

const SPACE_BETWEEN_PRODUCTS = 20;

export default class InventoryUI {
    constructor(UIScene){
        EventBus.on(events.INVENTORY_UPDATE, (unprocessedProducts, processedProducts) => { // Por alguna razón llegan todos con cantidad = 0
            this.unprocessedProducts = unprocessedProducts;
            this.processedProducts = processedProducts;
            this.updateInventoryUI();
        });
        this.UIScene = UIScene;
        this.rectangle = this.UIScene.add.rectangle(800, 580, 200, 460, 0x000000, 0).setOrigin(1, 1);

        this.unprocessedProductsCoords = { x: this.rectangle.x - this.rectangle.width + 20, y: this.rectangle.y - this.rectangle.height + 20 };
        this.processedProductsCoords = { x: this.rectangle.x - this.rectangle.width + 20, y: this.rectangle.y - this.rectangle.height / 2 + 20 };

        this.entities = [];
    }

    updateInventoryUI() {
        this.ClearInventoryUI()

        let unprocessedKeys = Object.keys(this.unprocessedProducts);
        let processedKeys = Object.keys(this.processedProducts);

        unprocessedKeys = unprocessedKeys.filter(key => this.unprocessedProducts[key].quantity > 0);
        processedKeys = processedKeys.filter(key => this.processedProducts[key].quantity > 0);

        unprocessedKeys.forEach((key, index) => {
            let product = this.unprocessedProducts[key];

            const x = this.unprocessedProductsCoords.x;
            const y = this.unprocessedProductsCoords.y + index * SPACE_BETWEEN_PRODUCTS;

            this.drawProduct(product, x, y, "#ffffffff");
    });

        // Productos procesados----------------------------------
        processedKeys.forEach((key, index) => {
            const product = this.processedProducts[key];
            const x = this.processedProductsCoords.x;
            const y = this.processedProductsCoords.y + index * SPACE_BETWEEN_PRODUCTS;

             this.drawProduct(product, x, y);
    });
    }

    drawProduct(product, x, y, color = "#ffffff") {

    let container = this.UIScene.add.container(x, y);
    this.entities.push(container);

    // ICONO
    if (product.texture) {
        let icon = this.UIScene.add.sprite(-10, 0, product.texture)
            .setOrigin(0, 0.5)
            .setScale(1);

        container.add(icon);
    }

    // NOMBRE
    let nameText = this.UIScene.add.text(10, 0, product.name, {
        fontFamily: "Arial",
        fontSize: "14px",
        color: color,
        stroke: "#000000",
        strokeThickness: 3
    }).setOrigin(0, 0.5);
    container.add(nameText);

    // CANTIDAD
    let qtyText = this.UIScene.add.text(150, 0, product.quantity, {
        fontFamily: "Arial",
        fontSize: "14px",
        color: color,
        stroke: "#000000",
        strokeThickness: 3
    }).setOrigin(0, 0.5);
    container.add(qtyText);
}


    ClearInventoryUI() {
        this.entities.forEach(entity => entity.destroy());
        this.entities = [];
    }
}