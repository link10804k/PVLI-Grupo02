import FloatingMessage from "./FloatingMessage.js";
import ProductionTimer from "./Timer.js";

export default class Building extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, name, description, products, productionSpeed = 1.0, isProcessor = false, audio) {

        super(scene, x, y, texture);
        scene.add.existing(this);

        this.name = name;
        this.originalTexture = texture;
        this.description = description;
        this.products = products;
        this.productionSpeed = productionSpeed;
        this.isProcessor = isProcessor;
        this.audio = audio;
        this.inventory = this.scene.playerInventory;

        this.assignedWorkers = 0;
        this.upgradeTier = 1;

        this.setScale(1);

        this.ui = this.scene.scene.get("UIScene");

        // Hacerlo interactivo
        this.setInteractive({ useHandCursor: true });

        this.on("pointerover", () => this.setTint(0x999999));
        this.on("pointerout", () => this.clearTint());
        this.on("pointerdown", () => this.setTint(0x666666));
        this.on("pointerup", () => {
            this.clearTint();
            this.showProductionMenu();
        });
    }

    // -------------------------------------------------------
    // PRODUCCIÓN
    // -------------------------------------------------------
    produce(product) {

        if (this.assignedWorkers <= 0) {
            new FloatingMessage(this.ui, "No hay trabajadores asignados.");
            return;
        }

        if (this.productionTimer) {
            this.cancelProduction(true);
        }

        if (product.buildingTexture) {
            this.setTexture(product.buildingTexture);
        }

        this.productionCancelled = false;

        if (this.isProcessor && !this.inventory.checkUnprocessedProducts(product, this.assignedWorkers)) {
            new FloatingMessage(this.ui, `No hay suficientes recursos para ${product.name}`);
            return;
        }

        const duration = product.time * this.productionSpeed;

        this.productionTimer = new ProductionTimer(
            this.scene,
            this.x,
            this.y - 40,
            duration,
            product.texture,
            null,
            false,
            this
        ).setScale(0.5);

        this.productionTimer.start();

        // sonido
        if (this.audio) {
            this.scene.sound.play(this.audio, { volume: 0.25 });
        }

        this.productionUpdateCallback = () => {

            if (this.productionCancelled) return;

            if (this.isProcessor && !this.inventory.checkUnprocessedProducts(product, this.assignedWorkers)) {
                new FloatingMessage(this.ui, "Faltan recursos.");
                return;
            }

            if (this.productionTimer && this.productionTimer.finished) {

                if (this.isProcessor) {
                    this.inventory.processProduct(product, this.assignedWorkers);
                } else {
                    this.inventory.produceProduct(product, this.assignedWorkers);
                }

                console.log(`${this.name} produjo ${product.name}`);

                // 🔥 Notificar al tutorial
                const tutoUI = this.scene.scene.get("TutorialUIScene");
                if (tutoUI && tutoUI.tutorial) {
                    tutoUI.tutorial.notify("PRODUCE_PRODUCT");
                }

                this.productionTimer.destroy();
                this.productionTimer = null;

                this.scene.events.off("update", this.productionUpdateCallback);
                this.productionUpdateCallback = null;

                this.produce(product);
            }
        };

        this.scene.events.on("update", this.productionUpdateCallback);
    }

    // -------------------------------------------------------
    // MENÚ DE PRODUCCIÓN
    // -------------------------------------------------------
    showProductionMenu() {
        this.scene.scene.launch("ProductionMenuScene", {
            building: this,
            mainScene: this.scene,
            products: this.products
        });

        this.scene.scene.pause();
        this.scene.UIScene.scene.pause();
    }

    // -------------------------------------------------------
    // CANCELAR PRODUCCIÓN
    // -------------------------------------------------------
    cancelProduction(keepTexture = false) {

        if (!this.productionTimer) return;

        this.productionCancelled = true;

        if (!keepTexture) this.setTexture(this.originalTexture);

        this.productionTimer.destroy();
        this.productionTimer = null;

        if (this.productionUpdateCallback) {
            this.scene.events.off("update", this.productionUpdateCallback);
            this.productionUpdateCallback = null;
        }
    }

    // -------------------------------------------------------
    // TRABAJADORES
    // -------------------------------------------------------
    addWorker(textObj) {
        if (this.inventory.availableWorkers <= 0) {
            new FloatingMessage(this.ui, "No hay trabajadores disponibles.");
            return;
        }

        this.assignedWorkers++;
        this.inventory.availableWorkers--;
        this.scene.workersUI.setText(`${this.inventory.availableWorkers}/${this.inventory.workers}`);
        textObj.setText(`Workers: ${this.assignedWorkers}`);
    }

    removeWorker(textObj) {

        if (this.assignedWorkers <= 0) return;

        this.assignedWorkers--;
        this.inventory.availableWorkers++;
        this.scene.workersUI.setText(`${this.inventory.availableWorkers}/${this.inventory.workers}`);
        textObj.setText(`Workers: ${this.assignedWorkers}`);

        if (this.assignedWorkers === 0) this.cancelProduction(false);
    }
}

