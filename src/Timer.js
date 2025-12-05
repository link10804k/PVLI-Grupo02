export default class ProductionTimer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, duration, textureKey, onCompleteCallback = null, changeColor = false) {
        super(scene, x, y);

        this.scene = scene;
        this.duration = duration;
        this.remaining = duration;
        this.radius = 30;
        this.startTime = null;
        this.finished = false;
        this.destroyedFlag = false;
        this.onCompleteCallback = onCompleteCallback; // callback opcional
        this.changeColor= changeColor;

        // Gráfico base (círculo gris)
        this.baseCircle = this.scene.add.graphics(); 
        this.baseCircle.lineStyle(10, 0x444444, 1);
        this.baseCircle.strokeCircle(0, 0, this.radius);
        // Gráfico del progreso (círculo que se rellena)
       this.progressCircle = scene.make.graphics({});

        // Icono del producto

        this.icon = scene.add.image(0, 0, textureKey);
        this.icon.setDisplaySize(40, 40);
        this.icon.setDepth(10);
        if(!textureKey) this.icon.setAlpha(0);

        // Texto del tiempo restante
        this.timeText = scene.add.text(0, 60, duration + "s", {
            fontFamily: "Arial",
            fontSize: "30px",
            color: "#17bb08ff",
            stroke: "#000000",  
            strokeThickness: 6
        }).setOrigin(0.5);

        // Agregar los elementos al container
        this.add([this.baseCircle, this.progressCircle, this.icon, this.timeText]);

        // Añadir el container a la escena
        scene.add.existing(this);
    }

    start() {
        this.startTime = this.scene.time.now;

        // Guardamos la referencia del callback para poder quitarlo luego
        this.updateCallback = this.updateTimer.bind(this);

        // Actualizar cada frame
        this.scene.events.on("update", this.updateTimer, this);
    }

    // Sobrescribimos destroy para limpiar listener
    destroy() {

    // Evita que updateTimer siga ejecutándose
    this.destroyedFlag = true;
    // Quitamos listener antes de destruir
    if (this.updateCallback) {
        this.scene.events.off("update", this.updateCallback);
        this.updateCallback = null;
    }

    super.destroy();
}

    updateTimer() {
        if (this.destroyedFlag) return;
        if (this.finished) return;
       
        const now = this.scene.time.now;
        const elapsed = (now - this.startTime) / 1000; // en segundos
        this.remaining = Math.max(this.duration - elapsed, 0); // tiempo restante

        // Actualiza el tiempo en pantalla
        this.timeText.setText(Math.ceil(this.remaining) + "s"); // redondear hacia arriba

        // Dibujar el círculo de progreso
        const progress = (1 - this.remaining / this.duration) * Math.PI * 2;// Progreso en radianes, de 0 a 2π

        this.progressCircle.clear();
        // progreso normalizado 0 = inicio (verde) → 1 = fin (rojo)
        let t = 1 - (this.remaining / this.duration);

        let color = 0x00cc00; // verde por defecto

        if (this.changeColor) { //Si hay cambio de color:
            color = this.interpolateColor(0x00ff00, 0xff0000, t);
        }

        this.progressCircle.lineStyle(10, color, 1);

        if (this.changeColor) { // Si hay cambio de color convertimos el color numérico a string hex (#rrggbb)
       
            const hexColor = "#" + color.toString(16).padStart(6, "0");
            this.timeText.setColor(hexColor);
        }

        this.progressCircle.beginPath();
        this.progressCircle.arc(0, 0, this.radius, -Math.PI / 2, progress - Math.PI / 2);
        this.progressCircle.strokePath();

        if (this.remaining <= 0) {
            this.finished = true;
            if (this.onCompleteCallback) {
                this.onCompleteCallback(); // llama al callback
    }
        }
        
    }

    interpolateColor(color1, color2, factor) {
    const r1 = (color1 >> 16) & 0xff;
    const g1 = (color1 >> 8) & 0xff;
    const b1 = color1 & 0xff;

    const r2 = (color2 >> 16) & 0xff;
    const g2 = (color2 >> 8) & 0xff;
    const b2 = color2 & 0xff;

    const r = r1 + (r2 - r1) * factor;
    const g = g1 + (g2 - g1) * factor;
    const b = b1 + (b2 - b1) * factor;

    return (r << 16) + (g << 8) + b;
}
    
}