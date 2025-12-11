import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";

const PRODUCTION_TIME = 10000; // 30 segundos (variable)
const SELLING_TIME = 30000; // 30 segundos (variable)

export default class PhaseManager {
    constructor(scene) {
        this.scene = scene;
        this.countdownText = null;
        this.countdownEvent = null;

        // Referencia a la UI
        this.ui = scene.scene.get("UIScene");

        this.createCountdownText();

        this.ProductionPhase();
    }

     //Crear texto del temporizador abajo en el centro
    createCountdownText() {
        const cam = this.ui.cameras.main;

        this.countdownText = this.ui.add.text(
            cam.width / 2,
            cam.height - 10,                      // posición
            "",                          // texto inicial vacío
            {
                fontSize: "22px",
                color: "#ffffffff",
                stroke: "#000000",
                strokeThickness: 5
            }
        ) 
    .setOrigin(0.5, 1)
    .setDepth(9999);
    }

    //Iniciar un temporizador
    startCountdown(label, timeMs, onFinish) {

        // Si hay un timer anterior, lo borramos
        if (this.countdownEvent) this.countdownEvent.remove(false);

        let remaining = Math.ceil(timeMs / 1000);

        this.countdownText.setText(`Próxima fase (${label}) en: ${remaining}s`);

        // Timer de 1 segundo que actualiza el texto
        this.countdownEvent = this.scene.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                remaining--;
                this.countdownText.setText(`Próxima fase (${label}) en: ${remaining}s`);

                if (remaining <= 0) {
                    this.countdownEvent.remove(false);
                    onFinish();
                }
            }
        });
    }

     ///////////////// FASES /////////////////

    ProductionPhase() {
        EventBus.emit(events.PRODUCTION_PHASE);
        this.scene.sound.play("phaseChange", { volume: 0.4 });

        console.log("Fase de producción iniciada");

         this.startCountdown(
            "Venta",
            PRODUCTION_TIME,
            () => this.SellingPhase()
        );
    }

    SellingPhase() {
        EventBus.emit(events.SELLING_PHASE);
        this.scene.sound.play("phaseChange", { volume: 0.4 });

        console.log("Fase de venta iniciada");

         this.startCountdown(
            "Producción",
            SELLING_TIME,
            () => this.ProductionPhase()
        );
    }
}