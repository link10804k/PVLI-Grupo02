import ProductionTimer from "./Timer.js";
export default class Building extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture = "building", name, description, products, productionSpeed = 1.0, isProcessor = false) {
        super(scene, x, y, texture);

        scene.add.existing(this);

        this.name = name;
        this.description = description;
        this.products = products; // Array de recursos
        this.productionSpeed = productionSpeed; // Ratio de velocidad
        this.currentResource = null; // Recurso actual
        this.assignedWorkers = 0;     // Número de trabajadores
        this.upgradeTier = 0;       // Nivel de mejora
        this.isProcessor = isProcessor; // Indica si el edificio es de producción o de procesado
        this.inventory = this.scene.playerInventory;
        
        this.setScale(0.4);

    //Hacer el sprite interactivo
    this.setInteractive({ useHandCursor: true });

    //Efectos visuales (oscurecimiento)
    this.on("pointerover", () => {
      this.setTint(0x999999); // oscurece un poco
    });

    this.on("pointerout", () => {
      this.clearTint(); // vuelve al color original
    });

    this.on("pointerdown", () => {
      this.setTint(0x666666); // más oscuro al hacer clic
    });

    this.on("pointerup", () => {
      this.clearTint();
      this.showProductionMenu(); // abre el menú
    });

        // Variables para el temporizador manual
        this.timerRunning = false;
        this.timeLeft = 0;

    }
    

   produce(product) {
    if (this.assignedWorkers <= 0) {
        console.log("No hay ningun trabajador en este edificio");
        return;
    }

    // Evita crear múltiples timers encima del mismo edificio
    if (this.productionTimer) {
       this.cancelProduction();
        return;
    }

    // Si es un edificio de procesado, comprobar materias primas
    if (this.isProcessor && !this.inventory.checkUnprocessedProducts(product)) {
        console.log(`No hay suficientes materias primas para producir ${product.name}`);
        return;
    }

    this.productionCancelled = false; // Resetear estado de cancelación

    const duration = product.time * this.productionSpeed;

    // Crear un contador circular sobre el edificio
    this.productionTimer = new ProductionTimer(
        this.scene,
        this.x,
        this.y - 60, // un poco arriba del edificio
        duration,
        product.texture   // icono del producto
    );

    this.productionTimer.start();

    // Cuando termine → producir y reiniciar
    // Guardar el callback para poder desconectarlo después
    this.productionUpdateCallback = () => {

        // si fue cancelado, no hacemos nada
        if (this.productionCancelled) return;

        // Si es un edificio de procesado, comprobar materias primas en el caso de que hayan cambiado
        if (this.isProcessor && !this.inventory.checkUnprocessedProducts(product)) {
            console.log(`No hay suficientes materias primas para producir ${product.name}`);
            return;
        }

        if (this.productionTimer && this.productionTimer.finished) {

            // producir recurso
            if (this.isProcessor) { // Método que también resta las materias primas correspondientes
                this.inventory.processProduct(product);
            }
            else {
                this.inventory.produceProduct(product);
            }
            console.log(`${this.name} produjo ${product.name}`);

            // eliminar timer
            this.productionTimer.destroy();
            this.productionTimer = null;

            // limpiar el callback de update antes de reiniciar
            this.scene.events.off("update", this.productionUpdateCallback);
            this.productionUpdateCallback = null;

            // reiniciar producción (loop)
            this.produce(product);
        }
    };
           // Registrar listener
    this.scene.events.on("update", this.productionUpdateCallback);
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
        this.scene.UIScene.scene.pause();
    }

    showProductionMenu() {
        this.scene.scene.launch("ProductionMenuScene", { building: this, mainScene: this.scene, products: this.products });
        this.scene.scene.pause();
        this.scene.UIScene.scene.pause();
    }

    cancelProduction() {
    // Si no hay producción activa, salir
    if (!this.productionTimer) return;

    console.log(`Producción en ${this.name} cancelada.`);

    // Flag para indicar cancelación y evitar producción al acabar
    this.productionCancelled = true;

    // Destruir el timer visual
    this.productionTimer.destroy();
    this.productionTimer = null;

    // quitar callback del update
    if (this.productionUpdateCallback) {
        this.scene.events.off("update", this.productionUpdateCallback);
        this.productionUpdateCallback = null;
    }
}
}
