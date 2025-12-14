import Tile from "./Tile.js";
import CustomersManager from "./CustomersManager.js";
import { EventBus } from "./EventBus.js";
import { events } from "./EventBus.js";

export default class Cafeteria extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture = "cafeteria", inventory) {
    super(scene, x, y, texture);
    scene.add.existing(this);

    this.inventory = inventory;
    //this.scene.playerInventory = inventory;

    this.workers = 0;

    this.customersManager = new CustomersManager(scene, this);

    // Slots cafeterass
    this.slots = [];

    for(let i = 0; i < 2; i++)
    { 
        for(let j = 0; j < 4; j++)
        {
          this.slots.push(new Tile(this.scene, this.x - 12 + (12 * j), this.y - 28 + (6 * i), false, true).setOrigin(0.5).setScale(0.5).setVisible(false));
        }
    }

    this.slots[0].setVisible(true); 
    this.slots[1].setVisible(true); 

    console.log("Posiciones de los slots de la cafetería:");
    this.slots.forEach((slot, index) => {
      console.log(`Slot ${index + 1}: (${slot.x}, ${slot.y})`);
    });

    EventBus.on(events.LEVEL_INCREASED, (newLevel) => {
      if (newLevel >= 1 && newLevel <= 4) {
        this.slots[(newLevel - 1) * 2].setVisible(true);
        this.slots[((newLevel - 1) * 2) + 1].setVisible(true);
      }
    });
  }
}