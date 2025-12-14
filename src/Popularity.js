import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js"; 
import Application from "./Application.js";
import MainScene from "./MainScene.js";

export default class PopularityBar {
    constructor(scene, playerInventory, workersUI) {
        this.scene = scene;
        this.inventory = playerInventory
        this.workersUI = workersUI;
       

        //Dimensiones
        this.width = 200;
        this.height = 20;

        //Popularidad
        this.level = 1;
        this.currentPopularity = 0;
        this.popularityNeeded = 300;

        //Color personalizable
        this.color = 0Xda0086;

        //Posiciones (anclado arriba a la derecha)
        const padding = 30; // espacio desde el borde
        this.x = (scene.scale.width - this.width) / 2;
        this.y = padding + this.height / 2;

        //Corazon
        this.heartText = scene.add.text(
            this.x - 30,   // a la izquierda del nivel
            this.y,
            "❤",
            {
                fontSize: "42px",
            color: "#da0086",    // mismo color que la barra
            stroke: "#000000",
            strokeThickness: 3,
            }
).setOrigin(0.5);

        //Texto del nivel (a la izquierda)
        this.levelText = scene.add.text(this.x - 38, this.y - 3, `${this.level}`, {
            fontSize: '30px',
            fill: '#030002ff',
            stroke: '#000000ff',
            strokeThickness: 1
        }).setOrigin(0, 0.5);

        // Barra de fondo
        this.background = scene.add.rectangle(
            this.x, this.y, this.width, this.height, 0x333333, 0.3
        ).setOrigin(0, 0.5);

        // Barra de progreso
        this.bar = scene.add.rectangle(
            this.x, this.y, 0, this.height, this.color
        ).setOrigin(0, 0.5);

        // Que sigan la cámara si se mueve
        this.levelText.setScrollFactor(0);
        this.background.setScrollFactor(0);
        this.bar.setScrollFactor(0);

        // Escuchar eventos de aumento de popularidad
        EventBus.on(events.ADD_POPULARITY, (amount) => {
        this.addPopularity(amount);
        });
        EventBus.on(events.REMOVE_POPULARITY, (amount) => {
        this.loosePopularity(amount);
        });

    //////////////////////////////////////////////////////////////
    //TRUQUITOS/////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    this.zKey = this.scene.input.keyboard.addKey('Z');
        this.zKey.on("down", () => {
            this.addPopularity(25);
    }   );

    this.xKey = this.scene.input.keyboard.addKey('X');
        this.xKey.on("down", () => {
            this.loosePopularity(25);
    }   );



}

    addPopularity(amount) {
        this.currentPopularity += amount;

        while (this.currentPopularity >= this.popularityNeeded) {
            this.currentPopularity -= this.popularityNeeded;
            this.levelUp();
        }

        this.updateBar();
        this.showFloatingPopularity(amount);
    }
   
    loosePopularity(amount) {
        this.currentPopularity -= amount;

        if (this.currentPopularity < 0) {
            this.currentPopularity = 0;
        }

        this.updateBar();
        this.showFloatingPopularity(-amount);
    }

    levelUp() {
        this.level++;
        this.popularityNeeded = Math.floor(this.popularityNeeded * 1.5);

        this.inventory.workersSlots += 4; // Aumentar espacio para trabajadores al subir de nivel
        this.inventory.workers += 1; // Aumentar número de trabajadores al subir de nivel
        this.inventory.availableWorkers += 1; // Aumentar trabajadores disponibles
        
        this.workersUI.setText(this.inventory.availableWorkers + "/" + this.inventory.workers);

        this.levelText.setText(`${this.level}`);

        EventBus.emit(events.LEVEL_INCREASED, this.level);

        this.scene.sound.play("popularityUp", { volume: 0.5} ); // Sonido de subida de nivel de popularidad

        const tutoUI = this.scene.scene.get("TutorialUIScene");
        if (tutoUI && tutoUI.tutorial) {
            tutoUI.tutorial.notify("LEVEL");
        }
    }

    updateBar() {
        const percentage = this.currentPopularity / this.popularityNeeded;
         const targetWidth = this.width * percentage;
    // Parar tween anterior si existe
        if (this.barTween) {
            this.barTween.stop();
            this.barTween = null;
        }

    // Objeto proxy con el ancho actual
    const startWidth = this.bar.width || 0;
    const proxy = { w: startWidth };

    this.barTween = this.scene.tweens.add({
        targets: proxy,
        w: targetWidth,
        duration: 1000,            // ajusta la velocidad aquí
        ease: "Quad.easeOut",
        onUpdate: () => {
            // Asignamos el valor intermedio al rectángulo
            this.bar.width = proxy.w;
        },
        onComplete: () => {
            // Aseguramos el valor final exacto y liberamos referencia
            this.bar.width = targetWidth;
            this.barTween = null;
        }
    });

    }

    showFloatingPopularity(amount) {
    const isPositive = amount >= 0;

    const floatText = this.scene.add.text(
        this.heartText.x - 35,   // a la izquierda del corazón
        this.heartText.y,
        `${isPositive ? "+" : ""}${amount}`,
        {
            fontSize: "22px",
            fill: isPositive ? "#da0086" : "#ff0000",
            stroke: "#000000",
            strokeThickness: 1
        }
    ).setOrigin(1, 0.5);

    floatText.setScrollFactor(0);

    this.scene.tweens.add({
        targets: floatText,
        y: floatText.y - 35,     // sube
        alpha: 0,                // desaparece
        duration: 3000,
        ease: "Cubic.easeOut",
        onComplete: () => {
            floatText.destroy();
        }
    });
}
}