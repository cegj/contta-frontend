import React from 'react'
import { GET_BALANCE_FOR_BUDGET } from '../../api'
import AppContext from '../../Contexts/AppContext'
import useFetch from '../../Hooks/useFetch'
import Header from '../Header'
import styles from './Budget.module.css'
import useDate from '../../Hooks/useDate'
import convertToFloat from '../../Helpers/convertToFloat'
import TransactionsOnBudget from './TransactionsOnBudget'
import ReactTooltip from 'react-tooltip'
import TransactionsContext from '../../Contexts/TransactionsContext'

const Budget = () => {

  const {setPageName} = React.useContext(AppContext)
  React.useEffect(() => {setPageName("Orçamento")}, [setPageName])

  const {getFirstDay, getLastDay} = useDate();
  const {request, fetchLoading} = useFetch()
  const {year, month, categories, setLoading} = React.useContext(AppContext)
  const [transactionsModalIsOpen, setTransactionsModalIsOpen] = React.useState(false)
  const [selectedCatId, setSelectedCatId] = React.useState(null)
  const [selectedMonth, setSelectedMonth] = React.useState(null)
  const [includeExpectedOnTransactionsModal, setIncludeExpectedOnTransactionsModal] = React.useState(null)
  const {updateTransactions, setUpdateTransactions} = React.useContext(TransactionsContext)

  React.useEffect(() => {
    setLoading(fetchLoading)
  }, [fetchLoading, setLoading])

  React.useEffect(() => {
    ReactTooltip.rebuild()
    if(!transactionsModalIsOpen) {ReactTooltip.hide()}
  }, [transactionsModalIsOpen])

  const lastDays = React.useMemo(() => {
    const arr = []
    for (let i = 1; i <= 12; i++){
      arr.push(getLastDay(year, i))
    }
    return arr
  }, [year, getLastDay])

  const getBudget = React.useCallback(async(lastDay) => {
    const token = window.localStorage.getItem('token')
    const firstDay = getFirstDay(lastDay.split('-')[0], lastDay.split('-')[1])
    const {url, options} = GET_BALANCE_FOR_BUDGET(token, {from: firstDay, to: lastDay, typeofdate: 'transaction_date'})
    const {json} = await request(url, options)
    setUpdateTransactions(false)
    
    const cells = Array.from(document.querySelectorAll(`td[data-last-day='${lastDay}']`))
    const prevCells = cells.filter(cell => cell.matches("td[data-cell-type='cat-prev']"))
    const execCells = cells.filter(cell => cell.matches("td[data-cell-type='cat-exec']"))

    prevCells.forEach((cell) => {
      if (cell.dataset.catId) { cell.innerText = convertToFloat(json.balances.categories[cell.dataset.catId].expected) }
      else { cell.innerText = convertToFloat(json.balances.all_month.expected) }
    })

    execCells.forEach((cell) => {
      if (cell.dataset.catId){ cell.innerText = convertToFloat(json.balances.categories[cell.dataset.catId].made) }
      else { cell.innerText = convertToFloat(json.balances.all_month.made) }
    })
      // eslint-disable-next-line
  }, [request])

  function handleClickOnCell({target}){
    const month = target.dataset.lastDay.split('-')[1]
    const {catId} = target.dataset;
    if (target.dataset.cellType === 'cat-exec') setIncludeExpectedOnTransactionsModal('false')
    else setIncludeExpectedOnTransactionsModal('true')
    setSelectedCatId(catId)
    setSelectedMonth(month)
    setTransactionsModalIsOpen(true)
  }

  React.useEffect(() => {
      lastDays.forEach((lastDay) => {
        if (setUpdateTransactions) getBudget(lastDay)
      // eslint-disable-next-line
    })}, [getBudget, year, updateTransactions])

  const elementsToRender = 
  <table id="budget-table" className={styles.table}>
    <thead>
      <tr>
        <th rowSpan="2" data-cell-type="category-title" data-sticky="left-1">Categoria</th>
        <th rowSpan="2">Resultado</th>
        <th data-type='month-title' colSpan='2'>jan</th>
        <th data-type='month-title' colSpan='2'>fev</th>
        <th data-type='month-title' colSpan='2'>mar</th>
        <th data-type='month-title' colSpan='2'>abr</th>
        <th data-type='month-title' colSpan='2'>mai</th>
        <th data-type='month-title' colSpan='2'>jun</th>
        <th data-type='month-title' colSpan='2'>jul</th>
        <th data-type='month-title' colSpan='2'>ago</th>
        <th data-type='month-title' colSpan='2'>set</th>
        <th data-type='month-title' colSpan='2'>out</th>
        <th data-type='month-title' colSpan='2'>nov</th>
        <th data-type='month-title' colSpan='2'>dez</th>
      </tr>
      <tr>
        <th>Prev.</th><th>Exec.</th>
        <th>Prev.</th><th>Exec.</th>
        <th>Prev.</th><th>Exec.</th>
        <th>Prev.</th><th>Exec.</th>
        <th>Prev.</th><th>Exec.</th>
        <th>Prev.</th><th>Exec.</th>
        <th>Prev.</th><th>Exec.</th>
        <th>Prev.</th><th>Exec.</th>
        <th>Prev.</th><th>Exec.</th>
        <th>Prev.</th><th>Exec.</th>
        <th>Prev.</th><th>Exec.</th>
        <th>Prev.</th><th>Exec.</th>
      </tr>
      {categories.map((group, i) => {
        return (
          <React.Fragment key={i}>
            <tr key={group.id}>
              <td data-cell-type="group-title" data-sticky="left-1">{group.name}</td>
              <td>R$ 0,00</td>
            </tr>
            {group.categories.map((cat) => {
              return (
              <tr key={cat.id}>
                <td data-cell-type="category-title" data-sticky="left-1">{cat.name}</td>
                <td>0,00</td>
                {lastDays.map((lastDay, i) => {
                  return (
                    <React.Fragment key={i}>
                      <td data-cell-type='cat-prev' data-last-day={lastDay} data-is-selected={lastDay === getLastDay(year, month) ? "true" : "false"} data-cat-id={cat.id} onDoubleClick={handleClickOnCell}>...</td> 
                      <td data-cell-type='cat-exec' data-last-day={lastDay} data-is-selected={lastDay === getLastDay(year, month) ? "true" : "false"} data-cat-id={cat.id} onDoubleClick={handleClickOnCell}>...</td>
                    </React.Fragment>
                  )})}
              </tr>
              )
            })}
          </React.Fragment>
        )})}
      <tr>
        <th data-cell-type="result-title" data-sticky="left-1">Result. mês</th>
        <td>R$ 0,00</td>
        {lastDays.map((lastDay, i) => {
          return (
            <React.Fragment key={i}>
              <td data-cell-type='cat-prev' data-last-day={lastDay} data-is-selected={lastDay === getLastDay(year, month) ? "true" : "false"}>...</td> 
              <td data-cell-type='cat-exec' data-last-day={lastDay} data-is-selected={lastDay === getLastDay(year, month) ? "true" : "false"}>...</td>
            </React.Fragment>
        )})}
      </tr>
      <tr>
        <th data-cell-type="result-title" data-sticky="left-1">Result. acum.</th>
        <td>R$ 0,00</td>
        {lastDays.map((lastDay, i) => {
          return (
            <React.Fragment key={i}>
              <td data-cell-type='cat-prev' data-last-day={lastDay} data-is-selected={lastDay === getLastDay(year, month) ? "true" : "false"}>...</td> 
              <td data-cell-type='cat-exec' data-last-day={lastDay} data-is-selected={lastDay === getLastDay(year, month) ? "true" : "false"}>...</td>
            </React.Fragment>
        )})}
      </tr>
    </thead>
</table>

  return (
    <>
      <Header />
      <div className={styles.tableContainer}>
        {elementsToRender}
      </div>
      {transactionsModalIsOpen && <TransactionsOnBudget catId={selectedCatId} month={selectedMonth} includeExpected={includeExpectedOnTransactionsModal} isOpen={transactionsModalIsOpen} setIsOpen={setTransactionsModalIsOpen}/>}
    </>
  )
}

export default Budget