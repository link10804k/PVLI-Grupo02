import FloatingMessage from "./FloatingMessage.js";
import ProductionTimer from "./Timer.js";
export default class Building extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture, name, description, products, productionSpeed = 1.0, isProcessor = false, audio) {
        super(scene, x, y, texture);

        scene.add.existing(this);

        this.name = name;
        this.originalTexture = texture;
        this.description = description;
        this.products = products; // Array de recursos
        this.productionSpeed = productionSpeed; // Ratio de velocidad
        this.currentResource = null; // Recurso actual
        this.assignedWorkers = 0;     // Número de trabajadores
        this.upgradeTier = 1;       // Nivel de mejora
        this.isProcessor = isProcessor; // Indica si el edificio es de producción o de procesado
        this.inventory = this.scene.playerInventory; // Referencia al inventario
        this.audio = audio; // Sonido que hace el edificio al empezar a producir un nuevo recurso

        this.ui = this.scene.scene.get("UIScene");
        
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
       new FloatingMessage(this.ui, "No hay ningun trabajador en este edificio");
        return;
    }

    // Evita crear múltiples timers encima del mismo edificio
    if (this.productionTimer) {
       this.cancelProduction(true); //true = no restaura la textura
        //no se hace return para reiniciar la producción
    }

    // Cambiar textura al nuevo producto si existe
    if (product.buildingTexture) {
        this.setTexture(product.buildingTexture);
    }

    this.productionCancelled = false; // Resetear estado de cancelación

    // Si es un edificio de procesado, comprobar materias primas
    if (this.isProcessor && !this.inventory.checkUnprocessedProducts(product, this.assignedWorkers)) {
        new FloatingMessage(this.ui, `No hay suficientes materias primas para producir ${product.name}`);
        return;
    }


     // Cambiar el sprite del edificio
    if (product.buildingTexture) {
        this.setTexture(product.buildingTexture);
    }

    const duration = product.time * this.productionSpeed;

    // Crear un contador circular sobre el edificio
    this.productionTimer = new ProductionTimer(
        this.scene,
        this.x,
        this.y - 60, // un poco arriba del edificio
        duration,
        product.texture,   // icono del producto
        null,  //no mostrar tiempo en segundos
        false, //change color
        this  //building reference
    );

    this.productionTimer.start();

    // LOOPEA
    this.scene.sound.play(this.audio); // Sonido de producir

    // Cuando termine → producir y reiniciar
    // Guardar el callback para poder desconectarlo después
    this.productionUpdateCallback = () => {

        // si fue cancelado, no hacemos nada
        if (this.productionCancelled) return;

        // Si es un edificio de procesado, comprobar materias primas en el caso de que hayan cambiado
        if (this.isProcessor && !this.inventory.checkUnprocessedProducts(product, this.assignedWorkers)) {
            new FloatingMessage(this.ui, `No hay suficientes materias primas para producir ${product.name}`);
            return;
        }

        if (this.productionTimer && this.productionTimer.finished) {

            // producir recurso
            if (this.isProcessor) { // Método que también resta las materias primas correspondientes
                this.inventory.processProduct(product, this.assignedWorkers);
            }
            else {
                this.inventory.produceProduct(product, this.assignedWorkers);
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
        if (this.inventory.hasEnoughMoney(500 * (this.upgradeTier))) {
        this.upgradeTier++;
        this.productionSpeed += 0.5; // Aumenta la velocidad de producción
        this.inventory.removeMoney(500 * (this.upgradeTier));
        console.log(`${this.name} ha sido mejorado al nivel ${this.upgradeTier}`);

        // Actualizar el texto del nivel de mejora en el menú si está abierto
        if (this.tierText) {
            this.tierText.setText(`Tier: ${this.upgradeTier}`);
        }
    }
    else {
        new FloatingMessage(this.ui, "No tienes suficiente dinero para mejorar este edificio.");
    }
}
    

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    addWorker(text) {
        if (this.inventory.availableWorkers <= 0) {
            new FloatingMessage(this.ui, "No hay trabajadores disponibles en el inventario.");
            return;
        }
        this.assignedWorkers++;
        this.inventory.availableWorkers--;
        this.scene.workersUI.setText(this.inventory.availableWorkers + "/" + this.inventory.workers);

        text.setText(`Workers: ${this.assignedWorkers}`);
    }

    removeWorker(text){
        if (this.assignedWorkers > 0) {
            this.assignedWorkers--;
            this.inventory.availableWorkers++;
            this.scene.workersUI.setText(this.inventory.availableWorkers + "/" + this.inventory.workers);
            text.setText(`Workers: ${this.assignedWorkers}`);

            if (this.assignedWorkers === 0) {
                console.log(`Edificio ${this.name} se quedó sin trabajadores. Producción detenida.`);
                this.cancelProduction(false); 
            // false → restaurar textura original
        }
        }
    }

    showProductionMenu() {
        this.scene.scene.launch("ProductionMenuScene", { building: this, mainScene: this.scene, products: this.products });

        // Guardamos la escena activa para poder actualizar sus textos
        this.activeMenu = this.scene.scene.get("ProductionMenuScene");

        this.scene.scene.pause();
        this.scene.UIScene.scene.pause();
    }

    cancelProduction(keepTexture = false) {
    // Si no hay producción activa, salir
    if (!this.productionTimer) return;

    console.log(`Producción en ${this.name} cancelada.`);

    // Flag para indicar cancelación y evitar producción al acabar
    this.productionCancelled = true;

    // Restaurar textura original
    if (!keepTexture) {
        this.setTexture(this.originalTexture);
    }

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
