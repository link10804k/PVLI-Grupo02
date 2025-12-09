export default class FloatingMessage extends Phaser.GameObjects.Text {
    
    //Propiedad estática para almacenar la instancia actual
    static currentInstance = null;

    constructor(uiScene, message) {

        // Si ya hay una instancia activa, la destruimos
        if (FloatingMessage.currentInstance) {
            if (FloatingMessage.currentInstance.fadeTween) {
                FloatingMessage.currentInstance.fadeTween.stop();
            }
            FloatingMessage.currentInstance.destroy();
            FloatingMessage.currentInstance = null;
        }

        const maxWidth = uiScene.cameras.main.width * 0.8; // 80% del ancho de la pantalla
        super(
            uiScene,
            uiScene.cameras.main.width / 2,   // X centrado
            50,                              // Y alto en la UI
            message,
            {
                fontFamily: "Arial",
                fontSize: "30px",
                color: "#a70000ff",
                stroke: "#000000",
                strokeThickness: 5,
                wordWrap: { width: maxWidth, useAdvancedWrap: true },
                align: "center"
            }
        );

        this.setOrigin(0.5);
        this.setDepth(9999);
        this.setScrollFactor(0);

        uiScene.add.existing(this);

        // Ajustar posición Y si el wrap ha aumentado la altura
        this.y = 50 + this.height * 0.5;

        // Guardamos esta instancia como la actual
        FloatingMessage.currentInstance = this;

        // Duración visible antes de desvanecerse
        this.scene.time.delayedCall(1200, () => {
            this.fadeOut();
        });
    }

    fadeOut() {

        // Verificamos que el objeto sigue vivo y tiene escena
            if (!this.scene || !this.active) return;

        // Guardamos la referencia del tween para poder cancelarlo
        this.fadeTween = this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 1000,
            ease: "Linear",
            onComplete: () => {
                if (!this.scene) return; // seguridad extra
                this.destroy();
                if (FloatingMessage.currentInstance === this) FloatingMessage.currentInstance = null;
                
            }
        });
    }
}