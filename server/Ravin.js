const { clientsConnected, tablesConnected, kitchenConnected, getIndexByConnection } = require('./connections');
const utils = require('./utils');
const Mesa = require('./Mesa');
const Cozinha = require('./Cozinha');


// Listas Constantes
const listaMesa = [];
const listaCozinha = [];
const listaUsuarios = require('./UsersList');

class Ravin {

    constructor (io) {
        // Instância do servidor Socket.io, não sei se será utilizada mas tá aqui a referência para caso precisarmos
        const server = io;
    }

    /**
     * Recebe uma nova solicitação do webSocket e faz o devido encaminhamento
     * @param {*} socket é a conexão do cliente
     * @param {*} message é a mensagem recebida
     */
    novaSolicitacao(socket, message){
        console.log("Nova solicitação", message);
        // Valida a solicitação
        if (message.action === undefined || message.action.trim() === '') {
            this.notificaConexao(socket, "Solicitação inválida!");
            return;
        }
        // Valida os parametros
        if (message.params === undefined || typeof message.params != 'object') {
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

    /**
     * Faz o login do usuário validando o login e a senha informada,
     * logo em seguida armazena a informação da conexão da lista de conexões ativas do usuário
     * @param {*} socket 
     * @param {*} params 
     * @returns 
     */
    login(socket, params){
        let login = params.login;
        let senha = params.senha;
        if(login === undefined || senha === undefined){
            this.notificaConexao(socket, "Dados inválidos!");
            return;
        }
        let usuario = null;
        listaUsuarios.forEach((u)=>{
            if(u.login == login && u.senha == senha){
                usuario = u;
                return;
            }
        });
        if(usuario){
            usuario.conexoes.push(socket);
            this.notificaUsuario(usuario, "Login efetuado com sucesso no dispositivo " + params.dispositivo);
            // LOGS DE TESTES APENAS
            console.log(usuario.nome + " logou-se no dispositivo " + params.dispositivo);
            console.log("Conexoes ativas do usuário", usuario.nome, usuario.conexoes.length);
            this.notificaTodosUsuarios(usuario.nome + " logou-se no dispositivo " + params.dispositivo);
            // FIM
        }else{
            this.notificaConexao(socket, "Usuário não encontrado com os dados informados!");
            console.log("Tentativa de login com os seguintes dados:", params);
            return;
        }
    }

    /**
     * Remove o socket desconectado da lista de conexões do usuário
     * @param {*} socket 
     */
    usuarioSeDesconectou(socket){
        let usuario = null;
        listaUsuarios.forEach((u)=>{
            for(let i=0; i < u.conexoes.length; i++){
                if(u.conexoes[i] === socket){
                    usuario = u;
                    usuario.conexoes.splice(i, 1);
                    break;
                }
            }
        });
        this.removeConexoesInativas();
        if(usuario){
            if(usuario.conexoes.length > 0){
                console.log(usuario.nome + " encerrou uma conexão!");
            }else{
                console.log(usuario.nome + " está offline!");
            }
        }
        this.listaUsuariosConectados();
    }

    /**
     * Remove as conexões que estão inativas, não está funcionando como esperava
     * TODO Como fechar as conexoes ainda ativas que o usuário fecha o APP sem encerrar a conexão?
     */
    removeConexoesInativas(){
        listaUsuarios.forEach((usuario)=>{
            // itera de traz pra frente para remover as conexoes inativas
            for (let i = usuario.conexoes.length - 1; i >= 0; i--) {
                let socket = usuario.conexoes[i];
                if(!socket.connected){
                    usuario.conexoes.splice(i, 1);
                }
            }
        });
    }

    /**
     * Envia uma mensagem pra todas as conexões
     * TODO deve haver um meio mais fácil pra enviar sem ter que iterar as listas
     * @param {*} message 
     */
    notificaTodosUsuarios(message){
        listaUsuarios.forEach((usuario)=>{
            usuario.conexoes.forEach((socket)=>{
                this.notificaConexao(socket, message);
            });
        });
    }

    listaUsuariosConectados(){
        listaUsuarios.forEach((u)=>{
            if(u.conexoes.length > 0){
                console.log(u.nome, "qtd conexões:", u.conexoes.length);
            }
        });
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

    /**
     * Envia uma notificação para todas as instâncias de conexão de um usuario
     * @param {*} usuario 
     * @param {*} message 
     */
    notificaUsuario(usuario, message){
        usuario.conexoes.forEach((socket)=>{
            this.notificaConexao(socket, message);
        });
    }

    selecionaMesa(socket){
        let mesa = null;
        let indexSocket = getIndexByConnection(socket);
        listaMesas.forEach((m)=>{
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