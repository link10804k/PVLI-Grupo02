import Button from "./Button.js";
import Products from "./Resources/Products.json" with { type: "json" };

export default class BuildingMenuScene extends Phaser.Scene {
    constructor(){
        super({ key: "BuildingMenuScene" });
    }

    init(data){
        this.mainScene = data.mainScene;
        this.tile = data.tile;
    }

    create(){
//Desactivar input en la escena principal mientras el menú está abierto
        if (this.mainScene && this.mainScene.input) {
            this.mainScene.input.enabled = false;
        }

        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);
        const menuRect = this.add.rectangle(400, 300, 400, 500, 0x000000, 1); //lo guardo para sacar sus límites

        //Guardamos sus límites
        const menuBounds = {
        x: menuRect.x - menuRect.width / 2,
        y: menuRect.y - menuRect.height / 2,
        width: menuRect.width,
        height: menuRect.height
        };

        // Título
        this.add.text(400, 80, "Menú de Construcción", {
            fontSize: "28px",
            color: "#ffffff",
            fontFamily: "Arial",
        }).setOrigin(0.5);

        // Lista de edificios disponibles
        const buildings = [
            {
                key: "coffee farm",
                texture: "building", // textura concreta del sprite
                name: "Granja de café",
                description: "Produce granos de café.",
                products: [ Products.unprocessedProducts.tier1.coffeeGrain, ],
                
        
            },

            {
                key: "tea farm",
                texture: "building", // textura concreta del sprite
                name: "Granja de té",
                description: "Produce hierbas de té.",
                products: [ Products.unprocessedProducts.tier1.teaHerbs, ],
                
        
            }
            // Futuro: puedes añadir más, ej:
            // { key: "house", name: "Casa", description: "Aumenta población.", icon: "houseIcon" },
            // { key: "mine", name: "Mina", description: "Extrae recursos.", icon: "mineIcon" },
        ];

         // Posición inicial del primer botón
        const startY = 160;
        const spacing = 100;

        buildings.forEach((building, index) => {
            const y = startY + index * spacing;


             // Botón principal del edificio
            const button = new Button(this, 250, y, building.texture, () => {
                this.selectBuilding(building);
            }).setScale(0.1);

            this.add.existing(button);

             // Descripción
            this.add.text(450, y , building.name + ": " + building.description, {
                fontSize: "14px",
                color: "#cccccc",
                fontFamily: "Arial",
                align: "center",
                wordWrap: { width: 250 },
            }).setOrigin(0.5);
        });

         // Botón para cerrar el menú
        const closeButton = new Button(this, 400, 520, "button", () => {
            this.closeWindow();
        });
        this.add.existing(closeButton);

 //cerrar el menú al hacer clic fuera de él
    this.input.on('pointerdown', (pointer) => {
        const { x, y } = pointer;
        const inside =
            x >= menuBounds.x &&
            x <= menuBounds.x + menuBounds.width &&
            y >= menuBounds.y &&
            y <= menuBounds.y + menuBounds.height;

        if (!inside) {
            this.closeWindow();
        }
    });

    }




     selectBuilding(building) {
        console.log("Construir:", building.name);
       this.tile.build(building);
        this.closeWindow();
    }


    
   closeWindow() {
    // Esperamos un poco antes de cerrar y reactivar input
    this.time.delayedCall(100, () => {
        if (this.mainScene && this.mainScene.input) {
            this.mainScene.input.enabled = true;
        }
        this.scene.resume("MainScene");
        this.scene.stop(); // ahora sí detenemos el menú
    });
}
    
}
