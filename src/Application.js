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
        

        // Estado del rectángulo: 'entering', 'staying', 'exiting'
        this.state = 'entering';

        // Activar el update para deslizarlo
        this.scene.events.on('update', this.update, this);
    }

     update(time, delta) {
        const deltaSeconds = delta / 1000;

        switch (this.state) {
            case 'entering':
                if (this.container.y > this.targetY) {
                    this.container.y -= this.speed * deltaSeconds;
                    if (this.container.y <= this.targetY) {
                        this.container.y = this.targetY;
                        this.state = 'staying';
                        this.lifeTimer = 0;
                    }
                }
                break;

            case 'staying':
                this.lifeTimer += delta;
                if (this.lifeTimer >= this.lifeTime) {
                    this.state = 'exiting';
                }
                break;

            case 'exiting':
                this.container.y += this.speed * deltaSeconds;
                if (this.container.y - this.width / 2 > this.scene.cameras.main.width) {
                    this.container.destroy();
                    this.scene.events.off('update', this.update, this);
                }
                break;
        }
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