class Comanda {
    constructor() {
        // ESTRUTURA DOS DADOS DA COMANDA E SEUS ITENS
        this.comanda = {
            numero: 0,
            itens: [
                { // item importante apenas para demonstração da estrutura de dados, é sobrescrito ou zerado logo em seguida
                    id: 0,
                    produto: {
                        identificador: "005",
                        categoria: "Água",
                        nome: "Água Mineral",
                        descritivo: "Água mineral natural, sem gás.",
                        valor: 2.00,
                        imagem: "agua500.jpg"
                    },
                    quantidade: 0,
                    total: 0
                }
            ],
            total: 0
        };

        //inicializa com os valores armazenados no storage (se houver) ao carregar a aplicação
        const data = this.recuperaComandaStorage();
        if (data !== null) {
            this.comanda = data;
        } else {
            //comanda vazia se não houver dados anteriores
            this.comanda = {
                numero: 0,
                itens: [],
                total: 0
            };
        }

    }

    // retorna a lista de itens da comanda
    getItens(){
        return this.comanda.itens;
    }

    /**
     * Encontra o maior ID na lista de itens da comanda.
     *
     * Esta função primeiro cria um novo array que contém apenas os IDs 
     * dos itens da comanda usando o método 'map'. Em seguida, usa a 
     * função 'Math.max' para encontrar o maior ID no novo array.
     * O operador '...' (spread) é usado para passar os elementos do 
     * array de IDs como argumentos individuais para 'Math.max'.
     * O '0' é incluído para lidar com o caso em que o array está vazio.
     *
     * @returns {number} O maior ID entre os itens da comanda, ou '0' 
     *                   se a lista de itens estiver vazia.
     */
    encontrarMaiorId() {
        return Math.max(0, ...this.comanda.itens.map(produto => produto.id));
    }

    // Função para gerar o próximo ID baseado no maior ID existente na lista de itens
    getNextIdItem() {
        const maiorId = this.encontrarMaiorId();
        return maiorId + 1;
    }

    // Função para adicionar item à comanda
    adicionarItem(produto, quantidade) {
        var item = {
            id: this.getNextIdItem(),
            produto: produto,
            quantidade: quantidade,
            total: quantidade * produto.valor
        };
        this.comanda.itens.push(item);
        this.comanda.total += item.total;
        this.atualizaStorage(this.comanda);
    }

    // Função para remover um item da comanda pelo ID
    removerItem(produtoId) {
        const index = this.comanda.itens.findIndex(produto => produto.id === produtoId);
        if (index > -1) {
            const item = this.comanda.itens[index];
            this.comanda.total -= item.total;
            this.comanda.itens.splice(index, 1);
            this.atualizaStorage(this.comanda);
        }
    }

    // Função para atualizar o storage com os dados da comanda
    atualizaStorage(comanda) {
        localStorage.setItem('comanda', JSON.stringify(comanda));
    }

    // Função para recuperar os dados da comanda do storage
    recuperaComandaStorage() {
        return JSON.parse(localStorage.getItem('comanda'));
    }

    // Função para obter o total da comanda
    getTotal() {
        return this.comanda.total.toFixed(2); // To fixed para por duas casas decimais
    }

    // Função para setar o número da comanda
    setNumero(numero) {
        this.comanda.numero = numero;
        this.atualizaStorage(this.comanda);
    }

    // Função para obter o número da comanda
    getNumero() {
        return this.comanda.numero;
    }

    // Função para imprimir os dados da comanda no console
    printComanda() {
        console.log(this.recuperaComandaStorage());
    }
}