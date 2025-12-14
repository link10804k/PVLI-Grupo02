export default class ProductionTimer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, duration, textureKey = null, onCompleteCallback = null, changeColor = false, building = null) {
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
        this.building = building;

        // Gráfico base (círculo gris)
        this.baseCircle = this.scene.add.graphics(); 
        this.baseCircle.lineStyle(10, 0x444444, 1);
        this.baseCircle.strokeCircle(0, 0, this.radius);
        // Gráfico del progreso (círculo que se rellena)
       this.progressCircle = scene.make.graphics({});

        // Icono del producto
        if (textureKey != null) {
            this.icon = scene.add.image(0, 0, textureKey);
            //this.icon.setDisplaySize(40, 40);
            this.icon.setScale(2);
            this.icon.setDepth(10);
        }

        // Texto del tiempo restante
        this.timeText = scene.add.text(0, 60, duration + "s", {
            fontFamily: "Arial",
            fontSize: "30px",
            color: "#17bb08ff",
            stroke: "#000000",  
            strokeThickness: 6
        }).setOrigin(0.5);

        //Si hay edificio asociado (para mostrar trabajadores)
         if (this.building) {
            this.workerIcon = scene.add.image(35, 55, "worker")  // esquina inferior derecha
                .setDisplaySize(22, 22)
                .setOrigin(0.5)
                .setDepth(20);

            this.workerText = scene.add.text(40, 55, "0", {
                fontFamily: "Arial",
                fontSize: "20px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 5
            }).setOrigin(0, 0.5);
        }

        // Agregar los elementos al container
       const elements = ([this.baseCircle, this.progressCircle, this.timeText]);

        if (this.icon != null) elements.push(this.icon);
        if (this.workerIcon) elements.push(this.workerIcon); 
        if (this.workerText) elements.push(this.workerText);

        this.add(elements);

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

        //Actualizar trabajadores si hay edificio asociado
        if (this.building) {
            this.workerText.setText("x" + this.building.assignedWorkers);
        }

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
             if (this.building) {;
        this.showProducedItemFeedback(this.icon.texture.key);
    }
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

showProducedItemFeedback(textureKey) {
    if (!textureKey) return;

    // Posición global del timer
    const worldX = this.x;
    const worldY = this.y - 40; // un poco encima del timer

    // Sprite del producto
    const productSprite = this.scene.add.image(worldX, worldY, textureKey)
        .setScale(1)
        .setDepth(999)
        .setAlpha(1);

    // Texto "+1"
    const plusOne = this.scene.add.text(worldX + 25, worldY, "+" + this.building.assignedWorkers, {
        fontSize: "26px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4
    })
        .setOrigin(0.5)
        .setDepth(999)
        .setAlpha(1);

    // Animación
    this.scene.tweens.add({
        targets: [productSprite, plusOne],
        y: worldY - 40,
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