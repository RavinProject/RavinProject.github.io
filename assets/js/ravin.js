function atualizarTotal() {
    // Recuperar a comanda do localStorage
    var comanda = JSON.parse(localStorage.getItem('comanda'));
    var total = 0;

    if (comanda !== null && comanda.itens !== null) {
        // Calcular o total
        for (var i = 0; i < comanda.itens.length; i++) {
            total += comanda.itens[i].total;
        }
    }

    // Atualizar o total na interface do usuário
    document.getElementById("totalGasto").innerText = total.toFixed(2);
}

function atualizarNumeroComanda() {
    // Recuperar a comanda do localStorage
    var comanda = JSON.parse(localStorage.getItem('comanda'));

    if (comanda !== null) {
        // Atualizar o número da comanda na interface do usuário
        document.getElementById("numero-comanda").innerText = comanda.numero;
    }
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
function carregarItens() {
    var box_itens = document.getElementsByClassName('product-lists')[0];
    fetch(`http://localhost:8080/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                console.log('deu ruim!');
                return;
            }
            let html = "";
            for (let categoria in data) {
                if (data.hasOwnProperty(categoria)) {
                    data[categoria].forEach(item => {
                        html += getBoxItem(categoria, item);
                    });
                }
            }
            box_itens.innerHTML = html;
            // carrega os actions do template
            loaderActions();
            setTimeout(function () {
                // isotop inner
                $(".product-lists").isotope();
            }, 500);
        })
        .catch(error => console.log(error));

    function getBoxItem(categoria, item) {
        return `<div class="col-lg-4 col-md-6 text-center ${categoria}">
        <div class="single-product-item">
            <div class="product-image">
                <a href="#myModal" data-toggle="modal"><img src="assets/img/products/${item.imagem}" alt=""></a>
            </div>
            <h3>${item.nome}</h3>
            <p class="product-price"><span>Un</span> R$ ${item.valor} </p>
            <a href="#" class="cart-btn"><i class="fas fa-shopping-cart"></i> Adicionar a comanda</a>
        </div>
        </div>`;
    }
}

/** INIICIALIZADORES */
(function ($) {
    $(document).ready(function ($) {
        atualizarTotal();
        atualizarNumeroComanda();
        carregarItens();
    });
}(jQuery));
/** FIM */