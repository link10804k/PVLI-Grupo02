export default class Button extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture="button", func) {
        super(scene, x, y, texture);

        this.func = func

        scene.add.existing(this);

        this.setInteractive();

        this.on("pointerover", () => this.onMouseOver());
        this.on("pointerdown", () => this.onMouseDown());
        this.on("pointerout", () => this.onMouseOut());
    }
    onMouseOver() {this.setTint(0xaaaaaa);}
    onMouseOut() {this.clearTint();}
    onMouseDown() {
         console.log("🟢 Botón presionado");
        if (this.func) this.func();} // Aquí se ejecuta la función pasada como parámetro}
    
    //Métodos nuevos para controlar visibilidad y estado
  disable() {
    this.isActive = false;
    this.disableInteractive();
    this.setAlpha(0); // apariencia desactivada
  }

  enable() {
    this.isActive = true;
    this.setInteractive();
    this.setAlpha(1);
  }

}