export default class inventory extends Phaser.GameObjects.Sprite{
constructor(){

    this.recursos = {
        cafe: 0,
        te: 0
    };

    this.productos = {};

}

    hayProducto(nombre, cantidad = 1){
        return (this.productos[nombre] || 0) >= cantidad;
    }

    añadeProducto(nombre, cantidad = 1){
        if(!this.productos[nombre]){
            this.productos[nombre] = 0;
        }
        this.productos[nombre] += cantidad;
    }

    quitaProducto(nombre, cantidad = 1){
        if(this.hayProducto(nombre, cantidad)){
            this.productos[nombre] -= cantidad;
        }
        else{
            console.warn(`No hay suficiente producto: ${nombre}`);
        }
    }
}