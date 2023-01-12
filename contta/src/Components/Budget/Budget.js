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
import convertToInteger from '../../Helpers/convertToInteger'
import ScrollContainer from 'react-indiana-drag-scroll'

const Budget = () => {

  const {setPageName} = React.useContext(AppContext)
  React.useEffect(() => {setPageName("Orçamento")}, [setPageName])

  const {getFirstDay, getLastDay} = useDate();
  const {request, fetchLoading} = useFetch()
  const {year, month, categories, setLoading, setMessage} = React.useContext(AppContext)
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

  const getBalances = React.useCallback(async(lastDay) => {
    try {
      const token = window.localStorage.getItem('token')
      const firstDay = getFirstDay(lastDay.split('-')[0], lastDay.split('-')[1])
      const {url, options} = GET_BALANCE_FOR_BUDGET(token, {from: firstDay, to: lastDay, typeofdate: 'transaction_date'})
      const {response, json, error} = await request(url, options)
      if (response.ok) return json.balances
      else throw new Error(error)
    } catch (error) {
      console.log(error)
      setMessage({content: `Erro ao obter orçamento: ${error.message}`, type: "e"})
      return false;
    } finally {
      setUpdateTransactions(false)
    }
  }, [getFirstDay, request, setMessage, setUpdateTransactions])

  const setPrevExecCatCells = React.useCallback((values, lastDay) => {
    const cells = Array.from(document.querySelectorAll(`td[data-last-day='${lastDay}']`))
    const prevCells = cells.filter(cell => cell.matches("td[data-cell-type='cat-prev']"))
    const execCells = cells.filter(cell => cell.matches("td[data-cell-type='cat-exec']"))
    prevCells.forEach((cell) => {
      if (cell.dataset.catId) { cell.innerText = convertToFloat(values.categories[cell.dataset.catId].expected) }
    })
    execCells.forEach((cell) => {
      if (cell.dataset.catId){ cell.innerText = convertToFloat(values.categories[cell.dataset.catId].made) }
    })
  }, [])

  const setPrevExecFinalCells = React.useCallback((values, lastDay) => {
    const cells = Array.from(document.querySelectorAll(`td[data-last-day='${lastDay}']`))
    const monthPrevCells = cells.filter(cell => cell.matches("td[data-cell-type='month-prev']"))
    const monthExecCells = cells.filter(cell => cell.matches("td[data-cell-type='month-exec']"))
    const generalPrevCells = cells.filter(cell => cell.matches("td[data-cell-type='accumulated-prev']"))
    const generalExecCells = cells.filter(cell => cell.matches("td[data-cell-type='accumulated-exec']"))
    console.log(values)
    monthPrevCells.forEach(cell => cell.innerText = convertToFloat(values.all_month.expected))
    monthExecCells.forEach(cell => cell.innerText = convertToFloat(values.all_month.made))
    generalPrevCells.forEach(cell => cell.innerText = convertToFloat(values.all_accumulated.expected))
    generalExecCells.forEach(cell => cell.innerText = convertToFloat(values.all_accumulated.made))
  }, [])

  const setPrevExecGroupCells = React.useCallback((values, lastDay) => {
    const cells = Array.from(document.querySelectorAll(`td[data-last-day='${lastDay}']`))
    const prevCells = cells.filter(cell => cell.matches("td[data-cell-type='group-prev']"))
    const execCells = cells.filter(cell => cell.matches("td[data-cell-type='group-exec']"))

    categories.forEach((group) => {
      const catPrevCellsOfGroup = cells.filter(cell => cell.matches(`td[data-cell-type='cat-prev'][data-group-id='${group.id}']`))
      let prevResult = 0;
      let execResult = 0;
      catPrevCellsOfGroup.forEach((catPrevCell) => {
        const value = values.categories[+catPrevCell.dataset.catId]
        prevResult += value.expected
        execResult += value.made
      })
      const prevCellGroupResult = prevCells.find((cell) => +cell.dataset.groupId === group.id)
      prevCellGroupResult.innerText = convertToFloat(prevResult)
      const execCellGroupResult = execCells.find((cell) => +cell.dataset.groupId === group.id)
      execCellGroupResult.innerText = convertToFloat(execResult)
    }) 
  }, [categories])

  const setResultCells = React.useCallback(() => {
    categories.forEach((group) => {
      const prevValue = +convertToInteger(document.querySelector(`td[data-is-selected='true'][data-group-id='${group.id}'][data-cell-type='group-prev']`).innerText)
      const execValue = +convertToInteger(document.querySelector(`td[data-is-selected='true'][data-group-id='${group.id}'][data-cell-type='group-exec']`).innerText)
      const resultCell = document.querySelector(`td[data-group-id='${group.id}'][data-cell-type='group-result']`)
      const result = prevValue - execValue;
      resultCell.innerText = convertToFloat(result)
    
      group.categories.forEach((cat) => {
        const prevValue = +convertToInteger(document.querySelector(`td[data-is-selected='true'][data-cat-id='${cat.id}'][data-cell-type='cat-prev']`).innerText)
        const execValue = +convertToInteger(document.querySelector(`td[data-is-selected='true'][data-cat-id='${cat.id}'][data-cell-type='cat-exec']`).innerText)
        const resultCell = document.querySelector(`td[data-cat-id='${cat.id}'][data-cell-type='cat-result']`)
        const result = prevValue - execValue;
        resultCell.innerText = convertToFloat(result)
      })
    })

    const monthPrevValue = +convertToInteger(document.querySelector(`td[data-is-selected='true'][data-cell-type='month-prev']`).innerText)
    const monthExecValue = +convertToInteger(document.querySelector(`td[data-is-selected='true'][data-cell-type='month-exec']`).innerText)
    const monthResultCell = document.querySelector(`td[data-cell-type='month-result']`)
    const monthResult = monthPrevValue - monthExecValue;
    monthResultCell.innerText = convertToFloat(monthResult)
    const accumulatedPrevValue = +convertToInteger(document.querySelector(`td[data-is-selected='true'][data-cell-type='accumulated-prev']`).innerText)
    const accumulatedExecValue = +convertToInteger(document.querySelector(`td[data-is-selected='true'][data-cell-type='accumulated-exec']`).innerText)
    const accumulatedResultCell = document.querySelector(`td[data-cell-type='accumulated-result']`)
    const accumulatedResult = accumulatedPrevValue - accumulatedExecValue;
    accumulatedResultCell.innerText = convertToFloat(accumulatedResult)

  }, [categories])

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
    async function getAndSet(){
      const promises = lastDays.map(async(lastDay) => {
        const balanceValues = await getBalances(lastDay)
        setPrevExecCatCells(balanceValues, lastDay)
        setPrevExecGroupCells(balanceValues, lastDay)
        setPrevExecFinalCells(balanceValues, lastDay)
      })

      await Promise.all(promises)
      setResultCells()
    }
    getAndSet();
    //eslint-disable-next-line
  }, [year])

  React.useEffect(() => {
    async function getAndSet(){
      const promises = lastDays.map(async(lastDay) => {
        const balanceValues = await getBalances(lastDay)
        setPrevExecCatCells(balanceValues, lastDay)
        setPrevExecGroupCells(balanceValues, lastDay)
        setPrevExecFinalCells(balanceValues, lastDay)
      })

      await Promise.all(promises)
      setResultCells()
    }
    if (updateTransactions) getAndSet();
    //eslint-disable-next-line
  }, [updateTransactions])

  React.useEffect(() => {
    setResultCells();
  }, [month, setResultCells])

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
              <td data-cell-type="group-title" data-cell-line="group-line" data-sticky="left-1">{group.name}</td>
              <td data-cell-line="group-line" data-group-id={group.id} data-cell-type='group-result'>...</td>
              {lastDays.map((lastDay, i) => {
                return (
                  <React.Fragment key={i}>
                    <td data-cell-type='group-prev' data-cell-line="group-line" data-last-day={lastDay} data-is-selected={lastDay === getLastDay(year, month) ? "true" : "false"} data-group-id={group.id} >...</td> 
                    <td data-cell-type='group-exec' data-cell-line="group-line" data-last-day={lastDay} data-is-selected={lastDay === getLastDay(year, month) ? "true" : "false"} data-group-id={group.id} >...</td>
                  </React.Fragment>
                )})}
            </tr>
            {group.categories.map((cat) => {
              return (
              <tr key={cat.id}>
                <td data-cell-type="category-title" data-sticky="left-1">{cat.name}</td>
                <td data-cat-id={cat.id} data-cell-type='cat-result'>0,00</td>
                {lastDays.map((lastDay, i) => {
                  return (
                    <React.Fragment key={i}>
                      <td data-cell-type='cat-prev' data-last-day={lastDay} data-is-selected={lastDay === getLastDay(year, month) ? "true" : "false"} data-cat-id={cat.id} data-group-id={group.id} onDoubleClick={handleClickOnCell}>...</td> 
                      <td data-cell-type='cat-exec' data-last-day={lastDay} data-is-selected={lastDay === getLastDay(year, month) ? "true" : "false"} data-cat-id={cat.id} data-group-id={group.id} onDoubleClick={handleClickOnCell}>...</td>
                    </React.Fragment>
                  )})}
              </tr>
              )
            })}
          </React.Fragment>
        )})}
      <tr>
        <th data-cell-type="result-title" data-sticky="left-1">Result. mês</th>
        <td data-cell-type="month-result">R$ 0,00</td>
        {lastDays.map((lastDay, i) => {
          return (
            <React.Fragment key={i}>
              <td data-cell-type='month-prev' data-last-day={lastDay} data-is-selected={lastDay === getLastDay(year, month) ? "true" : "false"}>...</td> 
              <td data-cell-type='month-exec' data-last-day={lastDay} data-is-selected={lastDay === getLastDay(year, month) ? "true" : "false"}>...</td>
            </React.Fragment>
        )})}
      </tr>
      <tr>
        <th data-cell-type="result-title" data-sticky="left-1">Result. acum.</th>
        <td data-cell-type="accumulated-result">R$ 0,00</td>
        {lastDays.map((lastDay, i) => {
          return (
            <React.Fragment key={i}>
              <td data-cell-type='accumulated-prev' data-last-day={lastDay} data-is-selected={lastDay === getLastDay(year, month) ? "true" : "false"}>...</td> 
              <td data-cell-type='accumulated-exec' data-last-day={lastDay} data-is-selected={lastDay === getLastDay(year, month) ? "true" : "false"}>...</td>
            </React.Fragment>
        )})}
      </tr>
    </thead>
</table>

  return (
    <>
      <Header />
      <ScrollContainer className={styles.tableContainer}>
        {elementsToRender}
      </ScrollContainer>
      {transactionsModalIsOpen && <TransactionsOnBudget catId={selectedCatId} month={selectedMonth} includeExpected={includeExpectedOnTransactionsModal} isOpen={transactionsModalIsOpen} setIsOpen={setTransactionsModalIsOpen}/>}
    </>
  )
}

export default Budget