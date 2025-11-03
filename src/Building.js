import Button from "./Button.js";

export default class Building extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture = "building", name, description, resources, productionSpeed = 1.0) {
        super(scene, x, y, texture);

        scene.add.existing(this);

        this.name = name;
        this.description = description;
        this.resources = resources; // Array de recursos
        this.productionSpeed = productionSpeed; // Ratio de velocidad
        this.currentResource = null; // Recurso actual
        this.assignedWorkers = 0;     // Número de trabajadores
        this.upgradeTier = 0;       // Nivel de mejora

        // Variables para el temporizador manual
        this.timerRunning = false;
        this.timeLeft = 0;

        new Button(this.scene, this.x +100, this.y, "button", () => this.showProductionMenu()).setOrigin(0.5, 0.5);
        new Button(this.scene, this.x -100, this.y, "button", () => this.showWorkerMenu()).setOrigin(0.5, 0.5);
    }

    produce(resource) {
        if (!resource || !resource.productionTime) {
            console.warn("Recurso inválido en produce()");
            return;
        }

        if(this.assignedWorkers > 0)
        {
            new Phaser.Time.TimerEvent({
            callback: this.scene.playerInventory.addResource(resource),
            delay: resource.productionTime * 1000,
            loop: true
            });

            console.log(`${this.name} está produciendo ${resource.name}...`);
        }
        
        else console.log("No hay ningun trabajador en este edificio");
    }

    upgrade() {
        // Lógica de mejora
        this.upgradeTier++;
        console.log(`${this.name} ha sido mejorado al nivel ${this.upgradeTier}`);
    }
    
    addWorker(text) {
        this.assignedWorkers++;
        text.setText(`Workers: ${this.assignedWorkers}`);
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    addWorker(text) {
        this.assignedWorkers++;
        text.setText(`Workers: ${this.assignedWorkers}`);
    }

    removeWorker(text){
        if (this.assignedWorkers > 0) {
            this.assignedWorkers--;
            text.setText(`Workers: ${this.assignedWorkers}`);
        }
    }

    showWorkerMenu() {
        this.scene.scene.launch("BuildingWorkerScene", { building: this, mainScene: this.scene });
        this.scene.scene.pause();
    }

    showProductionMenu() {
        this.scene.scene.launch("ProductionMenuScene", { building: this, mainScene: this.scene, resources: this.resources });
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
