import Pool from "./Pool.js";
import GachaBasket from "./GachaBasket.js"
import GachaBall from "./GachaBall.js";
import GachaButton from "./GachaButton.js";
import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";

// Canvas
const MID_POINT_X = 400;
const MID_POINT_Y = 300;

// Bordes
const LEFT_BORDER_X = 250;
const RIGHT_BORDER_X = 550;

// Bumpers
const BUMPER_RADIUS = 15;
const BUMPER_ROWS = 4;

const BUMPER_START_Y = 150;
const BUMPER_END_Y = 450;
const BUMPER_GAP_Y = (BUMPER_END_Y - BUMPER_START_Y) / (BUMPER_ROWS - 1);

// Impares
const BUMPER_ODD_COLS = 4;

const BUMPER_ODD_START_X = LEFT_BORDER_X + 60;
const BUMPER_ODD_END_X = RIGHT_BORDER_X - 60;
const BUMPER_ODD_GAP_X = (BUMPER_ODD_END_X - BUMPER_ODD_START_X) / (BUMPER_ODD_COLS - 1);

// Pares
const BUMPER_EVEN_COLS = 5;

const BUMPER_EVEN_START_X = LEFT_BORDER_X + 30;
const BUMPER_EVEN_END_X = RIGHT_BORDER_X - 30;
const BUMPER_EVEN_GAP_X = (BUMPER_EVEN_END_X - BUMPER_EVEN_START_X) / (BUMPER_EVEN_COLS - 1);

// Bolas
const BALL_NUMBER = 10;
const BALL_START = { x: MID_POINT_X, y: 100 };

// Columnas laterales
const LEFT_COLUMN_X = (LEFT_BORDER_X - 30) / 2;
const RIGHT_COLUMN_X = 800 - LEFT_COLUMN_X;

export default class GachaScene extends Phaser.Scene {
    constructor() {
        super({ key: "GachaScene" });
        
        EventBus.on(events.BALL_CAUGHT, (ball) => this.onBallCaught(ball));

        this.caughtProduct = null;
        this.poorText = null;
    }

    init(data){
        this.inventory = data.inventory;
        this.returnScene = data.returnScene;

        this.gachaPrice = 10 * (2**this.inventory.popularityLevel);
    }

    create() {
        // Fondo
        this.add.rectangle(400, 300, 800, 600, 0x000000).setOrigin(0.5);
        // Bumpers
        this.createBumpers();
        // Bordes
        this.createBorders();
        // Pool de bolas
        this.createBallPool();
        // Cesta
        this.gachaBasket = new GachaBasket(this, MID_POINT_X, 550);
        // Botón de inicio
        this.startButton = new GachaButton(this, RIGHT_COLUMN_X, 520, 150, 75, () => this.startGacha(), "¡Prueba \n tu suerte!", { fontSize: "22px", color: "#000000", align: "center", fontStyle: "bold" });
        // Botón de cierre
        this.closeButton = new GachaButton(this, RIGHT_COLUMN_X, 80, 100, 50, () => this.closeScene(), "Salir", { fontSize: "22px", color: "#000000", fontStyle: "bold" });
        // Decoración
        this.createDecoration();
    }
    createDecoration() {
        // Título
        let title = this.add.text(LEFT_COLUMN_X, 100, "GACHA", { fontSize: "50px", color: "#ffff00", fontStyle: "bold" }).setOrigin(0.5);

        let circles = [];
        // Círculos horizontales y verticales
        circles.push(this.add.circle(title.x, title.y - 50, 7, 0xFF0000).setOrigin(0.5));
        circles.push(this.add.circle(title.x, title.y + 50, 7, 0xFF0000).setOrigin(0.5));
        circles.push(this.add.circle(title.x - 95, title.y, 7, 0xFF0000).setOrigin(0.5));
        circles.push(this.add.circle(title.x + 95, title.y, 7, 0xFF0000).setOrigin(0.5));
        // Círculos diagonales
        circles.push(this.add.circle(title.x - 95 * 0.707, title.y - 50 * 0.707, 7, 0xFF0000).setOrigin(0.5));
        circles.push(this.add.circle(title.x - 95 * 0.707, title.y + 50 * 0.707, 7, 0xFF0000).setOrigin(0.5));
        circles.push(this.add.circle(title.x + 95 * 0.707, title.y - 50 * 0.707, 7, 0xFF0000).setOrigin(0.5));
        circles.push(this.add.circle(title.x + 95 * 0.707, title.y + 50 * 0.707, 7, 0xFF0000).setOrigin(0.5));
        // Animación
        function addAnimation(scene, circle) {
            scene.tweens.add({
                targets: circle,
                duration: 200,
                yoyo: true,
                ease: Phaser.Math.Easing.Sine.InOut,
                repeat: -1,
                fillAlpha: 0.5
            })
        }
        for(let i = 0; i < circles.length; i++) {
            if (i < circles.length / 2) {
                this.time.addEvent({
                    delay: 200,
                    callback: () => addAnimation(this, circles[i])
                })
            }
            else {
                addAnimation(this, circles[i])
            }
        }
        
        // Descripción
        this.add.rectangle(LEFT_COLUMN_X, 205, 200, 4, 0xffffff).setOrigin(0.5);
        this.add.text(LEFT_COLUMN_X, 275, "Minijuego \"habilidoso\"\npara conseguir productos\nde procedencia dudosa", { fontSize: "14px", color: "#ffffff", align: "center", lineSpacing: 10, fontStyle: "bold" }).setOrigin(0.5);
        this.add.rectangle(LEFT_COLUMN_X, 345, 200, 4, 0xffffff).setOrigin(0.5);
        this.add.text(LEFT_COLUMN_X, 450, "Utiliza el cursor del\nratón para mover la\ncesta e intentar atrapar\nuna de las bolas antes\nde que caiga al foso.\nSolo puedes atrapar una", { fontSize: "14px", color: "#ffffff", align: "center", fontStyle: "bold", lineSpacing: 10 }).setOrigin(0.5);
        this.add.rectangle(LEFT_COLUMN_X, 555, 200, 4, 0xffffff).setOrigin(0.5);

        // Pista
        this.add.text(RIGHT_COLUMN_X, 225, "Pista (!)", { fontSize: "24px", color: "#ffff00", align: "center", fontStyle: "bold", lineSpacing: 10 }).setOrigin(0.5);
        this.add.text(RIGHT_COLUMN_X, 280, "Los kanjis de las bolas\nrepresentan el producto\nque llevan dentro", { fontSize: "14px", color: "#ffffff", align: "center", fontStyle: "bold", lineSpacing: 10 }).setOrigin(0.5);

        // Bouncer
        this.add.text(RIGHT_COLUMN_X - 20, 350, "<-- ¡Rebota! (!!!)", { fontSize: "22px", color: "#ffff00", align: "center", fontStyle: "bold" }).setOrigin(0.5);

        // Coste
        this.add.text(RIGHT_COLUMN_X + 45, 425, "(Solo)", { fontSize: "16px", color: "#ffffff", align: "center", fontStyle: "bold" }).setOrigin(0.5);
        this.add.text(RIGHT_COLUMN_X, 450, "Coste: " + this.gachaPrice + "$", { fontSize: "22px", color: "#00ff00", align: "center", fontStyle: "bold" }).setOrigin(0.5);

        // Salida
        this.add.text(RIGHT_COLUMN_X, 140, "¡NOOOOOO!", { fontSize: "32px", color: "#ff0000", align: "center", fontStyle: "bold" }).setOrigin(0.5);
        this.add.text(RIGHT_COLUMN_X, 175, "(No estoy adicto)", { fontSize: "18px", color: "#ffffff", align: "center", fontStyle: "bold" }).setOrigin(0.5);
    }
    createBumpers() {
        for (let i = 0; i < BUMPER_ROWS; i++) {
            for (let j = 0; j < (i % 2 == 0 ? BUMPER_EVEN_COLS : BUMPER_ODD_COLS); j++) {
                let bumper;
                let border = false;
                if (i % 2 == 0) {
                    if (j == 0) { // Borde izquierdo
                        bumper = this.add.circle(BUMPER_EVEN_START_X + j * BUMPER_EVEN_GAP_X - BUMPER_RADIUS, BUMPER_START_Y + i * BUMPER_GAP_Y, BUMPER_RADIUS*2, 0x10FF10).setOrigin(0.5);
                        border = true;
                    }
                    else if (j == BUMPER_EVEN_COLS -1) { // Borde derecho
                        bumper = this.add.circle(BUMPER_EVEN_START_X + j * BUMPER_EVEN_GAP_X + BUMPER_RADIUS, BUMPER_START_Y + i * BUMPER_GAP_Y, BUMPER_RADIUS*2, 0x10FF10).setOrigin(0.5);
                        border = true;
                    }
                    else {
                        bumper = this.add.circle(BUMPER_EVEN_START_X + j * BUMPER_EVEN_GAP_X, BUMPER_START_Y + i * BUMPER_GAP_Y, BUMPER_RADIUS, 0x10FF10).setOrigin(0.5);
                    }
                    
                }
                else {
                    bumper = this.add.circle(BUMPER_ODD_START_X + j * BUMPER_ODD_GAP_X, BUMPER_START_Y + i * BUMPER_GAP_Y, BUMPER_RADIUS, 0x10FF10).setOrigin(0.5);      
                }
                this.matter.add.gameObject(bumper, { shape: "circle", isStatic: true });
                if (border) {
                    bumper.setBounce(1.5);
            
                    bumper.setOnCollide(() => {
                        if (this.tweens.getTweensOf(bumper).length == 0) {
                            this.tweens.add({
                                targets: bumper,
                                scale: 1.5,
                                duration: 150,
                                yoyo: true,
                                ease: Phaser.Math.Easing.Back.Out
                            });
                        }
                    })
                }
            }
        }
    }
    createBorders() {
        this.add.rectangle(LEFT_BORDER_X - 22.5, MID_POINT_Y, 15, 600, 0xff10F0).setOrigin(0.5); // Para tapar el tween

        let leftBorder = this.add.rectangle(LEFT_BORDER_X, MID_POINT_Y, 30, 800, 0xff10F0).setOrigin(0.5);
        this.matter.add.gameObject(leftBorder, { isStatic: true });

        this.add.rectangle(RIGHT_BORDER_X + 22.5, MID_POINT_Y, 15, 600, 0xff10F0).setOrigin(0.5); // Para tapar el tween

        let rightBorder = this.add.rectangle(RIGHT_BORDER_X, MID_POINT_Y, 30, 800, 0xff10F0).setOrigin(0.5);
        this.matter.add.gameObject(rightBorder, { isStatic: true });

        let floor = this.add.rectangle(MID_POINT_X, 700, 300, 30).setOrigin(0.5);
        this.matter.add.gameObject(floor, { isStatic: true });

        floor.setOnCollide((collisionData) => {
            let obj = collisionData.bodyB.gameObject;
            this.ballPool.release(obj);

            if (this.ballPool.getAliveCount() == 0) {
                this.endGame(false);  // Se llama al fin de juego indicando que no se ha conseguido atrapar una bola
            }
        })

        let ceiling = this.add.rectangle(MID_POINT_X, -100, 300, 30).setOrigin(0.5);
        this.matter.add.gameObject(ceiling, { isStatic: true });
    }
    createBallPool() {
        this.ballPool = new Pool(this, BALL_NUMBER, false); // Pool para las bolas

        let balls = [];

        for (let i = 0; i < BALL_NUMBER; i++) {
            let ball = new GachaBall(this, BALL_START.x, BALL_START.y);
            balls.push(ball);
        }
        this.ballPool.addMultipleEntity(balls);
    }

    startGacha() {
        if (this.inventory.hasEnoughMoney(this.gachaPrice)) {
            this.inventory.removeMoney(this.gachaPrice); // Se descuenta el precio por jugar

            this.deactivateButton();
            this.enableBasketControl();
            this.timeEvents = [];

            for (let i = 0; i < BALL_NUMBER; i++) {
                this.timeEvents.push(this.time.addEvent({
                    delay: i * 300,
                    callback: () => {
                        let ball = this.ballPool.spawn(BALL_START.x, BALL_START.y);
                        ball.setProduct(this.randomizeBallContent());


                        let force = new Phaser.Math.Vector2(Phaser.Math.FloatBetween(-0.005, 0.005), Phaser.Math.FloatBetween(-0.005, -0.0075));
                        ball.applyForce(force);
                    }
                }));
            }
        }
        else {
            if (this.poorText != null) {
                this.tweens.getTweensOf(this.poorText).forEach(tween => tween.stop());
                this.poorText.destroy();
            }
            this.poorText = this.add.text(MID_POINT_X, MID_POINT_Y, "No tienes suficiente dinero", { fontSize: '40px', fill: '#ff0000', fontStyle: 'bold' }).setOrigin(0.5);
                this.tweens.add({
                    targets: this.poorText,
                    duration: 2000,
                    alpha: 0,
                    onComplete: () => {
                        this.poorText.destroy();
                        this.poorText = null;
                    }
                })
        }
    }
    randomizeBallContent() { // Devuelve el contenido de la bola
        let maxTier = this.inventory.popularityLevel;

        let emptyOdds = 30; // 30% de probabilidad de que esté vacía - 70% de probabilidad de que tenga algo
        if (Phaser.Math.Between(1, 100) <= 30) {
            return null;
        }
        else {
            let itemOdds = []; // Probabilidades de cada tier
            let totalOdds = 0; // Suma total de probabilidades
            for (let tier = 1; tier <= maxTier; tier++) {
                itemOdds.push((100 / tier) + totalOdds); // Los tiers más bajos tienen más probabilidad de salir
                totalOdds += 100 / tier;
            }
            let randomNumber = Phaser.Math.Between(1, totalOdds);
            let i = 0;
            while (i < itemOdds.length && randomNumber > itemOdds[i]) { // Se determina el tier del producto
                i++;
            }
            let productTier = i + 1;
            let possibleProducts = this.inventory.getProcessedProductsFromTier(productTier); // Se obtienen los productos de la tier

            let selectedProduct = possibleProducts[Phaser.Math.Between(0, possibleProducts.length - 1)]; // Se selecciona uno aleatoriamente

            return selectedProduct;
        }   
    }

    activateButton() {
        this.startButton.enable();
        this.closeButton.enable();
    }
    deactivateButton() {
        this.startButton.disable();
        this.closeButton.disable();
    }

    enableBasketControl() {
        this.gachaBasket.setEnabled(true);
    }
    disableBasketControl() {
        this.gachaBasket.setEnabled(false);
        this.gachaBasket.x = MID_POINT_X;
    }

    onBallCaught(ball) { // Método que se ejecuta al capturar una bola
        this.caughtProduct = ball.product;
        this.ballPool.releaseAll();
        this.endGame(true); // Se llama al fin de juego indicando que se ha conseguido atrapar una bola
    }

    endGame(hasBall) {
        this.disableBasketControl();

        this.timeEvents.forEach(event => event.remove());
        this.timeEvents = [];

        if (hasBall) {
            this.showCaughtProduct();
        }
        else {
            this.pityThePlayer();
        }  
    }

    showCaughtProduct() {
        let temporaryDisplay = [];
        temporaryDisplay.push(this.add.star(MID_POINT_X, MID_POINT_Y, 10, 170, 220, 0xffff00, 1));

        let productDisplay = null;

        if (this.caughtProduct != null) {
            temporaryDisplay.push(this.add.text(MID_POINT_X, MID_POINT_Y - 40, "¡Has conseguido " + this.caughtProduct.name + "!", { fontSize: '22px', fill: '#000' }).setOrigin(0.5));
            productDisplay = this.add.image(MID_POINT_X, MID_POINT_Y + 40, this.caughtProduct.texture).setOrigin(0.5).setScale(4);
            this.caughtProduct.quantity += 1;
            this.caughtProduct = null;
        }
        else {
            temporaryDisplay.push(this.add.text(MID_POINT_X, MID_POINT_Y, "La bola estaba vacía", { fontSize: '24px', fill: '#000'}).setOrigin(0.5));
        }

        const destroyDelay = 3000;
        const tweenRepetitions = 3;

        this.tweens.add({
            targets: temporaryDisplay,
            scale: 1.3,
            duration: destroyDelay / (tweenRepetitions * 2), // *2 por el yoyó
            yoyo: true,
            repeat: tweenRepetitions,
            ease: Phaser.Math.Easing.Sine.InOut,
        })
        if (productDisplay != null) {
            this.tweens.add({
                targets: productDisplay,
                scale: 5.2,
                duration: destroyDelay / (tweenRepetitions * 2), // *2 por el yoyó
                yoyo: true,
                repeat: tweenRepetitions,
                ease: Phaser.Math.Easing.Sine.InOut,
            })
        }
         this.time.addEvent({
            delay: destroyDelay,
            callback: () => {
                temporaryDisplay.forEach(display => display.destroy());
                if (productDisplay != null)
                    productDisplay.destroy();
                this.activateButton();
            }
        })
    }
    pityThePlayer() {
        let temporaryDisplay = [];
        temporaryDisplay.push(this.add.rectangle(MID_POINT_X, MID_POINT_Y, 400, 120, 0xffff00).setOrigin(0.5));
        temporaryDisplay.push(this.add.text(MID_POINT_X, MID_POINT_Y, "No has conseguido atrapar\nninguna bola.", { fontSize: '24px', fill: '#000', align: 'center'}).setOrigin(0.5));

        this.time.addEvent({
            delay: 3000,
            callback: () => {
                temporaryDisplay.forEach(display => display.destroy());
                this.activateButton();
            }
        })
    }

    closeScene() {
        if(this.returnScene) {
            this.scene.resume(this.returnScene);
        }
        this.scene.resume("UIScene");
        this.scene.stop();
    }
}