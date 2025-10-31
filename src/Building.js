import GameButton from "./GameButton.js";
export default class Building extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture = "building", name, description, resources = [], productionSpeed = 1.0, ) {
        super(scene, x, y, texture);

        scene.add.existing(this);

        this.name = name;
        this.description = description;
        this.resources = resources; // Array de recursos
        this.productionSpeed = productionSpeed; // Ratio de velocidad
        this.inventory = null;      // Por ahora sin implementar
        this.currentResource = null; // Recurso actual
        this.hasWorker = false;     // Booleano trabajador
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

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }
}