export default class Product extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, nombre, description, time) {
        super(scene, x, y, texture);

        this.nombre = tiempo;
        this.descripcion = descripcion;
        this.tiempo = tiermpo;
    }

    getNombre() {
        return this.nombre;
    }

    getDescription() {
        return this.description;
    }

    getTiempo()
    {
        return this.time;
    }

}