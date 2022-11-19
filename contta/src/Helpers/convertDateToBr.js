const convertDateToBr = (dateString) => {

  //Receive date on ISO format YYYY-MM-DD and convert to BR format DD/MM/AAAA

  const arr = dateString.replace(/-/g, '/').split('/')
  const converted = arr[2] + '/' + arr[1] + '/' + arr[0];
  return converted
}

export default convertDateToBr