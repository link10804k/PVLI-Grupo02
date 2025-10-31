import Building from "./Building.js";
import Button from "./Button.js";

const ESCALADO_CONSTRUCCION = 0.4;

export default class Parcel extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture = "parcela", currentBuilding, occupied) {
    super(scene, x, y, texture)
    
    scene.add.existing(this);

    this.currentBuilding = currentBuilding;
    this.occupied = occupied;
    this.menuContainer = null;

    // Botón central
    this.buildButton = new Button(this.scene, this.x, this.y, "button", () => this.displayBuildMenu());
    this.buildButton.setOrigin(0.5);
    //this.buildButton.setDepth(10); // Evita que quede detrás de la parcela
    }
    destructor() {
        this.buildButton.destroy();
        this.destroy();
    }

    displayBuildMenu() {

    console.log("📋 Mostrando menú de construcción...");

    // Si ya existe un menú, lo eliminamos
    if (this.menuContainer) {
      this.menuContainer.destroy();
      this.menuContainer = null;
      return;
    }

    //Coordenadas: justo a la derecha de la parcela
    const offsetX = this.width / 6; // un poco separado del borde
    const menuX = this.x + offsetX;
    const menuY = this.y;
     //Contenedor del menú
    this.menuContainer = this.scene.add.container(menuX, menuY);
    this.menuContainer.setScale(1); // Escala del menú

    // Fondo
    const bg = this.scene.add.rectangle(0, 0, 120, 100, 0x514F4F, 1).setOrigin(0.5);
    bg.setStrokeStyle(1, 0xffffff);
    
    // Título
    const title = this.scene.add.text(-30, -15, "Construir", {
      color: "#fcfcfcff",
      fontSize: "15px",
    });
    
    const buildText = this.scene.add.text(-50, 0, "Granja", {
      color: "#00ff00", fontSize: "15px", backgroundColor: "#333", padding: { x: 5, y: 5 },})
      .setInteractive({ useHandCursor: true });

    // Acción al hacer clic en el texto
    buildText.on("pointerdown", () => {
      console.log("🔨 Construyendo Granja...");
      const newBuilding = new Building(this.scene, this.x, this.y, "building", "Granja", "Produce alimentos", [], 1).setScale(ESCALADO_CONSTRUCCION);
      this.build(newBuilding);
      this.menuContainer.destroy();
      this.menuContainer = null;
      this.buildButton.disable(); // Desactivar el botón tras construir
    });

    this.menuContainer.add([bg, title, buildText]); // Agregar elementos al contenedor del menú
    }

    getCurrentBuilding(){
        return currentBuilding;
    }

    isOccupied(){
        return occupied;
    }

   build(building) {
    this.currentBuilding = building;
    console.log(`Construido: ${building.getName()} en la parcela.`);
    this.destructor();
  }
}