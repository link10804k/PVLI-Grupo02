//import {worker} from "Worker.js";
//import {productName} from "Product.js";
//import {client} from "Client.js";

export default class Cafeteria extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture = "cafeteria", kitchen, cashier, inventory, clients = [], capacity) {   
      super(scene, x , y, texture)

      scene.add.existing(this);

        this.kitchen = kitchen;
        this.cashier = cashier;
        this.inventory = inventory;
        this.clients = clients;
        this.capacity = capacity;

    
    }

    produce() {
    // Lógica de producción de recursos
    console.log(`${this.name} está produciendo recursos...`);
    }

    upgrade() {
    // Lógica de mejora
        this.upgradeTier++;
        console.log(`${this.name} ha sido mejorado al nivel ${this.upgradeTier}`);
    }

    deliverOrder( client) {
    // Lógica para entregar el pedido al cliente
    }

  

  //CRAFTEAR PRODUCTOS--------------------------------------------------------------
    craftProduct(productName) {
    switch (productName) {
        case cafe:
            // Lógica para craftear café
            break;
        case te:
            // Lógica para craftear té
            break;
       
        default:
            break;
    }
  }
}