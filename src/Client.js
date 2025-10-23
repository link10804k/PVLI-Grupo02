import Person from "./Person.js";

export default class Cliente extends Person{
    constructor(scene, x, y, texture, pedido, tiempoEspera, tiempoConsumo = null){
        super(scene, x ,y, texture);

        //escena añadida
        scene.add.existing(this);

        //Atributos
        this.scene = scene;
        this.pedido = pedido;
        this.tiempoEspera = tiempoEspera;
        this.tiempoConsumo = tiempoConsumo;

        //Estado del cliente
        this.enfadado = false;
    }

    getPedido(){
        return this.pedido;
    }
}