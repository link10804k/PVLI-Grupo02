import Building from "./Building.js";
import Button from "./Button.js";

const ESCALADO_CONSTRUCCION = 0.4;

export default class Tile extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture = "tile", occupied) {
    super(scene, x, y, texture)
    
    scene.add.existing(this);

    this.currentBuilding = null;
    this.occupied = occupied;
  

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
        if (this.occupied) {
            console.log("Parcela ocupada. No se puede construir aquí.");
            return;
        }
        else {
            this.scene.scene.pause();
            this.scene.UIScene.scene.pause();
            this.scene.scene.launch("BuildingMenuScene", { tile: this, mainScene: this.scene});
        }
    }

    getCurrentBuilding(){
        return currentBuilding;
    }

    isOccupied(){
        return occupied;
    }

   build(buildingData) {
    // Evitar construir si ya hay un edificio en este tile
    if (this.currentBuilding) {
        console.warn(`⛔ Este tile ya tiene un edificio construido: ${this.currentBuilding.name}`);
        return;
    }

     // Crear una nueva instancia de la clase Building con los datos del tipo seleccionado
    const newBuilding = new Building(
        this.scene,                      // Escena actual
        this.x,                          // Coordenada X del tile
        this.y,                          // Coordenada Y del tile
        buildingData.texture,            // Textura principal del edificio
        buildingData.name,               // Nombre
        buildingData.description,        // Descripción
        buildingData.products,    // Recursos que produce
        buildingData.productionSpeed ?? 1.0 // Velocidad de producción
    )
  
 // Guardar referencia
    this.currentBuilding = newBuilding;

     // Agregarlo a la lista global de edificios de la escena (si existe)
   // if (!this.scene.buildings) this.scene.buildings = [];
    //this.scene.buildings.push(newBuilding);
    this.buildButton.disable(); // Desactivar el botón de construcción
    this.occupied = true; // Marcar el tile como ocupado
  }
}