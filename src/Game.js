import MainMenu from "./MainMenu.js";
import MainScene from "./MainScene.js";

let config = {
    type: Phaser.AUTO,
    parent: "canvas",
    width: 800, 
    height: 600,
    scale: {
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    scene: [MainMenu, MainScene]
}

new Phaser.Game(config);