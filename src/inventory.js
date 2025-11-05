import Products from "./Resources/Products.js" with { type: "json"}
export default class Inventory{
    constructor(){
        this.unprocessedProducts = Products.unprocessedProducts.tier1;

        this.processedProducts = Products.processedProducts.tier1;

        this.money = 0;
    }

     // Aumenta la cantidad de un producto de la lista si existe, y si no, lo crea y le asigna la cantidad determinada
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
