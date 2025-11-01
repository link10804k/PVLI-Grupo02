import Resource from "./Resource.js"
export default class Inventory{
    constructor(){
        this.resources = {
            coffeeGrain: new Resource ("coffeeGrain", "Simple grain of coffee. Used for making standard coffee.", 3, 0),
            teaHerbs: new Resource("teaHerbs", "Common herbs of tea. Used for making green tea.", 6, 0)
    };

        this.products = {};
    }

    // Devuelve true si hay la cantidad suficiente del recurso especificado
    minimumResources(name, amount = 1){
        return (this.resources[name] || 0) >= amount;
    }

    // Aumenta la cantidad de un recurso de la lista si existe, y si no, lo crea y le asigna la cantidad determinada
    addResource(resource){
        if(!this.resources[resource.name]){
            Object.defineProperty(this.resources, resource.name, { value: resource.amount, writable: true, enumerable: true,  configurable: true });
        }
        
        this.resources[resource.name].amount += resource.amount;
        console.log("La cantidad de ", resource.name, " es: ", this.resources[resource.name].amount);
    }

     // Aumenta la cantidad de un producto de la lista si existe, y si no, lo crea y le asigna la cantidad determinada
    addProduct(name, amount){
        if(!this.products[name]){
            Object.defineProperty(this.products, name, { value: 0, writable: true, enumerable: true,  configurable: true });
        }
        
        this.products[name].amount += amount;
        console.log("La cantidad de ", name, " es: ", this.products[name].amount);
    }

    // Reduce la cantidad de un producto de la lista si existe
    removeProduct(name, amount = 1){
        if(this.hayProducto(this.products[name], 1)) 
        {
            this.products[name].amount -= amount;
            console.log("Se ha reducido la cantidad de ", name, " del inventario en ", amount);
        }

        else console.log("No se ha podido eliminar: ", name);
    }
}