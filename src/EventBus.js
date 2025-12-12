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
    LEVEL_INCREASED: 'popularityIncreased', // Con nuevo nivel de popularidad como parámetro (El nivel inicial es 1)
    ADD_POPULARITY: 'addPopularity', // Con cantidad a añadir como parámetro
    REMOVE_POPULARITY: 'removePopularity', // Con cantidad a quitar como parámetro
    // UI Inventario
    INVENTORY_UPDATE: 'inventoryUpdate', // Con los recursos actuales como parámetro
    // Aplicación
    POPULAR_PRODUCT_REQUESTED: 'popularProductRequested', // Con el producto popular como parámetro   
    // Gacha
    BALL_CAUGHT: 'ballCaught' // Con la bola como parámetro
}