export default class Resource extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, name, description, time) {
        super(scene, x, y, texture);

        this.name = name;
        this.description = description;
        this.time = time;
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getTiempo()
    {
        return this.time;
    }

}