/**
 * DECLARAÇÃO DAS VARIÁVEIS E OBJETOS GLOBAIS
 */
var itensList = null; //itens recuperados da API
const objetoComanda = new Comanda(); // Objeto javascript para controlar toda a lógica local referente aos dados de uma comanda

/** 
 * INICIALIZADORES GLOBAIS 
 * para todas as páginas da aplicação
 * */
(function ($) {
    $(document).ready(function ($) {
        atualizarTotal();
        atualizarNumeroComanda();
    });
}(jQuery));
/** FIM */

// ADICIONA UM ITEM A COMANDA A PARTIR DO IDENTIFICADOR
function adicionarItemComanda(identificador) {
    var quantidade = document.querySelector('#modalProdutoSelecionado #quantidade').value;
    var produto = buscaItemPeloIdentificador(identificador);
    objetoComanda.adicionarItem(produto, quantidade);
    atualizarTotal();
    alert("Item incluído a comanda!");
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
    document.getElementById("numero-comanda").innerText = objetoComanda.getNumero();
}

// COMPLETA O MODAL COM AS INFORMAÇÕES DO ITEM SELECIONADO
function preencherModal(produto) {
    var imageURL = "assets/img/products/" + produto.imagem;
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
    fetch(`http://api.npoint.io/c442d6ba06c605014033/`)
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
        var imageURL = "assets/img/products/" + produto.imagem;
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

function carregaTelaComanda(){
    var box_itens = document.getElementById('itens_selecionados');
    let html = "";
    objetoComanda.getItens().forEach(function(item){
        html += `<tr class="table-body-row">
            <td class="product-remove"><a href="#" title="remover"><i class="far fa-window-close"></i></a></td>
            <td class="product-image"><img src="assets/img/products/${item.produto.imagem}" alt="">
            </td>
            <td class="product-name">${item.produto.nome}</td>
            <td class="product-price">${item.produto.valor}</td>
            <td class="product-quantity"><input type="number" placeholder="${item.quantidade}"></td>
            <td class="product-total">${item.total}</td>
            </tr>`;
    });
    box_itens.innerHTML = html;

}