import Button from "./Button.js";
import Inventory from "./inventory.js";

export default class Cafeteria extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, kitchen, cashier, inventory, clients = [], capacity, building, texture = "cafeteria") {
    super(scene, x, y, texture);

      scene.add.existing(this);

      this.inventory = inventory;

      this.kitchen = kitchen;
      this.cashier = cashier;
      this.clients = clients;
      this.capacity = capacity;
      this.workers = 0;

    this.Cafetera = new Button(this.scene, this.x +100, this.y - 150, "button", () => this.showCoffeSelectionMenu())
        .setOrigin(0.5, 0.5);
    }
    
    showCoffeSelectionMenu() {
      this.scene.scene.launch("CoffeSelectionMenu", {
        Cafeteria: this,
        mainScene: this.scene,
    });
    this.scene.scene.pause();
  }

CookingTime(duration, typeOfDrink) {
  if (this.timerActive) return;
  this.timerActive = true;

  // Desactivar el botón Cafetera mientras está activo
  this.Cafetera.disableInteractive();

  // Crear elementos visuales del temporizador
  const { timerBox, timerText } = this.createTimerUI();

  // Iniciar el temporizador
  this.startTimer(duration, timerText, timerBox, typeOfDrink);
}

/** Crea el fondo y el texto del temporizador */
createTimerUI() {
  const timerBox = this.scene.add.rectangle(
    this.x, this.y - 100, 120, 40, 0x000000, 0.6
  ).setOrigin(0.5).setDepth(1000);

  const timerText = this.scene.add.text(
    this.x, this.y - 100, "Tiempo: --", { fontSize: "20px", color: "#ffffff" }
  ).setOrigin(0.5).setDepth(1001);

  return { timerBox, timerText };
}

/** Lógica del temporizador */
startTimer(duration, timerText, timerBox, typeOfDrink) {
  let timeLeft = duration;
  timerText.setText(`Tiempo: ${timeLeft}`);

  this.scene.time.addEvent({
    delay: 1000,
    repeat: duration,
    callback: () => {
      timeLeft--;
      if (timeLeft > 0) {
        timerText.setText(`Tiempo: ${timeLeft}`);
      } else {
        timerText.setText("¡Listo!");
        this.finishCooking(timerText, timerBox, typeOfDrink);
      }
    },
  });
}

/** Se ejecuta al terminar el proceso */
finishCooking(timerText, timerBox, typeOfDrink) {
  // Añadir producto al inventario
  if (this.inventory?.addProduct) {
    this.inventory.addProduct(typeOfDrink, 1);
  } else {
    console.warn("Inventario no válido o método addProduct no encontrado:", this.inventory);
  }

  // Reactivar el botón Cafetera
  this.Cafetera.setInteractive();
  this.timerActive = false;

  // Eliminar los elementos del temporizador tras un breve retraso
  this.scene.time.delayedCall(1500, () => {
    timerText.destroy();
    timerBox.destroy();
  });
 }
}