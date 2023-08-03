#!/usr/bin/env node

// Importando as bibliotecas necessárias
const WebSocketServer = require('websocket').server;
const http = require('http');
require('dotenv').config();

// Imports de módulos locais
const { clientsConnected, kitchenConnected, getIndexByConnection } = require('./connections');
const utils = require('./utils');
const handlers = require('./handlers');

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
            const validationError = utils.validateMessage(data);
            if (validationError) {
                // Se houver um erro de validação, o tratamos aqui
                const errorMessage = utils.formatMessage("erro", validationError);
                connection.sendUTF(errorMessage);
                console.log(errorMessage);
                return;
            }
            const action = data.action;

            // swtich cases para cada action
            switch (action) {
                case "login":
                    // Tratar ação de login
                    handlers.doLogin(data.params.table, connection);
                    const answerMessage = utils.formatMessage("loginAnswer", 'success');
                    connection.sendUTF(answerMessage);
                    break;
                case "newOrder":
                    
            }
        } catch (e) {
            // Tratamento de erros para mensagens malformadas
            const errorMessage = utils.formatMessage("erro", 'Formato da mensagem inválido...');
            connection.sendUTF(errorMessage);
            console.log(errorMessage);
        }
    });
});
