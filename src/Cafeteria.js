import Building from "./Building.js";
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

    this.Cafetera = new Button(this.scene, this.x +100, this.y, "button", () => this.showCoffeSelectionMenu())
        .setOrigin(0.5, 0.5);
    }
    
    showCoffeSelectionMenu() {
      this.scene.scene.launch("CoffeSelectionMenu", {
        Cafeteria: this,
        mainScene: this.scene 
    });
    this.scene.scene.pause();
  }

startTimer(duration, button) {
  // Si ya hay un temporizador activo, no hacemos nada
  if (this.timerActive) return;

  this.timerActive = true;
  let timeLeft = duration;

  // Crear texto encima del edificio
  const timerText = this.scene.add.text(
    this.x,
    this.y - 70,
    `Tiempo: ${timeLeft}`,
    { fontSize: "20px", color: "#ffffff" }
  ).setOrigin(0.5);

  // Desactivar el botón mientras corre el timer
  if (button) button.disableInteractive();

  // Crear el evento de tiempo usando el sistema de Phaser
  this.timerEvent = this.scene.time.addEvent({
    delay: 1000,          // cada segundo
    repeat: duration - 1, // repetir (duración - 1) veces
    callback: () => {
      timeLeft--;
      timerText.setText(`Tiempo: ${timeLeft}`);

      if (timeLeft <= 0) {
        timerText.setText("¡Listo!");
        this.timerActive = false;

        // Reactivar el botón
        if (button) button.setInteractive();
      }
    }
  });
}
}