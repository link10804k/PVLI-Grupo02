import Button from "./Button.js";
export default class Building extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture = "building", name, description, resources = [], productionSpeed = 1.0) {
        super(scene, x, y, texture);

        scene.add.existing(this);

        this.name = name;
        this.description = description;
        this.resources = resources; // Array de recursos
        this.productionSpeed = productionSpeed; // Ratio de velocidad
        this.inventory = null;      // Por ahora sin implementar
        this.currentResource = null; // Recurso actual
        this.assignedWorkers = 0;     // Número de trabajadores
        this.upgradeTier = 0;       // Nivel de mejora

        new Button(this.scene, this.x +100, this.y, "button", () => this.showProductionMenu()).setOrigin(0.5, 0.5);
        new Button(this.scene, this.x -100, this.y, "button", () => this.showExtraMenu()).setOrigin(0.5, 0.5);
    }

    produce(resource) {
        // Lógica de producción de recursos
        setTimeout(this.scene.playerInventory.addResource(resource.name, 1), resource.productionTime);
        console.log(`${this.name} está produciendo ${productName}...`);
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

    removeWorker(text){
        if (this.assignedWorkers > 0) {
            this.assignedWorkers--;
            text.setText(`Workers: ${this.assignedWorkers}`);
        }
    }

    showExtraMenu() {
        this.scene.scene.launch("BuildingWorkerScene", { building: this });
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
}