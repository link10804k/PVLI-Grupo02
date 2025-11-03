export const EventBus = new Phaser.Events.EventEmitter();

export const events = {
    // Ciclo de juego
    PRODUCTION_PHASE: 'productionPhase',
    SELLING_PHASE: 'sellingPhase',
    // Pedidos
    ORDER_COMPLETED: 'orderCompleted',
    ORDER_FAILED: 'orderFailed',
    //
}