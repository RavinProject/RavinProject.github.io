// Função para encontrar o índice do cliente na lista de clientes conectados
exports.clientsConnected = [];
exports.tablesConnected = [];
exports.kitchenConnected = [];
exports.getIndexByConnection = (socket) => exports.clientsConnected.findIndex((valor) => socket === valor);