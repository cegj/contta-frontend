const convertToFloat = (value) => {
  let float = +value / 100;
  return float.toLocaleString('pt-BR', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default convertToFloat