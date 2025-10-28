export default class CameraManager {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.scene.events.on('preupdate', this.preupdate.bind(this));

        this.scrollSpeed = 50; // Parámetro variable
        this.zoomSpeed = 1.1; // Parámetro variable

        this.camera.setBounds(-this.scene.tileWidth/2, -this.scene.tileHeight/2, this.scene.mapWidth, this.scene.mapHeight);
        //this.camera.setViewport(0, 0, this.scene.mapWidth, this.scene.mapHeight);
        this.camera.width = 800;
        this.camera.height = 600;

        // Eventos cámara
        const Direction = {
            UP: { x: 0, y: -1 },
            DOWN: { x: 0, y: 1 },
            LEFT: { x: -1, y: 0 },
            RIGHT: { x: 1, y: 0 },
        };

        // Scroll
        ///this.wKey = this.scene.input.keyboard.addKey('W');
        ///this.aKey = this.scene.input.keyboard.addKey('A');
        ///this.sKey = this.scene.input.keyboard.addKey('S');
        ///this.dKey = this.scene.input.keyboard.addKey('D');
        ///// Pass functions (don't call the methods immediately)
        ///this.wKey.on("down", () => this.cameraScroll(Direction.UP));
        ///this.aKey.on("down", () => this.cameraScroll(Direction.LEFT));
        ///this.sKey.on("down", () => this.cameraScroll(Direction.DOWN));
        ///this.dKey.on("down", () => this.cameraScroll(Direction.RIGHT));

        this.scene.input.keyboard.on('keydown-W', (event) => {
            event.repeat === true;
            this.cameraScroll(Direction.UP);
        });

        this.scene.input.keyboard.on('keydown-A', (event) => {
            event.repeat === true;
            this.cameraScroll(Direction.LEFT);
        });

        this.scene.input.keyboard.on('keydown-S', (event) => {
            event.repeat === true;
            this.cameraScroll(Direction.DOWN);
        });

        this.scene.input.keyboard.on('keydown-D', (event) => {
            event.repeat === true;
            this.cameraScroll(Direction.RIGHT);
        });

        // Zoom
        this.iKey = this.scene.input.keyboard.addKey('I');
        this.oKey = this.scene.input.keyboard.addKey('O');
        this.iKey.on("down", () => this.cameraZoomIn());
        this.oKey.on("down", () => this.cameraZoomOut());
    }
    cameraScroll(direction) {
        this.camera.scrollX += direction.x * this.scrollSpeed;
        this.camera.scrollY += direction.y * this.scrollSpeed;
    }
    cameraZoomIn() {
        this.camera.zoom *= this.zoomSpeed //* this.scene.time.elapsed/1000
    }
    cameraZoomOut() {
        this.camera.zoom /= this.zoomSpeed //* this.scene.time.elapsed/1000
    }
    preupdate() {
        //console.log("Time elapsed: " + this.scene.game.time.physicsElapsed);
        //console.log("Camera scrollX: " + this.camera.scrollX);
        //console.log("Camera scrollY: " + this.camera.scrollY);
        //console.log("Camera zoom: " + this.camera.zoom);
    }
}
    
    