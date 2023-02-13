module.exports = {
  camposObrigatorios: (campos) => {
    let campoInvalido;

    campos.forEach((campo) => {
      for (const key in campo) {
        if (!campo[key]) return (campoInvalido = key);
      }
    });
    return campoInvalido;
  }
};
