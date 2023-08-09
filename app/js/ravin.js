/**
 * DECLARAÇÃO DAS VARIÁVEIS E OBJETOS GLOBAIS
 */
var itensList = null; //itens recuperados da API
var objetoComanda = new Comanda(); // Objeto javascript para controlar toda a lógica local referente aos dados de uma comanda
var objetoPedido = new Pedido();
var listaPedidos = [];
var server_vps = false;
const urlWebsocket = window.location.hostname === 'localhost' && !server_vps ? 'localhost' : 'https://vps48753.publiccloud.com.br';
const portWebsocket = '3000';
var socket = null;
/** 
 * INICIALIZADORES GLOBAIS 
 * para todas as páginas da aplicação
 * */
(function ($) {
    $(document).ready(function ($) {
        atualizarTotal();
        atualizarNumeroComanda();
        pedido = JSON.parse(localStorage.getItem('listaPedidos'));
        listaPedidos = pedido != null ? pedido : listaPedidos;
        startWebsocket();
    });
}(jQuery));
/** FIM */

// SESSÃO WEBSOCKET

function startWebsocket() {
    // Obter o identificador de sessão do localStorage
    const savedSocketId = localStorage.getItem('socketId');

    // Reconectar usando o identificador de sessão
    if (savedSocketId) {
        socket = io(`${urlWebsocket}:${portWebsocket}`, {
            query: {
                sessionId: savedSocketId
            }
        });

        // Lidar com eventos e continuar a interação com o servidor
        socket.on('message', (message) => {
            processaMensagemServidor(message);
        });

        // Evento antes do fechamento da página
        window.addEventListener('beforeunload', () => {
            socket.emit({'action': 'clienteFechouAbas'}); // Enviar um aviso ao servidor
        });

    } else {
        // Conectar ao servidor Socket.IO
        const socket = io(`${urlWebsocket}:${portWebsocket}`);

        // Armazenar o identificador de sessão no localStorage
        socket.on('connect', () => {
            localStorage.setItem('socketId', socket.id);
        });
    }
}

function processaMensagemServidor(message) {
    if (message.action !== undefined
        && message.action.trim() !== ''
        && message.params !== undefined
        && typeof message.params === 'object') {

        switch (message.action) {
            case 'atualizar_pedidos':
                atualizarPedidos();
                break;
            case 'pedidoPronto':
                notificaPedidoPronto(message.params);
                break;
            default: console.log('Solicitação do servidor não processada:', message)
        }

    } else {
        console.log('Mensagem do servidor:', message);
    }
}

function notificaPedidoPronto(params){
    console.log("pedido pronto");
    if(params.numeroPedido){
        alert(`O pedido ${params.numeroPedido} está pronto para ser retirado!`);
    }
}

function atualizarPedidos(callback) {

    console.log('atualizando pedidos');
    

    socket.emit('message', {
        "action": "pegarListaPedidos",
        "params": {}
    }, (respostaDoServidor) => {
        let response = respostaDoServidor;
        console.log(response);

        if(response.params.listaPedidos !== undefined && typeof response.params.listaPedidos === 'object'){
            this.listaPedidos = response.params.listaPedidos;
            console.log('lista de pedidos atualizada');
            if(callback){
                callback();
            }
        }else{
            console.log('Não foi possível atualizar a lista de pedidos');
        }
        
    });

}

// ADICIONA UM ITEM A COMANDA A PARTIR DO IDENTIFICADOR
function adicionarItemComanda(identificador) {
    var quantidade = document.querySelector('#modalProdutoSelecionado #quantidade').value;
    var produto = buscaItemPeloIdentificador(identificador);
    objetoComanda.adicionarItem(produto, quantidade);
    atualizarTotal();
    alert("Item incluído a comanda!");
    event.preventDefault();
    $('#modalProdutoSelecionado').modal('hide');
}

// REMOVE UM ITEM NA COMANDA A PARTIR DO ID EXISTENTE NA LISTA DE ITENS DA COMANDA
function removerItemComanda(id) {
    objetoComanda.removerItem(id);
    atualizarTotal();
}

// RETORNA UM ITEM A PARTIR DO IDENTIFICADOR
function buscaItemPeloIdentificador(identificador) {
    for (const categoria in itensList) {
        const itensCategoria = itensList[categoria];
        const itemEncontrado = itensCategoria.find(item => item.identificador === identificador);
        if (itemEncontrado) {
            return itemEncontrado;
        }
    }
    // Se o item não for encontrado, retorna null ou outra indicação de que não foi encontrado
    return null;
}

function atualizarTotal() {
    // Atualizar o total na interface do usuário
    document.getElementById("totalGasto").innerText = objetoComanda.getTotal();
}

function atualizarNumeroComanda() {
    objetoComanda.setNumero(1);
    document.getElementById("numero-comanda").innerText = objetoComanda.getNumero();
}

// COMPLETA O MODAL COM AS INFORMAÇÕES DO ITEM SELECIONADO
function preencherModal(produto) {
    var imageURL = "app/img/products/" + produto.imagem;
    document.querySelector('#modalProdutoSelecionado .single-product-img img').src = imageURL;
    document.querySelector('#modalProdutoSelecionado .single-product-content h3').innerText = produto.nome;
    document.querySelector('#modalProdutoSelecionado .single-product-content .single-product-pricing').innerText = 'R$' + produto.valor.toFixed(2);
    document.querySelector('#modalProdutoSelecionado #quantidade').value = 1;
    document.querySelector('#modalProdutoSelecionado .single-product-content p:not(.single-product-pricing)').innerText = produto.descritivo;
    document.querySelector('#modalProdutoSelecionado #modal-categoria').innerText = produto.categoria;
    //adiciona o evento para o botão de confirmação 
    var btnAdicionarItemComanda = document.querySelector('#modalProdutoSelecionado .btnAdicionarItemComanda');
    btnAdicionarItemComanda.setAttribute('onclick', `adicionarItemComanda('${produto.identificador}')`);
}

/**
 * CARREGA OS ITENS PARA SELEÇÃO
 */
function carregarItens(callback) {
    var box_itens = document.querySelector('.product-lists');
    var ul_categorias = document.querySelector('.product-filters ul');
    fetch(`https://api.npoint.io/c442d6ba06c605014033/`)
        .then(response => response.json())
        .then(data => {
            itensList = data;
            let html = "";
            for (let categoria in data) {
                if (data.hasOwnProperty(categoria)) {
                    data[categoria].forEach(item => {
                        html += getBoxItem(categoria, item);
                    });
                    adicionaFiltroCategoria(categoria);
                }
            }
            box_itens.innerHTML = html;
            // carrega os actions do template
            loaderActions();
            setTimeout(function () {
                // isotop inner
                $(".product-lists").isotope();
            }, 500);
            //
            if (callback) callback();
        })
        .catch(error => console.log(error));

    function adicionaFiltroCategoria(categoria) {
        const novoItem = document.createElement('li');
        novoItem.textContent = categoria;
        novoItem.setAttribute('data-filter', `.${removerAcentosEspeciais(categoria)}`);
        ul_categorias.appendChild(novoItem);
    }

    function getBoxItem(categoria, produto) {
        var imageURL = "app/img/products/" + produto.imagem;
        return `<div class="product-item col-lg-4 col-md-6 text-center ${removerAcentosEspeciais(categoria)}" >
        <div class="single-product-item">
            <div class="product-image">
                <img src="${imageURL}" alt="${produto.nome}">
            </div>
            <h3>${produto.nome}</h3>
            <p class="product-description">${produto.descritivo}</p>
            <p class="product-price"><span>Unidade</span> R$ ${produto.valor.toFixed(2)} </p>
            <a href="#" class="cart-btn" data-item='${encodeURI(JSON.stringify(produto))}'><i class="fas fa-shopping-cart"></i> Adicionar a comanda</a>
        </div>
        </div>`;
    }
}

function removerAcentosEspeciais(str) {
    // Substitui os caracteres acentuados por seus equivalentes sem acento
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Substitui os caracteres especiais e o 'ç' por ''
    str = str.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");

    return str;
}

function carregaTelaComanda() {
    var box_itens = document.getElementById('itens_selecionados');
    let html = "";
    objetoComanda.getItens().forEach(function (item) {
        html += `<tr class="table-body-row item_${item.id}">
            <td class="product-remove"><a href="#" title="Remover item" onclick="removerItemComanda(${item.id}); document.querySelector('.item_${item.id}').remove()"><i class="far fa-window-close"></i></a></td>
            <td class="product-image"><img src="app/img/products/${item.produto.imagem}" alt="">
            </td>
            <td class="product-name">${item.produto.nome}</td>
            <td class="product-price">${item.produto.valor}</td>
            <td class="product-quantity"><input type="number" disabled="disabled" placeholder="${item.quantidade}"></td>
            <td class="product-total">${item.total}</td>
            </tr>`;
    });
    box_itens.innerHTML = html;
    document.getElementById('total_comanda').innerHTML = objetoComanda.getTotal();
}

function fazerPedido() {

    if (objetoComanda.getItens().length > 0) {

        objetoPedido.adicionarComanda(objetoComanda);
        objetoPedido.mesa = 1; // TODO implementar numeração de mesas

        socket.emit('message', {
            "action": "novoPedido",
            "params": {
                "pedido": objetoPedido
            }
        }, (respostaDoServidor) => {
            if(respostaDoServidor === 'pedido_recebido'){
                // remove o pedido do storage
                localStorage.removeItem('pedido');

                // remove a comanda do storage
                localStorage.removeItem('comanda');

                // cria novos objetos vazios
                comanda = new Comanda();
                objetoPedido = new Pedido();
                alert("Pedido realizado com sucesso!");

                // Abre a lista de pedidos
                window.location = "./pedidos.html";
            }
            console.log('Resposta do servidor:', respostaDoServidor);
        });
    }
}

function getDateHour() {
    var dataAtual = new Date();

    // Formata a data para exibição
    var dia = dataAtual.getDate();
    var mes = dataAtual.getMonth() + 1; // Os meses em JavaScript são base 0, então adicionamos 1
    var ano = dataAtual.getFullYear();

    // Formatação para adicionar zero à esquerda se for necessário
    if (dia < 10) {
        dia = '0' + dia;
    }

    if (mes < 10) {
        mes = '0' + mes;
    }

    // Obtém a hora e os minutos
    var horas = dataAtual.getHours();
    var minutos = dataAtual.getMinutes();

    // Formatação para adicionar zero à esquerda se necessário
    if (horas < 10) {
        horas = '0' + horas;
    }

    if (minutos < 10) {
        minutos = '0' + minutos;
    }

    // Monta a string da data no formato desejado (dd/mm/aaaa)
    return `${dia}-${mes}-${ano} ${horas}:${minutos}`;
}

function formatarValorParaReais(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

function atualizaStatusPedido(pedidoNumero, e){
    console.log("Pedido " + pedidoNumero + " atualizado para: ", e.value);
    socket.emit('message', {
        "action": "atualizarStatusPedido",
        "params": {
            "numeroPedido": pedidoNumero,
            "status": e.value
        }
    }, (respostaDoServidor)=>{
        alert(respostaDoServidor);
    });
}

