import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";
import Customer from "./Customer.js";

const CUSTOMER_IMAGE_SIZE = 20; // Tamaño en píxeles del sprite del cliente
const Direction = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
};

export default class CustomersManager {
    constructor(scene, cafeteria) {
        this.scene = scene;
        this.cafeteria = cafeteria;
        this.customers = [];

        EventBus.on(events.ORDER_ADDED, (order) => this.AddCustomer(order));
        EventBus.on(events.ORDER_COMPLETED, (order, orderId) => this.RemoveCustomer(order, orderId));
        EventBus.on(events.ORDER_FAILED, (order, orderId) => this.AngryCustomer(order, orderId));
        EventBus.on(events.PRODUCTION_PHASE, () => this.RemoveAllCustomers());
    }

    AddCustomer(order) {
        let customerImage;
        if (Phaser.Math.Between(0, 1) == 0) {
            customerImage = "maleCustomer";
        }
        else {
            customerImage = "femaleCustomer";
        }
        let customer = new Customer(this.scene, this.cafeteria.x+15, this.cafeteria.y - 10 + this.customers.length * (CUSTOMER_IMAGE_SIZE), customerImage).setOrigin(0.5).setScale(1);
        this.customers.push(customer);
    }

    RemoveCustomer(order, orderId) {
        this.customers[orderId].GetOut(30, Direction.LEFT);

        for (let i = orderId; i < this.customers.length; i++)  {
            this.customers[i] = i+1 == this.customers.length ? null : this.customers[i+1];
        }
        this.customers = this.customers.filter(customer => customer != null);

        for(let i = orderId; i < this.customers.length; i++) {
            this.customers[i].Walk(CUSTOMER_IMAGE_SIZE, Direction.UP);
            this.customers[i].id -= 1;
        }

        this.scene.sound.play("customerExit"); // Sonido de cliente marchandose
    }

    RemoveAllCustomers() {
        let customersLength = this.customers.length;
        for (let i = 0; i < customersLength; i++) {
            this.customers[i].GetOut(30, Direction.LEFT);
        }

        this.customers = [];

        this.scene.sound.play("customerExit"); // Sonido de cliente marchandose
    }

    AngryCustomer(order, orderId) {
        this.customers[orderId].GetOutAngry(30, Direction.LEFT);
        this.RemoveCustomer(order, orderId);
    }
}