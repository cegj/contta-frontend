const useDate = () => {

  function getFirstDay(year, month){
    let first = new Date(year, +month-1, 1)
    first = first.toISOString().split('T')[0]
    return first;
  }

  function getLastDay(year, month){
    let last = new Date(year, month, 0)
    last = last.toISOString().split('T')[0]
    return last;
  }

  return {getFirstDay, getLastDay}
}

export default useDate