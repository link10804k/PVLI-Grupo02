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
        this.hasWorker = false;     // Booleano trabajador
        this.upgradeTier = 0;       // Nivel de mejora
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
}