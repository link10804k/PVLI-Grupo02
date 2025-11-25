import InventoryUI from './InventoryUI.js';

export default class UIScene extends Phaser.Scene {
    constructor(){
        super({ key: "UIScene" });
    }

    create() {
        this.inventoryUI = new InventoryUI(this);
    }
}