export default class Application {
    constructor(scene, imageKey = null, captionText = "Pie de imagen") {
        this.scene = scene;

        // Dimensiones del rectángulo (puedes modificarlas aquí)
        this.width = 200;
        this.height = 300;

        // Posición inicial (fuera de la pantalla abajo)
        const xStart = this.scene.cameras.main.width / 2;
        const yPos = this.scene.cameras.main.height + this.height / 2;
        

        // Contenedor para imagen, texto y background
        this.container = this.scene.add.container(xStart, yPos);

        // Crear el rectángulo dentro del container
        this.rect = this.scene.add.rectangle(0, 0, this.width, this.height, 0x734F96).setOrigin(0.5);

        // Velocidad de deslizamiento (en píxeles por segundo)
        this.speed = 120;

        // Objetivo: Centro de la pantalla
         this.targetY = this.scene.cameras.main.height / 2;

         // Tiempo que permanece visible (en ms)
        this.lifeTime = 5000; // 5 segundos
        this.staying = false; // indicador de que está en su posición
        this.lifeTimer = 0;

         

        // Crear imagen (placeholder si no se pasa key)
       if (imageKey) {
        this.image = this.scene.add.image(0, -this.height * 0.1, imageKey);
        }       
        else {
        // placeholder más pequeño que el rectángulo
            this.image = this.scene.add.rectangle(0, -this.height * 0.1, this.width * 0.8, this.height * 0.5, 0xffffff);
        }

         // Ajustar tamaño máximo para que no se salga del rectángulo
        this.image.displayWidth = this.width * 0.8;
        this.image.displayHeight = this.height * 0.5;

        // Crear texto debajo de la imagen
        this.text = this.scene.add.text(0, this.height / 4, captionText, {
            fontSize: '14px',
            color: '#000',
            align: 'center',
             stroke: '#000000ff',
            strokeThickness: 1,
            wordWrap: { width: this.width * 0.9 } // Ajustar al ancho del rectángulo
        });
        this.text.setOrigin(0.5, 0);

        //Añadir rectángulo, imagen y texto al contenedor
        this.container.add([this.rect, this.image, this.text]);
        

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
}