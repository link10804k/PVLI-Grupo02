import Button from "./Button.js";
import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";

export default class Order extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, id, resources, amounts, time, inventory) {
        super(scene, x, y, texture);
        this.id = id;
        this.resources = resources;
        this.amounts = amounts;
        this.inventory = inventory;
        console.log(this.inventory);

        scene.add.existing(this);
        this.completeOrderButton = new Button(scene, x, y+40, "button", () => this.TryCompleteOrder()).setScale(0.8).setOrigin(0.5);


        this.timerEvent = this.scene.time.addEvent({
            callback: () => this.FailOrder(),
            delay: time,
            loop: false
        });
    }
    destructor() {
        this.completeOrderButton.destroy();
        this.timerEvent.remove();
        this.destroy();
    }
    TryCompleteOrder() {
        if (this.inventory.checkProcessedProducts(this.resources, this.amounts)) {
            this.CompleteOrder();
        }
        else {
            this.FailCompleteOrder();
        }
    }
    CompleteOrder() {
        EventBus.emit(events.ORDER_COMPLETED, this.id);
        this.timerEvent.remove();

        this.inventory.sellProducts(this.resources, this.amounts);

        this.destructor();
    }
    FailCompleteOrder() {
        console.log("No se pueden completar los requisitos del pedido"); // Feedback en la UI a futuro
    }
    FailOrder() {
        EventBus.emit(events.ORDER_FAILED, this.id);
    }
}