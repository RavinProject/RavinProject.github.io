const { clientsConnected, tablesConnected, kitchenConnected, getIndexByConnection } = require('./connections');
const utils = require('./utils');


// Listas Constantes
const listaUsuarios = require('./UsersList');
const listaPedidos = [];

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
    novaSolicitacao(socket, m, callback){

        let message = JSON.parse(m);

        // Valida a solicitação
        if (message.action === undefined || message.action.trim() === '') {
            console.log("Solicitação inválida!");
            this.notificaConexao(socket, "Solicitação inválida!");
            return;
        }
        // Valida os parametros
        if (message.params === undefined || typeof message.params != 'object') {
            console.log("Parâmetros inválidos!");
            this.notificaConexao(socket, "Parâmetros inválidos!");
            return;
        }
        // Encaminha para o tratamento correto
        switch (message.action) {
            case "login":
                this.login(socket, message.params);
                break;
            case "novoPedido":
                this.novoPedido(socket, message.params, callback);
                break;
            case "pegarListaPedidos":
                this.pegarListaProdutos(socket, callback);
                break;
            case "atualizarStatusPedido":
                this.atualizarStatusPedido(message.params, socket, callback);
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
     * Verifica qual usuário se reconectou e substitui o socket antigo pelo novo socket
     * Isso impede que o usuário que atualizar a pagina ou navegar pelo site criar várias conexoes
     * TODO não sei se é a melhor forma de impedir sessoes inativas, mas é importante para poder notificar os usuários corretos
     * @param {*} socket 
     */
    usuarioSeReconectou(sessionId, socket){
        listaUsuarios.forEach((u)=>{
            for(let i=0; i < u.conexoes.length; i++){
                let sock = u.conexoes[i];
                let sockSessionID = sock.handshake.query.sessionId;
                if(sockSessionID === sessionId){
                    u.conexoes[i] = socket;
                    break;
                }
            }
        });
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

    /**
     * Recebe um novo pedido:
     * - altera o status do pedido para recebido
     * - insere o pedido na lista de pedidos
     * - atualiza a lista de pedidos nas sessoes conectadas
     * @param {*} socket 
     * @param {*} params 
     */
    novoPedido(socket, params, callback){
    
        let pedido = params.pedido

        // Cria um número para o pedido
        pedido.numero = listaPedidos.length + 1;

        // Modifica o status para recebido
        pedido.status = 'recebido';

        // Adiciona a lista de pedidos
        listaPedidos.push(pedido);

        // Solicita a atualização dos pedidos aos usuários conectados
        socket.emit("message", {
            "action": "atualizar_pedidos",
            "params": listaPedidos
        });
                
        // Informa que ao socket que o pedido foi recebido
        if(callback) callback("pedido_recebido");
    }
  
    /**
     * Retorna a lista de pedidos através de uma função de callback ou envia por mensagem ao cliente que a solicitou
     * @param {*} socket 
     * @param {*} callback 
     */
    pegarListaProdutos(socket, callback){
        if(callback){
            callback({
                "action": "pegarListaPedidos",
                "params": {
                    "listaPedidos": listaPedidos
                }
            });
        }else{
            socket.emit('message', {
                "action": "pegarListaPedidos",
                "params": {
                    "listaPedidos": listaPedidos
                }
            });    
        }
    }

    /**
     * Atualiza o status do pedido com o status recebido da cozinha e notifica todos 
     * @param {*} socket 
     * @param {*} callback 
     */
    atualizarStatusPedido(params, socket, callback){
        let numeroPedido = params.numeroPedido;
        let status = params.status;

        if(numeroPedido && status && callback){
            listaPedidos.forEach((pedido)=>{
                if(pedido.numero === numeroPedido){
                    pedido.status = status;
                }
            });
            callback(`O status do pedido ${numeroPedido} foi atualizado para ${status}`);

            if(status === 'pronto'){
                console.log("pedido pronto");
                console.log(clientsConnected.length);
                clientsConnected.forEach((c)=>{
                    console.log("socket id:", c.socket.id);
                    if(c.socket !== socket){
                        console.log("notificando pedido pronto");
                        c.socket.emit('message', {
                            "action": "pedidoPronto",
                            "params": {
                                "numeroPedido": numeroPedido
                            }
                        });
                    }
                });

            }
        }else{
            socket.emit("Não foi possível atualizar o status do pedido! Verifique os parametros informados.");
        }
    }



}

module.exports = Ravin;