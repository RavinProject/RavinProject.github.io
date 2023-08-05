const { clientsConnected, tablesConnected, kitchenConnected, getIndexByConnection } = require('./connections');
const utils = require('./utils');
const Mesa = require('./Mesa');
const Cozinha = require('./Cozinha');
const listaUsuarios = require('./UsersList');

class Ravin {

    constructor (io) {
        // Instancia do servidor Socket.io
        this.io = io;
        // Listas
        this.listaUsuariosConectados = [];
        this.listaMesas = [];
        this.listaCozinha = [];
    }

    /**
     * Recebe uma nova solicitação do webSocket e faz o devido encaminhamento
     * @param {*} socket é a conexão do cliente
     * @param {*} message é a mensagem recebida
     */
    novaSolicitacao(socket, message){
        console.log("Nova solicitação da Conexão " + getIndexByConnection(socket), message);
        // Valida a solicitação
        if (typeof message.action === 'undefined' || message.action.trim() === '') {
            this.notificaConexao(socket, "Solicitação inválida!");
            return;
        }
        // Valida os parametros
        if (typeof message.params === 'undefined' || typeof message.params != 'object') {
            this.notificaConexao(socket, "Parâmetros inválidos!");
            return;
        }
        // Encaminha para o tratamento correto
        switch (message.action) {
            case "login":
                this.login(socket, message.params);
                break;
            case "novoPedido":
                this.novoPedido(socket, message.params);
                break;
            default:
                this.notificaConexao(socket, "Não foi possível processar a solicitação.");
        }
        return;
    }

    usuarioDesconectado(socket){
        console.log("Usuário desconectou!");
    }

    /**
     * Seleciona a conexão pelo indice e envia uma mensagem
     * @param {*} connectionIndex 
     * @param {*} message 
     */
    notificaConexao(socket, message){
        // TODO localizar a conexao alvo pelo index

        socket.emit('message', JSON.stringify(message));
    }

    notificaMesa(mesa, pedido){
        this.notificaConexao(mesa.getSocket(), pedido);
    }

    login(socket, params){
        let login = params.usuario;
        let senha = params.senha;
        if(login === 'undefined' || senha === 'undefined'){
            this.notificaConexao(socket, "Dados inválidos!");
        }
        let usuario;
        listaUsuarios.forEach((u)=>{
            if(u.login === login, u.senha === senha){
                usuario = u;
            }
        });
        if(usuario){
            
        }else{
            this.notificaConexao(socket, "Usuário não encontrado com os dados informados!");
        }
        
        // if (params.table === "cozinha") { 
        //     const answerMessage = utils.formatMessage("loginKitchen", 'success');
        //     console.log(`Cozinha online ${params.table}`);
        //     this.listaCozinha.push(new Cozinha(socket));
        //     socket.emit('message', answerMessage);
        // } else if (params.table === "mesa") {
        //     const answerMessage = utils.formatMessage("loginTable", 'success');
        //     console.log(`Mesa online ${params.table}`);
        //     this.listaMesas.push(new Mesa(socket));
        //     socket.emit('message', answerMessage);
        // }
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