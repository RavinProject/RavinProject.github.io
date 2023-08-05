const { getIndexByConnection } = require('./connections');
class Mesa {
    constructor (socket) {
        this.numero;
        this.listaPedidos = [];
        this.socket = socket;
    }

    getSocket(){
        return this.socket;
    }

    getConnectionIndex(){
        return getIndexByConnection(this.socket);
    }

    novoPedido(pedido){
        // TODO recebe o pedido e o adiciona na lista de pedidos
        pedido.numero = 123;
        pedido.status = "recebido";
        this.listaPedidos.push(pedido);
        console.log("novo pedido recebido", pedido);
        return pedido;
    }

    atualizarComanda(comanda){
        // TODO fecha a comanda 
    }


}
module.exports = Mesa;