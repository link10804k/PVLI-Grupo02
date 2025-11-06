import Building from "./Building.js";
import Button from "./Button.js";

export default class Cafetera extends Building {
  constructor(scene, x, y, inventory) {
    super(scene, x, y, "cafetera", "Cafetera", "Produce café caliente");

  this.inventory = inventory;
  this.setScale(0.5);

  this.Button = new Button(this.scene, this.x, this.y + 100, "button", () => this.showCoffeSelectionMenu()).setOrigin(0.5, 0.5);
  }

  produce(resource) {
    if (!resource) {
        console.warn("La cafetera no tiene recurso asignado.");
        return;
    }

    console.log(`${this.name} produce ${resource.name}...`);

    this.scene.time.addEvent({
        delay: resource.productionTime * 1000 ,
        callback: () => {
          this.scene.playerInventory.addResource(resource);
          console.log(`${this.name} ha producido ${resource.amount} ${resource.name}`);
        },
        loop: true
    });
  }  

  showCoffeSelectionMenu() {
      this.scene.scene.launch("CoffeSelectionMenu", {
        cafetera: this,
        inventory : this.inventory,
        mainScene: this.scene,
    });
    this.scene.scene.pause();
  }

  
CookingTime(duration, typeOfDrink) {
  if (this.timerActive) return;
  this.timerActive = true;

  // Desactivar el botón Cafetera mientras está activo
  this.Button.disableInteractive();

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
  this.produce(typeOfDrink);

  // Reactivar el botón Cafetera
  this.Button.setInteractive();
  this.timerActive = false;

  // Eliminar los elementos del temporizador tras un breve retraso
  this.scene.time.delayedCall(1500, () => {
    timerText.destroy();
    timerBox.destroy();
  });
 }
}