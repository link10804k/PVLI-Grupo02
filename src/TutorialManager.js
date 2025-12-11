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
                text: "GOD, esto ya tiene mejor pinta y como parece que vas espabilando vamos con lo siguiente.",
                characterKey: "K_talk"
            },
            {
                text: "Primero ves que ya tienes tu granja así, pim pam. ",
                characterKey: "K_talk"
            },
            {
                text: "Pero no te da nada porque no está trabajando nadie en ella tonto!!!.",
                characterKey: "K_angry"
            },
            {
                text: "Pues ya sabes, tienes un knekrer ahí sin hacer nada, pulsa en la granja y sumale un trabajador",
                characterKey: "K_talk"
            },
            {
                text: "Una vez este ahí trabajando, dale al botón de el producto que quieras hacer ",
                characterKey: "K_talk"
            },
            {
                text: "Muy importante que esté el knekrer (trabajador) asignado en la granja porque sino está no va a hacer nada ",
                characterKey: "K_talk"
            },
            {
                text: "Pues igual, cuando lo tengas mandame unos bits o unas subs y seguimos.  ",
                characterKey: "K_talk",
                waitFor: "PRODUCE_PRODUCT"
            },
            {
                text: "Oye pues al final tan tonto tan tonto no eres, locurilla  ",
                characterKey: "K_talk",
            },
            {
                text: "Bueno pues vamos a hacer una cosa más, y así ya sabes producir todo.  ",
                characterKey: "K_talk",
            },
            {
                text: "Ves tu cafetería no? Y como se have el café?  ",
                characterKey: "K_presente",
            },
            {
                text: "Pues ala a constuir una cafetera y que tienes una cafeteria pero no una cafetera. ",
                characterKey: "K_talk",
            },
            {
                text: "Es que me tocan siempre los tontos macho.  ",
                characterKey: "K_talk",
                waitFor: "BUILD_CAFE"
            },
            {
                text: "LOCURILLA, pues ya sabes venga hazme una tazita de tu productito calentito, LETS'S GO ",
                characterKey: "K_talk",
            },
            {
                text: "EPAA, a dónde vas tan rápido tu!?!? ",
                characterKey: "K_angry",
            },
            {
                text: "Antes, contrata otro trabajador dando click al botón de arriba a la derecha y así ya dos knekres, GOD ",
                characterKey: "K_talk",
            },
            {
                text: "Ponlo a trabajar en la cafetera para que haga café y pim, pam, pum cafecito calentito ",
                characterKey: "K_presente",
                waitFor: "PROCESE_PRODUCT"
            },
            {
                text: "PERUANOS ",
                characterKey: "K_presente",
            },
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

            this.scene.input.topOnly = false;
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

            this.scene.input.topOnly = true;

            this.goToNextDialogue();
        }
    }

    endTutorial() {
        this.character.destroy();
        this.dialogPanel.destroy();
        this.dialogText.destroy();
        this.nextButton.destroy();

        this.scene.input.topOnly = false;

        this.resumeWorld();
        this.scene.scene.stop("TutorialUIScene");
    }
}
