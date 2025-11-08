import Building from "./Building.js";
import Button from "./Button.js";

export default class Cafetera extends Building {
  constructor(scene, x, y, inventory) {
    super(scene, x, y, "button", "Cafetera", "Produce café caliente");

  this.inventory = inventory;
  this.setScale(0.5);
  this.assignedWorkers = 0; 

  this.off("pointerup");

  this.on("pointerup", () => {
    this.clearTint();
    this.showCoffeSelectionMenu();
  });
}

  produce(resource) {
    if(this.assignedWorkers > 0)
    {
      if (!resource) {
        console.warn("La cafetera no tiene recurso asignado.");
        return;
      }

      const targetInventory = this.inventory || this.scene.playerInventory;

     if(!targetInventory) {
        console.warn("No se encontró inventario para añadir el recurso.");
        return;
      }

      if (targetInventory.checkUnprocessedProducts(resource, 1))
      {
        targetInventory.processProduct(resource, 1);
        console.log(`${this.name} ha producido 1 ${resource.name}`);
      }
        
      else console.log("No existen recursos suficientes para producir: ", resource.name);
    }
    
    else console.log("No hay ningun trabajador en este edificio");
  } 

  showCoffeSelectionMenu() {
      this.scene.scene.launch("CoffeSelectionMenu", {
        cafetera: this,
        inventory: this.inventory,
        mainScene: this.scene,
    });
    this.scene.scene.pause();
    this.scene.UIScene.scene.pause();
  }

  
  CookingTime(duration, typeOfDrink) {
    if (this.timerActive) return;
    this.timerActive = true;

    // Desactivar el botón Cafetera mientras está activo
    this.disableInteractive();

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
  this.setInteractive();
  this.timerActive = false;

  // Eliminar los elementos del temporizador tras un breve retraso
  this.scene.time.delayedCall(1500, () => {
    timerText.destroy();
    timerBox.destroy();
  });
 }
}