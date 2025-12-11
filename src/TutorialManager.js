export default class TutorialManager {
    constructor(scene) {
        // ESCENA = TutorialUIScene
        this.scene = scene;

        // Lista de diálogos del tutorial
        this.dialogues = [
            {
                text: "¡Hola! Bienvenido a Ténai-zawa nuesto pequeño pueblo en Japón.",
                characterKey: "worker"
            },
            {
                text: "¿Qué por qué hablo español a la perfección?",
                characterKey: "worker"
            },
            {
                text: "Pues porque soy Knekro tonto, espabila loquete.",
                characterKey: "K_presente"
            },
            {
                text: "¿Qué por qué estoy aquí? Pues porque alguien tendrá que explicarte esto no?? Vamos a ver.",
                characterKey: "K_talk"
            },
            {
                text: "Bueno a ya vale de preguntitas, te voy a enseñar a montar tu negocio desde cero para no tener problemas",
                characterKey: "K_talk"
            },
            {
                text: "Primero y antes de nada vamos a construir una granja",
                characterKey: "K_presente"
            },
            {
                text: "Para hacer algo porque parece que estás empanao con los gachas y no enteras!!!",
                characterKey: "K_angry"
            },
            {
                text: "Dale a uno de los botones con el símbolo de suma que ves en pantalla cerca de tu cafeteria y dentro de estos te saldrá la granja que quiras",
                characterKey: "K_talk"
            },
            {
                text: "Una vez dentro dale click a la imagen de la granja, y cuando termines avisa que viene la que te cuento ",
                characterKey: "K_presente",
                waitFor: "BUILD_FARM"
            },
            {
                text: "Peruanos",
                characterKey: "K_talk"
            },
            /*
            {
                text: "Primero y antes de nada vamos a construir una granja para poder hacer cosas",
                characterKey: "worker"
            },
            {
                text: "Primero y antes de nada vamos a construir una granja para poder hacer cosas",
                characterKey: "worker"
            },
            {
                text: "Primero y antes de nada vamos a construir una granja para poder hacer cosas",
                characterKey: "worker"
            },
            {
                text: "Primero y antes de nada vamos a construir una granja para poder hacer cosas",
                characterKey: "worker"
            },

            {
                text: "Ahora haz clic en la cafetería para continuar.",
                characterKey: "worker",
                waitFor: "BUILD_CAFE"
            },
            {
                text: "¡Perfecto! Has completado el primer objetivo.\n\nSeguiremos con más pasos.",
                characterKey: "worker"
            }
                */
        ];

        this.currentDialogueIndex = 0;
        this.currentPageIndex = 0;
        this.pages = [];

        this.fullPageText = "";
        this.displayText = "";
        this.charIndex = 0;
        this.typingSpeed = 25;
        this.isTyping = false;
        this.currentWaitFor = null;

        this.character = null;
        this.dialogPanel = null;
        this.dialogText = null;
        this.nextButton = null;

        this.createUI();
    }

    // -----------------------------
    // UI DEL TUTORIAL
    // -----------------------------
    createUI() {
        const cam = this.scene.cameras.main;
        const centerX = cam.width / 2;
        const centerY = cam.height / 2;

        // PANEL
        this.dialogPanel = this.scene.add.rectangle(
            centerX,
            centerY + 150,
            600,
            150,
            0x000000,
            0.75
        )
        .setStrokeStyle(3, 0xffffff)
        .setScrollFactor(0)
        .setDepth(9999);

        // PERSONAJE
        this.character = this.scene.add.image(centerX - 330, centerY + 140, "worker")
            .setScale(0.9)
            .setScrollFactor(0)
            .setDepth(9999);

        // TEXTO
        this.dialogText = this.scene.add.text(centerX - 260, centerY + 110, "", {
            fontSize: "22px",
            color: "#FFFFFF",
            wordWrap: { width: 500 }
        })
        .setScrollFactor(0)
        .setDepth(9999);

        // BOTÓN
        this.nextButton = this.scene.add.text(centerX + 230, centerY + 180, "Continuar >", {
            fontSize: "24px",
            color: "#00d1ff",
            fontStyle: "bold"
        })
        .setInteractive()
        .setScrollFactor(0)
        .setDepth(9999)
        .on("pointerdown", () => this.onNextPressed());

        this.showUI();
    }

    showUI() {
        this.dialogPanel.setVisible(true);
        this.dialogText.setVisible(true);
        this.character.setVisible(true);
        this.nextButton.setVisible(true);

        //// FIX >>>>>
        // Cuando el tutorial aparece, bloqueamos la interacción del juego:
        this.scene.input.topOnly = true;
        //// FIX <<<<<
    }

    hideUI() {
        this.dialogPanel.setVisible(false);
        this.dialogText.setVisible(false);
        this.character.setVisible(false);
        this.nextButton.setVisible(false);

        //// FIX >>>>>
        // Cuando desaparece el tutorial, permitimos interacción del juego:
        this.scene.input.topOnly = false;
        //// FIX <<<<<
    }

    // -----------------------------
    // CONTROL DE PAUSA
    // -----------------------------
    pauseWorld() {
        this.scene.scene.pause("TutorialScene");
    }

    resumeWorld() {
        this.scene.scene.resume("TutorialScene");
    }

    // -----------------------------
    // COMIENZO DEL TUTORIAL
    // -----------------------------
    start() {
        this.showDialogue(0);
    }

    preparePages(textOrArray) {
        let rawPages = Array.isArray(textOrArray)
            ? textOrArray
            : textOrArray.split("\n\n");

        const maxChars = 140;
        const pages = [];

        for (let block of rawPages) {
            const words = block.split(" ");
            let page = "";

            for (let w of words) {
                const test = (page + " " + w).trim();
                if (test.length > maxChars) {
                    pages.push(page.trim());
                    page = w;
                } else {
                    page = test;
                }
            }
            if (page.trim().length > 0) pages.push(page.trim());
        }

        return pages;
    }

    updateCharacterSprite(data) {
        const key = data.characterKey || "worker";
        if (this.scene.textures.exists(key)) {
            this.character.setTexture(key);
        } else {
            this.character.setTexture("worker");
        }
    }

    showDialogue(index) {
        const data = this.dialogues[index];
        if (!data) {
            this.endTutorial();
            return;
        }

        this.currentDialogueIndex = index;
        this.currentWaitFor = data.waitFor || null;

        this.showUI();
        this.pauseWorld();
        this.updateCharacterSprite(data);

        this.pages = this.preparePages(data.text);
        this.currentPageIndex = 0;

        this.startTypingCurrentPage();
    }

    startTypingCurrentPage() {
        this.fullPageText = this.pages[this.currentPageIndex];
        this.displayText = "";
        this.dialogText.setText("");

        this.charIndex = 0;
        this.isTyping = true;

        this.typeWriterStep();
    }

    typeWriterStep() {
        if (!this.isTyping) return;

        this.displayText += this.fullPageText[this.charIndex];
        this.dialogText.setText(this.displayText);
        this.charIndex++;

        if (this.charIndex < this.fullPageText.length) {
            this.scene.time.delayedCall(
                this.typingSpeed,
                () => this.typeWriterStep()
            );
        } else {
            this.isTyping = false;
        }
    }

    onNextPressed() {
        if (this.isTyping) {
            this.isTyping = false;
            this.dialogText.setText(this.fullPageText);
            return;
        }

        if (this.currentPageIndex < this.pages.length - 1) {
            this.currentPageIndex++;
            this.startTypingCurrentPage();
            return;
        }

        // Si este diálogo requiere un objetivo…
        if (this.currentWaitFor) {
            this.hideUI();
            this.resumeWorld();

            //// FIX >>>>>
            // Esto permite que el jugador interactúe mientras el tutorial está oculto.
            this.scene.input.topOnly = false;
            //// FIX <<<<<

            return;
        }

        this.goToNextDialogue();
    }

    goToNextDialogue() {
        this.currentDialogueIndex++;
        if (this.currentDialogueIndex >= this.dialogues.length) {
            this.endTutorial();
        } else {
            this.showDialogue(this.currentDialogueIndex);
        }
    }

    notify(actionName) {
        const current = this.dialogues[this.currentDialogueIndex];

        if (current && current.waitFor === actionName) {
            this.currentWaitFor = null;

            this.showUI();
            this.pauseWorld();

            //// FIX >>>>>
            // El tutorial vuelve a bloquear el input aquí.
            this.scene.input.topOnly = true;
            //// FIX <<<<<

            this.goToNextDialogue();
        }
    }

    endTutorial() {
        this.character.destroy();
        this.dialogPanel.destroy();
        this.dialogText.destroy();
        this.nextButton.destroy();

        //// FIX >>>>>
        // Liberar completamente input del juego cuando termina
        this.scene.input.topOnly = false;
        //// FIX <<<<<

        this.resumeWorld();
        this.scene.scene.stop("TutorialUIScene");
    }
}
