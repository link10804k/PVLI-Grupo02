import Button from "./Button.js";

export default class MenuButton extends Button {
    onMouseOver() {
        this.setScale(1.1);
    }
    onMouseOut() {
        this.setScale(1.0);
    }
    onMouseDown() {
        this.scene.scene.start("MainScene");
    }
}