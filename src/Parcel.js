export default class Parcel extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture = "parcela", actualBuilding, occupied) {
    super(scene, x, y, texture)
    
    this.actualBuilding = Building;
    this.occupied = occupied;
    }
  
    getActualBuilding(){
        return actualBuilding;
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