import Button from "./Button.js";
import { events } from "./EventManager.js";

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
    init() {
        //this.events.addListener(events.MENU_LOADED, gritar())
    }
    gritar() {
        console.log("AAAAAAAAAAAAAA");
    }
}