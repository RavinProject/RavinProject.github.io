# Protótipo de Menu Digital -  Branch Websocket

Nesta versão do código, criamos uma funcionalidade websocket para implementar algumas funções.

## Propósito

A interface de usuário é projetada para ser fácil de usar em tablets, tornando-a ideal para ser usada como um menu digital em restaurantes ou cafés.

## Especificações do desafio

1. Definir os tipos de **Itens** a serem criados
    1. Definir Categorias de Itens
    2. Campos necessários dos **Itens**:
        1. Identificador
        2. Categoria
        3. Nome
        4. Descritivo (tipo o que vai no prato e tals)
        5. Valor e imagem do produto
    3. Os itens todos estarão em um arquivo `JSON`, que será chamado pelo nosso script principal.
2. Deve ter um menu para seleção da categoria, na lateral esquerda da tela
3. Uma barra superior com o número da mesa, e com o valor gasto até o momento e o status do último pedido
4. No meio da tela, deve haver o espaço onde terá os itens e suas informações
5. Ao clicar no item, irá exibir um modal pra adicionar a quantidade e vai ter um botão pra oficializar o pedido
6. Criar um função para consultar via requisição os itens do menu da aplicação
7. Criar um forma de exibir os itens que são oriundos da requisição em tela, sendo possível interagir e depois realizar os pedidos
8. Criar método para realizar o pedido, aguardando ainda a implementação do *Websocket* das próximas aulas
9. Realizar uma forma de salvar o último pedido feito pelo cliente (localStorage)
10. Criar uma forma de salvar todo o histórico de pedidos feitos pelo cliente (localStorage)
