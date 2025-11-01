export default class Resource{
    constructor(name, description, time, amount) {
        this.name = name;
        this.description = description;
        this.time = time;
        this.amount = amount;
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getTiempo() {
        return this.time;
    }

    getAmount() {
        return this.amount;
    }
}