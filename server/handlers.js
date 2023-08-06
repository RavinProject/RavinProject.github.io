const { kitchenConnected, tablesConnected, getIndexByConnection } = require('./connections');
const utils = require('./utils');
const listaPedidos = require('./listaPedidos');

exports.doLogin = (table, socket) => {
    const index = getIndexByConnection(socket);
    if (index === -1) {
        // Erro caso a conexão não seja encontrada
        const ERROR_CODE = "CONNECTION_NOT_FOUND"
        const errorMessage = utils.formatError("erro", ERROR_CODE, "Erro ao efetuar login");
        socket.emit('message', errorMessage);
        console.log(errorMessage);
    } else {
        // Conexão de cozinha ou mesa
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
};

// Função para criar um pedido
// 'tableName'
// item.id
// item.valor
// item.quantidade
// const createdOrder = (table, )

exports.createOrder = (pedido, socket) => {
    const index = getIndexByConnection(socket);
    if (index === -1) {
        // Erro caso a conexão não seja encontrada
        const ERROR_CODE = "CONNECTION_NOT_FOUND"
        const errorMessage = utils.formatError("erro", ERROR_CODE, "Erro ao efetuar login");
        socket.emit('message', errorMessage);
        console.log(errorMessage);
    } else {
        // Implementação da criação do pedido aqui...
        pedido.numero = 2;
        pedido.status = "recebido";
        listaPedidos.push(pedido);
        const answerMessage = utils.formatMessage("pedido", pedido);
        socket.emit('message', answerMessage);
    }
};