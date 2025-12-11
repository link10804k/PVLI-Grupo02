import TutorialManager from "./TutorialManager.js";

export default class TutorialUIScene extends Phaser.Scene {
    constructor() {
        super({ key: "TutorialUIScene" });

        this.tutorial = null;
    }
    
    preload() {
        this.load.image("K_angry", "assets/gameAssets/Knekro_angry.png")
        this.load.image("K_happy", "assets/gameAssets/Knekro_happy.png")
        this.load.image("K_presente", "assets/gameAssets/Knekro_presente.png")
        this.load.image("K_talk", "assets/gameAssets/Knekro_talk.png")
    }
    create() {
        // Crear el manager del tutorial
        this.tutorial = new TutorialManager(this);
        this.tutorial.start();

        // Asegurar que esta escena está arriba
        this.scene.bringToTop();
    }

    // Método para notificar objetivos desde TutorialScene
    notify(actionName) {
        if (this.tutorial) {
            this.tutorial.notify(actionName);
        }
    }
}

