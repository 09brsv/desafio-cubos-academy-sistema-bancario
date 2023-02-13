const format = require("date-fns/format");

const dados = require("../bancodedados");

const registrarTransacao = (valor, numero_conta) => {
  return {
    data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    numero_conta,
    valor,
  };
};

const localizaPorIndice = (numeroConta) =>
  dados.contas.findIndex(({ numero }) => numero === numeroConta);

const depositar = (req, res) => {
  const { numero_conta } = req.body;
  const valor = Number(req.body.valor);

  const registro = registrarTransacao(valor, numero_conta);

  const localizar = localizaPorIndice(numero_conta);

  dados.depositos.push(registro);
  dados.contas[localizar].saldo += valor;

  res.status(200).send();
};

const transferir = (req, res) => {
  const { numero_conta_origem, numero_conta_destino } = req.body;
  const valor = Number(req.body.valor);

  const { data } = registrarTransacao(valor, true);

  const indiceContaDestino = localizaPorIndice(numero_conta_destino);
  const indiceContaOrigem = localizaPorIndice(numero_conta_origem);

  const incrementarRegistroTransferencia = {
    data,
    numero_conta_origem,
    numero_conta_destino,
    valor,
  };

  dados.transferencias.push(incrementarRegistroTransferencia);
  dados.contas[indiceContaDestino].saldo += valor;
  dados.contas[indiceContaOrigem].saldo -= valor;

  res.status(200).send();
};

const sacar = (req, res) => {
  const { numero_conta } = req.body;
  const valor = Number(req.body.valor);

  const registro = registrarTransacao(valor, numero_conta);

  const localizar = localizaPorIndice(numero_conta);

  dados.saques.push(registro);
  dados.contas[localizar].saldo -= valor;

  res.status(200).send();
};

const emitirSaldo = (req, res) => {
  const { saldo } = dados.contas.find(
    ({ numero }) => numero === req.query.numero_conta
  );
  res.status(200).json({ saldo });
};

const emitirExtrato = (req, res) => {
  const { numero_conta } = req.query;
  const transacoes = ["depositos", "transferencias", "saques"];
  let extratoDaConta = {};

  for (const chave in dados) {
    if (transacoes.includes(chave)) {
      const filtro = dados[chave].filter(
        (conta) =>
          conta.numero_conta === numero_conta ||
          conta.numero_conta_origem === numero_conta ||
          conta.numero_conta_destino === numero_conta
      );

      if (filtro[0]) {
        extratoDaConta[chave] = filtro;
      }
    }
  }

  Object.keys(extratoDaConta)[0]
    ? res.status(200).json(extratoDaConta)
    : res.status(200).json({ mensagem: "Nenhuma operação feita" });
};

module.exports = {
  depositar,
  transferir,
  sacar,
  emitirSaldo,
  emitirExtrato,
};
