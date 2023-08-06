// Função para formatar mensagens de resposta
exports.formatError = (action, errorCode, errorDescription) => {
  let message = { 
    "action": action, 
    "params": { 
      "code": errorCode, 
      "msg": errorDescription 
    } 
  };
  return message;
};

exports.formatMessage = (action, actionDescription) => {
  let message = { 
    "action": action, 
    "params": { 
      "msg": actionDescription 
    } 
  };
  return message;
};


exports.validateMessage = (message) => {
  if (typeof message.action === 'undefined' || message.action.trim() === '') {
    return message = 'Campo "action" não encontrado ou vazio';
  }
  // Outras validações podem ser adicionadas
  return null; // Retorna nulo se a validação for bem-sucedida
};
