#!/usr/bin/env node

// Importando as bibliotecas necessárias
const WebSocketServer = require('websocket').server;
const http = require('http');
require('dotenv').config();

// Inicializando listas para armazenar clientes conectados e cozinha conectada
const clientsConnected = [];
const kitchenConnected = [];

// Cria o servidor HTTP para lidar com solicitações que não são do WebSocket
const server = http.createServer((request, response) => {
    console.log((new Date()) + ' Recebida requisição para ' + request.url);
    response.writeHead(404);
    response.end();
});

// Inicia o servidor HTTP na porta 3000
server.listen(3000, () => {
    console.log((new Date()) + ' WebSocket Server rodando na porta 3000');
});

// Cria o servidor WebSocket associado ao servidor HTTP
const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

// Lidando com solicitações WebSocket recebidas
wsServer.on('request', (request) => {
    // Aceitando a conexão e adicionando-a à lista de clientes conectados
    const connection = request.accept();
    clientsConnected.push(connection);

    // Lidando com mensagens recebidas na conexão
    connection.on('message', (message) => {
        if (message.type !== 'utf8') return; // Ignorar mensagens que não são UTF-8
        console.log(message);
        try {
            // Tentando analisar a mensagem JSON
            const data = JSON.parse(message.utf8Data);
            const action = data.action;
            switch (action) {
                case "login":
                    // Tratar ação de login
                    doLogin(data.params.table, connection);
                    const answerMessage = formatMessage("loginAnswer", 'success');
                    connection.sendUTF(answerMessage);
                    break;
                case "newOrder":
                    
            }
        } catch (e) {
            // Tratamento de erros para mensagens malformadas
            const errorMessage = formatMessage("erro", 'Formato da mensagem inválido...');
            connection.sendUTF(errorMessage);
            console.log(errorMessage);
        }
    });
});

// Função para encontrar o índice do cliente na lista de clientes conectados
const getIndexByConnection = (connection) => clientsConnected.findIndex((valor) => connection == valor);

// Função para lidar com a ação de login
const doLogin = (table, connection) => {
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

// Função para formatar mensagens de resposta
const formatMessage = (action, data) => {
    let mensagem;
    switch (action) {
        case 'erro':
        case 'loginAnswer':
            // Formatação básica para mensagens de erro ou resposta de login
            mensagem = { "action": action, "params": { "msg": data } };
            break;
        // Outros casos podem ser adicionados aqui
    }
    return JSON.stringify(mensagem); // Convertendo o objeto em string JSON
};
