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

export default class TutorialScene extends Phaser.Scene {
    constructor() {
        super({ key: "TutorialScene" });

        this.mapWidth = 1260;
        this.mapHeight = 945;

        this.tileWidth = 315;
        this.tileHeight = 315;

        this.tiles = [];
    }

    preload() {
        this.load.image("Background", "assets/gameAssets/Background.png");
        this.load.image("cafeteria", "assets/gameAssets/Cafeteria.jpg");
        this.load.image("tile", "assets/gameAssets/tile.jpg");
        this.load.image("worker", "assets/gameAssets/worker.png");

        this.load.image("plus", "assets/gameAssets/PlusIcon.png");
        this.load.image("menos", "assets/gameAssets/MinusIcon.png");
        this.load.image("panel", "assets/gameAssets/panel.jpg");

        // Productos no procesados (necesarios para managers/UI)
        this.load.image("coffeeGrains_display", "assets/gameAssets/Coffee_display.png");
        this.load.image("teaHerbs_display", "assets/gameAssets/TeaIcon.png");
        this.load.image("cocoaBeans_display", "assets/gameAssets/cocoaBeans.png");
        this.load.image("pumpkins_display", "assets/gameAssets/pumpkins.png");
        this.load.image("dough_display", "assets/gameAssets/Dough.png");
        this.load.image("sugar_display", "assets/gameAssets/sugar.png");

        // Productos procesados
        this.load.image("Coffee_display", "assets/gameAssets/CoffeeIcon.png");
        this.load.image("Tea_display", "assets/gameAssets/Tea.png");

        // Edificios necesarios
        this.load.image("building_CoffeeGrains_texture", "assets/gameAssets/CoffeeFarm.png");
        this.load.image("building_TeaHerbs_texture", "assets/gameAssets/TeaFarm.png");
        this.load.image("ExoticFarm_CocoaBeans_texture", "assets/gameAssets/CocoaFarm.png");
        this.load.image("ExoticFarm_Pumpkins_texture", "assets/gameAssets/PumpkinFarm.png");
    }

    create() {
        this.scene.launch("UIScene");
        this.scene.bringToTop("UIScene");
        this.UIScene = this.scene.get("UIScene");

        this.cameraManager = new CameraManager(this, this.cameras.main);
        this.playerInventory = new Inventory(this, 50.00);
        this.phaseManager = new PhaseManager(this);
        this.ordersManager = new OrdersManager(this, this.playerInventory);
        this.applicationManager = new ApplicationManager(this, this.playerInventory, this.UIScene);

        this.add.image(470, 300, "Background").setOrigin(0.5);

        // Crear tablero 2x2
        this.createParcelas();

        // Ubicar cafetería en tiles[1][1]
        const cafeTile = this.tiles[1][1];

        new Cafeteria(
            this,
            cafeTile.x,
            cafeTile.y,
            "cafeteria",
            0,
            0,
            this.playerInventory,
            [],
            0
        )
        .setOrigin(0.5)
        .setScale(0.4);

        // Eliminar solo la tile usada
        this.tiles[1][1].destructor();
        this.tiles[1][1] = null;

        // --- UI ---
        this.moneyUI = this.UIScene.add.text(620, 20, "$" + this.playerInventory.money, {
            font: "50px",
            color: "#007332",
            stroke: "#000000",
            strokeThickness: 6
        }).setScrollFactor(0);

        this.workersIconUI = this.UIScene.add.image(600, 90, "worker")
            .setDisplaySize(40, 40)
            .setOrigin(0.5)
            .setScrollFactor(0);

        this.workersUI = this.UIScene.add.text(
            620,
            65,
            this.playerInventory.availableWorkers + "/" + this.playerInventory.workers,
        {
            font: "50px",
            color: "#ff0101ff",
            stroke: "#000000",
            strokeThickness: 6
        }).setScrollFactor(0);

        this.addWorkersBut = new Button(this.UIScene, 760, 85, "plus", () => {
            this.playerInventory.buyWorker();
            this.workersUI.setText(this.playerInventory.availableWorkers + "/" + this.playerInventory.workers);

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
            color: "#326d02ff",
            stroke: "#000000",
            strokeThickness: 6
        });

        this.popularityBar = new PopularityBar(this.UIScene, this.playerInventory);
        this.inventoryUI = new InventoryUI(this.UIScene);
    }

    createParcelas() {

        const rows = 2;   // 2 filas
        const cols = 2;   // 2 columnas

        this.tiles = [];

        for (let row = 0; row < rows; row++) {
            this.tiles[row] = [];
            for (let col = 0; col < cols; col++) {

                const x = col * this.tileWidth;
                const y = row * this.tileHeight;

                const nearWater = col === 0;

                this.tiles[row][col] =
                    new Tile(this, x, y, "tile", 0, false, nearWater)
                        .setOrigin(0.5)
                        .setScale(0.4);
            }
        }
    }

    showInventory() {
        this.scene.launch("InventoryScene", { mainScene: this.scene, inventory: this.playerInventory });
        this.scene.pause();
    }

    updateMoneyUI() {
        this.moneyUI.setText("$" + this.playerInventory.money);
    }
}
