class Mesa {
    constructor (connectionIndex) {
        this.connectionIndex = connectionIndex;
        this.numero;
        this.listaPedidos = [];
    }

    getConnectionIndex(){
        return this.connectionIndex;
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