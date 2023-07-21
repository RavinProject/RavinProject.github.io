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

function atualizarTotal() {
    // Recuperar a comanda do localStorage
    var comanda = JSON.parse(localStorage.getItem('comanda'));
    var total = 0;

    if(comanda !== null && comanda.itens !== null) {
        // Calcular o total
        for(var i = 0; i < comanda.itens.length; i++) {
            total += comanda.itens[i].total;
        }
    }

    // Atualizar o total na interface do usuário
    document.getElementById("totalGasto").innerText = total.toFixed(2);
}

function atualizarNumeroComanda() {
    // Recuperar a comanda do localStorage
    var comanda = JSON.parse(localStorage.getItem('comanda'));

    if(comanda !== null) {
        // Atualizar o número da comanda na interface do usuário
        document.getElementById("numero-comanda").innerText = comanda.numero;
    }
}

// COMPLETA O MODAL COM AS INFORMAÇÕES DO ITEM SELECIONADO
function preencherModal(item) {
    var imageURL = "assets/img/products/" + item.imagem;
    document.querySelector('#modalProdutoSelecionado .single-product-img img').src = imageURL;
    document.querySelector('#modalProdutoSelecionado .single-product-content h3').innerText = item.nome;
    document.querySelector('#modalProdutoSelecionado .single-product-content .single-product-pricing').innerText = 'R$' + item.valor;
    document.querySelector('#modalProdutoSelecionado #quantidade').value = 1;
    document.querySelector('#modalProdutoSelecionado .single-product-content p:not(.single-product-pricing)').innerText = item.descritivo;
    document.querySelector('#modalProdutoSelecionado #modal-categoria').innerText = item.categoria;
}

var comanda = {
    "numero": 12222,
    "itens": [
        {
            "item": { "nome": "Item 1", "valor": 10.0 },
            "quantidade": 2,
            "total": 2323230.0
        },
        {
            "item": { "nome": "Item 2", "valor": 15.0 },
            "quantidade": 3,
            "total": 45.0
        }
    ],
    "total": 65.0
};

localStorage.setItem('comanda', JSON.stringify(comanda));

/**
 * CARREGA OS ITENS PARA SELEÇÃO
 */
function carregarItens(callback) {
    var box_itens = document.querySelector('.product-lists');
    var ul_categorias = document.querySelector('.product-filters ul');
    fetch(`http://localhost:8080/`)
        .then(response => response.json())
        .then(data => {
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
            if(callback) callback();
        })
        .catch(error => console.log(error));

    function adicionaFiltroCategoria(categoria){
        const novoItem = document.createElement('li');
        novoItem.textContent = categoria;
        novoItem.setAttribute('data-filter', `.${removerAcentosEspeciais(categoria)}`);
        ul_categorias.appendChild(novoItem);
    }

    function getBoxItem(categoria, item) {
        var imageURL = "assets/img/products/" + item.imagem;
        return `<div class="product-item col-lg-4 col-md-6 text-center ${removerAcentosEspeciais(categoria)}" >
        <div class="single-product-item">
            <div class="product-image">
                <img src="${imageURL}" alt="${item.nome}">
            </div>
            <h3>${item.nome}</h3>
            <p class="product-description">${item.descritivo}</p>
            <p class="product-price"><span>Unidade</span> R$ ${item.valor} </p>
            <a href="#" class="cart-btn" data-item='${encodeURI(JSON.stringify(item))}'><i class="fas fa-shopping-cart"></i> Adicionar a comanda</a>
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