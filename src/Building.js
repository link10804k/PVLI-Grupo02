export default class Building extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture = "building", name, description, resources = [], velocityRatio = 1.0, ) {
        super(scene, x, y, texture);

        scene.add.existing(this);

        this.name = name;
        this.description = description;
        this.resources = resources; // Array de recursos
        this.velocityRatio = velocityRatio; // Ratio de velocidad
        this.inventory = null;      // Por ahora sin implementar
        this.currentResource = null; // Recurso actual
        this.workers = 0;     // Número de trabajadores
        this.upgradeTier = 0;       // Nivel de mejora
    }

    produce(productName) {
        // Lógica de producción de recursos
        console.log(`${this.name} está produciendo ${productName}...`);
    }

    upgrade() {
        // Lógica de mejora
        this.upgradeTier++;
        console.log(`${this.name} ha sido mejorado al nivel ${this.upgradeTier}`);
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }
    mostrarMenuExtra(){

        //Crea el panel
        const fondo = this.scene.add.image(400, 300, "panel").setScale(0, 8);
        //Crea los dos botones para añadir y quitar trabajadores
        const botonAdd = this.scene.add.image(350, 370, "botonExtra1").setInteractive();
        const botonRemove = this.scene.add.image(450, 370, "botonExtra2").setInteractive();
        const texto = this.scene.add.text(400, 420, `Workers: ${this.assignedWorkers}`, {
            fontSize: "20px",
            color: "#fff",
            }).setOrigin(0.5);


        //Acciones de los botones
        botonAdd.on("pointrdown", () =>{
            this.assignedWorkers++;
            //Crear el worker
            const worker = new Worker(this.scene, 400, 500, "worker", "factory", true);
            this.worker = worker;
            texto.setText(`Workers: ${this.assignedWorkers}`);
        });

        botonRemove.on("pointdown", () => {
            if(this.assignedWorkers > 0){
                this.assignedWorkers--;
                //Eliminar al worker si existe
                if(this.worker){
                    this.worker.destroy();
                    this.worker = null;
                }
                texto.setText(`Workers: ${this.assignedWorkers}`);
            }
        });

        const cerrar = this.scene.add.text(400, 460, "Cerrar", {
            fontSize: "20px",
            color: "#fff",
            backgroundColor: "#000",
            padding: { x: 10, y: 5 },
        }).setOrigin(0.5).setInteractive();

        cerrar.on("pointerdown", () => {
            fondo.destroy();
            botonAdd.destroy();
            botonRemove.destroy();
            texto.destroy();
            cerrar.destroy();
        });
    }
}