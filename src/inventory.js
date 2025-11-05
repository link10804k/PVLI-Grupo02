import Products from "./Resources/Products.json" with { type: "json"}
export default class Inventory{
    constructor(){
        this.unprocessedProducts = Products.unprocessedProducts.tier1;
        this.processedProducts = Products.processedProducts.tier1;

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

     // Aumenta la cantidad de un producto de la lista
    addProduct(product, amount = 1){
        product.quantity += amount;
    }

    // Quita productos si hay suficientes, si no, devuelve false 
    // (siempre se debería comprobar de antes de hacer nada si este método ha podido quitar dinero)
    // Ej: if (inventory.removeProduct(product, amount)) { (Hacer lo que sea) } else { (Feedback al jugador de que no tiene suficiente) }
    removeProduct(product, amount = 1){
        if (amount <= product.quantity) {
            product.quantity -= amount;
            return true;
        }
        else {
            return false;
        }
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