import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";

const PRODUCTION_TIME = 5000; // 1 minuto (variable)
const SELLING_TIME = 60000; // 1 minuto (variable)

export default class PhaseManager {
    constructor(scene) {
        this.scene = scene;
        this.ProductionPhase();
    }

    ProductionPhase() {
        EventBus.emit(events.PRODUCTION_PHASE);
        console.log("Fase de producción iniciada");

        this.scene.time.addEvent({
            callback: () => this.SellingPhase(),
            delay: PRODUCTION_TIME,
            loop: false
        })
    }

    SellingPhase() {
        EventBus.emit(events.SELLING_PHASE);
        console.log("Fase de venta iniciada");

        this.scene.time.addEvent({
            callback: () => this.ProductionPhase(),
            delay: SELLING_TIME,
            loop: false
        })
    }
}