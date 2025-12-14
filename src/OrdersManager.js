import Order from "./Order.js";
import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";


const ORDER_INTERVAL = 10000; // 10 segundos entre pedidos (variable)
const ORDER_TIME = 12000; // 20 segundos para completar el pedido (variable)
const ORDER_IMAGE_SIZE = 64; // Tamaño en píxeles del sprite del pedido
    
export default class OrdersManager {
    constructor(scene, inventory) {
        this.scene = scene;
        this.orders = [];
        this.inventory = inventory;
        this.waitingCustomers = [];

        this.orderInterval = ORDER_INTERVAL;
        
        EventBus.on(events.LEVEL_INCREASED, (tier) => {
            this.orderInterval = Math.max(1000, ORDER_INTERVAL - (tier*1.5*1000)); // Disminuye el intervalo entre pedidos al subir de nivel
        });
         
        EventBus.on(events.SELLING_PHASE, () => this.StartOrders());
        EventBus.on(events.PRODUCTION_PHASE, () => this.StopOrders());

        EventBus.on(events.ORDER_COMPLETED, (order, orderId) => this.RemoveOrder(order, orderId));
        EventBus.on(events.ORDER_FAILED, (order, orderId) => this.FailOrder(order, orderId));

        this.popularProduct = null;

        EventBus.on(events.POPULAR_PRODUCT_REQUESTED, (popularProduct) => {
            this.popularProduct = popularProduct;
        });
    }
    
    StartOrders() {
        this.AddOrder();
        this.timerEvent = this.scene.time.addEvent({
            callback: () => this.AddOrder(),
            delay: this.orderInterval,
            loop: true
        });
    }
    StopOrders() {
        this.scene.time.removeEvent(this.timerEvent);
        this.timerEvent = null;

        let ordersLength = this.orders.length;
        for (let i = 0; i < ordersLength; i++) {
            this.orders[0].destructor();
            this.FailOrder(this.orders[0], this.orders[0].id);
        }

        this.popularProduct = null;
    }
    AddOrder() {     
        if (this.orders.length < 8) {
            let {products, amounts} = this.RandomizeOrder();
    
            let order = new Order(this.scene.UIScene, 0, this.orders.length*ORDER_IMAGE_SIZE, "panel", this.orders.length, products, amounts, ORDER_TIME, this.inventory).setOrigin(0).setScale(2);
            this.orders.push(order);

            EventBus.emit(events.ORDER_ADDED, order); // Para los clientes

            this.scene.sound.play("newCustomer", { volume: 0.5 });
        }
    }
    RemoveOrder(order, orderId) {
        for (let i = orderId; i < this.orders.length; i++)  {
            this.orders[i] = i+1 == this.orders.length ? null : this.orders[i+1];
        }
        this.orders = this.orders.filter(order => order != null);

        for(let i = orderId; i < this.orders.length; i++) {
            this.orders[i].moveOrder(ORDER_IMAGE_SIZE);
            this.orders[i].id -= 1;
        }
    }
    FailOrder(order, orderId) {
        this.RemoveOrder(order, orderId);
    }
    RandomizeOrder() {
        let nProducts = Phaser.Math.Between(1, 3); // elegir entre 1 y 3 productos
        let products = [];
        let amounts = [];
        let eligibleProducts = Object.keys(this.inventory.processedProducts);

        for (let i = 0; i < nProducts; i++) {
            // Elige un producto aleatorio entre el array de keys. LUEGO, accede al objeto del inventario usando la key (como en un array).
            let selectedProduct;
            if (this.popularProduct && Phaser.Math.Between(1, 100) <= 20) { // 20% de probabilidad de que salga el producto popular (más la probabilidad normal)
                selectedProduct = this.popularProduct;
            }
            else {
                selectedProduct = this.inventory.processedProducts[eligibleProducts[Phaser.Math.Between(0, eligibleProducts.length - 1)]];
            }
            
            let position = this.IsInArray(products, selectedProduct);
            if (position == -1) {
                products.push(selectedProduct);
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
        while (i < array.length && array[i] != element) {
            i++;
        }
        return i < array.length ? i : -1;
    }
}