import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";

const PRODUCTION_TIME = 60000; // 90 segundos (variable)
const SELLING_TIME = 60000; // 90 segundos (variable)

export default class PhaseManager {
    constructor(scene) {
        this.scene = scene;
        this.countdownText = null;
        this.countdownEvent = null;

        // Filtro de atardecer
        this.phaseFilter = this.scene.add.image(0, 0, "SunsetFilter").setDepth(1).setOrigin(0); // Filtro de color (escondido en la fase de produccion)

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

        this.countdownText.setText(`${label} en: ${remaining}s`);

        // Timer de 1 segundo que actualiza el texto
        this.countdownEvent = this.scene.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                remaining--;
                this.countdownText.setText(`${label} en: ${remaining}s`);

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
        this.phaseFilter.alpha = 0; // Desactivamos filtro de tarde
        this.scene.sound.play("phaseChange", { volume: 0.4 });

        // Música de la escena principal del juego
        this.scene.sound.play("MainSceneMusic", { volume: 0.5 }); 

         this.startCountdown(
            "Abrirá la cafetería",
            PRODUCTION_TIME,
            () => this.SellingPhase()
        );
    }

    SellingPhase() {
        EventBus.emit(events.SELLING_PHASE);
        this.phaseFilter.alpha = 255; // Activamos filtro de tarde
        this.scene.sound.play("phaseChange", { volume: 0.4 });

        this.startCountdown(
            "Cerrará la cafetería",
            SELLING_TIME,
            () => this.ProductionPhase()
        );
    }
}