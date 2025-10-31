export default class Inventory{
    constructor(){
        this.resources = {
            cafe: 0,
            te: 0
        };

        this.products = {};
    }

    // Devuelve true si hay la cantidad suficiente del recurso especificado
    minimumResources(name, amount = 1){
        return (this.resources[name] || 0) >= amount;
    }

    // Aumenta la cantidad de un recurso de la lista si existe, y si no, lo crea y le asigna la cantidad determinada
    addResource(name, amount = 1){
        if(!this.resources[name]){
            Object.defineProperty(this.resources, name, { value: 0, writable: true, enumerable: true,  configurable: true });
        }
        
        this.resources[name] += amount;
        console.log("La cantidad de ", name, " es: ", this.resources[name]);
    }

     // Aumenta la cantidad de un producto de la lista si existe, y si no, lo crea y le asigna la cantidad determinada
    addProduct(name, amount){
        if(!this.products[name]){
            Object.defineProperty(this.products, name, { value: 0, writable: true, enumerable: true,  configurable: true });
        }
        
        this.products[name] += amount;
        console.log("La cantidad de ", name, " es: ", this.products[name]);
    }

    // Reduce la cantidad de un producto de la lista si existe
    removeProduct(name, amount = 1){
        if(this.hayProducto(this.products[name], 1)) 
        {
            this.products[name] -= amount;
            console.log("Se ha reducido la cantidad de ", name, " del inventario en ", cantidad);
        }

        else console.log("No se ha podido eliminar: ", name);
    }
}