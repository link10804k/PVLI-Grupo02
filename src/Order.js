import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";

export default class Order extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture = "order", id, resources, price, time) {
        super(scene, x, y, texture);
        this.id = id;
        this.resources = resources;
        this.price = price;

        scene.add.existing(this);

        this.on('pointerdown', () => this.TryCompleteOrder());

        this.timerEvent = new Phaser.Time.TimerEvent({
            callback: this.FailOrder(),
            delay: time,
            loop: false
        });
    }
    TryCompleteOrder() {
        var canComplete = true;
        this.resources.forEach(resource => {
            if (!this.scene.playerInventory.minimumResources(resource)) {
                canComplete = false;
            }
        });
        if (canComplete) {
            this.CompleteOrder();
        }
        else {
            this.FailCompleteOrder();
        }
    }
    CompleteOrder() {
        EventBus.emit(events.ORDER_COMPLETED, this.id);
        this.timerEvent.remove();

        this.resources.forEach(resource => {
            this.scene.playerInventory.removeProduct(resource);
        });

        this.scene.playerInventory.addMoney(this.price);
        this.destroy();
    }
    FailCompleteOrder() {
        console.log("No se pueden completar los requisitos del pedido"); // Feedback en la UI a futuro
    }
    FailOrder() {
        EventBus.emit(events.ORDER_FAILED, this.id);
        this.destroy();
    }
}