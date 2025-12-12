import Button from "./Button.js";
import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";
import ProductionTimer from "./Timer.js"; 
import FloatingMessage from "./FloatingMessage.js";

const POPULARITY_LOSS_ON_FAIL = 30; // Cantidad de popularidad que se pierde al fallar un pedido
const POPULARITY_GAIN_ON_COMPLETE = 20; // Cantidad de popularidad que se gana al completar un pedido

export default class Order extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture = "panel", id, resources, amounts, time, inventory) {
        super(scene, x, y, texture);
        this.id = id;
        this.resources = resources;
        this.amounts = amounts;
        this.inventory = inventory;
        
        this.ui = this.scene.scene.get("UIScene");

        scene.add.existing(this);
        this.setInteractive();

        this.on("pointerover", () => {
            this.setTint(0xaaaaaa);
        });
        this.on("pointerout", () => {
            this.clearTint();
        });
        this.on("pointerdown", () => {
            this.setTint(0x888888);
        });
        this.on("pointerup", () => {
            this.clearTint();
            this.TryCompleteOrder()
        });

        this.productsImages = [];

        let k = 0;
        for (let i = 0; i < this.resources.length; i++) {
            for (let j = 0; j < this.amounts[i]; j++) {
                this.productsImages.push(this.scene.add.image(this.x + 25 + k*37.5, this.y + 30, this.resources[i].texture).setScale(2));
                k++;
            }
        }

        // Timer con ProductionTimer
       this.timer = new ProductionTimer(
            scene, 
            this.x + this.width + 100, 
            this.y + this.height / 2 + 10, 
            Math.ceil(time / 1000), 
            null,// <---icono si queremos aqui
            this.FailOrder.bind(this), // <-- callback al terminar
            true
        ).setScale(0.5);
        this.timer.start();


        //this.timer = this.scene.add.text(x + 150, y + 20, "Tiempo: " + Math.ceil(time / 1000).toString(), { font: "20px Arial", fill: "#00FF00" });
        //console.log(this.timer);
    }
    
    moveOrder(y) {
        this.y -= y;
        this.productsImages.forEach(element => {
            element.y -= y;
        });

     // Mueve también el timer
        this.timer.y -= y;
    }
    destructor() {
        this.scene.time.removeEvent(this.timerEvent);
        this.timerEvent = null;
        this.productsImages.forEach(element => {
            element.destroy();
        });
        
        //Destruir timer
        this.timer.destroy();
        this.timer = null;
    
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

        let popularityGain = 0;

        this.amounts.forEach(amount => {
            popularityGain += amount * POPULARITY_GAIN_ON_COMPLETE;
        });

        EventBus.emit(events.ADD_POPULARITY, popularityGain);

        this.scene.sound.play("purchase");

        this.destructor();
    }
    FailCompleteOrder() {
        new FloatingMessage(this.ui, "No se pueden completar los requisitos del pedido"); // Feedback en la UI a futuro
    }
    FailOrder() {
        EventBus.emit(events.ORDER_FAILED, this, this.id);

        let popularityLoss = 0;

        this.amounts.forEach(amount => {
            popularityLoss += amount * POPULARITY_LOSS_ON_FAIL;
        });

        EventBus.emit(events.REMOVE_POPULARITY, popularityLoss);

        this.destructor();
    }
}