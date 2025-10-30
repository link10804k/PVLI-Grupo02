import GameButton from "./GameButton.js";
import Worker from "./Worker.js";

export default class WorkerButton extends Button {
        constructor(scene, x, y, texture = "button") {
            super(scene, x, y, texture);

            this.scene = scene;

             // variable para controlar workers asignados
            this.assignedWorkers = 0; 
            this.maxWorkers = 1;
        }   

        onMouseOver() {
            this.setScale(0.3);
        }
        onMouseOut() {
            this.setScale(0.2);
        }
        onMouseDown() {
            this.mostrarMenuExtra();
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
            if (this.assignedWorkers > 0) {
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