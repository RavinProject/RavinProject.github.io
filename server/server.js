// Include the cluster module
const cluster = require('cluster');

const multiThreads = false; // por enquanto terá que ser assim, apenas um processo!

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    const cpuCount = multiThreads ? require('os').cpus().length : 1;

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
    // const io = socketIo(server);

    const io = socketIo(server, {
        cors: {
            origin: [
                'http://localhost', 
                'https://ravinproject.github.io/'
            ],
            methods: ["GET", "POST"]
        }
    });


    // Controlador da Aplicação
    const Ravin = require('./Ravin');
    const RavinController = new Ravin(io);

    // Lidando com solicitações WebSocket recebidas
    io.on('connection', (socket) => {

        // A sessionId que o usuário tem gravada no localStorage do seu navegador
        const sessionId = socket.handshake.query.sessionId;

        console.log("Nova sessionId", sessionId);

        // No primeira acesso a sessionId é undefined
        let sessaoExistente = sessionId === undefined ? false : true;

        if(sessionId === undefined){
            console.log("Novo cliente conectado " + sessionId);
            // clientsConnected[sessionId] = socket;
            clientsConnected.push({
                "sessionId": socket.id,
                "socket": socket
            }); 
        }else{
            console.log("Sessao preexistente");
            let existeNoArray = false;
            // Caso já exista uma sessão anterior com o mesmo ID, substituí o socket de uma conexão já exitente na lista de clientes conectados
            for(let i = 0; i < clientsConnected.length; i++){
                if(clientsConnected[i].sessionId == sessionId){
                    console.log("Cliente reconectado (1)", sessionId);
                    existeNoArray = true;
                    clientsConnected[i].socket = socket;
                    // Atualiza a relação da sessão/socket do usuário
                    RavinController.usuarioSeReconectou(sessionId, clientsConnected[i].socket);
                }
            }
            if(!existeNoArray){
                clientsConnected.push({
                    "sessionId": sessionId,
                    "socket": socket
                }); 
            }
        }

        clientsConnected.forEach((c)=>{
            console.log("sessionId", c.sessionId, "sockerId", c.socket.id);
        });

        console.log(clientsConnected.length, "conectados");

        socket.on('message', (message, callback) => {
            
            RavinController.novaSolicitacao(socket, message, callback);
            
        });

        // Esse evento dispara cada vez que o usuário navega para outra página ou atualiza a página
        socket.on('disconnect', () => {

        });

    });

}