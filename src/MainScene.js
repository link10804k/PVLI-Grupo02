import Tile from "./Tile.js";
import Cafeteria from "./Cafeteria.js";
import Building from "./Building.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainScene" });
    }

    preload() { // Cargar recursos aquí
        this.load.image("background2", "assets/gameAssets/background2.jpg");
        this.load.image("cafeteria", "assets/gameAssets/cafeteria.jpg")
        this.load.image("building", "assets/gameAssets/farm.jpg")
        this.load.image("pedidos", "assets/gameAssets/order.jpg")
        this.load.image("tile", "assets/gameAssets/tile.jpg")
    }
    
    create() { // Crear objetos del juego aquí
        this.add.image(400, 300, "background2").setOrigin(0.5, 0.5);
        this.createParcelas();
        let cafeteria = new Cafeteria(this, 0, 0, "cafeteria", 0, 0, 0, [], 0).setOrigin(0.5).setScale(0.35);
        cafeteria.setPosition(this.tiles[1][1].x, this.tiles[1][1].y);
        this.tiles[1][1].occupied = true;
        let building = new Building(this, 0, 0, "building", 0, 0, [], 0).setOrigin(0.5).setScale(0.35);
        building.setPosition(this.tiles[1][2].x, this.tiles[1][2].y);
        this.tiles[1][2].occupied = true;
    }

    createParcelas(){ //Crea parcelas

         // Crear una cuadrícula de Parcelas (rectángulos ordenados)
            const cols = 3;         // columnas
            const rows = 3;         // filas
            const tileWidth = 300;   // ancho de cada parcela
            const tileHeight = 300;  // alto de cada parcela
            const startX = 50;      // posición inicial X
            const startY = 0;      // posición inicial Y

            this.tiles = [[]];
            
            for (let row = 0; row < rows; row++) {
                this.tiles[row] = [];
                for (let col = 0; col < cols; col++) {
                    const x = startX + col * (tileWidth);
                    const y = startY + row * (tileHeight);

                    console.log("Pre parcela creada");
                    this.tiles[row][col] = new Tile(this, x, y, "tile", 0).setOrigin(0.5).setScale(0.4);
                    console.log("Post parcela creada");
                }
            }
        }    

}