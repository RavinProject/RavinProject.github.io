const { clientsConnected, tablesConnected, kitchenConnected, getIndexByConnection } = require('./connections');
const utils = require('./utils');
const Mesa = require('./Mesa');
const Cozinha = require('./Cozinha');

class Ravin {

    constructor (socket) {
        this.socket = socket;
        this.listaMesas = [];
        this.listaCozinha = [];
    }

    /**
     * Recebe uma nova solicitação do webSocket e faz o devido encaminhamento
     * @param {*} connectionIndex 
     * @param {*} message 
     */
    novaSolicitacao(connectionIndex, message){
        console.log(connectionIndex, message);
        switch (message.action) {
            case "login":
                this.login(connectionIndex, message.params);
                break;
            case "novoPedido":
                this.novoPedido(connectionIndex, message.params);
                break;
        }
    }

    /**
     * Seleciona a conexão pelo indice e envia uma mensagem
     * @param {*} connectionIndex 
     * @param {*} message 
     */
    notificaConexao(connectionIndex, message){
        // TODO localizar a conexao alvo pelo index
        
        // let connectedSockets = this.socket.sockets.sockets; // CHAT GPT
        // let con = connectedSockets[connectionIndex];
        let con = getIndexByConnection(connectionIndex);
        console.log(con);
        con.emit('message', 'foi!!!!!!!!!!!!!!');
    }

    notificaMesa(mesa, pedido){
        this.notificaConexao(mesa.getConnectionIndex(), pedido);
    }

    login(connectionIndex, params){

        if (params.table === "cozinha") { 
            const answerMessage = utils.formatMessage("loginKitchen", 'success');
            this.socket.emit('message', answerMessage);
            console.log(`Cozinha online ${params.table}`);
            this.listaCozinha.push(new Cozinha(connectionIndex));

            kitchenConnected.push(connectionIndex);
        } else if (params.table === "mesa") {
            const answerMessage = utils.formatMessage("loginTable", 'success');
            this.socket.emit('message', answerMessage);
            console.log(`Mesa online ${params.table}`);
            this.listaMesas.push(new Mesa(connectionIndex));
            tablesConnected.push(connectionIndex);
        }
    }

    selecionaMesa(connectionIndex){
        let mesa = null;
        this.listaMesas.forEach((m)=>{
            if(m.getConnectionIndex() == connectionIndex){
                console.log("Mesa localizada!", m);
                mesa = m;
            }
        });
        return mesa;
    }

    novoPedido(connectionIndex, params){

        //TODO atualizar lista de pedidos e enviar para a cozinha
        let mesa = this.selecionaMesa(connectionIndex);
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