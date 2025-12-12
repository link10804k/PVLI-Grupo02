const BALL_RADIUS = 10;

export default class GachaBall extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        scene.add.existing(this);

        // Le doy un body a la bola
        this.scene.matter.add.gameObject(this);
        this.setCircle(BALL_RADIUS);
        this.setBounce(0.6);
        this.setFrictionAir(0);
        this.setFriction(0);

        this.add(this.scene.add.circle(0, 0, BALL_RADIUS, 0xFFFF10).setOrigin(0.5));

        this.text = this.scene.add.text(0, 0, "", { fontSize: '20px', fill: '#000' }).setOrigin(0.5);
        this.add(this.text);
    }
    setProduct(product) {
        this.product = product;
        if (product == null) {
            this.setProductText("少");
        }
        else {
            this.setProductText(product.japaneseName);
        }
    }
    setProductText(text) { // Método para asignar el texto (producto) a la bola
        this.text.setText(text);
    }
}