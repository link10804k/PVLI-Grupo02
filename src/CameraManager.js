const Direction = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
}

export default class CameraManager {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.scene.events.on('preupdate', this.preUpdate.bind(this)) // Es necesario suscribirse al preupdate ya que la clase no extiende de Phaser

        this.scrollSpeed = 300; // Parámetro variable
        this.zoomSpeed = 4; // Parámetro variable
        this.minZoom = this.camera.width / this.scene.mapWidth;
        this.maxZoom = 16; // Parámetro variable
        this.camera.zoom = 1; // Valor inicial


        //this.camera.setBounds(0, 0, this.scene.mapWidth, this.scene.mapHeight);
        this.camera.setBounds(0, 0, 1600, 1600);

        this.moveUp = false;
        this.moveDown = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.zoomIn = false;
        this.zoomOut = false;

        // Eventos cámara
        
        // Scroll
        this.wKey = this.scene.input.keyboard.addKey('W');
        this.aKey = this.scene.input.keyboard.addKey('A');
        this.sKey = this.scene.input.keyboard.addKey('S');
        this.dKey = this.scene.input.keyboard.addKey('D');
        
        this.wKey.on("down", () => this.moveUp = true);
        this.aKey.on("down", () => this.moveLeft = true);
        this.sKey.on("down", () => this.moveDown = true);
        this.dKey.on("down", () => this.moveRight = true);
        this.wKey.on("up", () => this.moveUp = false);
        this.aKey.on("up", () => this.moveLeft = false);
        this.sKey.on("up", () => this.moveDown = false);
        this.dKey.on("up", () => this.moveRight = false);

        // Zoom
        this.iKey = this.scene.input.keyboard.addKey('I');
        this.oKey = this.scene.input.keyboard.addKey('O');
        this.iKey.on("down", () => this.zoomIn = true);
        this.oKey.on("down", () => this.zoomOut = true);
        this.iKey.on("up", () => this.zoomIn = false);
        this.oKey.on("up", () => this.zoomOut = false);
    }
    cameraScroll(direction, dt) {
        this.camera.scrollX += direction.x * this.scrollSpeed * dt;
        this.camera.scrollY += direction.y * this.scrollSpeed * dt;
        console.log("X: " + this.camera.scrollX + " Y: " + this.camera.scrollY);
    }
    cameraZoomIn(dt) {
        this.camera.zoom += this.zoomSpeed * dt;
        if (this.camera.zoom > this.maxZoom) {
            this.camera.zoom = this.maxZoom;
        }
    }
    cameraZoomOut(dt) {
        this.camera.zoom -= this.zoomSpeed * dt;
        if (this.camera.zoom < this.minZoom) {
            this.camera.zoom = this.minZoom;
        }
    }
    preUpdate(t, dt) {
        dt /= 1000; // Convertir dt a segundos

        if (this.moveUp) {
            this.cameraScroll(Direction.UP, dt);
        }
        else if (this.moveDown) {
            this.cameraScroll(Direction.DOWN, dt);
        }
        if (this.moveLeft) {
            this.cameraScroll(Direction.LEFT, dt);
        }
        else if (this.moveRight) {
            this.cameraScroll(Direction.RIGHT, dt);
        }
        if (this.zoomIn) {
            this.cameraZoomIn(dt);
        }
        else if (this.zoomOut) {
            this.cameraZoomOut(dt);
        }
    }
}