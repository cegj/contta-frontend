const convertDateToBr = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString().split(" ")[0]
}

export default convertDateToBr