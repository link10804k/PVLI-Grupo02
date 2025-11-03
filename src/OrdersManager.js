import Order from "./Order.js";
import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";

const ORDER_INTERVAL = 20000; // 20 segundos entre pedidos(variable)
const ORDER_TIME = 30000; // 30 segundos para completar el pedido (variable)
const ORDER_IMAGE_SIZE = 100; // Tamaño en píxeles del sprite del pedido
    
export default class OrdersManager {
    constructor(scene) {
        this.scene = scene;
        this.orders = [];

        EventBus.on(events.SELLING_PHASE, () => this.StartOrders());
        EventBus.on(events.PRODUCTION_PHASE, () => this.StopOrders());

        EventBus.on(events.ORDER_COMPLETED, (orderId) => this.RemoveOrder(orderId));
        EventBus.on(events.ORDER_FAILED, (orderId) => this.FailOrder(orderId));
    }
    
    StartOrders() {
        this.AddOrder();
        this.timerEvent = this.scene.time.addEvent({
            callback: () => this.AddOrder(),
            delay: ORDER_INTERVAL,
            loop: true
        });
    }
    StopOrders() {
        this.timerEvent.remove();
        this.orders.forEach(element => {
            this.FailOrder(element.id);
        });
    }
    AddOrder() {
        console.log('OrdersManager: adding new order');
        let order = new Order(this.scene, 0, this.orders.length*ORDER_IMAGE_SIZE, "order", this.orders.length, [], 100, ORDER_TIME);
        this.orders.push(order);
    }
    RemoveOrder(orderId) {
        this.orders = this.orders.filter(order => order.id !== orderId);
        for(let i = orderId; i < this.orders.length; i++) {
            this.orders[i].y -= ORDER_IMAGE_SIZE;
        }
    }
    FailOrder(orderId) {
        this.RemoveOrder(orderId);
        // Perder popularidad, etc
    }
}