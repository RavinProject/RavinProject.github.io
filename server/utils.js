// Função para formatar mensagens de resposta
exports.formatError = (action, errorCode, errorDescription) => {
  let mensagem = { 
    "action": action, 
    "params": { 
      "code": errorCode, 
      "msg": errorDescription 
    } 
  };
  return JSON.stringify(mensagem);
};

exports.formatMessage = (action, actionDescription) => {
  let mensagem = { 
    "action": action, 
    "params": { 
      "msg": actionDescription 
    } 
  };
  return JSON.stringify(mensagem);
};


exports.validateMessage = (message) => {
  if (typeof message.action === 'undefined' || message.action.trim() === '') {
    return 'Campo "action" não encontrado ou vazio';
  }
  // Outras validações podem ser adicionadas
  return null; // Retorna nulo se a validação for bem-sucedida
};
