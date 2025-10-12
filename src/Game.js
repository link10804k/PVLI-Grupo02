import MainScene from "./MainScene.js";

let config = {
    type: Phaser.AUTO,
    width: 800, // 1024
    height: 600, // 768
    scale: {
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    scene: [MainScene]
}

new Phaser.Game(config);