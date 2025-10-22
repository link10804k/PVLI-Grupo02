export default class Product extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, description, processingTime) {
        super(scene, x, y, texture);
        
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