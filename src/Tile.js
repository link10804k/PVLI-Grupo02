import Building from "./Building.js";
import Button from "./Button.js";

const ESCALADO_CONSTRUCCION = 0.4;

export default class Tile extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, occupied, isProcessor = false, nearWater = false) {
    super(scene, x, y, "plus")
    
    scene.add.existing(this);

    this.currentBuilding = null;
    this.occupied = occupied;

    this.isProcessor = isProcessor;
    this.nearWater = nearWater;

    this.inventory = this.scene.playerInventory;
  
    //Hacer el sprite interactivo
    this.setInteractive({ useHandCursor: true });

    //Efectos visuales (oscurecimiento)
    this.on("pointerover", () => {
      this.setTint(0x999999); // oscurece un poco
    });

    this.on("pointerout", () => {
      this.clearTint(); // vuelve al color original
    });

    this.on("pointerdown", () => {
      this.setTint(0x666666); // más oscuro al hacer clic
    });

    this.on("pointerup", () => {
      this.clearTint();
      this.displayBuildMenu(); // abre el menú
    });
    
    }
    destructor() {
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
            this.scene.scene.launch("BuildingMenuScene", { tile: this, mainScene: this.scene, inventory: this.scene.playerInventory, isProcessor: this.isProcessor } );
        }
    }

    getCurrentBuilding(){
        return this.currentBuilding;
    }

    isOccupied(){
        return this.occupied;
    }

    // devuelve false o true si se consigue construir el edificio
   build(buildingData) {
    // Evitar construir si ya hay un edificio en este tile
        if (this.currentBuilding) {
            console.warn(`Este tile ya tiene un edificio construido: ${this.currentBuilding.name}`);
            return false;
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
            buildingData.productionSpeed ?? 1.0, // Velocidad de producción
            this.isProcessor, // Indica si el edificio es de producción o de procesado
            buildingData.audio // Sonido que hace el edificio al cambiar de producto
            );
        
        if (this.nearWater) {
          newBuilding.setOrigin(0.75, 0.6);
        }
        else {
          newBuilding.setOrigin(0.5);
        }
  
        // Guardar referencia
        this.currentBuilding = newBuilding;

        // Agregarlo a la lista global de edificios de la escena (si existe)
        // if (!this.scene.buildings) this.scene.buildings = [];
        //this.scene.buildings.push(newBuilding);

        this.disableInteractive(); 
        
        this.occupied = true; // Marcar el tile como ocupado

        this.scene.sound.play("build", { volume: 0.2 }); // Sonido de construcción

        this.alpha = 0; // Hacer invisible el tile de construcción

        return true;
    }
}