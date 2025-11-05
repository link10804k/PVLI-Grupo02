import Products from "./Resources/Products.json" with { type: "json"}
import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";
export default class Inventory{
    constructor(){
        this.unprocessedProducts = Products.unprocessedProducts.tier1;
        this.processedProducts = Products.processedProducts.tier1;

        EventBus.on(events.POPULARITY_INCREASED, (popularityLevel) => this.inventoryChange(popularityLevel));

        Object.values(this.unprocessedProducts).forEach(element => {
            console.log(element.name);
        });

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
    
    // Hace el proceso para conseguir un producto procesado
    ProcessProduct(productWanted, amount = 1) {
        Object.values(productWanted.neededProducts).forEach(element => {
            this.removeProduct(element);
        });
        productWanted.quantity += amount;
    }

    //Comprueba si hay suficientes productos
    checkProducts(productsWanted, quantities) {
        let canProduce = true;
        productsWanted.forEach(element => {
            if (element.quantity < quantities[element.id]) {
                canProduce = false;
            }
        });
        return canProduce;
    }
     // Aumenta la cantidad de un producto de la lista
    addProduct(product, amount = 1){
        product.quantity += amount;
    }

    // Quita productos
    removeProduct(product, amount = 1){
        product.quantity -= amount;
    }

    // Añade dinero
    addMoney(amount) {
        this.money += amount;
    }

    // Quita dinero si hay suficiente, si no, devuelve false 
    // (siempre se debería comprobar de antes de hacer nada si este método ha podido quitar dinero)
    // Ej: if (inventory.removeMoney(amount)) { (Hacer lo que sea) } else { (Feedback al jugador de que no tiene suficiente) }
    removeMoney(amount) {
        if (amount <= this.money) {
            this.money -= amount;
            return true;
        }
        else {
            return false;
        }
    }
}