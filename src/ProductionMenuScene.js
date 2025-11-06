import Button from "./Button.js";

export default class ProductionMenuScene extends Phaser.Scene {
    constructor(){
        super({ key: "ProductionMenuScene" });
    }

    init(data){
        this.building = data.building;
        this.mainScene = data.mainScene;
        this.resources = data.resources;
    }

    create(){
        //
        //Menu de Producción
        //
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);
       const menuRect = this.add.rectangle(400, 300, 400, 500, 0x000000, 1);

        //Guardamos sus límites
    const menuBounds = {
        x: menuRect.x - menuRect.width / 2,
        y: menuRect.y - menuRect.height / 2,
        width: menuRect.width,
        height: menuRect.height
    };

        //this.add.image(400, 150, "order").setScale(0.8).setOrigin(0.5).setScale(2);

        this.add.text(410, 90, `PRODUCTION MENU `, {
            fontSize: "40px",
            color: "#fff",
        }).setOrigin(0.5);

        for(let i = 0; i < this.resources.length; i++)
        {
            this.add.text(320, 160 + 50 * i, this.resources[i].name.toUpperCase(), {
            fontSize: "30px",
            color: "#fff",
            }).setOrigin(0.5);

            this.addButton = new Button(this, 520, 160 + 50 * i, "button", () => this.building.produce(this.resources[i])).setScale(0.5);
        }


        //Menu de trabajadores
        //
        //
                //this.add.image(400, 150, "panel").setScale(0.8).setOrigin(0.5).setScale(2);
        
                const text = this.add.text(400, 450, `Workers: ${this.building.assignedWorkers}`, {
                    fontSize: "20px",
                    color: "#fff",
                }).setOrigin(0.5);
        
                this.addButton = new Button(this, 350, 500, "button", () => 
                    this.building.addWorker(text))
                    .setScale(0.5);
        
                this.removeButton = new Button(this, 450, 500, "menos", () => 
                    this.building.removeWorker(text))
                    .setScale(0.05);
        


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

    closeWindow() {
        this.scene.stop();
        this.mainScene.scene.resume();
    }
}