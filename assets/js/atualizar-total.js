function atualizarTotal() {
    // Recuperar a comanda do localStorage
    var comanda = JSON.parse(localStorage.getItem('comanda'));
    var total = 0;

    if(comanda !== null) {
        // Calcular o total
        for(var i = 0; i < comanda.length; i++) {
            total += comanda[i].total;
        }
    }

    // Atualizar o total na interface do usuário
    document.getElementById("totalGasto").innerText = total.toFixed(2);
}