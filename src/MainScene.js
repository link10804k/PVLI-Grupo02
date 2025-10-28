import Tile from "./Tile.js";
import Cafeteria from "./Cafeteria.js";
import Building from "./Building.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainScene" });

        this.scrollSpeed = 50; // Parámetro variable
        this.zoomSpeed = 50; // Parámetro variable

        // Eventos cámara
        // Direction vectors (simple objects with x,y)
        const Direction = {
            UP: { x: 0, y: -1 },
            DOWN: { x: 0, y: 1 },
            LEFT: { x: -1, y: 0 },
            RIGHT: { x: 1, y: 0 },
        };

        // Scroll
        this.wKey = this.input.keyboard.addKey('W');
        this.aKey = this.input.keyboard.addKey('A');
        this.sKey = this.input.keyboard.addKey('S');
        this.dKey = this.input.keyboard.addKey('D');
        // Pass functions (don't call the methods immediately)
        this.wKey.on("down", () => this.cameraScroll(Direction.UP));
        this.aKey.on("down", () => this.cameraScroll(Direction.LEFT));
        this.sKey.on("down", () => this.cameraScroll(Direction.DOWN));
        this.dKey.on("down", () => this.cameraScroll(Direction.RIGHT));

        // Zoom
        this.iKey = this.input.keyboard.addKey('I');
        this.oKey = this.input.keyboard.addKey('O');
        this.iKey.on("down", () => this.cameraZoom(1));
        this.oKey.on("down", () => this.cameraZoom(-1));
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
    cameraScroll(direction) {
        direction *= this.scrollSpeed * game.time.elapsed/1000; // game.time.elapsed/1000 = deltaTime
        this.cameras.main.scrollX += direction.x;
        this.cameras.main.scrollY += direction.y;
    }
    cameraZoom(isZoomIn) {
        this.cameras.main.zoom += this.zoomSpeed * isZoomIn * game.time.elapsed/1000;
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