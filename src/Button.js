export default class Button extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture="button", func) {
        super(scene, x, y, texture);

         // Convertimos func en array para permitir múltiples callbacks
       this.func = [].concat(func); //concat añade func a un array, si ya es un array lo deja igual

        scene.add.existing(this);

        this.setInteractive();

        this.on("pointerover", () => this.onMouseOver());
        this.on("pointerdown", () => this.onMouseDown());
        this.on("pointerout", () => this.onMouseOut());
    }
    onMouseOver() {
      this.setTint(0xaaaaaa);
      this.scale *= 1.1;
    }
    onMouseOut() {
      this.clearTint();
      this.scale /= 1.1;
    }
    onMouseDown() {
         console.log("Botón presionado");
         this.scene.sound.play("popUp", { volume: 0.2 }); // Sonido de pop up

        // Ejecutamos todas las funciones
       this.func.forEach(f => f());}
    
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