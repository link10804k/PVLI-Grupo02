//import {worker} from "Worker.js";
//import {productName} from "Product.js";
//import {client} from "Client.js";
import Building from "./Building";

export default class Cafeteria extends Building{
  constructor(scene, x, y, texture = "cafeteria", kitchen, cashier, inventory, clients = [], capacity) {   
      super(scene, x , y, texture)

      scene.add.existing(this);

        this.kitchen = kitchen;
        this.cashier = cashier;
        this.inventory = inventory;
        this.clients = clients;
        this.capacity = capacity;
    }
    deliverOrder(client) {
    // Lógica para entregar el pedido al cliente
    }
}