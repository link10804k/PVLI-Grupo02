import MainMenu from "./MainMenu.js";
import MainScene from "./MainScene.js";
import BuildingWorkerScene from "./BuildingWorkerScene.js";
import ProductionMenuScene from "./ProductionMenuScene.js";
import InventoryScene from "./InventoryUI.js"
import CoffeSelectionMenu from "./CoffeSelectionMenu.js";
import BuildingMenuScene from "./BuildingMenuScene.js";
import UIScene from "./UIScene.js";

let config = {
    type: Phaser.AUTO,
    parent: "canvas",  
    scale: {
        mode: Phaser.Scale.FIT, // Ajusta el juego para que quepa en la ventana manteniendo la relación de aspecto
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
    },
    scene: [
        MainMenu, 
        MainScene, 
        BuildingWorkerScene, 
        ProductionMenuScene, 
        CoffeSelectionMenu, 
        BuildingMenuScene, 
        UIScene],
}

new Phaser.Game(config);