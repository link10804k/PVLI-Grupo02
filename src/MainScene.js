import Tile from "./Tile.js";
import Cafeteria from "./Cafeteria.js";
import Building from "./Building.js";
import CameraManager from "./CameraManager.js";

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
        this.load.image("cafeteria", "assets/gameAssets/cafeteria.jpg")
        this.load.image("building", "assets/gameAssets/farm.jpg")
        this.load.image("pedidos", "assets/gameAssets/order.jpg")
        this.load.image("tile", "assets/gameAssets/tile.jpg")

        this.load.image("menos", "assets/gameassets/Menos.jpg")
        this.load.image("panel", "assets/gameassets/panel.jpg")
    }
    
    create() { // Crear objetos del juego aquí
        this.cameraManager = new CameraManager(this, this.cameras.main);

        this.add.image(400, 300, "background2").setOrigin(0.5, 0.5);

        this.createParcelas();
        
        let cafeteria = new Cafeteria(this, this.tiles[1][1].x, this.tiles[1][1].y, "cafeteria", 0, 0, 0, [], 0).setOrigin(0.5).setScale(0.35);
        this.tiles[1][1].occupied = true;
        let building = new Building(this, this.tiles[1][2].x, this.tiles[1][2].y, "building", 0, 0, [], 0).setOrigin(0.5).setScale(0.35);
        this.tiles[1][2].occupied = true;
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

}