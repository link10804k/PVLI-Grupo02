import Application from "./Application.js";
import EventBus from "./EventBus.js";
import events from "./EventBus.js";
import Messages from "./Resources/Messages.json" with { type: "json" };

export default class ApplicationManager {
    constructor(scene) {
        this.scene = scene;
        this.inventory = this.scene.playerInventory;

        this.tier = 1;

        this.messages = Object.entries(structuredClone(Messages));

        EventBus.on(events.LEVEL_INCREASED, (tier) => this.tier = tier);
        EventBus.on(events.PRODUCTION_PHASE, () => this.createApplication());
    }

    createApplication() {
        let image;
        let text;
        let user;
        new Application(this.scene, image, text);
    }

    getRandomProcessedProduct() { // Devuelve un producto procesado aleatorio del tier actual
        let products = Object.keys(this.inventory.getProcessedProductsFromTier(this.tier));

        let randomIndex = Phaser.Math.Between(0, products.length - 1);
        return this.inventory.processedProducts[products[randomIndex]];
    }

    getRandomText() { // Devuelve un texto aleatorio de los mensajes
        let randomIndex = Phaser.Math.Between(0, this.messages.length - 1);
        return this.messages[randomIndex];
    }

    produceAppText() { // Devuelve el texto ya preparado para la aplicación
        let message = this.getRandomText();
        let product = this.getRandomProcessedProduct();
    }
}