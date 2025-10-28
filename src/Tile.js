import GameButton from "./GameButton.js";

export default class Tile extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture = "tile", currentBuilding) {
        super(scene, x, y, texture)
        
        scene.add.existing(this);

        this.currentBuilding = currentBuilding;
        this.occupied = false;

        new GameButton(this.scene, this.x, this.y, "button", this.displayBuildMenu.bind()).setOrigin(0.5);
    }
    displayBuildMenu() {
        // Despliega un menú
        console.log("*Se despliega el menú de construcción*");
    }

    getActualBuilding(){
        return this.currentBuilding;
    }

    isOccupied(){
        return this.occupied;
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
