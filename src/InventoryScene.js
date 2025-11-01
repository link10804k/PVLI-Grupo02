import Button from "./Button.js";

export default class InventoryScene extends Phaser.Scene {
    constructor(){
        super({ key: "InventoryScene" });
    }

    init(data){
        this.mainScene = data.mainScene;
    }

    create(){
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);
        this.add.rectangle(400, 300, 400, 500, 0x000000, 1);

        this.add.text(410, 90, `INVENTORY`, {
            fontSize: "50px",
            color: "#fff",
        }).setOrigin(0.5);

        for(let i = 0; i < this.mainScene.playerInventory.resources.length; i++)
        {
            this.add.text(320, 160 + 50 * i, this.resources[i].name.toUpperCase(), {
            fontSize: "30px",
            color: "#fff",
            }).setOrigin(0.5);

            this.add.text(520, 160 + 50 * i, this.resources[i].amount, {
            fontSize: "30px",
            color: "#fff",
            }).setOrigin(0.5);  
        }

        this.closeButton = new Button(this, 400, 500, "button", () => this.closeWindow()).setScale(0.5);
    }

    closeWindow() {
        this.scene.stop();
        this.mainScene.scene.resume();
    }
}