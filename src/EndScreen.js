import Application from "./Application.js";
import Button from "./Button.js";

export default class EndScreen extends Phaser.Scene {
    constructor(){
        super({ key: "EndScreen" });
    }
    create() {
        this.displayEndScreen();
    }
    displayEndScreen() {
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);

        this.createApplication();

        this.continueText = this.add.text(400, 530, "Continuar", {fontSize: "24px"}).setOrigin(0.5);
        this.continueButton = new Button(this, 400, 500, "plus", () => {
            this.scene.resume("MainScene");
            this.scene.resume("UIScene");
            this.scene.stop("EndScreen");
        }).setOrigin(0.5).setScale(2);
    }
    createApplication() {
        let image;
            
        let text = "¡Wow! ¡Qué popular es esta cafetería! ¿Se podría decir que se ha pasado el juego del capitalismo? " + 
        "Parece que no hay botón de salir así que supongo que podrás seguir jugando";

        let user = "WallyButChinese";

        new Application(this, user, "Smartphone", text, 100000);
    }
}