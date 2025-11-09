export const EventBus = new Phaser.Events.EventEmitter();

export const events = {
    // Ciclo de juego
    PRODUCTION_PHASE: 'productionPhase',
    SELLING_PHASE: 'sellingPhase',
    // Pedidos
    ORDER_COMPLETED: 'orderCompleted',
    ORDER_FAILED: 'orderFailed',
    ORDER_ADDED: 'orderAdded', // Para los clientes
    // Popularidad
    POPULARITY_INCREASED: 'popularityIncreased', // Con nuevo nivel de popularidad como parámetro (El nivel inicial es 1)
}