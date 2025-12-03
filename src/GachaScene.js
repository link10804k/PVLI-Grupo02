import Button from "./Button.js";
import GachaBall from "./GachaBall.js";

const PHYSICS_FPS = 120;

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
const BALL_RADIUS = 10;
const BALL_NUMBER = 10;
const BALL_START = { x: MID_POINT_X, y: 100 };

export default class GachaScene extends Phaser.Scene {
    constructor() {
        super({ key: "GachaScene" });

        this.colliders = [];
        this.bouncers = [];
    }

    init(data){
        this.inventory = data.inventory;
    }

    preload() {

    }

    create() {
        // Fondo
        this.add.rectangle(400, 300, 800, 600, 0x000000).setOrigin(0.5);

        // Bumpers
        for (let i = 0; i < BUMPER_ROWS; i++) {
            for (let j = 0; j < (i % 2 == 0 ? BUMPER_EVEN_COLS : BUMPER_ODD_COLS); j++) {
                let bumper;
                let border = false;
                if (i % 2 == 0) {
                    if (j == 0) {
                        bumper = this.add.circle(BUMPER_EVEN_START_X + j * BUMPER_EVEN_GAP_X - BUMPER_RADIUS, BUMPER_START_Y + i * BUMPER_GAP_Y, BUMPER_RADIUS*2, 0x10FF10).setOrigin(0.5);
                        border = true;
                    }
                    else if (j == BUMPER_EVEN_COLS -1) {
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
                this.matter.add.gameObject(bumper, { isStatic: true, circleRadius: bumper.radius });
                if (border) {
                    this.bouncers.push(bumper);
                }
                else {
                    this.colliders.push(bumper);
                }
            }
        }

        // Bordes
        this.add.rectangle(LEFT_BORDER_X - 22.5, MID_POINT_Y, 15, 600, 0xff10F0).setOrigin(0.5); // Para tapar el tween

        let leftBorder = this.add.rectangle(LEFT_BORDER_X, MID_POINT_Y, 30, 600, 0xff10F0).setOrigin(0.5);
        this.matter.add.gameObject(leftBorder, { isStatic: true });
        this.colliders.push(leftBorder);

        this.add.rectangle(RIGHT_BORDER_X + 22.5, MID_POINT_Y, 15, 600, 0xff10F0).setOrigin(0.5); // Para tapar el tween

        let rightBorder = this.add.rectangle(RIGHT_BORDER_X, MID_POINT_Y, 30, 600, 0xff10F0).setOrigin(0.5);
        this.matter.add.gameObject(rightBorder, { isStatic: true });
        this.colliders.push(rightBorder);

        // Botón de inicio
        new Button(this, MID_POINT_X, 550, "button", () => this.startGacha()).setOrigin(0.5).setScale(0.5);
    }

    startGacha() {
        let balls = [];
        let ballsSpeed = [];

        for (let i = 0; i < BALL_NUMBER; i++) {
            this.time.addEvent({
                delay: i * 300,
                callback: () => {
                    //let ball = new GachaBall(this, BALL_START.x, BALL_START.y, BALL_RADIUS, 0xFFFF10);
                    let ball = this.add.circle(BALL_START.x, BALL_START.y, BALL_RADIUS, 0xFFFF10).setOrigin(0.5);
                    this.matter.add.gameObject(ball, { circleRadius: BALL_RADIUS });
                    //let content = this.randomizeBallContent();
                    //ball.applyForce({ x: Phaser.Math.Between(-0.01, 0.01), y: Phaser.Math.Between(-0.01, -0.02) });
                    ball.setVelocity(Phaser.Math.Between(-1, 1), Phaser.Math.Between(-1, -1));
                    balls.push(ball);
                }
            });
        }
        //this.physics.add.collider(balls, this.colliders, (ball) => {
        //    if (ball.body.velocity.y < ballsSpeed[this.whichBall(balls, ball)] + this.physics.world.gravity.y / PHYSICS_FPS) {
        //        ball.body.velocity.y = ballsSpeed[this.whichBall(balls, ball)] + this.physics.world.gravity.y / PHYSICS_FPS;
        //        ballsSpeed[this.whichBall(balls, ball)] = ball.body.velocity.y;
        //    }
        //    if (ball.body.velocity.y < 10) {
        //        ballsSpeed[this.whichBall(balls, ball)] = ball.body.velocity.y;
        //    }
        //});
        //this.physics.add.collider(balls, balls, (ball1, ball2) => {
        //    if (ball1.body.velocity.y < ballsSpeed[this.whichBall(balls, ball1)] + this.physics.world.gravity.y / PHYSICS_FPS) {
        //        ball1.body.velocity.y = ballsSpeed[this.whichBall(balls, ball1)] + this.physics.world.gravity.y / PHYSICS_FPS;
        //        ballsSpeed[this.whichBall(balls, ball1)] = ball1.body.velocity.y;
        //    }
        //    if (ball1.body.velocity.y < 10) {
        //        ballsSpeed[this.whichBall(balls, ball1)] = ball1.body.velocity.y;
        //    }
//
        //    if (ball2.body.velocity.y < ballsSpeed[this.whichBall(balls, ball2)] + this.physics.world.gravity.y / PHYSICS_FPS) {
        //        ball2.body.velocity.y = ballsSpeed[this.whichBall(balls, ball2)] + this.physics.world.gravity.y / PHYSICS_FPS;
        //        ballsSpeed[this.whichBall(balls, ball2)] = ball2.body.velocity.y;
        //    }
        //    if (ball2.body.velocity.y < 10) {
        //        ballsSpeed[this.whichBall(balls, ball2)] = ball2.body.velocity.y;
        //    }
        //});
//
        //this.physics.add.collider(balls, this.bouncers, (ball, bumper) => {
        //    if (this.tweens.getTweensOf(bumper).length == 0) {
        //        this.tweens.add({
        //            targets: bumper,
        //            scale: 1.5,
        //            duration: 100,
        //            yoyo: true,
        //            ease: 'Quart',
        //        })
        //        let direction = new Phaser.Math.Vector2(ball.x - bumper.x, ball.y - bumper.y).normalize();
        //        ball.body.setVelocity(direction.x * 300, direction.y * 300);
        //    }     
        //});
    }

    whichBall(balls, ball) { // Devuelve el índice de la bola en el array
        let i = 0;
        while (i < balls.length && balls[i] != ball) {
            i++;
        }
        return i;
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
                itemOdds.push(100 / tier); // Los tiers más bajos tienen más probabilidad de salir
                totalOdds += 100 / tier;
            }
            let randomNumber = Phaser.Math.Between(1, totalOdds);
            let i = 0;
            while (i < itemOdds.length && randomNumber > itemOdds[i]) { // Se determina el tier del producto
                i++;
            }
            let productTier = i + 1;
            let possibleProducts = Object.keys(this.inventory.getProcessedProductsFromTier(productTier)); // Se obtienen los productos de la tier

            let selectedProduct = possibleProducts[Phaser.Math.Between(0, possibleProducts.length - 1)]; // Se selecciona uno aleatoriamente

            return this.inventory.processedProducts[selectedProduct];
        }   
    }
}