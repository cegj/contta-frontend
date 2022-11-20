const convertToInteger = (value) => {
  const integer = value.replace(/\./g, '').replace(',', '')  
  return integer
}

export default convertToInteger