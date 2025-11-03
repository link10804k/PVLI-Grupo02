import Button from "./Button.js";

export default class CoffeeSelectionMenu extends Phaser.Scene {
    constructor() {
        super({ key : "CoffeeSelectionMenu" });
    }

    create() {
        this.menuButton = new Button(this, 400, 300, "button", () => this.showMenu()); 

        this.timerText = this.add
            .text(400, 200, "Timer: 0", { fontSize: "32px", color: "#ffffff" })
            .setOrigin(0.5);
    }

    showMenu() {
        this.menuBackground = this.add
            .rectangle(400, 300, 800, 600, 0x000000, 0.6)
            .setInteractive();

        this.image1 = this.add.image(250, 300, "coffee1").setScale(0.5);
        this.image2 = this.add.image(550, 300, "coffee2").setScale(0.5);

        this.selectButton1 = new Button(this, 250, 500, "button", () => {
            this.hideMenu();
            this.startTimer(10);
        });

         this.closeMenuButton = new Button(this, 550, 400, "button", () => this.hideMenu());
    }

    hideMenu() {
        this.menuBackground.destroy();
        this.image1.destroy();
        this.image2.destroy();
        this.selectButton1.destroy();
        this.closeMenuButton.destroy();
    }

    startTimer(timeLeft) {
        this.timerEvent.setText = (`Tiempo: ${timeLeft}`);

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            repeat: timeLeft - 1,
            callback: () => {
                timeLeft--;
                this.timerText.setText(`Timer: ${timeLeft}`);
                if (timeLeft <= 0) {
                    this.timerText.setText("Time's up!");
                }
            },
        });
    }
}