import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js"; 
import Aplication from "./Aplication.js";
import MainScene from "./MainScene.js";

export default class PopularityBar {
    constructor(scene, playerInventory) {
        this.scene = scene;
        this.inventory = playerInventory

        //Dimensiones
        this.width = 200;
        this.height = 20;

        //Popularidad
        this.level = 1;
        this.currentPopularity = 0;
        this.popularityNeeded = 100;

        //Color personalizable
        this.color = 0Xda0086;

        //Posiciones (anclado arriba a la derecha)
        const padding = 30; // espacio desde el borde
        this.x = (scene.scale.width - this.width) / 2;
        this.y = padding + this.height / 2;

        //Texto del nivel (a la izquierda)
        this.levelText = scene.add.text(this.x - 20, this.y, `${this.level}`, {
            fontSize: '30px',
            fill: '#da0086ff',
            stroke: '#da0086',
            strokeThickness: 2
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

 this.zKey = this.scene.input.keyboard.addKey('Z');
    this.zKey.on("down", () => {
        this.addPopularity(25);
    }   );


}

    addPopularity(amount) {
        this.currentPopularity += amount;

        while (this.currentPopularity >= this.popularityNeeded) {
            this.currentPopularity -= this.popularityNeeded;
            this.levelUp();
        }

        this.updateBar();
    }
   
    loosePopularity(amount) {
        this.currentPopularity -= amount;

        if (this.currentPopularity < 0) {
            this.currentPopularity = 0;
        }

        this.updateBar();
    }

    levelUp() {
        this.level++;
        this.popularityNeeded = Math.floor(this.popularityNeeded * 1.25);

        this.inventory.workersSlots += 4; // Aumentar espacio para trabajadores al subir de nivel
        this.inventory.worckers += 1; // Aumentar número de trabajadores al subir de nivel

        this.levelText.setText(`${this.level}`);
        new Aplication(this.scene, Image, "Cuanto me gustan los macarrones!");
        console.log(`¡Has alcanzado el nivel de popularidad ${this.level}!`);


    }

    updateBar() {
        const percentage = this.currentPopularity / this.popularityNeeded;
        this.bar.width = this.width * percentage;
    }
}