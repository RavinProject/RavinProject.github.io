class Pedido {
    constructor() {
        // ESTRUTURA DOS DADOS DO PEDIDO
        this.numero = 0;
        this.mesa = 0;
        this.comanda = null;
        this.datahora = getDateHour();
        this.status = null;

    }

    realizarPedido(){
        // muda o status do pedido
        this.status = "realizado";
        // TODO criar a chamada a Api Rest que irá realizar o pedido no sistema
    }


    // Função para adicionar uma comanda ao pedido
    adicionarComanda(comanda) {
        this.comanda = comanda;
    }

    // Função para atualizar o storage com os dados do pedido
    atualizaStorage(pedido) {
        localStorage.setItem('pedido', JSON.stringify(pedido));
    }

    // Função para recuperar os dados do pedido do storage
    recuperaPedidoStorage() {
        return JSON.parse(localStorage.getItem('pedido'));
    }

    // Função para setar o número do pedido
    setNumero(numero) {
        this.numero = numero;
        this.atualizaStorage(this);
    }

    // Função para obter o número do pedido
    getNumero() {
        return this.numero;
    }

    printPedido() {
        console.log(this.recuperaPedidoStorage());
    }
}