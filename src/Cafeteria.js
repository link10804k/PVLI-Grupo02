import Button from "./Button.js";

export default class Cafeteria extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture = "cafeteria", kitchen, cashier, inventory, clients = [], capacity) {   
      super(scene, x , y, texture)

      scene.add.existing(this);

      this.kitchen = kitchen;
      this.cashier = cashier;
      this.inventory = inventory;
      this.clients = clients;
      this.capacity = capacity;
      this.workers = 0;

      new Button(this.scene, this.x +100, this.y, "button", () => this.showCoffeSelectionMenu()).setOrigin(0.5, 0.5);
    }
    deliverOrder(client) {
    // Lógica para entregar el pedido al cliente
    }

    startTimer(timeLeft) {
      this.timerEvent.setText = (`Tiempo: ${timeLeft}`);

      this.timerEvent = this.time.addEvent({
        delay: 1000,
        repeat: timeLeft - 1,
        callback: () => {
          timeLeft--;
          this.timerText.setText(`Timer: ${timeLeft}`);
            if (timeLeft <= 0) {
              this.timerText.setText("Time's up!");
            }
          },
      });
    }

    showCoffeSelectionMenu() {
        this.scene.scene.launch("CoffeSelectionMenu", { Cafeteria: this, mainScene: this.scene });
        this.scene.scene.pause();
    }
}