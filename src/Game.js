import MainMenu from "./MainMenu.js";
import MainScene from "./MainScene.js";
import BuildingWorkerScene from "./BuildingWorkerScene.js";
import ProductionMenuScene from "./ProductionMenuScene.js";
import InventoryScene from "./InventoryUI.js"
import CoffeSelectionMenu from "./CoffeSelectionMenu.js";
import BuildingMenuScene from "./BuildingMenuScene.js";
import UIScene from "./UIScene.js";
import GachaScene from "./GachaScene.js";
import TutorialScene from "./TutorialScene.js";
import TutorialUIScene from "./TutorialUIScene.js";

let config = {
    type: Phaser.AUTO,
    parent: "canvas",  
    pixelArt: true,  
    scale: {
        mode: Phaser.Scale.FIT, // Ajusta el juego para que quepa en la ventana manteniendo la relación de aspecto
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
    },
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0.6 },
            debug: false,
        },
    },
    scene: [
        MainMenu, 
        MainScene,
        TutorialScene,
        UIScene,
        BuildingWorkerScene, 
        ProductionMenuScene, 
        CoffeSelectionMenu, 
        BuildingMenuScene,
        TutorialUIScene,
        GachaScene]
}

new Phaser.Game(config);