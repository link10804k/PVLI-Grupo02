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

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainScene" });
        this.mapWidth = 1260;
        this.mapHeight = 945;

        this.tileWidth = 315;   // ancho de cada parcela
        this.tileHeight = 315;  // alto de cada parcela

        this.tiles = [[]];
    }

    preload() { // Cargar recursos aquí
        this.load.image("Background", "assets/gameAssets/Background.png");
        this.load.image("cafeteria", "assets/gameAssets/Cafeteria.jpg")
        this.load.image("building", "assets/gameAssets/farm.jpg")
        this.load.image("pedidos", "assets/gameAssets/order.jpg")
        this.load.image("tile", "assets/gameAssets/tile.jpg")
        this.load.image("worker", "assets/gameAssets/worker.png")

        this.load.image("coffeeOrder", "assets/gameAssets/coffeeOrder.png")

        this.load.image("plus", "assets/gameAssets/PlusIcon.png")
        this.load.image("menos", "assets/gameAssets/MinusIcon.png")
        this.load.image("panel", "assets/gameAssets/panel.jpg")

        // Productos no procesados
        this.load.image("coffeeGrains_display", "assets/gameAssets/Coffee_display.png");
        this.load.image("teaHerbs_display", "assets/gameAssets/TeaIcon.png");
        this.load.image("cocoaBeans_display", "assets/gameAssets/cocoaBeans.png");
        this.load.image("pumpkins_display", "assets/gameAssets/pumpkins.png");
        this.load.image("dough_display", "assets/gameAssets/Dough.png");
        this.load.image("sugar_display", "assets/gameAssets/sugar.png");
        this.load.image("frozenBurgers_display", "assets/gameAssets/frozenBurgers.png");
        this.load.image("frozenTacos_display", "assets/gameAssets/FrozenTaco.png");
        this.load.image("frozenPizza_display", "assets/gameAssets/frozenPizza.png");
        this.load.image("frozenPaella_display", "assets/gameAssets/frozenPaella.png");
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
        this.load.image("building_CoffeeGrains_texture", "assets/gameAssets/CoffeeFarm.png");
        this.load.image("building_TeaHerbs_texture", "assets/gameAssets/TeaFarm.png");
        this.load.image("ExoticFarm_CocoaBeans_texture", "assets/gameAssets/CocoaFarm.png");
        this.load.image("ExoticFarm_Pumpkins_texture", "assets/gameAssets/PumpkinFarm.png");
        

        for (let i = 0; i < 16; i++) {
            this.load.image("customer" + i, "assets/gameAssets/customersSprites/" + i + ".png");
        }
        this.load.image("Angry", "assets/gameAssets/Angry.png");
        this.load.audio("customer_walk", "assets/gameAssets/audios/moving-stone.mp3");
    }
    
    create() { // Crear objetos del juego aquí
        this.scene.launch("UIScene");
        this.UIScene = this.scene.get("UIScene");

        this.cameraManager = new CameraManager(this, this.cameras.main);
        this.playerInventory = new Inventory(this, 50.00);
        this.phaseManager = new PhaseManager(this);
        this.ordersManager = new OrdersManager(this, this.playerInventory);
        this.applicationManager = new ApplicationManager(this, this.playerInventory, this.UIScene);

        this.add.image(470, 300, "Background").setOrigin(0.5, 0.5);

         this.wally = new Wally(this);

        this.createParcelas();
        
        new Cafeteria(this, this.tiles[1][1].x, this.tiles[1][1].y, "cafeteria", 0, 0, this.playerInventory, [], 0).setOrigin(0.5).setScale(0.4);
        this.tiles[1][1].destructor();
        this.tiles[1][1] = null;
        this.tiles[1][2].destructor();
        this.tiles[1][2] = null; 

        // UI del dinero del jugador-------------------------------------------------------
        this.moneyUI = this.UIScene.add.text(620, 20, "$" + this.playerInventory.money, {
            font: "50px",
            color: "#007332",
            stroke: "#000000",  
            strokeThickness: 6
        }).setScrollFactor(0);

        //UI de workers---------------------------------------------------------------
        this.workersIconUI = this.UIScene.add.image(600, 90, "worker")
        .setDisplaySize(40, 40)
        .setOrigin(0.5)
        .setScrollFactor(0);

        this.workersUI = this.UIScene.add.text(620, 65, this.playerInventory.availableWorkers + "/" + this.playerInventory.workers, {
            font: "50px",
            color: "#ff0101ff",
            stroke: "#000000",  
            strokeThickness: 6
        }).setScrollFactor(0);

            //Botón para comprar trabajadores
        this.addWorkersBut = new Button(this.UIScene, 760, 85, "plus", () => {
            this.playerInventory.buyWorker();
            this.workersUI.setText(this.playerInventory.availableWorkers + "/" + this.playerInventory.workers);
            if(this.playerInventory.workers >= this.playerInventory.workersSlots){
                this.addWorkersBut.setActive(false).setVisible(false);
            }
             EventBus.on(events.LEVEL_INCREASED, () => {
                   this.addWorkersBut.setActive(true).setVisible(true);
                    });
        }).setScale(1.5);

            //Texto del precio del siguiente trabajador
        this.workerPriceText = this.UIScene.add.text(730, 105, "$" + this.playerInventory.workerPrice, {
            font: "20px",
            color: "#326d02ff",
            stroke: "#000000",  
            strokeThickness: 6
        });

        //UI crear la barra de popularidad------------------------------------------------------------
        this.popularityBar = new PopularityBar(this.UIScene,this.playerInventory);

        this.inventoryUI = new InventoryUI(this.UIScene);
    }

    createParcelas(){ //Crea parcelas

        // Crear una cuadrícula de Parcelas (rectángulos ordenados)     
        const cols = this.mapWidth / this.tileWidth;         // columnas
        const rows = this.mapHeight / this.tileHeight;       // filas
        const startX = 0;      // posición inicial X
        const startY = 0;      // posición inicial Y
       
        for (let row = 0; row < rows; row++) {
            this.tiles[row] = [];
            for (let col = 0; col < cols; col++) {
                const x = startX + col * (this.tileWidth);
                const y = startY + row * (this.tileHeight);

                // Establecer nearWater a true si es la primera columna
                const nearWater = col === 0;

                this.tiles[row][col] = new Tile(this, x, y, "tile", 0, false, nearWater).setOrigin(0.5).setScale(0.4);
            }
        }
    }    

    showInventory() {
        this.scene.launch("InventoryScene", { mainScene: this.scene, inventory: this.playerInventory });
        this.scene.pause();
    }

    // Actualiza la cantidad de dinero en pantalla
    updateMoneyUI() {
        this.moneyUI.setText("$" + this.playerInventory.money);
    }
    
}