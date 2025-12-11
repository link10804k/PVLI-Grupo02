import Tile from "./Tile.js";
import CustomersManager from "./CustomersManager.js";

export default class Cafeteria extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture = "cafeteria", inventory) {
    super(scene, x, y, texture);
    scene.add.existing(this);

    this.inventory = inventory;
    //this.scene.playerInventory = inventory;

    this.workers = 0;

    this.customersManager = new CustomersManager(scene, this);

    // Slots cafeteras
    new Tile(this.scene, this.x + 80, this.y - 150, false, true).setScale(0.5);
    new Tile(this.scene, this.x + 100, this.y - 150, false, true).setScale(0.5);
    new Tile(this.scene, this.x + 120, this.y - 150, false, true).setScale(0.5);
    new Tile(this.scene, this.x + 140, this.y - 150, false, true).setScale(0.5);
  }
}