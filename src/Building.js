import GameButton from "./GameButton.js";

export default class Building extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture = "building", name, description, resources = [], velocityRatio = 1.0, ) {
        super(scene, x, y, texture);

        scene.add.existing(this);

        this.name = name;
        this.description = description;
        this.resources = resources; // Array de recursos
        this.velocityRatio = velocityRatio; // Ratio de velocidad
        this.inventory = null;      // Por ahora sin implementar
        this.currentResource = null; // Recurso actual
        this.assignedWorkers = 0;     // Número de trabajadores
        this.upgradeTier = 0;       // Nivel de mejora

        let button = new GameButton(this.scene, this.x, this.y, "button", this.showExtraMenu.bind(this)).setOrigin(0.5);
    }

    produce(productName) {
        // Lógica de producción de recursos
        console.log(`${this.name} está produciendo ${productName}...`);
    }

    upgrade() {
        // Lógica de mejora
        this.upgradeTier++;
        console.log(`${this.name} ha sido mejorado al nivel ${this.upgradeTier}`);
    }
    
    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    addWorker(text) {
        this.assignedWorkers++;
        //Crear el worker
        //const worker = new Worker(this.scene, 400, 500, "worker", "factory", true);
        //this.worker = worker;
        text.setText(`Workers: ${this.assignedWorkers}`);
    }

    removeWorker(text){
        this.assignedWorkers--;
        //Eliminar al worker si existe
        //if(this.worker){
        //    this.worker.destroy();
        //    this.worker = null;
        //}

        text.setText(`Workers: ${this.assignedWorkers}`);
    }

    showExtraMenu() {
        let menuElements = []

        //Crea el panel
        const panel = this.scene.add.image(this.x, this.y, "panel")
            .setScale(2)
            .setOrigin(0.8);
        menuElements.push(panel);

        let text = this.scene.add.text(this.x - 300, this.y - 100, `Workers: ${this.assignedWorkers}`, {
            fontSize: "20px",
            color: "#fff",
            }).setOrigin(0.5).setScale(2);
            
        menuElements.push(text);

        //Crea los dos botones para añadir y quitar trabajadores
        const addButton = new GameButton(
            this.scene,
            this.x - 50,
            this.y + 70,
            "button",
            this.addWorker.bind(this, text)
        ).setOrigin(0.5).setScale(0.2);
        menuElements.push(addButton);

        const removeButton = new GameButton(
            this.scene,
            this.x - 400,
            this.y + 70,
            "menos",
            this.removeWorker.bind(this, text)
        ).setOrigin(0.5).setScale(0.2);
        menuElements.push(removeButton);

         const closeButton = new GameButton(
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
        });
    }
}