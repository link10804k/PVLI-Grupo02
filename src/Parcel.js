import GameButton from "./GameButton.js";

export default class Parcel extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture = "parcela", currentBuilding, occupied) {
    super(scene, x, y, texture)
    
    scene.add.existing(this);

    this.currentBuilding = currentBuilding;
    this.occupied = occupied;

    new GameButton(this.scene, this.x, this.y, "button", displayBuildMenu()).setOrigin(0.5);
    }
    dispayBuildMenu() {
        // Despliega un menú
    }

    getActualBuilding(){
        return currentBuilding;
    }

    isOccupied(){
        return occupied;
    }

    build(building){
        switch (building) {
            case granja:
                 //logica para construir granja
                break;
            case fabrica:
                //logica para construir fabrica
                break;
       
            default:
                break;
        }
    }
}