const dados = require("../bancodedados");
const { camposObrigatorios } = require("../utils/camposObrigatorios");


const verificarValorNegativo = (req, res, next) => {
  Number(req.body.valor) > 0
    ? next()
    : res.status(400).json({ mensagem: "O valor não pode ser menor ou zero!" });
};

const temSaldoSuficiente = (numeroDaConta, valor) => {

  const temSaldo = dados.contas.find(
    ({ numero }) => numero === numeroDaConta
  );

  if (temSaldo.saldo >= Number(valor)) return true;
};

const deposito = (req, res, next) => {
  const { numero_conta, valor} = req.body;
  const campos = [
    {
      numero_conta,
      valor,
    },
  ];
  const campoNaoPreenchido = camposObrigatorios(campos);

  if (campoNaoPreenchido) {
    return res.status(400).json({
      mensagem: `É obrigatório preencher o campo ${campoNaoPreenchido} para fazer um depósito`,
    });
  }
  next();
};

const transferencia = (req, res, next) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
  const campos = [
    {
      numero_conta_origem,
      numero_conta_destino,
      valor,
      senha,
    },
  ];
  const campoNaoPreenchido = camposObrigatorios(campos);

  if (numero_conta_origem === numero_conta_destino) {
    return res.status(400).json({mensagem : "Não é possível transferir para a conta de origem"})
  }
  
  if (campoNaoPreenchido) {
    return res.status(400).json({
      mensagem: `É obrigatório preencher o campo ${campoNaoPreenchido} para fazer uma transferência`,
    });
  }

  if (!(temSaldoSuficiente(numero_conta_origem, valor))) {
    return res.status(400).json({ mensagem: "Saldo insuficiente" });
  }
  next();
};

const saque = (req, res, next) => {
  const { valor, numero_conta, senha } = req.body;

  const campos = [
    {
      numero_conta,
      valor,
      senha
    },
  ];
  const campoNaoPreenchido = camposObrigatorios(campos);

  if (campoNaoPreenchido) {
    return res.status(400).json({
      mensagem: `É obrigatório preencher o campo ${campoNaoPreenchido} para sacar`,
    });
  }

  if (!(temSaldoSuficiente(numero_conta, valor))) {
    return res.status(400).json({ mensagem: "Saldo insuficiente" });
  }
  next();
};

const consulta = (req, res, next) => {
  const { numero_conta, senha } = req.query;

  const campos = [
    {
      numero_conta, senha
    },
  ];
  const campoNaoPreenchido = camposObrigatorios(campos);

  if (campoNaoPreenchido) {
    return res.status(400).json({
      mensagem: `É obrigatório preencher o campo ${campoNaoPreenchido} para concluir a consulta`,
    });
  }
  next();
}

module.exports = {
  verificarValorNegativo,
  deposito,
  transferencia,
  saque,
  consulta
};