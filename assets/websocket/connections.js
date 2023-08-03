// Função para encontrar o índice do cliente na lista de clientes conectados
exports.clientsConnected = [];
exports.kitchenConnected = [];

exports.getIndexByConnection = (connection) => exports.clientsConnected.findIndex((valor) => connection === valor);