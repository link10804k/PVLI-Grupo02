import GameButton from "./GameButton.js";
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

        new GameButton(this, this.x, this.y, "button", function() { new ProductionMenu(this.scene, this.x, this.y, "order", this); }).setOrigin(0.5, 0.5);
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

    showExtraMenu() {
        if (this.menuAbierto) return;
        this.menuAbierto = true;

        const menuElements = []

        //Crea el panel
        const panel = this.scene.add.image(this.x, this.y, "panel")
            .setScale(2)
            .setOrigin(0.8);
        menuElements.push(panel);

        const text = this.scene.add.text(this.x - 300, this.y - 100, `Workers: ${this.assignedWorkers}`, {
            fontSize: "20px",
            color: "#fff",
            }).setOrigin(0.5).setScale(2);
            
        menuElements.push(text);

        //Crea los dos botones para añadir y quitar trabajadores
        const addButton = new WorkerButton(
            this.scene,
            this.x - 50,
            this.y + 70,
            "button",
            this.addWorker.bind(this, text)
        ).setOrigin(0.5).setScale(0.2);
        menuElements.push(addButton);

        const removeButton = new WorkerButton(
            this.scene,
            this.x - 400,
            this.y + 70,
            "menos",
            this.removeWorker.bind(this, text)
        ).setOrigin(0.5).setScale(0.2);
        menuElements.push(removeButton);

         const closeButton = new WorkerButton(
            this.scene,
            this.x,
            this.y - 70,
            "menos",
            this.hideExtraMenu.bind(this, menuElements)
        ).setOrigin(0.5).setScale(0.2);
        menuElements.push(closeButton);
    }
    hideExtraMenu(menuElements) {
        menuElements.forEach(element => {
            element.destroy();
            this.menuAbierto = false;
        });
    }
}