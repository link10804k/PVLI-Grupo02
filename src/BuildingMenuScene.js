import Button from "./Button.js";
import Resource from "./resource.js";

export default class BuildingMenuScene extends Phaser.Scene {
    constructor(){
        super({ key: "BuildingMenuScene" });
    }

    init(data){
        this.mainScene = data.mainScene;
        this.tile = data.tile;
    }

    create(){
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
                key: "farm",
                texture: "building", // textura concreta del sprite (debe estar precargada)
                name: "Granja",
                description: "Produce comida para tu población.",
                resources: [new Resource("coffeeGrain", "Simple grain of coffee. Used for making standard coffee.", 3, 1), new Resource("teaHerbs", "Common herbs of tea. Used for making green tea.", 6, 1)],
                productionSpeed: 1.0,
                icon: "building" // opcional: icono del menú (puede ser distinto de la textura principal)
            },
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
            const button = new Button(this, 250, y, building.icon, () => {
                this.selectBuilding(building);
            }).setScale(0.1);

            this.add.existing(button);

             // Descripción
            this.add.text(400, y , "Granja:" + building.description, {
                fontSize: "14px",
                color: "#cccccc",
                fontFamily: "Arial",
                align: "center",
                wordWrap: { width: 250 },
            }).setOrigin(0.5);
        });

         // Botón para cerrar el menú
        const closeButton = new Button(this, 400, 520, "Button", () => {
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
        this.scene.stop();
       this.scene.resume("MainScene");
    }
    
}
