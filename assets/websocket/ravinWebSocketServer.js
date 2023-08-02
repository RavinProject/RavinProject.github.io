#!/usr/bin/env node

var WebSocketServer = require('websocket').server;
var http = require('http');
const { connect } = require('http2');

var clientsConnected = [];
var kitchenConnected = [];

//Cria o server
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Recebida requisição para ' + request.url);
    response.writeHead(404);
    response.end();
});

//Inicia o server
server.listen(3000, function() {
    console.log((new Date()) + ' WebSocket Server rodando na porta 3000');
});

//Monta o objeto do tipo WebSocketServer
wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

//Criptografa a requisição e faz o handshake (sinceramente não sei como esse método funciona)
wsServer.on('upgrade', function (req, socket) {
    if (req.headers['upgrade'] !== 'websocket') {
        socket.end('HTTP/1.1 400 Bad Request');
        return;
    }
    const acceptKey = req.headers['sec-websocket-key'];
    const hash = generateAcceptValue(acceptKey);
    const responseHeaders = [ 'HTTP/1.1 101 Web Socket Protocol Handshake', 'Upgrade: WebSocket', 'Connection: Upgrade', `Sec-WebSocket-Accept: ${hash}` ];

    const protocol = req.headers['sec-websocket-protocol'];
    const protocols = !protocol ? [] : protocol.split(',').map(s => s.trim());
    if (protocols.includes('json')) {
        responseHeaders.push(`Sec-WebSocket-Protocol: json`);
    }

    socket.write(responseHeaders.join('\r\n') + '\r\n\r\n');
});

//Leitura das requests para o websocket
wsServer.on('request', function(request) {

    var connection = request.accept();
    clientsConnected.push(connection);

    //Quando recebe mensagem
    connection.on('message', function(message) {

        if (message.type === 'utf8') {
            try {
                var data = JSON.parse(message.utf8Data);
            } catch (e) {
                mensagem = formatMessage("erro", 'Formato da mensagem inválido, as mensagens devem ser no formato JSON e devem seguir o padrão de formatação, exemplo: {"action":"nomeDoMetodo","params":{"parametro":"1"}}');
                connection.sendUTF(mensagem);
                console.log('Formato da mensagem inválido, as mensagens devem ser no formato JSON e devem seguir o padrão de formatação, exemplo: {"action":"nomeDoMetodo","params":{"parametro":"1"}}');
                return;
            }

            const action = data.action;
            switch(action) {
                case "login":
                    doLogin(data.params.table, connection);
                    answerMessage = formatMessage("loginAnswer", 'success');
                    connection.sendUTF(answerMessage);
                    break;
            }
        }
    });
});

function getIndexByConnection(connection) {
    let index;
    clientsConnected.forEach(function(valor, chave) {
        if (connection == valor) {
        index = chave;
        }
    });

    return index;
}

function doLogin(table, connection) {
    var index = getIndexByConnection(connection);
    if (index === false) {
        let mensagem = formatMessage("erro", "Erro ao efetuar login");
        connection.sendUTF(mensagem);
        console.log('Erro ao efetuar login, MESA ' + table);
    } else {
        if(table === "kitchen"){
            kitchenConnected = connection;
        } else {
            connectedTables[index]['table'] = table;
            console.log('Mesa online ' + table);
        }
        
    }
}

function formatMessage(action, data) {
	
    let mensagem;

    switch(action) {
        case 'erro':
        case 'loginAnswer':
            mensagem = {"action":action,"params":{"msg":data}};
            break;
    }

    return JSON.stringify(mensagem);
}