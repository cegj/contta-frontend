const convertToInteger = (value) => {
  const float = parseFloat(value.replace(/\./g, '').replace(',', '.'))
  const integer = float * 100;
  return integer
}

export default convertToInteger