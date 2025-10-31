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
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);
        this.add.rectangle(400, 300, 400, 500, 0x000000, 1);

        //this.add.image(400, 150, "panel").setScale(0.8).setOrigin(0.5).setScale(2);

        const text = this.add.text(400, 300, `Workers: ${this.building.assignedWorkers}`, {
            fontSize: "20px",
            color: "#fff",
        }).setOrigin(0.5);

        this.addButton = new Button(this, 350, 400, "button", () => this.building.addWorker(text)).setScale(0.25);
        this.removeButton = new Button(this, 450, 400, "menos", () => this.building.removeWorker(text)).setScale(0.25);
        this.closeButton = new Button(this, 400, 500, "button", () => this.closeWindow()).setScale(0.5);
    }
    closeWindow() {
        this.scene.stop();
        this.mainScene.scene.resume();
    }
}