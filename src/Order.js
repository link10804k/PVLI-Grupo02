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

        scene.add.existing(this);
        this.completeOrderButton = new Button(scene, x+90, y+40, "button", () => this.TryCompleteOrder()).setScale(0.8).setOrigin(0.5);
        this.productsImages = [];

        let k = 0;
        for (let i = 0; i < this.resources.length; i++) {
            for (let j = 0; j < this.amounts[i]; j++) {
                this.productsImages.push(this.scene.add.image(this.x + 20 + k*30, this.y + 20, this.resources[i].texture).setScale(0.05));
                k++;
            }
        }

        this.timerEvent = this.scene.time.addEvent({
            callback: () => this.FailOrder(),
            delay: time,
            loop: false
        });

        //this.timer = this.scene.add.text(x + 150, y + 20, "Tiempo: " + Math.ceil(time / 1000).toString(), { font: "20px Arial", fill: "#00FF00" });
        //console.log(this.timer);
    }
    moveOrder(y) {
        this.y -= y;
        this.completeOrderButton.y -= y;
        this.productsImages.forEach(element => {
            element.y -= y;
        });
    }
    destructor() {
        this.scene.time.removeEvent(this.timerEvent);
        this.timerEvent = null;
        this.completeOrderButton.destroy();
        this.productsImages.forEach(element => {
            element.destroy();
        });
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
        EventBus.emit(events.ORDER_COMPLETED, this, this.id);

        this.inventory.sellProducts(this.resources, this.amounts);

        this.destructor();
    }
    FailCompleteOrder() {
        console.log("No se pueden completar los requisitos del pedido"); // Feedback en la UI a futuro
    }
    FailOrder() {
        EventBus.emit(events.ORDER_FAILED, this, this.id);

        this.destructor();
    }
}