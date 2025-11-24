import Products from "./Resources/Products.json" with { type: "json"}
import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";
export default class Inventory{
    constructor(scene, money){
        this.unprocessedProducts = structuredClone(Products.unprocessedProducts.tier1);
        this.processedProducts = structuredClone(Products.processedProducts.tier1);

        EventBus.on(events.POPULARITY_INCREASED, (popularityLevel) => this.inventoryChange(popularityLevel));
        
        this.money = money;
        this.mainScene = scene;
    }

    inventoryChange(popularityLevel) {
        // Cambia la cantidad de productos en función del nivel de popularidad
        Object.assign(this.unprocessedProducts, Products.unprocessedProducts[`tier${popularityLevel}`]);
        Object.assign(this.processedProducts, Products.processedProducts[`tier${popularityLevel}`]);
    }
    // Producir un producto no procesado
    // PARA LOS EDIFICIOS DE PRODUCCIÓN
    produceProduct(product, amount = 1) { // Producto que se quiere producir y su cantidad
        product.quantity += amount;

        console.log("La cantidad de ", product.name, " es: ", product.quantity);
    }
    // Producir un producto procesado
    // PARA LOS EDIFICIOS DE PROCESADO
    processProduct(productWanted, amount = 1) { // Producto que se quiere producir y su cantidad
        Object.entries(productWanted.neededProducts).forEach(([key, value]) => {
            this.unprocessedProducts[key].quantity -= value * amount;
            console.log("La cantidad de ", this.unprocessedProducts[key].name, " es: ", this.unprocessedProducts[key].quantity);
        });

        productWanted.quantity += amount;

        console.log("La cantidad de ", productWanted.name, " es: ", productWanted.quantity);
    }
    // Vender productos
    // PARA LOS PEDIDOS
    sellProducts(products, amounts) { // Array de productos que se quieren vender y array de cantidades
        products.forEach((element, index) => {
            this.money += element.price * amounts[index];
            element.quantity -= amounts[index];
        });

        this.mainScene.updateMoneyUI();
    }
    // Comprueba si hay suficientes productos no procesados
    // PARA LOS EDIFICIOS DE PROCESADO
    checkUnprocessedProducts(productWanted, amount = 1) { // Producto que se quiere producir y su cantidad
        let canProduce = true;
        Object.entries(productWanted.neededProducts).forEach(([key, value]) => {
            if (this.unprocessedProducts[key].quantity < value * amount) {
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

    getUnprocessedProductsFromTier(tier) {
        let productKeys = Object.keys(Products.unprocessedProducts[`tier${tier}`]);
        let list = [];

        productKeys.forEach((key) => {
            list.push(this.unprocessedProducts[key]);
        });

        return list;
    }
    getProcessedProductsFromTier(tier) {
        let productKeys = Object.keys(Products.processedProducts[`tier${tier}`]);
        let list = [];

        productKeys.forEach((key) => {
            list.push(this.processedProducts[key]);
        });

        return list;
    }
}