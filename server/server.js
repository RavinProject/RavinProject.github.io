// Include the cluster module
const cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    const cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (let i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for terminating workers
    cluster.on('exit', function (worker) {

        // Replace the terminated workers
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();

    });

    // Code to run if we're in a worker process
} else {

    const port = 8080;

    // Importando as bibliotecas necessárias
    const http = require('http');
    const socketIo = require('socket.io');
    require('dotenv').config();

    // Imports de módulos locais
    const { clientsConnected, getIndexByConnection } = require('./connections');
    const utils = require('./utils');
    const handlers = require('./handlers');

    // Cria o servidor HTTP para lidar com solicitações que não são do WebSocket
    const server = http.createServer((request, response) => {
        console.log((new Date()) + ' Recebida requisição para ' + request.url);
        response.writeHead(200); // TODO Por enquanto não consegui trocar a porta no AWS, ela faz checagem na 80 para verificar se está retornando o código 200
        response.end();
    });

    // Inicia o servidor HTTP
    server.listen(port, () => {
        console.log((new Date()) + ' WebSocket Server rodando na porta ' + port);
    });

    // Cria o servidor WebSocket associado ao servidor HTTP
    const io = socketIo(server);

    // Lidando com solicitações WebSocket recebidas
    io.on('connection', (socket) => {
        // Adicionando a conexão à lista de clientes conectados
        console.log('a user connected');
        clientsConnected.push(socket);

        // Lidando com mensagens recebidas na conexão
        socket.on('message', (message) => {
            console.log('Mensagem recebida:', message);
            try {
                // Tentando analisar a mensagem
                const validationError = utils.validateMessage(message);
                if (validationError) {
                    // Se houver um erro de validação, o tratamos aqui
                    const errorMessage = utils.formatError("erro", validationError, "Erro de validação. Revise o formato da sua mensagem");
                    socket.emit('message', errorMessage);
                    console.log(errorMessage);
                    return;
                }
                const action = message.action;

                // switch cases para cada action
                switch (action) {
                    case "login":
                        // Tratar ação de login
                        handlers.doLogin(message.params.table, socket);
                        break;
                    case "newOrder":
                        handlers.createOrder(message.params.pedido, socket);
                        break;
                }
            } catch (e) {
                // Tratamento de erros para mensagens malformadas
                const errorCode = "INVALID_FORMAT"; // Você pode definir códigos de erro específicos para diferentes tipos de erros
                const errorMessage = utils.formatError("erro", errorCode, 'Formato da mensagem inválido...');
                socket.emit('message', errorMessage);
                console.log(errorMessage);
                console.log(e);
            }
        });
    });

    io.on('disconnect', () => {
        const index = getIndexByConnection(socket);
        if (index !== -1) {
            clientsConnected.splice(index, 1);
        }
        console.log('user disconnected');
    });
}