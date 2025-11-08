import Button from "./Button.js";

export default class BuildingMenuScene extends Phaser.Scene {
    constructor(){
        super({ key: "BuildingWorkerScene" });
    }

    init(data){
        this.building = data.building;
        this.mainScene = data.mainScene;
    }

    create(){
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);
        this.add.rectangle(400, 300, 400, 500, 0x000000, 1);

        //this.add.image(400, 150, "panel").setScale(0.8).setOrigin(0.5).setScale(2);

        const text = this.add.text(400, 300, `Workers: ${this.building.assignedWorkers}`, {
            fontSize: "20px",
            color: "#fff",
        }).setOrigin(0.5);

        this.addButton = new Button(this, 350, 400, "button", () => 
            this.building.addWorker(text))
            .setScale(0.25);

        this.removeButton = new Button(this, 450, 400, "menos", () => 
            this.building.removeWorker(text))
            .setScale(0.25);

        this.closeButton = new Button(this, 400, 500, "button", () => 
            this.closeWindow())
            .setScale(0.5);

        //const addButton = this.add.image(350, 400, "button").setInteractive().setScale(0.25);
        //addButton.on("pointerdown", () => {
        //    this.building.addWorker(text);
        //});
//
        //const removeButton = this.add.image(450, 400, "menos").setInteractive().setScale(0.25);
        //removeButton.on("pointerdown", () => {
        //    this.building.removeWorker(text);
        //});
//
        //const closeButton = this.add.text(400, 500, "Close", {
        //    fontSize: "20px",
        //    color: "#fff",
        //    backgroundColor: "#ff0000",
        //    padding: { x: 10, y: 5 },
        //}).setOrigin(0.5).setInteractive();
//
        //closeButton.on("pointerdown", () => {
        //    this.scene.stop();
        //});
    }
    closeWindow() {
        this.scene.stop();
        this.mainScene.scene.resume();
        this.scene.resume("UIScene");
    }
}