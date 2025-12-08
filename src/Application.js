export default class Application {
    constructor(scene, userId = null, imageKey = null, captionText = "Pie de imagen") {
        this.scene = scene;
        this.userId = userId;

        this.setupDimensions();
        this.createContainer();
        this.createRectangle();
        this.setupMovement();
        this.createUsernameText();
        this.createImage(imageKey);
        this.adjustImageSize();
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

     createRectangle() {
        this.rect = this.scene.add.rectangle(0, 0, this.width, this.height, 0x734F96)
            .setOrigin(0.5);
    }

     setupMovement() {
        this.speed = 120;
        this.targetY = this.scene.cameras.main.height / 2;
        this.lifeTime = 5000;
        this.staying = false;
        this.lifeTimer = 0;
    }

    createUsernameText() {
        this.usernameText = this.scene.add.text(
            -this.width / 2 + 10,
            -this.height / 2 + 10,
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

    createImage(imageKey) {
        if (imageKey) {
            this.image = this.scene.add.image(0, -this.height * 0.1, imageKey);
        } else {
            this.image = this.scene.add.rectangle(
                0,
                -this.height * 0.1,
                this.width * 0.8,
                this.height * 0.5,
                0xffffff
            );
        }
    }

     adjustImageSize() {
        this.image.displayWidth = this.width * 0.8;
        this.image.displayHeight = this.height * 0.5;
    }

     createCaptionText(captionText) {
        this.text = this.scene.add.text(0, this.height / 4, captionText, {
            fontSize: '14px',
            color: '#000',
            align: 'center',
            stroke: '#000000ff',
            strokeThickness: 1,
            wordWrap: { width: this.width * 0.9 }
        });
        this.text.setOrigin(0.5, 0);
    }

    addToContainer() {
        this.container.add([this.rect, this.usernameText, this.image, this.text]);
    }

}