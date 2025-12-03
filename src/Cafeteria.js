import Tile from "./Tile.js";
import CustomersManager from "./CustomersManager.js";
import Button from "./Button.js";

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

    this.customersManager = new CustomersManager(scene, this);
    this.cafetera = new Tile(this.scene, this.x +100, this.y - 150, "button", false, true).setScale(0.5);

    this.gacha = new Button(this.scene, this.x + 100, this.y, "button", () => this.displayGachaScene()).setScale(0.5);
  }

  displayGachaScene() {
    this.scene.scene.launch("GachaScene", { inventory: this.inventory });

    this.scene.scene.pause();
    this.scene.UIScene.scene.pause();
  }
}