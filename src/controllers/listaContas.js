const { v4: uuidv4 } = require("uuid");

const { contas } = require("../bancodedados");


const localizarConta = (id) =>
  contas.findIndex(({ numero }) => numero === id);

const listar = (req, res) => res.status(200).json(contas);

const criar =  (req, res) => {

    const novaConta = {
      numero: uuidv4(),
      saldo: 0,
      usuario: { ...req.body },
    };

    contas.push(novaConta);

    return res.status(201).send();
};

const atualizar = (req, res) => {
 
    const conta = localizarConta(req.params.numeroConta);

    contas[conta].usuario = req.body;

    return res.status(204).send();
};

const deletar = (req, res) => {
 
    const conta = localizarConta(req.params.numeroConta);

    contas.splice(conta, 1);

    return res.status(204).send();
};

module.exports = {
  listar,
  criar,
  atualizar,
  deletar,
};
