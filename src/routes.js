const { Router } = require('express')
const listaContas = require('./controllers/listaContas');
const transacoes = require('./controllers/transacoes');

const { autenticarBanco, autenticarConta } = require('./middlewares/autenticacaoBanco');
const { verificarNovaConta, validarNumeroDaConta, validarExclusaoConta, verificarListaContas, validarNumeroDasContasTransferiveis } = require('./middlewares/validarConta');
const { deposito, saque, verificarValorNegativo, transferencia, consulta } = require('./middlewares/validarTransacoes');

const rotas = Router()

rotas.get('/contas',autenticarBanco, verificarListaContas, listaContas.listar)
rotas.get('/contas/saldo', validarNumeroDaConta, autenticarConta, consulta, transacoes.emitirSaldo)
rotas.get('/contas/extrato', validarNumeroDaConta, autenticarConta, consulta, transacoes.emitirExtrato)

rotas.post('/contas', verificarNovaConta, listaContas.criar)
rotas.post('/transacoes/depositar',verificarValorNegativo, validarNumeroDaConta, deposito, transacoes.depositar)
rotas.post('/transacoes/transferir', verificarValorNegativo, validarNumeroDasContasTransferiveis, autenticarConta, transferencia, transacoes.transferir )
rotas.post('/transacoes/sacar',verificarValorNegativo, validarNumeroDaConta, autenticarConta, saque, transacoes.sacar)

rotas.put('/contas/:numeroConta/usuario', verificarNovaConta, validarNumeroDaConta, listaContas.atualizar)

rotas.delete('/contas/:numeroConta', validarNumeroDaConta, validarExclusaoConta, listaContas.deletar)

module.exports = rotas