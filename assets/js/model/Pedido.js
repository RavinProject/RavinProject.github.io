class Pedido {
    constructor() {
        //inicializa com os valores armazenados no storage (se houver) ao carregar a aplicação
        const data = this.recuperaPedidoStorage();
        if (data !== null) {
            this.pedido = data;
        } else {
            //pedido vazio se não houver dados anteriores
            this.pedido = {
                numero: 0,
                comanda: null,
                datahora: null,
                status: null
            };
        }
    }

    realizarPedido(){
        // TODO implementar método para realizar pedido
    }


    // Função para adicionar uma comanda ao pedido
    adicionarComanda(comanda) {
        // TODO implementar adicionar comanda ao pedido
    }

    // Função para atualizar o storage com os dados do pedido
    atualizaStorage(pedido) {
        localStorage.setItem('pedido', JSON.stringify(comanda));
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