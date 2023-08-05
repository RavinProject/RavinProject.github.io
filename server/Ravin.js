const { clientsConnected, tablesConnected, kitchenConnected, getIndexByConnection } = require('./connections');
const utils = require('./utils');
const Mesa = require('./Mesa');
const Cozinha = require('./Cozinha');

class Ravin {

    constructor (io) {
        this.io = io;
        this.listaMesas = [];
        this.listaCozinha = [];
    }

    /**
     * Recebe uma nova solicitação do webSocket e faz o devido encaminhamento
     * @param {*} socket 
     * @param {*} message 
     */
    novaSolicitacao(socket, message){
        console.log("Nova solicitação da Conexão " + getIndexByConnection(socket), message);
        switch (message.action) {
            case "login":
                this.login(socket, message.params);
                break;
            case "novoPedido":
                this.novoPedido(socket, message.params);
                break;
        }
    }

    /**
     * Seleciona a conexão pelo indice e envia uma mensagem
     * @param {*} connectionIndex 
     * @param {*} message 
     */
    notificaConexao(socket, message){
        // TODO localizar a conexao alvo pelo index

        socket.emit('message', "vão bora!!!");
    }

    notificaMesa(mesa, pedido){
        this.notificaConexao(mesa.getSocket(), pedido);
    }

    login(socket, params){

        if (params.table === "cozinha") { 
            const answerMessage = utils.formatMessage("loginKitchen", 'success');
            console.log(`Cozinha online ${params.table}`);
            this.listaCozinha.push(new Cozinha(socket));
            socket.emit('message', answerMessage);
        } else if (params.table === "mesa") {
            const answerMessage = utils.formatMessage("loginTable", 'success');
            console.log(`Mesa online ${params.table}`);
            this.listaMesas.push(new Mesa(socket));
            socket.emit('message', answerMessage);
        }
    }

    selecionaMesa(socket){
        let mesa = null;
        let indexSocket = getIndexByConnection(socket);
        this.listaMesas.forEach((m)=>{
            if(m.getConnectionIndex() == indexSocket){
                console.log("Mesa localizada!", m);
                mesa = m;
            }
        });
        return mesa;
    }

    novoPedido(socket, params){

        //TODO atualizar lista de pedidos e enviar para a cozinha
        let mesa = this.selecionaMesa(socket);
        if(mesa){
            let pedido = mesa.novoPedido(params.pedido);
            this.notificaMesa(mesa, pedido);
        }else{
            console.log('mesa não localizada');
        }

    }

    notificarMesa(){

        // TODO através na tela da cozinha a mesa poderá ser notificada que o pedido esta pronto

    }

    fecharComanda(){

        // TODO recebe a comanda e notifica a mesa

    }


}

module.exports = Ravin;