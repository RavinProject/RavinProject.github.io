class Comanda {
    constructor() {
        // ESTRUTURA DOS DADOS DA COMANDA E SEUS ITENS
        this.comanda = {
            numero: 0,
            itens: [
                { // item importante apenas para demonstração da estrutura de dados, é sobrescrito ou zerado logo em seguida
                    id: 0,
                    item: {
                        identificador: "005",
                        categoria: "Água",
                        nome: "Água Mineral",
                        descritivo: "Água mineral natural, sem gás.",
                        valor: 2.00,
                        imagem: "agua500.jpg"
                    },
                    quantidade: 0
                }
            ],
            total: 0
        };

        //inicializa com os valores armazenados no storage (se houver) ao carregar a aplicação
        const data = JSON.parse(localStorage.getItem('comanda'));
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
        return Math.max(0, ...this.comanda.itens.map(item => item.id));
    }

    // Função para gerar o próximo ID baseado no maior ID existente na lista de itens
    getNextIdItem() {
        const maiorId = this.encontrarMaiorId();
        return maiorId + 1;
    }

    // Função para adicionar um item à comanda
    adicionarItem(item, quantidade) {
        this.comanda.itens.push({
            id: this.getNextIdItem(),
            item: item,
            quantidade: quantidade
        });
        this.comanda.total += quantidade * item.valor;
        this.atualizaStorage(this.comanda);
    }

    // Função para remover um item da comanda pelo ID
    removerItem(idItem) {
        const index = this.comanda.itens.findIndex(item => item.id === idItem);
        if (index > -1) {
            const item = this.comanda.itens[index].item;
            this.comanda.total -= this.comanda.itens[index].quantidade * item.valor;
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