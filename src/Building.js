export default class Building extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture = "building", name, description, products, productionSpeed = 1.0) {
        super(scene, x, y, texture);

        scene.add.existing(this);

        this.name = name;
        this.description = description;
        this.products = products; // Array de recursos
        this.productionSpeed = productionSpeed; // Ratio de velocidad
        this.currentResource = null; // Recurso actual
        this.assignedWorkers = 0;     // Número de trabajadores
        this.upgradeTier = 0;       // Nivel de mejora
        
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
        if(this.assignedWorkers > 0)
        {
            this.timerEvent = this.scene.time.addEvent({
            callback: this.scene.playerInventory.produceProduct(product),
            delay: product.time * 1000,
            loop: true
            });

            console.log(`${this.name} está produciendo ${product.name}...`);
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
        this.scene.scene.launch("ProductionMenuScene", { building: this, mainScene: this.scene, products: this.products });
        this.scene.scene.pause();
    }
}
