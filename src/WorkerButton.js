import Button from "./Button.js";

export default class WorkerButton extends Button {
    constructor(scene, x, y, texture = "button", func = null) {
        super(scene, x, y, texture, func);
        this.scene = scene;
        this.setScale(0.25); // tamaño por defecto
    }

    onMouseOver() {
        this.setScale(0.3);
    }

    onMouseOut() {
        this.setScale(0.25);
    }

    onMouseDown() {
        console.log("[WorkerButton] pointerdown received on", this.x, this.y);
        // Ejecutar la función pasada (por ejemplo: abrir menú)
        if (this.func) {
            try { this.func(); } catch (e) { 
                console.error("[WorkerButton] error calling func:", e); }
        } 
        
        else {
            console.log("[WorkerButton] no func, nothing to do");
        }
    }
}