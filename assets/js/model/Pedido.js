class Pedido {
    constructor() {
        // ESTRUTURA DOS DADOS DO PEDIDO
        this.pedido = {
            numero: 0,
            comanda: null,
            datahora: null,
            status: null
        };

        //inicializa com os valores armazenados no storage (se houver) ao carregar a aplicação
        const data = this.recuperaPedidoStorage();
        if (data !== null) {
            this.pedido = data;
        }

    }

    realizarPedido(){
        // muda o status do pedido
        this.pedido.status = "realizado";
        // TODO criar a chamada a Api Rest que irá realizar o pedido no sistema
    }


    // Função para adicionar uma comanda ao pedido
    adicionarComanda(comanda) {
        this.pedido.comanda = comanda;
    }

    // Função para atualizar o storage com os dados do pedido
    atualizaStorage(pedido) {
        localStorage.setItem('pedido', JSON.stringify(this.pedido));
    }

    // Função para recuperar os dados do pedido do storage
    recuperaPedidoStorage() {
        return JSON.parse(localStorage.getItem('pedido'));
    }

    // Função para setar o número do pedido
    setNumero(numero) {
        this.pedido.numero = numero;
        this.atualizaStorage(this.pedido);
    }

    // Função para obter o número do pedido
    getNumero() {
        return this.pedido.numero;
    }

    printPedido() {
        console.log(this.recuperaPedidoStorage());
    }
}