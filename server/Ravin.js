const { clientsConnected, tablesConnected, kitchenConnected, getIndexByConnection } = require('./connections');

class Ravin {

    constructor () {
        this.listaMesas;
        this.cozinha;
    }

    novaSolicitacao(message){
        switch (action) {
            case "login":
                // Tratar ação de login
                handlers.doLogin(message.params.table, socket);
                break;
            case "novoPedido":
                handlers.createOrder(message.params.pedido, socket);
                break;
        }
    }

    login(){
        if (table === "kitchen") { 
            const answerMessage = utils.formatMessage("loginKitchen", 'success');
            socket.emit('message', answerMessage);
            console.log(`Cozinha online ${table}`);
            kitchenConnected.push(index);
        } else {
            const answerMessage = utils.formatMessage("loginTable", 'success');
            socket.emit('message', answerMessage);
            console.log(`Mesa online ${table}`);
            tablesConnected.push(index);
        }
    }

    fecharComanda(){
        // TODO recebe a comanda e notifica a mesa
    }


}