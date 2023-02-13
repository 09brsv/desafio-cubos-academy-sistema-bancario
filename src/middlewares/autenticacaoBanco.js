const dados = require("../bancodedados");

const autenticarBanco = (req, res, next) => {
  
  dados.banco.senha === req.query.senha_banco
  ? next()
  : res.status(401).json({
    "mensagem": "A senha do banco informada é inválida!"
})
}

const autenticarConta = (req, res, next) => {
  let conta;
  let senha;
  
  if (Object.keys(req.body)[0]) {
    const { numero_conta, numero_conta_origem } = req.body;
    numero_conta ? conta = numero_conta : conta = numero_conta_origem
    senha = req.body.senha
  }
  if(Object.keys(req.query)[0]){
    conta = req.query.numero_conta
    senha = req.query.senha
  }
  const validarParametros = dados.contas.find(({ numero }) => numero === conta)
  
  validarParametros.usuario.senha === senha
  ? next()
  : res.status(401).json({mensagem: "A senha ou o número da conta informada não existe"})
}

module.exports = { autenticarBanco, autenticarConta }