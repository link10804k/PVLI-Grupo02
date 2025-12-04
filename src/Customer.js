export default class Customer extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture){
        super(scene, x ,y, texture);

        //escena añadida
        scene.add.existing(this);

        this.speed = 25; // píxeles por segundo
        this.walking = false;
        this.direction = {x: 0, y: -1};
        this.isFinished = false;
        this.fading = false;
        this.fadingSpeed = 0;
        this.order = null

        this.setRotation(Math.PI); // Mirando hacia arriba
    }
    Walk(distance, direction) {
        let duration = (distance / this.speed) * 1000; // duración en ms
        this.direction = direction;

        let angle = Math.atan2(direction.y, direction.x); // Ángulo a partir de la dirección RIGHT
        this.setRotation(angle - Math.PI / 2); // Offset para que la dirección de partida sea DOWN 
                                                // (No debería ser + PI/2?? Funciona así por alguna razon)

        this.walking = true;
        if (this.isFinished) {
            this.fading = true;
            this.fadingSpeed = 1000 / duration; // 1000 porque duration está en ms
        }      

        this.scene.sound.play('customer_walk');

        this.timeEvent = this.scene.time.addEvent({
            delay: duration,
            callback: () => {
                this.walking = false;
                if (this.isFinished) {
                    this.fading = false;
                    this.destroy();
                }            
            }
        });
    }
    GetOut(distance, direction) {
        this.isFinished = true;
        this.Walk(distance, direction);
    }

    GetOutAngry(distance, direction) {
        this.GetAngry();      // Mostrar icono
        this.isFinished = true;
        this.Walk(distance, direction); // Reutiliza el Walk normal
}

   GetAngry() {
    //crea el icono
    this.angryIcon = this.scene.add.image(
        this.x + this.displayWidth * 1.5,
        this.y - this.displayHeight * 0.8,
        'Angry'
    ).setOrigin(0.5, 0.5).setScale(0.05);

    //icono por encima de customer
    this.angryIcon.setDepth(this.depth + 1);
}

    preUpdate(t, dt) {
        dt /= 1000; // Convertir dt a segundos
        if (this.walking) {
            this.x += this.direction.x * this.speed * dt;
            this.y += this.direction.y * this.speed * dt;
        }
        if (this.fading) {
            this.alpha -= this.fadingSpeed * dt;
            if (this.alpha < 0) this.alpha = 0;
        }

        //Mover icono enfadado junto al Customer 
         if (this.angryIcon) {
        const offsetX = this.displayWidth * 1.5;  
        const offsetY = -this.displayHeight * 0.8;

        this.angryIcon.x = this.x + offsetX;
        this.angryIcon.y = this.y + offsetY;
    }
    }

     SetOrder(order) {
    this.order = order;
}

    destroy(fromScene) { //destroyer para borrar el icono junto al customer
    if (this.angryIcon) {
        this.angryIcon.destroy();
        this.angryIcon = null;
    }
    super.destroy(fromScene);
}
}