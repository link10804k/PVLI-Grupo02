import Tile from "./Tile.js";
import Cafeteria from "./Cafeteria.js";
import Building from "./Building.js";
import Inventory from "./inventory.js";
import CameraManager from "./CameraManager.js";
import PhaseManager from "./PhaseManager.js";
import OrdersManager from "./OrdersManager.js";

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
        this.load.image("background2", "assets/gameAssets/background2.jpg");
        this.load.image("cafeteria", "assets/gameAssets/Cafeteria.jpg")
        this.load.image("building", "assets/gameAssets/farm.jpg")
        this.load.image("pedidos", "assets/gameAssets/order.jpg")
        this.load.image("tile", "assets/gameAssets/tile.jpg")

        this.load.image("coffeeOrder", "assets/gameAssets/coffeeOrder.png")

        this.load.image("menos", "assets/gameAssets/Menos.jpg")
        this.load.image("panel", "assets/gameAssets/panel.jpg")

        this.load.image("Coffe_display", "assets/gameAssets/Coffe_display.png")
        this.load.image("Tea_display", "assets/gameAssets/Tea_display.png")
    }
    
    create() { // Crear objetos del juego aquí
        this.scene.launch("UIScene");
        const ui = this.scene.get("UIScene");
        ui.events.once('create', () => {
            this.UIManager = ui;
        });

        this.cameraManager = new CameraManager(this, this.cameras.main);
        this.playerInventory = new Inventory(this);
        this.phaseManager = new PhaseManager(this);
        this.ordersManager = new OrdersManager(this, this.playerInventory);

        this.tabKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
        this.tabKey.on("down", () => this.showInventory());

        this.add.image(400, 300, "background2").setOrigin(0.5, 0.5);

        this.createParcelas();
        
        new Cafeteria(this, this.tiles[1][1].x, this.tiles[1][1].y, "cafeteria", 0, 0, this.playerInventory, [], 0).setOrigin(0.5).setScale(0.4);
        this.tiles[1][1].destructor();
        this.tiles[1][1] = null;
        new Building(this, this.tiles[1][2].x, this.tiles[1][2].y, "building", 0, 0, 0, 1).setOrigin(0.5);
        this.tiles[1][2].destructor();
        this.tiles[1][2] = null; 
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

                this.tiles[row][col] = new Tile(this, x, y, "tile", 0).setOrigin(0.5).setScale(0.4);
            }
        }
    }    

    showInventory() {
        this.scene.launch("InventoryScene", { mainScene: this.scene, inventory: this.playerInventory });
        this.scene.pause();
    }
}