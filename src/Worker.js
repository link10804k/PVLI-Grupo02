import Person from "./Person.js";

export default class Worker extends Person{
    constructor(scene, x, y, texture = "worker", location, isWorking){
        super(scene, x , y, texture);
        
        this.location = location;
        this.isWorking = isWorking; 
    }
    
    getLocation() {
        return this.location;
    }
}