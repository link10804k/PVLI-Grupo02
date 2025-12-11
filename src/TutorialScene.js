import Tile from "./Tile.js";
import Cafeteria from "./Cafeteria.js";
import Building from "./Building.js";
import Inventory from "./inventory.js";
import CameraManager from "./CameraManager.js";
import PhaseManager from "./PhaseManager.js";
import OrdersManager from "./OrdersManager.js";
import PopularityBar from "./Popularity.js";
import InventoryUI from "./InventoryUI.js";
import Button from "./Button.js";
import ApplicationManager from "./ApplicationManager.js";
import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";
import Wally from "./Wally.js";

// ⭐ AÑADIDO PARA EL TUTORIAL
import TutorialManager from "./TutorialManager.js";

export default class TutorialScene extends Phaser.Scene {
    constructor() {
        super({ key: "TutorialScene" });

        this.mapWidth = 704;
        this.mapHeight = 544;

        this.tileWidth = 64;
        this.tileHeight = 64;

        this.tiles = [[]];
    }

    preload() {

        this.load.image("Background", "assets/gameAssets/Background.png");
        this.load.image("pedidos", "assets/gameAssets/order.jpg")
        this.load.image("tile", "assets/gameAssets/tile.jpg")
        this.load.image("worker", "assets/gameAssets/worker.png")

        this.load.image("coffeeOrder", "assets/gameAssets/coffeeOrder.png")
        this.load.image("plus", "assets/gameAssets/PlusIcon.png")
        this.load.image("menos", "assets/gameAssets/MinusIcon.png")
        this.load.image("panel", "assets/gameAssets/panel.jpg")

        // Productos no procesados
        this.load.image("CoffeeGrains_display", "assets/gameAssets/CoffeeGrainIcon.png");
        this.load.image("TeaHerbs_display", "assets/gameAssets/TeaIcon.png");
        this.load.image("CocoaBeans_display", "assets/gameAssets/cocoaBeans.png");
        this.load.image("Pumpkins_display", "assets/gameAssets/pumpkins.png");
        this.load.image("Dough_display", "assets/gameAssets/Dough.png");
        this.load.image("Sugar_display", "assets/gameAssets/sugar.png");
        this.load.image("FrozenBurgers_display", "assets/gameAssets/frozenBurgers.png");
        this.load.image("FrozenTacos_display", "assets/gameAssets/FrozenTaco.png");
        this.load.image("FrozenPizza_display", "assets/gameAssets/frozenPizza.png");
        this.load.image("FrozenPaella_display", "assets/gameAssets/frozenPaella.png");

        // Productos procesados
        this.load.image("Coffee_display", "assets/gameAssets/CoffeeIcon.png")
        this.load.image("Tea_display", "assets/gameAssets/Tea.png")
        this.load.image("HotChocolate_display", "assets/gameAssets/hotChocolate.png");
        this.load.image("PumpkinLatte_display", "assets/gameAssets/pumpkinLatte.png");
        this.load.image("Cookies_display", "assets/gameAssets/Cookies.png");
        this.load.image("PumpkinPie_display", "assets/gameAssets/pumpkinCake.png");
        this.load.image("Bread_display", "assets/gameAssets/bread.png");
        this.load.image("Burger_display", "assets/gameAssets/Hamburguesa.png");
        this.load.image("Taco_display", "assets/gameAssets/tacos.png");
        this.load.image("Pizza_display", "assets/gameAssets/Pizza.png");
        this.load.image("Paella_display", "assets/gameAssets/Paella.png");

        // Edificios
        this.load.image("cafeteria", "assets/gameAssets/cafeteria.png")

        this.load.image("Farm_building", "assets/gameAssets/Tier1Farm.png");
        this.load.image("Farm_CoffeeGrains_texture", "assets/gameAssets/CoffeeFarm.png");
        this.load.image("Farm_TeaHerbs_texture", "assets/gameAssets/TeaFarm.png");

        this.load.image("ExoticFarm_building", "assets/gameAssets/Tier2Farm.png");
        this.load.image("ExoticFarm_CocoaBeans_texture", "assets/gameAssets/CocoaFarm.png");
        this.load.image("ExoticFarm_Pumpkins_texture", "assets/gameAssets/PumpkinFarm.png");

        this.load.image("Bakery_building", "assets/gameAssets/Tier1Bakery.png");
        this.load.image("Bakery_Dough_texture", "assets/gameAssets/DoughFarm.png");
        this.load.image("Bakery_Sugar_texture", "assets/gameAssets/SugarFarm.png");

        this.load.image("Harbor_building", "assets/gameAssets/Tier4FarmBase.png");
        this.load.image("Harbor_FrozenBurgers_texture", "assets/gameAssets/Tier4BurgerFarm.png");
        this.load.image("Harbor_FrozenTacos_texture", "assets/gameAssets/Tier4TacoFarm.png");
        this.load.image("Harbor_FrozenPizza_texture", "assets/gameAssets/Tier4PizzaFarm.png");
        this.load.image("Harbor_FrozenPaella_texture", "assets/gameAssets/Tier4PaellaFarm.png");

        for (let i = 0; i < 16; i++) {
            this.load.image("customer" + i, "assets/gameAssets/customersSprites/" + i + ".png");
        }

        this.load.image("Angry", "assets/gameAssets/Angry.png");

        // Audios
        this.load.audio("customer_walk", "assets/gameAssets/audios/moving-stone.mp3");
        this.load.audio("purchase", "assets/gameAssets/audios/PurchaseSFX.mp3");
        this.load.audio("build", "assets/gameAssets/audios/BuildSFX.mp3");
        this.load.audio("dig", "assets/gameAssets/audios/ShovelDigSFX.mp3");
        this.load.audio("furnace", "assets/gameAssets/audios/FireWhooshSFX.mp3");
        this.load.audio("boat", "assets/gameAssets/audios/BoatHornSFX.mp3");
        this.load.audio("coffeeMaker", "assets/gameAssets/audios/CoffeeMakerSFX.mp3");
        this.load.audio("oven", "assets/gameAssets/audios/OvenSFX.mp3");
        this.load.audio("microwave", "assets/gameAssets/audios/MicrowaveSFX.mp3");
        this.load.audio("popularityUp", "assets/gameAssets/audios/LevelUpSFX.mp3");
        this.load.audio("popUp", "assets/gameAssets/audios/PopUpSFX.mp3");
        this.load.audio("newCustomer", "assets/gameAssets/audios/DoorBellSFX.mp3");
        this.load.audio("phaseChange", "assets/gameAssets/audios/GongSFX.mp3");
    }

    create() {

        // Lanzar la UI normal
        this.scene.launch("UIScene");
        this.UIScene = this.scene.get("UIScene");

        this.cameraManager = new CameraManager(this, this.cameras.main);
        this.playerInventory = new Inventory(this, 50.0);
        this.phaseManager = new PhaseManager(this);
        this.ordersManager = new OrdersManager(this, this.playerInventory);
        this.applicationManager = new ApplicationManager(this, this.playerInventory, this.UIScene);

        this.add.image(0, 0, "Background").setOrigin(0);

        this.wally = new Wally(this);

        this.createParcelas();

        new Cafeteria(this, this.tiles[1][1].x, this.tiles[1][1].y, "cafeteria", this.playerInventory)
            .setOrigin(0.5)
            .setScale(0.4);

        this.tiles[1][1].destructor();
        this.tiles[1][1] = null;
        this.tiles[1][2].destructor();
        this.tiles[1][2] = null;

        // UI dinero
        this.moneyUI = this.UIScene.add.text(620, 20, "$" + this.playerInventory.money, {
            font: "50px",
            color: "#007332",
            stroke: "#000",
            strokeThickness: 6
        }).setScrollFactor(0);

        // Workers
        this.workersIconUI = this.UIScene.add.image(600, 90, "worker")
            .setDisplaySize(40, 40)
            .setOrigin(0.5)
            .setScrollFactor(0);

        this.workersUI = this.UIScene.add.text(
            620, 65,
            this.playerInventory.availableWorkers + "/" + this.playerInventory.workers,
            {
                font: "50px",
                color: "#ff0101",
                stroke: "#000",
                strokeThickness: 6
            }
        ).setScrollFactor(0);

        this.addWorkersBut = new Button(this.UIScene, 760, 85, "plus", () => {

            this.playerInventory.buyWorker();
            this.workersUI.setText(
                this.playerInventory.availableWorkers + "/" + this.playerInventory.workers
            );

            if (this.playerInventory.workers >= this.playerInventory.workersSlots) {
                this.addWorkersBut.setActive(false).setVisible(false);
            }

            EventBus.on(events.LEVEL_INCREASED, () => {
                this.addWorkersBut.setActive(true).setVisible(true);
            });

        }).setScale(1.5);

        this.workerPriceText = this.UIScene.add.text(730, 105,
            "$" + this.playerInventory.workerPrice,
            {
                font: "20px",
                color: "#326d02",
                stroke: "#000",
                strokeThickness: 6
            });

        this.popularityBar = new PopularityBar(this.UIScene, this.playerInventory);

        this.inventoryUI = new InventoryUI(this.UIScene);


        // ----------------------------------------------------
        // ⭐ AÑADIDO: LANZAR EL TUTORIAL UI SCENE
        // ----------------------------------------------------
        this.time.delayedCall(200, () => {
            this.scene.launch("TutorialUIScene");
            this.scene.bringToTop("TutorialUIScene");
        });
    }

    createParcelas() {

        const cols = 6;
        const rows = 4;
        const startX = 64 + 32;
        const startY = 64 * 2;
        const spacingX = 64 + 32;
        const spacingY = 64 + 32;

        for (let row = 0; row < rows; row++) {
            this.tiles[row] = [];
            for (let col = 0; col < cols; col++) {

                const x = startX + col * spacingX;
                const y = startY + row * spacingY;

                const nearWater = col === 0;

                this.tiles[row][col] = new Tile(
                    this,
                    x,
                    y,
                    0,
                    false,
                    nearWater
                ).setOrigin(0.5);
            }
        }
    }

    showInventory() {
        this.scene.launch("InventoryScene", {
            mainScene: this.scene,
            inventory: this.playerInventory
        });
        this.scene.pause();
    }

    updateMoneyUI() {
        this.moneyUI.setText("$" + this.playerInventory.money);
    }
}
