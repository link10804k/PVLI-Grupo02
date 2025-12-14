import Button from "./Button.js";
import Buildings from "./Resources/Buildings.json" with { type: "json"}
import FloatingMessage from "./FloatingMessage.js";

export default class BuildingMenuScene extends Phaser.Scene {

     // Definir constante para tiles cercanas al agua
    static WATER_TILE_X = 200; // Todo tile con x <= 200 se considera cerca del agua

    constructor(){
        super({ key: "BuildingMenuScene" });
        // Número de edificios construidos para aplicar un multiplicador por 
        this.buildingCount = 0;

        this.firstBuildingBuilt = false;
        this.firstCoffeeMakerBuilt = false;
    }

    init(data){
        this.mainScene = data.mainScene;
        this.tile = data.tile;
        this.inventory = data.inventory;
        this.isProcessor = data.isProcessor;

        this.ui = this.mainScene.scene.get("UIScene");
        this.mainScene.sound.play("popUp", { volume: 0.2 }); // Sonido de aparición de menú
    }

    create(){
        //Desactivar input en la escena principal mientras el menú está abierto
        if (this.mainScene && this.mainScene.input) {
            this.mainScene.input.enabled = false;
        }

        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);
        //const menuRect = this.add.rectangle(400, 300, 400, 500, 0x000000, 1); //lo guardo para sacar sus límites
        const menuRect = this.add.image(400, 300, "menuBackground").setOrigin(0.5).setScale(1.6, 1.4);

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
            }).setScale(1);

            if(this.isProcessor) button.setScale(6);

            this.add.existing(button);

             // Descripción
            this.add.text(450, y , building.name + ": " + building.description, {
                fontSize: "16px",
                color: "#fff",
                fontFamily: "Arial",
                align: "center",
                wordWrap: { width: 250 },
            }).setOrigin(0.5);

            this.add.text(450, y + 40, "$" + building.price, {
                fontSize: "20px",
                color: "#007332",
                fontFamily: "Arial",
                align: "center",
                wordWrap: { width: 250 },
            }).setOrigin(0.5);
        });

        // Botón para cerrar el menú
        const closeButton = new Button(this, 400, 520, "exit", () => {
            this.closeWindow();
        }).setScale(2);
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

       // Si es un puerto, solo permitir en tiles cerca del agua y nivel de popularidad 4
    if (building.name === "Puerto") {
        if (!this.tile.nearWater) {
            new FloatingMessage(this.ui, "Solo se puede construir el puerto en tiles cercanas al agua");
            return;
        }

            if (this.inventory.popularityLevel < 4) {
                new FloatingMessage(this.ui, "Necesitas ser nivel 4 de popularidad para construir el puerto");
                return;
            }

        } else {
            // Si el nivel del jugador aún no desbloquea otros edificios, bloquearlos
            if (this.inventory.popularityLevel < building.requiredLevel) {
                 new FloatingMessage(this.ui, "Aún no puedes construir este edificio");
                return;
            }
        }

        if(this.mainScene.playerInventory.hasEnoughMoney(building.price))
        {
            if(this.tile.build(building)) 
            {
                if (this.isProcessor) {
                    this.firstCoffeeMakerBuilt = true;
                    Buildings.processedProducts[`tier${building.tier}`].numBuilt += 1;
                }
                else {
                    this.firstBuildingBuilt = true;
                    Buildings.unprocessedProducts[`tier${building.tier}`].numBuilt += 1;
                }

                this.mainScene.playerInventory.removeMoney(building.price);
                this.mainScene.updateMoneyUI();
                this.buildingCount++;

                if (building.name === "Granja") {
                    const tutoUI = this.mainScene.scene.get("TutorialUIScene");
                    if (tutoUI && tutoUI.tutorial) {
                        tutoUI.tutorial.notify("BUILD_FARM");
                    }
                }

                if (building.name === "Cafetera") {
                    const tutoUI = this.mainScene.scene.get("TutorialUIScene");
                    if (tutoUI && tutoUI.tutorial) {
                        tutoUI.tutorial.notify("BUILD_CAFE");
                    }
                }
            }
        }
        else new FloatingMessage(this.ui, "No tienes suficiente dinero para construir " + building.name)

        this.closeWindow();
    }

closeWindow() {
    this.time.delayedCall(50, () => {

        // Reactivar input del mundo
        if (this.mainScene && this.mainScene.input) {
            this.mainScene.input.enabled = true;
        }

        // Reanudar la escena que abrió este menú
        if (this.scene.isPaused(this.mainScene.scene.key)) {
            this.scene.resume(this.mainScene.scene.key);
        }

        // Reanudar UIScene
        if (this.scene.isPaused("UIScene")) {
            this.scene.resume("UIScene");
        }

        // Cerrar el menú
        this.scene.stop();
    });
}


    getUnprocessedBuildings() {
        
    // Si el tile está cerca del agua, solo devolver el puerto
    if (this.tile.nearWater) {
        const harbor = Buildings.unprocessedProducts.tier4; // Ajusta según tu JSON
        return [{
            name: harbor.name,
            description: harbor.description,
            products: this.inventory.getUnprocessedProductsFromTier(4),
            price: this.firstBuildingBuilt ? 200*(Math.pow(1.5, harbor.numBuilt)) : 0,
            texture: harbor.texture,
            audio: harbor.audio, // Audio del edificio
            tier: 4
        }];
    }
        //comportamineto normal
        let buildings = []
        let tier = Math.min(this.inventory.popularityLevel, this.inventory.maxTier - 1);
        for (let i = 1; i <= tier; i++) {
            let currentTier = Buildings.unprocessedProducts[`tier${i}`];
            buildings.push({
                name: currentTier.name,
                description: currentTier.description,
                products: this.inventory.getUnprocessedProductsFromTier(i),
                price: this.firstBuildingBuilt ? 200*(Math.pow(1.5, currentTier.numBuilt)) : 0, // El primer edificio de procesamiento es gratis 
                texture: currentTier.texture, // textura concreta del sprite
                audio: currentTier.audio, // Audio del edificio
                tier: i
            });
        }
        return buildings;
    }

    getProcessedBuildings() {
        let buildings = []
        let tier = Math.min(this.inventory.popularityLevel, this.inventory.maxTier);
        for (let i = 1; i <= tier; i++) {
            let currentTier = Buildings.processedProducts[`tier${i}`];
            if (currentTier.numBuilt < 2) {
                buildings.push({
                name: currentTier.name,
                description: currentTier.description,
                products: this.inventory.getProcessedProductsFromTier(i),
                price: this.firstCoffeeMakerBuilt ? 50 + (350*currentTier.numBuilt) : 0, // El primer edificio de procesamiento es gratis
                texture: currentTier.texture, // textura concreta del sprite
                audio: currentTier.audio, // Audio del edificio
                tier: i
            });
            }
        }
        return buildings;
    }
}
