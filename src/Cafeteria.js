import Button from "./Button.js";

export default class Cafeteria extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, kitchen, cashier, inventory, clients = [], capacity, building, texture = "cafeteria") {
    super(scene, x, y, texture);

      scene.add.existing(this);

      this.kitchen = kitchen;
      this.cashier = cashier;
      this.inventory = inventory;
      this.clients = clients;
      this.capacity = capacity;
      this.workers = 0;

      this.building = building;

      new Button(this.scene, this.x +100, this.y, "button", () => this.showCoffeSelectionMenu())
        .setOrigin(0.5, 0.5);
    }
    
    showCoffeSelectionMenu() {
      this.scene.scene.launch("CoffeSelectionMenu", {
        Cafeteria: this, 
        building: this.building,
        mainScene: this.scene 
    });
    this.scene.scene.pause();
  }
}