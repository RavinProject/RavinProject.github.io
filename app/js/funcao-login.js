// Simulação de um banco de dados de usuários
const usersDatabase = [
    { username: "admin", password: "admin" },
    { username: "usuario2", password: "outrasenha" }
];

// Função de login
function login(username, password) {
    // Verificar se os campos de login e senha foram preenchidos
    if (!username || !password) {
        return "Por favor, preencha ambos os campos.";
    }

    // Procurar o usuário na base de dados
    const user = usersDatabase.find(user => user.username === username);

    // Verificar se o usuário foi encontrado e se a senha corresponde
    if (user && user.password === password) {
        return "Login bem-sucedido!";
    } else {
        return "Nome de usuário ou senha incorretos.";
    }
}

// Capturar o botão de login e adicionar o ouvinte de evento
const loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        const resultMessageElement = document.getElementById("resultMessage");
        resultMessageElement.textContent = "Por favor, preencha ambos os campos.";
        resultMessageElement.classList.remove("show");
        return;
    }

    const loginResult = login(username, password);

    const resultMessageElement = document.getElementById("resultMessage");

    if (loginResult === "Login bem-sucedido!") {
        resultMessageElement.textContent = loginResult;
        resultMessageElement.classList.add("show");
        localStorage.setItem("loginPageShown", "true");
        setTimeout(() => {
            window.location.href = "home.html"; // Redirecionar para a página inicial
        }, 1000); // Opcional: esperar por 2 segundos antes de redirecionar
    } else {
        resultMessageElement.textContent = "Erro ao fazer login. Verifique suas credenciais.";
        resultMessageElement.classList.remove("show");
    }
});
