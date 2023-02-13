const { contas } = require("../bancodedados");
const { camposObrigatorios } = require("../utils/camposObrigatorios");

const localizaPorNumero = (numeroConta) =>
  contas.find(({ numero }) => numero === numeroConta);

const verificarListaContas = (req, res, next) => {
  contas[0]
    ? next()
    : res.status(404).json({ mensagem: "Não existe nenhuma conta" });
};

const verificarNovaConta = (req, res, next) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const campos = [{ nome, cpf, data_nascimento, telefone, email, senha }];

  const verificaCampos = camposObrigatorios(campos);
  if (verificaCampos)
    return res.status(400).json({
      mensagem: `É obrigatório preencher o campo ${verificaCampos} para criar uma conta`,
    });

  if (contas[0]) {
    const contaExiste = contas.find(
      ({ usuario }) => usuario.cpf === cpf || usuario.email === email
    );

    if (contaExiste) {
      return res.status(400).json({
        mensagem: "Já existe uma conta com o cpf ou e-mail informado!",
      });
    }
  }
  next();
};

const validarNumeroDaConta = (req, res, next) => {
  const localizarConta = localizaPorNumero(
    req.params.numeroConta || req.query.numero_conta || req.body.numero_conta
  );

  localizarConta
    ? next()
    : res.status(404).json({ mensagem: "O número da conta é inválido" });
};

const validarNumeroDasContasTransferiveis = (req, res, next) => {
  const { numero_conta_origem, numero_conta_destino } = req.body;

  let contaInvalida;

  const localizarContaOrigem = localizaPorNumero(numero_conta_origem);
  const localizarContaDestino = localizaPorNumero(numero_conta_destino);

  if (localizarContaOrigem && localizarContaDestino) return next();
  else if (!localizarContaOrigem && !localizarContaDestino)
    contaInvalida = "conta de origem e da conta de destino são inválidos";
  else if (!localizarContaOrigem) contaInvalida = "conta de origem é inválido";
  else {
    contaInvalida = "conta de destino é inválido";
  }
  res.status(404).json({ mensagem: `O número da ${contaInvalida}` });
};

const validarExclusaoConta = (req, res, next) => {
  const { saldo } = localizaPorNumero(req.params.numeroConta);
  saldo
    ? res.status(400).json({
        mensagem: "A conta só pode ser removida se o saldo for zero!",
      })
    : next();
};
module.exports = {
  verificarListaContas,
  verificarNovaConta,
  validarNumeroDaConta,
  validarNumeroDasContasTransferiveis,
  validarExclusaoConta,
};
