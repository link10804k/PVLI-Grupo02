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
    // Producir un producto no procesado
    // PARA LOS EDIFICIOS DE PRODUCCIÓN
    produceProduct(product, amount = 1) { // Producto que se quiere producir y su cantidad
        product.quantity += amount;
    }
    // Producir un producto procesado
    // PARA LOS EDIFICIOS DE PROCESADO
    processProduct(productWanted, amount = 1) { // Producto que se quiere producir y su cantidad
        Object.entries(productWanted.neededProducts).forEach(([key, value]) => {
            this.unprocessedProducts[key].quantity -= value * amount;
        });
        productWanted.quantity += amount;
    }
    // Vender productos
    // PARA LOS PEDIDOS
    sellProducts(products, amounts) { // Array de productos que se quieren vender y array de cantidades
        products.forEach((element, index) => {
            this.money += element.price * amounts[index];
            element.quantity -= amounts[index];
        });
    }
    // Comprueba si hay suficientes productos no procesados
    // PARA LOS EDIFICIOS DE PROCESADO
    checkUnprocessedProducts(productWanted, amount = 1) { // Producto que se quiere producir y su cantidad
        let canProduce = true;
        Object.entries(productWanted.neededProducts).forEach(([key, quantity]) => {
            if (this.unprocessedProducts[key].quantity < quantity * amount) {
                canProduce = false;
            }
        });
        return canProduce;
    }
    // Comprueba si hay suficientes productos procesados
    // PARA LOS PEDIDOS
    checkProcessedProducts(productsWanted, quantities) { // Array de productos requeridos y array de cantidades requeridas
        let canSell = true;
        productsWanted.forEach((element, index) => {
            if (element.quantity < quantities[index]) {
                canSell = false;
            }
        });
        return canSell;
    }

    // Comprueba si hay suficiente dinero
    // PARA COMPRAS
    hasEnoughMoney(amount) {
        return this.money >= amount;
    }
    // Quita dinero
    // PARA COMPRAS
    removeMoney(amount) {
        this.money -= amount;
    }
}