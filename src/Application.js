import Button from "./Button.js";

export default class Application {
    constructor(scene, userId = null, imageKey = "Smartphone", captionText = "Pie de imagen", lifeTime = 5000) {
        this.scene = scene;
        this.userId = userId;
        this.lifeTime = lifeTime;

        console.log("textura: " + imageKey);

        this.setupDimensions();
        this.createContainer();
        this.createRectangle(imageKey);
        this.setupMovement();
        this.createUsernameText();
        this.createExitButton();
        this.createCaptionText(captionText);

        this.addToContainer();
        

        // Lanzar animación de entrada con tween
        this.playEnterTween();
    }

    //TWEEN DE ENTRADA
    playEnterTween() {
        this.scene.tweens.add({
            targets: this.container,
            y: this.targetY,
            duration: 1000,   // tiempo que tarda en entrar
            ease: 'Power2', 
            onComplete: () => {
                // Después de entrar -> esperar -> salir
                this.scene.time.delayedCall(this.lifeTime, () => this.playExitTween());
            }
        });

    }

    //TWEEN DE SALIDA
    playExitTween() {
        this.scene.tweens.add({
            targets: this.container,
            y: this.scene.cameras.main.height + this.height,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.container.destroy();
            }
        });
    }

     setupDimensions() {
        this.width = 200;
        this.height = 300;
    }

     createContainer() {
        const xStart = this.scene.cameras.main.width / 2;
        const yPos = this.scene.cameras.main.height + this.height / 2;
        this.container = this.scene.add.container(xStart, yPos);
    }

     createRectangle(imageKey) {
        this.rect = this.scene.add.image(0, 0, imageKey)
            .setOrigin(0.5);
    }

     setupMovement() {
        this.speed = 120;
        this.targetY = this.scene.cameras.main.height / 2;
        this.staying = false;
        this.lifeTimer = 0;
    }

    createUsernameText() {
        this.usernameText = this.scene.add.text(
            -this.width / 2 + 40,
            -25,
            this.userId || "Usuario",
            {
                fontSize: '14px',
                color: '#000',
                fontStyle: 'bold',
                stroke: '#000000ff',
                strokeThickness: 1
            }
        );
        this.usernameText.setOrigin(0, 0);
    }

     createCaptionText(captionText) {
        this.text = this.scene.add.text(0, 5, captionText, {
            fontSize: '14px',
            color: '#000',
            align: 'center',
            stroke: '#000000ff',
            strokeThickness: 1,
            wordWrap: { width: this.width * 0.9 }
        });
        this.text.setOrigin(0.5, 0);

        this.fitCaptionInsideBox();
    }

createExitButton() {
    this.exitButton = new Button(
        this.scene,
        this.container.x + this.width / 2 - 10,
        this.container.y - this.height / 2 + 10,
        'exit',
        () => this.playExitTween()
    );

    this.exitButton.setOrigin(0.5, 0.5);
    this.exitButton.setDepth(100); // siempre encima

    // Hacer que siga al container
    this.scene.events.on('update', () => {
        this.exitButton.x = this.container.x + this.width / 2 - 10;
        this.exitButton.y = this.container.y - this.height / 2 + 10;
    });
}

fitCaptionInsideBox() {
    const maxHeight = this.height * 0.30; // Altura disponible debajo de la imagen
    const minFont = 8;
    let fontSize = 14;

    do {
        this.text.setStyle({ fontSize: `${fontSize}px` });
        this.text.setWordWrapWidth(this.width * 0.8);

        // Phaser necesita un paso de actualización
        this.text.updateText();
        this.text.updateDisplayOrigin();

        if (this.text.height <= maxHeight) break;

        fontSize--;
    } while (fontSize >= minFont);

    // Si aún no cabe, forzar truncado con "..."
    if (this.text.height > maxHeight) {
        const original = this.text.text;
        let truncated = original;

        while (this.text.height > maxHeight && truncated.length > 0) {
            truncated = truncated.substring(0, truncated.length - 1);
            this.text.setText(truncated + "...");
            this.text.updateText();
        }
    }
}

    addToContainer() {
        this.container.add([this.rect, this.usernameText, this.text]);
    }

}