export default class Wally extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene, 0, 0, "wally");

        this.scene = scene;
        this.inventory = scene.playerInventory;
        this.setScale(0.02);

        this.positions = [
            { x: 100, y: 175 },
            { x: 150, y: 300 },
            { x: 350, y: 175 },
            { x: 525, y: 450 },
            { x: 525, y: 250 }

        ];

        // No aparece todavía
        this.setAlpha(0);
        this.setPosition(-500, -500); // fuera de pantalla

        // Agregar el objeto a la escena
        this.scene.add.existing(this);

        // Interactivo para clicks
        this.setInteractive();
        this.on("pointerdown", () => this.onClick());

       // Empezar el ciclo automático
        this.nextAppearance();
    }

    // Genera un intervalo aleatorio entre 10 y 20 segundos
    getRandomInterval() {
        return Phaser.Math.Between(10000, 20000);
    }

    // Elegir aleatoriamente una posición interna
    getRandomPosition() {
        return Phaser.Utils.Array.GetRandom(this.positions);
    }

    // Programa la próxima aparición
    nextAppearance() {
        const delay = this.getRandomInterval();

        console.log("Wally aparecerá en " + delay + " ms");

        this.scene.time.delayedCall(delay, () => {
            this.appear();
        });
    }


     // Hace aparecer al sprite en una posición aleatoria
    appear() {
        const pos = this.getRandomPosition();
        this.setPosition(pos.x, pos.y);

        // Fade-in rápido
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 400,
            onComplete: () => {
                console.log("Wally ha aparecido en:", pos);
                // Quedarse 10 segundos visible
                this.scene.time.delayedCall(10000, () => {
                    this.disappear();
                });
            }
        });
    }

     // Desaparece moviéndose y bajando alpha
    disappear() {
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            x: -300,            // mover fuera de la pantalla
            y: Phaser.Math.Between(0, 600), // un punto aleatorio fuera
            duration: 800,
            onComplete: () => {
                // Reiniciar ciclo
                this.nextAppearance();
            }
        });
    }

    onClick() {
        const product = this.inventory.produceRandomProduct();
        this.showProducedItemFeedback(product.texture); // Muestra el feedback visual
        this.disappear();
    }

    showProducedItemFeedback(textureKey) {
    const x = this.x;
    const y = this.y - 40; // un poco encima de Wally

    // Sprite del producto
    const productSprite = this.scene.add.image(x, y, textureKey).setScale(1);
    productSprite.setDepth(999); 
    productSprite.setAlpha(1);

    // Texto "+1"
    const plusOne = this.scene.add.text(x + 25, y, "+1", {
        fontSize: "28px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4
    })
    .setOrigin(0.5)
    .setDepth(999)
    .setAlpha(1);

    // Tween para ambos
    this.scene.tweens.add({
        targets: [productSprite, plusOne],
        y: y - 40,
        alpha: 0,
        duration: 1200,
        ease: "Cubic.easeOut",
        onComplete: () => {
            productSprite.destroy();
            plusOne.destroy();
        }
    });
}

}