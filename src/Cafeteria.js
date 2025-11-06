import Cafetera from "./Cafetera.js";

export default class Cafeteria extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture = "cafeteria", kitchen, cashier, inventory, clients = [], capacity, building) {
    super(scene, x, y, texture);
      scene.add.existing(this);

      this.kitchen = kitchen;
      this.cashier = cashier;

      this.inventory = inventory;
      this.scene.playerInventory = inventory;

      this.clients = clients;
      this.capacity = capacity;
      this.workers = 0;

    this.cafetera = new Cafetera(this.scene, this.x +100, this.y - 150, this.inventory);
    }
}