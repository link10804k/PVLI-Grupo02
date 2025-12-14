import Products from "./Resources/Products.json" with { type: "json" }
import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";
import FloatingMessage from "./FloatingMessage.js";

export default class Inventory {
    constructor(mainScene, money) {

        this.mainScene = mainScene;  
        this.ui = this.mainScene.scene.get("UIScene");

        this.unprocessedProducts = structuredClone(Products.unprocessedProducts.tier1);
        this.processedProducts = structuredClone(Products.processedProducts.tier1);

        EventBus.on(events.LEVEL_INCREASED, (popularityLevel) => this.inventoryChange(popularityLevel));

        // Dinero
        this.money = 400;   

        // Trabajadores
        this.workers = 1;
        this.availableWorkers = 1;
        this.workersSlots = 4;
        this.workerBasePrice = 250;
        this.workerGrowthRate = 1.25;
        this.workerPrice = this.workerBasePrice;

        // Popularidad
        this.popularityLevel = 1;
        this.maxTier = Object.keys(Products.unprocessedProducts).length;

        // Truco para test
        this.mKey = this.mainScene.input.keyboard.addKey('M');
        this.mKey.on("down", () => { this.addMoney(25); });
    }

    inventoryChange(popularityLevel) {
        Object.assign(this.unprocessedProducts, Products.unprocessedProducts[`tier${popularityLevel}`]);
        Object.assign(this.processedProducts, Products.processedProducts[`tier${popularityLevel}`]);
        this.popularityLevel = popularityLevel;
    }

    // -------------------------------------------------------
    // PRODUCCIÓN DE PRODUCTOS NO PROCESADOS
    // -------------------------------------------------------
    produceProduct(product, amount = 1) {
        product.quantity += amount;

        this.updateInventoryUI();

        // NOTIFICAR AL TUTORIAL
        const tutoUI = this.mainScene.scene.get("TutorialUIScene");
        if (tutoUI && tutoUI.tutorial) {
            tutoUI.tutorial.notify("PRODUCE_PRODUCT");
        }
    }

    produceRandomProduct() {
        const products = this.getUnprocessedProductsFromTier(this.popularityLevel);
        const randomProduct = Phaser.Utils.Array.GetRandom(products);
        randomProduct.quantity++;
        this.updateInventoryUI();
        return randomProduct;
    }

    // -------------------------------------------------------
    // PRODUCCIÓN DE PRODUCTOS PROCESADOS
    // -------------------------------------------------------
    processProduct(productWanted, amount = 1) {

        Object.entries(productWanted.neededProducts).forEach(([key, value]) => {
            this.unprocessedProducts[key].quantity -= value * amount;
        });

        productWanted.quantity += amount;

        this.updateInventoryUI();

        // NOTIFICAR AL TUTORIAL (antes mal escrito)
        const tutoUI = this.mainScene.scene.get("TutorialUIScene");
        if (tutoUI && tutoUI.tutorial) {
            tutoUI.tutorial.notify("PROCESE_PRODUCT");
        }
    }

    // -------------------------------------------------------
    // VENDER PRODUCTOS
    // -------------------------------------------------------
    sellProducts(products, amounts) {
        let totalMoney = 0;

        products.forEach((element, index) => {
            let earnedMoney = element.price * amounts[index];
            totalMoney += earnedMoney;
            element.quantity -= amounts[index];
        });

        this.addMoney(totalMoney);
        this.updateInventoryUI();

        const tutoUI = this.mainScene.scene.get("TutorialUIScene");
        if (tutoUI && tutoUI.tutorial) {
            tutoUI.tutorial.notify("ORDER_COMPLETE");
        }
    }

    // -------------------------------------------------------
    // COMPROBACIONES
    // -------------------------------------------------------
    checkUnprocessedProducts(productWanted, amount = 1) {
        let canProduce = true;
        Object.entries(productWanted.neededProducts).forEach(([key, value]) => {
            if (this.unprocessedProducts[key].quantity < value * amount) {
                canProduce = false;
            }
        });
        return canProduce;
    }

    checkProcessedProducts(productsWanted, quantities) {
        let canSell = true;
        productsWanted.forEach((element, index) => {
            if (element.quantity < quantities[index]) {
                canSell = false;
            }
        });
        return canSell;
    }

    hasEnoughMoney(amount) {
        return this.money >= amount;
    }

    removeMoney(amount) {
        this.addMoney(-amount);
    }

    getUnprocessedProductsFromTier(tier) {
        let productKeys = Object.keys(Products.unprocessedProducts[`tier${tier}`]);
        return productKeys.map(key => this.unprocessedProducts[key]);
    }

    getProcessedProductsFromTier(tier) {
        let productKeys = Object.keys(Products.processedProducts[`tier${tier}`]);
        return productKeys.map(key => this.processedProducts[key]);
    }

    updateInventoryUI() {
        EventBus.emit(events.INVENTORY_UPDATE, this.unprocessedProducts, this.processedProducts);
    }

    buyWorker() {
        if (this.workers >= this.workersSlots) {
            new FloatingMessage(this.ui, "No puedes contratar más trabajadores.");
            return false;
        }

        if (!this.hasEnoughMoney(this.workerPrice)) {
            new FloatingMessage(this.ui, "No tienes suficiente dinero.");
            return false;
        }

        this.removeMoney(this.workerPrice);
        this.workers++;
        this.availableWorkers++;
        this.workerPrice = Math.floor(this.workerPrice * this.workerGrowthRate);

        this.mainScene.updateMoneyUI();
        this.mainScene.workerPriceText.setText("$" + this.workerPrice);

        return true;
    }

    addMoney(amount) {
        this.money += amount;
        this.mainScene.updateMoneyUI();
        this.showFloatingMoney(amount);
    }

    showFloatingMoney(amount) {
        const isPositive = amount >= 0;

        const floatText = this.mainScene.UIScene.add.text(
            this.mainScene.moneyUI.x - 10,
            this.mainScene.moneyUI.y + 30,
            `${isPositive ? "+" : ""}${amount}$`,
            {
                fontSize: "26px",
                fill: isPositive ? "#00cc44" : "#ff0000",
                stroke: "#000",
                strokeThickness: 6
            }
        ).setOrigin(1, 0.5);

        floatText.setScrollFactor(0);

        this.mainScene.tweens.add({
            targets: floatText,
            y: floatText.y - 40,
            alpha: 0,
            duration: 3000,
            ease: "Cubic.easeOut",
            onComplete: () => floatText.destroy()
        });
    }
}
