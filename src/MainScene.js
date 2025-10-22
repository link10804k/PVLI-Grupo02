import Parcel from "./Parcel.js";
import Cafeteria from "./Cafeteria.js";
import Building from "./Building.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainScene" });
    }

    preload() { // Cargar recursos aquí
        this.load.image("background2", "assets/gameAssets/background2.jpg");
        this.load.image("cafeteria", "assets/gameAssets/Cafeteria.jpg")
        this.load.image("building", "assets/gameAssets/Granja.jpg")
        this.load.image("pedidos", "assets/gameAssets/Pedidos.jpg")
        this.load.image("parcela", "assets/gameAssets/Parcela.png")
    }
    
    create() { // Crear objetos del juego aquí
        this.add.image(400, 300, "background2").setOrigin(0.5, 0.5);
        this.createParcelas();
        new Cafeteria(this, 0, 0, "cafeteria", 0, 0, 0, [], 0).setOrigin(0, 0);
        new Building(this, 0, 0, "building", 0, 0, [], 0).setOrigin(0, 0);
    }

    createParcelas(){ //Crea parcelas

         // Crear una cuadrícula de Parcelas (rectángulos ordenados)
            const cols = 8;         // columnas
            const rows = 6;         // filas
            const margin = 10;      // espacio entre parcelas
            const tileWidth = 80;   // ancho de cada parcela
            const tileHeight = 60;  // alto de cada parcela
            const startX = 50;      // posición inicial X
            const startY = 50;      // posición inicial Y

            this.parcels = [];

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = startX + col * (tileWidth + margin);
                    const y = startY + row * (tileHeight + margin);

                    const parcel = new Parcel(this, x, y, "parcela", 0 , false).setOrigin(0, 0);


                    this.parcels.push(parcel);
                }
            }
        }    

}