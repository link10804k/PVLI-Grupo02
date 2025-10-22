export default class Product extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, name, description, processingTime) {
        super(scene, x, y, 'cafe');
        this.name = name;
        this.description = description;
        this.processingTime = processingTime;
        this.upgradeTier = 1;
       
        function getName() {
            return this.name;
        }

        function getDescription() {
            return this.description;
        }

        function getTime() {
            return this.processingTime;
        }
    }
}