
var ws = new WebSocket("ws://localhost:3000") 

// listener

ws.onmessage = function(message){
    var dados = JSON.parse(message.data)
    console.log(dados)
} 

ws.onopen = function(message){
    var dados = JSON.parse(message.data)
    console.log(dados)
};

ws.onerror = function(message){
    var dados = JSON.parse(message.data)
    console.log(dados)
};

ws.onclose = function(message){
    var dados = JSON.parse(message.data)
    console.log(dados)
};

// Send e close

ws.send()

ws.close();

