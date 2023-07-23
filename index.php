<?php
/**
 * Endereço da API: https://api.npoint.io/c442d6ba06c605014033/
 * 
 * Alteração do JSON: https://www.npoint.io/docs/c442d6ba06c605014033
 */
$jsonData = '{
  "Refeições": [
    {
      "identificador": "001",
      "categoria": "Prato",
      "nome": "Alaminuta",
      "descritivo": "Alaminuta é um prato típico do sul do Brasil, composto por carne (normalmente filé mignon) grelhada, acompanhada de arroz, feijão, fritas e ovo frito.",
      "valor": 24.90,
      "imagem": "alaminuta.jpg"
    },
    {
      "identificador": "002",
      "categoria": "Prato",
      "nome": "Macarronada",
      "descritivo": "Macarronada é um prato clássico da culinária italiana, feito com massa de macarrão e molho de tomate caseiro, geralmente acompanhado de queijo ralado.",
      "valor": 19.99,
      "imagem": "macarronada.jpg"
    },
    {
      "identificador": "003",
      "categoria": "Prato ",
      "nome": "Strogonoff",
      "descritivo": "Strogonoff é um prato de origem russa, feito com tiras de carne (geralmente carne bovina) cozidas em um molho cremoso de creme de leite e mostarda, acompanhado de arroz branco e batata palha.",
      "valor": 28.50,
      "imagem": "strogonoff.png"
    }
  ],

   "Bebidas": [
    {
      "identificador": "004",
      "categoria": "Refrigerante",
      "nome": "Coca-Cola 600 ml",
      "descritivo": "Refrigerante de cola, com sabor único e refrescante.",
      "valor": 5.50,
      "imagem": "coca600.jpg"
    },
    {
      "identificador": "005",
      "categoria": "Água",
      "nome": "Água Mineral",
      "descritivo": "Água mineral natural, sem gás.",
      "valor": 2.00,
      "imagem": "agua500.jpg"
    },
    {
      "identificador": "006",
      "categoria": "Suco",
      "nome": "Suco de Laranja",
      "descritivo": "Suco natural de laranja, sem adição de açúcar.",
      "valor": 4.50,
      "imagem": "sucoLaranja.jpg"
    }
  ],

  "Sobremesas": [
    {
      "identificador": "007",
      "categoria": "Sobremesa",
      "nome": "Pudim",
      "descritivo": "Delicioso pudim de leite condensado com calda de caramelo.",
      "valor": 6.50,
      "imagem": "pudim.jpg"
    },
    {
      "identificador": "008",
      "categoria": "Sobremesa",
      "nome": "Mousse de Chocolate",
      "descritivo": "Mousse de chocolate cremoso e aerado, decorado com raspas de chocolate.",
      "valor": 7.00,
      "imagem": "mousse_chocolate.jpg"
    },
    {
      "identificador": "009",
      "categoria": "Sobremesa",
      "nome": "Mousse de Maracujá",
      "descritivo": "Mousse refrescante de maracujá com sabor tropical.",
      "valor": 5.50,
      "imagem": "mousse_maracuja.jpg"
    }
  ]
}';
header("Access-Control-Allow-Origin: *"); // Permite acesso de todas as origens (remova ou ajuste o * conforme necessário)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos HTTP permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Cabeçalhos permitidos

// Configurar cabeçalhos HTTP
header('Content-Type: application/json');

// Enviar resposta JSON
echo $jsonData;
?>