import FloatingMessage from "./FloatingMessage.js";
import ProductionTimer from "./Timer.js";

export default class Building extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, name, description, products, productionSpeed = 1.0, isProcessor = false, audio) {

        super(scene, x, y, texture);
        scene.add.existing(this);

        this.mainScene = scene;
        this.name = name;
        this.originalTexture = texture;
        this.description = description;
        this.products = products;
        this.productionSpeed = productionSpeed;
        this.isProcessor = isProcessor;
        this.inventory = this.scene.playerInventory;
        this.audio = audio;

        this.currentResource = null;
        this.assignedWorkers = 0;
        this.upgradeTier = 1;
        this.upgradeCost = 500;

        // RESTAURADO
        this.setScale(1);

        this.ui = this.scene.scene.get("UIScene");

        // ------- INTERACTIVO COMPLETO RESTAURADO -------
        this.setInteractive({ useHandCursor: true });

        this.on("pointerover", () => this.setTint(0x999999));
        this.on("pointerout", () => this.clearTint());
        this.on("pointerdown", () => this.setTint(0x666666));
        this.on("pointerup", () => {
            this.clearTint();
            this.showProductionMenu();
        });

        this.timerRunning = false;
        this.timeLeft = 0;
    }

    // -------------------------------------------------------
    // PRODUCCIÓN COMPLETA (VERSIÓN RESTAURADA + notify)
    // -------------------------------------------------------
    produce(product) {

        if (this.assignedWorkers <= 0) {
            new FloatingMessage(this.ui, "No hay ningun trabajador en este edificio");
            return;
        }

        // Evitar timers dobles
        if (this.productionTimer) {
            this.cancelProduction(true);
        }

        if (product.buildingTexture) {
            this.setTexture(product.buildingTexture);
        }

        this.productionCancelled = false;

        // Check de materia prima RESTAURADO
        if (this.isProcessor && !this.inventory.checkUnprocessedProducts(product, this.assignedWorkers)) {
            new FloatingMessage(this.ui, `No hay suficientes materias primas para producir ${product.name}`);
            return;
        }

        const duration = product.time * this.productionSpeed;

        this.productionTimer = new ProductionTimer(
            this.scene,
            this.x,
            this.y - 60,
            duration,
            product.texture,
            null,
            false,
            this
        );

        if (this.isProcessor) {
            this.productionTimer.setScale(0.2);
            this.productionTimer.y += 35;
        }
        else {
            this.productionTimer.setScale(0.5);
        }

        this.productionTimer.start();

        // sonido
        if (this.audio) {
            this.scene.sound.play(this.audio, { volume: 0.25 });
        }

        // ---------- CALLBACK RESTAURADO ----------
        this.productionUpdateCallback = () => {

            if (this.productionCancelled) return;

            // Rechequeo de materia prima para procesados
            if (this.isProcessor && !this.inventory.checkUnprocessedProducts(product, this.assignedWorkers)) {
                new FloatingMessage(this.ui, `No hay suficientes materias primas para producir ${product.name}`);
                return;
            }

            if (this.productionTimer && this.productionTimer.finished) {

                // producir
                if (this.isProcessor) {
                    this.inventory.processProduct(product, this.assignedWorkers);
                } else {
                    this.inventory.produceProduct(product, this.assignedWorkers);
                }

                console.log(`${this.name} produjo ${product.name}`);

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
    // MENÚ RESTAURADO
    // -------------------------------------------------------
    showProductionMenu() {
        this.scene.scene.launch("ProductionMenuScene", {
            building: this,
            mainScene: this.scene,
            products: this.products
        });

        this.activeMenu = this.scene.scene.get("ProductionMenuScene");

        this.scene.scene.pause();
        this.scene.UIScene.scene.pause();
    }

    // -------------------------------------------------------
    // CANCELAR RESTAURADO
    // -------------------------------------------------------
    cancelProduction(keepTexture = false) {

        if (!this.productionTimer) return;

        this.productionCancelled = true;

        if (!keepTexture) {
            this.setTexture(this.originalTexture);
        }

        this.productionTimer.destroy();
        this.productionTimer = null;

        if (this.productionUpdateCallback) {
            this.scene.events.off("update", this.productionUpdateCallback);
            this.productionUpdateCallback = null;
        }
    }

    // -------------------------------------------------------
    // TRABAJADORES (REST) 
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

        if (this.assignedWorkers === 0) {
            this.cancelProduction(false);
        }
    }

    upgrade() {
        if (this.inventory.hasEnoughMoney(this.upgradeCost)) {

            this.inventory.removeMoney(this.upgradeCost);
            this.upgradeTier++;
            this.productionSpeed = this.productionSpeed * 0.7; // Aumenta la velocidad de producción en un 30%
            this.upgradeCost = Math.floor(this.upgradeCost * 1.5); // Incrementa el costo de mejora para la próxima vez

            if (this.tierText) {
                this.tierText.setText(`Tier: ${this.upgradeTier}`);
            }

        } else {
            new FloatingMessage(this.ui, "No tienes suficiente dinero para mejorar este edificio.");
        }
    }
}


