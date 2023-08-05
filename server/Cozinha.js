const { getIndexByConnection } = require('./connections');
class Cozinha {
    constructor (connectionIndex) {
        this.connectionIndex = connectionIndex;
    }

    novoPedido(pedido){
        // TODO recebe um pedido e o adiciona na lista de pedido a serem preparados
    }

    notificaMesa(){
        // TODO notifica o Ravin.js para que seja o pedido esta pronto
    }


}
module.exports = Cozinha;