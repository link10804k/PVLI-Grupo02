import Application from "./Application.js";
import {EventBus} from "./EventBus.js";
import {events} from "./EventBus.js";
import Messages from "./Resources/Messages.json" with { type: "json" };
import UIScene from "./UIScene.js";

export default class ApplicationManager {
    constructor(scene, inventory, UIScene) {
        this.scene = scene;
        this.UIScene = UIScene;
        this.inventory = inventory;

        this.maxTier = this.inventory.maxTier;
        this.tier = 1;

        this.messages = structuredClone(Messages);

        EventBus.on(events.LEVEL_INCREASED, (tier) => this.tier = Math.min(tier, this.maxTier));
        EventBus.on(events.PRODUCTION_PHASE, () => this.createApplication());
    }

    createApplication() {
        let image = "Smartphone";

        let message = this.produceAppText();
        
        let text = message.text;
        let user = message.user;
        new Application(this.UIScene, user, image, text, 10);
    }

    getRandomProcessedProduct() { // Devuelve un producto procesado aleatorio del tier actual
        let products = this.inventory.getProcessedProductsFromTier(this.tier);
        let randomIndex = Phaser.Math.Between(0, products.length - 1);

        let product = products[randomIndex];
        EventBus.emit(events.POPULAR_PRODUCT_REQUESTED, product);

        return product;
    }

    getRandomMessage() { // Devuelve un texto aleatorio de los mensajes
        let randomIndex = Phaser.Math.Between(0, this.messages.length - 1);
        return this.messages[randomIndex];
    }

    produceAppText() { // Devuelve el mensaje ya preparado para la aplicación
        let message = this.getRandomMessage();
        let product = this.getRandomProcessedProduct();

        
        message.text = message.text.replaceAll("[producto]", product.name);
        return message;
    }
}