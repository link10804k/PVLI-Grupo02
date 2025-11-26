import Button from "./Button.js";
import Buildings from "./Resources/Buildings.json" with { type: "json"}

export default class BuildingMenuScene extends Phaser.Scene {
    constructor(){
        super({ key: "BuildingMenuScene" });
        // Número de edificios construidos para aplicar un multiplicador por 
        this.buildingCount = 0;
    }

    init(data){
        this.mainScene = data.mainScene;
        this.tile = data.tile;
        this.inventory = data.inventory;
        this.isProcessor = data.isProcessor;
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

        // Generar la lista de edificios disponibles según el nivel de popularidad
        if (this.isProcessor) this.buildings = this.getProcessedBuildings();
        else this.buildings = this.getUnprocessedBuildings();

        // Posición inicial del primer botón
        const startY = 160;
        const spacing = 100;

        this.buildings.forEach((building, index) => {
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

            this.add.text(450, y + 30, "$" + building.price, {
                fontSize: "20px",
                color: "#007332",
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
            const inside = (
                x >= menuBounds.x &&
                x <= menuBounds.x + menuBounds.width &&
                y >= menuBounds.y &&
                y <= menuBounds.y + menuBounds.height
            );

            if (!inside) {
                this.closeWindow();
            }
        });
    }

    // Si el jugador tiene suficiente dinero para construir el edificio seleccionado y la parcela esta vacía, se construye el edificio 
    selectBuilding(building) {
        console.log("Construir:", building.name);
        if(this.mainScene.playerInventory.hasEnoughMoney(building.price))
        {
            if(this.tile.build(building)) 
            {
                this.mainScene.playerInventory.removeMoney(building.price);
                this.mainScene.updateMoneyUI();
                this.buildingCount++;
            }
        }
        else console.log("No tienes suficiente dinero para construir ", building.name)

        this.closeWindow();
    }

   closeWindow() {
        // Esperamos un poco antes de cerrar y reactivar input
        this.time.delayedCall(100, () => {
            if (this.mainScene && this.mainScene.input) {
                this.mainScene.input.enabled = true;
            }
            this.scene.resume("MainScene");
            this.scene.resume("UIScene");
            this.scene.stop(); // ahora sí detenemos el menú
        });
    }

    getUnprocessedBuildings() {
        let buildings = []
        let tier = Math.min(this.inventory.popularityLevel, this.inventory.maxTier);
        for (let i = 1; i <= tier; i++) {
            let currentTier = Buildings.unprocessedProducts[`tier${i}`];
            buildings.push({
                name: currentTier.name,
                description: currentTier.description,
                products: this.inventory.getUnprocessedProductsFromTier(i),
                price: 50 * Math.pow(2, this.buildingCount),
                texture: currentTier.texture // textura concreta del sprite
            });
        }
        return buildings;
    }
    getProcessedBuildings() {
        let buildings = []
        let tier = Math.min(this.inventory.popularityLevel, this.inventory.maxTier);
        for (let i = 1; i <= tier; i++) {
            let currentTier = Buildings.processedProducts[`tier${i}`];
            buildings.push({
                name: currentTier.name,
                description: currentTier.description,
                products: this.inventory.getProcessedProductsFromTier(i),
                price: 50 * Math.pow(2, this.buildingCount),
                texture: currentTier.texture // textura concreta del sprite
            });
        }
        return buildings;
    }
}
