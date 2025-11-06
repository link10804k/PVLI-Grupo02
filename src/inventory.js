import Products from "./Resources/Products.json" with { type: "json"}
import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";
export default class Inventory{
    constructor(){
        this.unprocessedProducts = Products.unprocessedProducts.tier1;
        this.processedProducts = Products.processedProducts.tier1;

        EventBus.on(events.POPULARITY_INCREASED, (popularityLevel) => this.inventoryChange(popularityLevel));

        this.money = 0;
    }

    inventoryChange(popularityLevel) {
        // Cambia la cantidad de productos en función del nivel de popularidad
        switch (popularityLevel) {
            case 2: // Tier 2
                Object.assign(this.unprocessedProducts, Products.unprocessedProducts.tier2);
                Object.assign(this.processedProducts, Products.processedProducts.tier2);
                break;
        }
    }
    // Producir un producto no procesadoÇ
    // PARA LOS EDIFICIOS DE PRODUCCIÓN
    produceProduct(product, amount = 1) { // Producto que se quiere producir y su cantidad
        product.quantity += amount;
    }
    // Producir un producto procesado
    // PARA LOS EDIFICIOS DE PROCESADO
    processProduct(productWanted, amount = 1) { // Producto que se quiere producir y su cantidad
        Object.entries(productWanted.neededProducts).forEach(([key, quantity]) => {
            this.unprocessedProducts[key].quantity -= quantity * amount;
        });
        productWanted.quantity += amount;
    }
    // Vender productos
    // PARA LOS PEDIDOS
    sellProduct(product, amount = 1) { // Producto que se quiere vender y su cantidad
        this.money += product.price * amount;
        product.quantity -= amount;
    }
    // Comprueba si hay suficientes productos no procesados
    // PARA LOS EDIFICIOS DE PROCESADO
    checkUnprocessedProducts(productWanted, amount = 1) { // Producto que se quiere producir y su cantidad
        Object.entries(productWanted.neededProducts).forEach(([key, quantity]) => {
            if (this.unprocessedProducts[key].quantity < quantity * amount) {
                return false;
            }
        });
        return true;
    }
    // Comprueba si hay suficientes productos procesados
    // PARA LOS PEDIDOS
    checkProcessedProducts(productsWanted, quantities) { // Array de productos requeridos y array de cantidades requeridas
        productsWanted.forEach(element => {
            if (element.quantity < quantities[element.id]) {
                return false;
            }
        });
        return true;
    }

    // Comprueba si hay suficiente dinero
    hasEnoughMoney(amount) {
        return this.money >= amount;
    }
    // Quita dinero
    removeMoney(amount) {
        this.money -= amount;
    }
}