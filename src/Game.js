import MainMenu from "./MainMenu.js";
import MainScene from "./MainScene.js";
import BuildingWorkerScene from "./BuildingWorkerScene.js";
import ProductionMenuScene from "./ProductionMenuScene.js";
import InventoryScene from "./InventoryScene.js"

let config = {
    type: Phaser.AUTO,
    parent: "canvas",
    width: 800, 
    height: 600,
    scale: {
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    scene: [MainMenu, MainScene, BuildingWorkerScene, ProductionMenuScene, InventoryScene]
}

new Phaser.Game(config);