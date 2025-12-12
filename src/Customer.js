export default class Customer extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture){
        super(scene, x ,y, texture);

        //escena añadida
        scene.add.existing(this);

        this.speed = 25; // píxeles por segundo
        this.isFinished = false;
        this.order = null

        this.setRotation(Math.PI); // Mirando hacia arriba
    }
    Walk(distance, direction) {
        let duration = (distance / this.speed) * 1000; // duración en ms
        
        let angle = Math.atan2(direction.y, direction.x); // Ángulo a partir de la dirección RIGHT
        this.setRotation(angle - Math.PI / 2); // Offset para que la dirección de partida sea DOWN 

        const targetX = this.x + direction.x * distance;
        const targetY = this.y + direction.y * distance;

        this.scene.sound.play("customerExit");

       //TWEEN PRINCIPAL (movimiento)
        this.scene.tweens.add({
            targets: this,
            x: targetX,
            y: targetY,
            duration: duration,
            ease: "Linear",
            onUpdate: () => {
                // Mantener el icono enfadado pegado al Customer
                if (this.angryIcon) {
                    const offsetX = this.displayWidth * 1.5;
                    const offsetY = -this.displayHeight * 0.8;
                    this.angryIcon.x = this.x + offsetX;
                    this.angryIcon.y = this.y + offsetY;
                }
            }
        });
        if (this.isFinished) {
            this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: duration,
            ease: "Linear",
            onComplete: () => {
                this.destroy();
            }
        });
        }
    }


    fadeOutAndDestroy(duration) {
        console.log("Esto: " + this);
        console.log("Escena: " + this.scene);
        console.log("Tweens: " + this.scene.tweens);
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: duration,
            ease: "Linear",
            onComplete: () => {
                
            }
        });

        // Desaparecer también el icono si existe
        if (this.angryIcon) {
            this.scene.tweens.add({
                targets: this.angryIcon,
                alpha: 0,
                duration: duration,
                ease: "Linear"
            });
        }
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