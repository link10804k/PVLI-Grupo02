import Order from "./Order.js";
import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";

const ORDER_INTERVAL = 10000; // 10 segundos entre pedidos (variable)
const ORDER_TIME = 20000; // 20 segundos para completar el pedido (variable)
const ORDER_IMAGE_SIZE = 100; // Tamaño en píxeles del sprite del pedido
    
export default class OrdersManager {
    constructor(scene, inventory) {
        this.scene = scene;
        this.orders = [];
        this.inventory = inventory;

        EventBus.on(events.SELLING_PHASE, () => this.StartOrders());
        EventBus.on(events.PRODUCTION_PHASE, () => this.StopOrders());

        EventBus.on(events.ORDER_COMPLETED, (orderId) => this.RemoveOrder(orderId));
        EventBus.on(events.ORDER_FAILED, (orderId) => {
            console.log(orderId);
            this.FailOrder(orderId);
        });
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
        console.log("Order added");

        let {products, amounts} = this.RandomizeOrder();
        console.log("Productos: ");
        
        for (let i = 0; i < products.length; i++) {
            console.log(products[i].name + " (" + amounts[i] + ")");
        }

        let order = new Order(this.scene.UIManager, 0, this.orders.length*ORDER_IMAGE_SIZE, "coffeeOrder", this.orders.length, products, amounts, ORDER_TIME, this.inventory).setOrigin(0).setScale(0.4);
        this.orders.push(order);
    }
    RemoveOrder(orderId) {
        this.orders = this.orders.filter(order => order.id !== orderId);
        for(let i = orderId; i < this.orders.length; i++) {
            this.orders[i].y -= ORDER_IMAGE_SIZE;
        }
    }
    FailOrder(orderId) {
        this.orders[orderId].destructor();
        this.RemoveOrder(orderId);
        // Perder popularidad, etc
    }
    RandomizeOrder() {
        let nProducts = Phaser.Math.Between(1, 3); // elegir entre 1 y 3 productos
        let products = [];
        let amounts = [];
        let eligibleProducts = Object.keys(this.inventory.processedProducts); // keys = ['coffee', 'tea', ...]

        for (let i = 0; i < nProducts; i++) {
            let selectedProduct = eligibleProducts[Phaser.Math.Between(0, eligibleProducts.length - 1)];
            
            let position = this.IsInArray(products, selectedProduct);
            if (position == -1) {
                products.push(this.inventory.processedProducts[selectedProduct]);
                amounts[products.length - 1] = 1;
            }
            else {
                amounts[position] += 1;
            }
        }
   
        return {products, amounts};
    }
    // Devuelve el índice de un elemento en un array o -1 si no está
    IsInArray(array, element) {
        let i = 0;
        while (i < array.length && array[i] !== element) {
            i++;
        }
        return i < array.length ? i : -1;
    }
}