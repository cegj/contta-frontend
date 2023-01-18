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

  const {setPageName, setPageSubName} = React.useContext(AppContext)
  React.useEffect(() => {setPageName("Orçamento"); setPageSubName(null)}, [setPageName, setPageSubName])

  const {getFirstDay, getLastDay} = useDate();
  const {request, fetchLoading} = useFetch()
  const {year, month, categories, setLoading, setMessage, hideUnsellectedMonthsOnBudget} = React.useContext(AppContext)
  const [transactionsModalIsOpen, setTransactionsModalIsOpen] = React.useState(false)
  const [selectedCatId, setSelectedCatId] = React.useState(null)
  const [selectedMonth, setSelectedMonth] = React.useState(null)
  const [includeExpectedOnTransactionsModal, setIncludeExpectedOnTransactionsModal] = React.useState(null)
  const {updateTransactions, setUpdateTransactions} = React.useContext(TransactionsContext)
  const tableContainer = React.useRef(null)

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
      if (cell.dataset.catId) {
        const expectedValue = values.categories[cell.dataset.catId].expected
        cell.innerText = convertToFloat(expectedValue)
        if (expectedValue === 0) {cell.classList.add("zero")}
        else cell.classList.remove("zero")
      }
    })
    execCells.forEach((cell) => {
      if (cell.dataset.catId){
        const madeValue = values.categories[cell.dataset.catId].made
        cell.innerText = convertToFloat(madeValue)
        if (madeValue === 0) {cell.classList.add("zero")}
        else cell.classList.remove("zero")
      }
    })
  }, [])

  const setPrevExecFinalCells = React.useCallback((values, lastDay) => {
    const cells = Array.from(document.querySelectorAll(`td[data-last-day='${lastDay}']`))
    const monthPrevCells = cells.filter(cell => cell.matches("td[data-cell-type='month-prev']"))
    const monthExecCells = cells.filter(cell => cell.matches("td[data-cell-type='month-exec']"))
    const accumulatedPrevCells = cells.filter(cell => cell.matches("td[data-cell-type='accumulated-prev']"))
    const accumulatedExecCells = cells.filter(cell => cell.matches("td[data-cell-type='accumulated-exec']"))
    monthPrevCells.forEach(cell => cell.innerText = convertToFloat(values.all_month.expected))
    monthExecCells.forEach(cell => cell.innerText = convertToFloat(values.all_month.made))
    accumulatedPrevCells.forEach(cell => cell.innerText = convertToFloat(values.all_accumulated.expected))
    accumulatedExecCells.forEach(cell => cell.innerText = convertToFloat(values.all_accumulated.made))
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

  function hideUnsellected(){
    const cellTypesToHide = ['month-title', 'cat-prev', 'cat-exec', 'group-prev', 'group-exec', 'month-prev', 'month-exec', 'accumulated-prev', 'accumulated-exec']
    cellTypesToHide.forEach((cellType) => {
      const cells = Array.from(document.querySelectorAll(`td[data-cell-type='${cellType}'], th[data-cell-type='${cellType}']`))
      cells.forEach((cell) => {
        if (cell.dataset.isSelected === "false"){
          cell.style.display = "none"; 
        }
      })  
    })

    // eslint-disable-next-line
    const prevExecTitles = ['prev-title', 'exec-title'].forEach((title) => {
      const cells = document.querySelectorAll(`th[data-cell-type='${title}']`)
      cells.forEach((cell, i) => {
      if (i > 0) {cell.style.display = "none"}
      })
    })
  }

  function showUnsellected(){
    const cellTypesToHide = ['month-title', 'cat-prev', 'cat-exec', 'group-prev', 'group-exec', 'month-prev', 'month-exec', 'accumulated-prev', 'accumulated-exec']
    cellTypesToHide.forEach((cellType) => {
      const cells = Array.from(document.querySelectorAll(`td[data-cell-type='${cellType}'], th[data-cell-type='${cellType}']`))
      cells.forEach((cell) => {
        if (cell.dataset.isSelected === "false"){
          cell.style.display = "table-cell"; 
        }
      })  
    })

    // eslint-disable-next-line 
    const prevExecTitles = ['prev-title', 'exec-title'].forEach((title) => {
      const cells = document.querySelectorAll(`th[data-cell-type='${title}']`)
      cells.forEach((cell, i) => {
      if (i > 0) {cell.style.display = "table-cell"}
      })
    })
  }

  function setSelectedMonthAsFirst(){
      const referenceTd = document.querySelector('[data-is-selected="true"]');
      const referenceStickyLeft1 = document.querySelector('[data-sticky="left-1"]')
      const referenceStickyLeft2 = document.querySelector('[data-sticky="left-2"]')
      const stickyColumnsWidth = referenceStickyLeft1.offsetWidth + referenceStickyLeft2.offsetWidth + 1
      tableContainer.current.scrollTo({left: referenceTd.offsetLeft - stickyColumnsWidth})
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
      setSelectedMonthAsFirst()
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
      setSelectedMonthAsFirst()
    }
    if (updateTransactions) getAndSet();
    //eslint-disable-next-line
  }, [updateTransactions])

  React.useEffect(() => {
    setResultCells();
    setSelectedMonthAsFirst()
  }, [month, setResultCells])

  React.useEffect(() => {
    if (hideUnsellectedMonthsOnBudget) hideUnsellected()
    else showUnsellected()
  }, [hideUnsellectedMonthsOnBudget])

  const elementsToRender = 
  <table id="budget-table" className={styles.table}>
    <thead>
      <tr>
        <th rowSpan="2" data-cell-type="category-title" data-sticky="left-1">Categoria</th>
        <th rowSpan="2" data-sticky="left-2">Resultado</th>
        {lastDays.map((lastDay, i) => {
          const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov',' dez']
          const currentMonthName = monthNames[i]
        return (
          <React.Fragment key={i}>
            <th data-cell-type='month-title' colSpan='2' data-last-day={lastDay} data-is-selected={lastDay === getLastDay(year, month) ? "true" : "false"}>{currentMonthName}</th>
          </React.Fragment>
        )})}
      </tr>
      <tr>
        <th data-cell-type='prev-title'>Prev.</th><th data-cell-type='exec-title'>Exec.</th>
        <th data-cell-type='prev-title'>Prev.</th><th data-cell-type='exec-title'>Exec.</th>
        <th data-cell-type='prev-title'>Prev.</th><th data-cell-type='exec-title'>Exec.</th>
        <th data-cell-type='prev-title'>Prev.</th><th data-cell-type='exec-title'>Exec.</th>
        <th data-cell-type='prev-title'>Prev.</th><th data-cell-type='exec-title'>Exec.</th>
        <th data-cell-type='prev-title'>Prev.</th><th data-cell-type='exec-title'>Exec.</th>
        <th data-cell-type='prev-title'>Prev.</th><th data-cell-type='exec-title'>Exec.</th>
        <th data-cell-type='prev-title'>Prev.</th><th data-cell-type='exec-title'>Exec.</th>
        <th data-cell-type='prev-title'>Prev.</th><th data-cell-type='exec-title'>Exec.</th>
        <th data-cell-type='prev-title'>Prev.</th><th data-cell-type='exec-title'>Exec.</th>
        <th data-cell-type='prev-title'>Prev.</th><th data-cell-type='exec-title'>Exec.</th>
        <th data-cell-type='prev-title'>Prev.</th><th data-cell-type='exec-title'>Exec.</th>
      </tr>
      {categories.map((group, i) => {
        return (
          <React.Fragment key={i}>
            <tr key={group.id}>
              <td data-cell-type="group-title" data-cell-line="group-line" data-sticky="left-1">{group.name}</td>
              <td data-cell-line="group-line" data-group-id={group.id} data-cell-type='group-result' data-sticky="left-2">...</td>
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
                <td data-cat-id={cat.id} data-cell-type='cat-result' data-sticky="left-2">0,00</td>
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
        <td data-cell-type="month-result" data-sticky="left-2">R$ 0,00</td>
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
        <td data-cell-type="accumulated-result" data-sticky="left-2">R$ 0,00</td>
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
      <ScrollContainer innerRef={tableContainer} className={styles.tableContainer}>
        {elementsToRender}
      </ScrollContainer>
      {transactionsModalIsOpen && <TransactionsOnBudget catId={selectedCatId} month={selectedMonth} includeExpected={includeExpectedOnTransactionsModal} isOpen={transactionsModalIsOpen} setIsOpen={setTransactionsModalIsOpen}/>}
    </>
  )
}

export default Budget