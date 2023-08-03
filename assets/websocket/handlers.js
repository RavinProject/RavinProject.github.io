const { getIndexByConnection, kitchenConnected } = require('./connections');
const { formatMessage } = require('./utils');

exports.doLogin = (table, connection) => {
  const index = getIndexByConnection(connection);
    if (index === -1) {
        // Erro caso a conexão não seja encontrada
        const mensagem = formatMessage("erro", "Erro ao efetuar login");
        connection.sendUTF(mensagem);
        console.log(`Erro ao efetuar login, MESA ${table}`);
    } else {
        // Conexão de cozinha ou mesa
        if (table === "kitchen") { 
            kitchenConnected = connection;
        } else {
            console.log(`Mesa online ${table}`);
        }
    }
};

// Função para criar um pedido
// 'tableName'
// item.id
// item.valor
// item.quantidade
// const createdOrder = (table, )

exports.createOrder = (orderData, connection) => {
  // Implementação da criação do pedido aqui...
};