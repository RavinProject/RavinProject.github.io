// Função para formatar mensagens de resposta
exports.formatMessage = (action, data) => {
  let mensagem;
  switch (action) {
      case 'erro':
      case 'loginAnswer':
          // Formatação básica para mensagens de erro ou resposta de login
          mensagem = { "action": action, "params": { "msg": data } };
          break;
      // Outros casos podem ser adicionados
  }
  return JSON.stringify(mensagem);
};

exports.validateMessage = (data) => {
  if (typeof data.action === 'undefined' || data.action.trim() === '') {
    return 'Campo "action" não encontrado ou vazio';
  }
  // Outras validações podem ser adicionadas
  return null; // Retorna nulo se a validação for bem-sucedida
};
