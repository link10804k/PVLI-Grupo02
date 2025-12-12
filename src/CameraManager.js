const Direction = { // Por alguna razón, scrollSpeed*dt*direction sale el doble hacia arriba y hacia la izquierda
    UP: { x: 0, y: -0.5 }, // Parche (muy feo) para que las velocidades sean iguales en ambas direcciones
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -0.5, y: 0 }, // Parche (muy feo) para que las velocidades sean iguales en ambas direcciones
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
        this.maxZoom = 8; // Parámetro variable
        this.camera.zoom = 4; // Valor inicial

        this.camera.setOrigin(0.5);

        this.camera.setBounds(0, 0, this.scene.mapWidth, this.scene.mapHeight);

        this.moveUp = false;
        this.moveDown = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.zoomIn = false;
        this.zoomOut = false;
        
        // Scroll
        this.wKey = this.scene.input.keyboard.addKey('W');
        this.aKey = this.scene.input.keyboard.addKey('A');
        this.sKey = this.scene.input.keyboard.addKey('S');
        this.dKey = this.scene.input.keyboard.addKey('D');

        // Zoom
        this.iKey = this.scene.input.keyboard.addKey('I');
        this.oKey = this.scene.input.keyboard.addKey('O');
    }
    setPosition(x, y) {
        this.camera.centerOn(x, y);
    }
    cameraScroll(direction, dt) {
        this.camera.scrollX += direction.x * this.scrollSpeed * dt;
        this.camera.scrollY += direction.y * this.scrollSpeed * dt;
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

        if (this.wKey.isDown) {
            this.cameraScroll(Direction.UP, dt);
        }
        if (this.sKey.isDown) {
            this.cameraScroll(Direction.DOWN, dt);
        }
        if (this.aKey.isDown) {
            this.cameraScroll(Direction.LEFT, dt);
        }
        if (this.dKey.isDown) {
            this.cameraScroll(Direction.RIGHT, dt);
        }
        if (this.iKey.isDown) {
            this.cameraZoomIn(dt);
        }
        else if (this.oKey.isDown) {
            this.cameraZoomOut(dt);
        }  
    }
}