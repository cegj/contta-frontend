import React from 'react'
import { GET_BALANCE } from '../../api'
import AppContext from '../../Contexts/AppContext'
import useFetch from '../../Hooks/useFetch'
import Header from '../Header'
import styles from './Budget.module.css'
import useDate from '../../Hooks/useDate'
import convertToFloat from '../../Helpers/convertToFloat'

const Budget = () => {

  const {setPageName} = React.useContext(AppContext)
  React.useEffect(() => {setPageName("Extrato")}, [setPageName])

  const {getLastDay} = useDate();
  const {request, fetchLoading} = useFetch()
  const {year, categories, setLoading, setMonth} = React.useContext(AppContext)

  React.useEffect(() => {
    setLoading(fetchLoading)
  }, [fetchLoading, setLoading])

  const getPrev = React.useCallback(async (cell) => {
    const token = window.localStorage.getItem('token')
    const {lastDay, catId} = cell.dataset
    const {url, options} = GET_BALANCE(token, {date: lastDay, typeofdate: 'transaction_date', includeexpected: 'true', category: catId})
    const req = await request(url, options)
    const {all_to_date} = req.json;
    cell.innerText = convertToFloat(all_to_date.balance);
  }, [])

  const getExec = React.useCallback(async (cell) => {
    const token = window.localStorage.getItem('token')
    const {lastDay, catId} = cell.dataset
    const {url, options} = GET_BALANCE(token, {date: lastDay, typeofdate: 'transaction_date', includeexpected: 'false', category: catId})
    const req = await request(url, options)
    const {all_to_date} = req.json;
    cell.innerText = convertToFloat(all_to_date.balance);
  }, [])

  const handleClickOnCell = React.useCallback(({target}) => {
    const month = target.dataset.lastDay.split('-')[1]
    const {catId} = target.dataset;
    console.log(month, catId)
  }, [])

  React.useEffect(() => {
    const prevCells = document.querySelectorAll("td[data-cell-type='cat-prev']")
    prevCells.forEach((cell) => {
      getPrev(cell)
    })
    const execCells = document.querySelectorAll("td[data-cell-type='cat-exec']")
    execCells.forEach((cell) => {
      getExec(cell)
    })
  }, [])

  const elementsToRender = 
  <table id="budget-table" className={styles.table}>
    <thead>
      <tr>
        <th rowSpan="2">Categoria</th>
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
      {categories.map((group) => {
        return (
          <>
            <tr>
              <td data-cell-type="group-title">{group.name}</td>
              <td>R$ 0,00</td>
            </tr>
            {group.categories.map((cat) => {
              return (<tr>
                <td>{cat.name}</td>
                <td>0,00</td>
                <td data-cell-type='cat-prev' data-last-day={getLastDay(year, 1)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-exec' data-last-day={getLastDay(year, 1)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-prev' data-last-day={getLastDay(year, 2)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-exec' data-last-day={getLastDay(year, 2)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-prev' data-last-day={getLastDay(year, 3)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-exec' data-last-day={getLastDay(year, 3)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-prev' data-last-day={getLastDay(year, 4)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-exec' data-last-day={getLastDay(year, 4)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-prev' data-last-day={getLastDay(year, 5)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-exec' data-last-day={getLastDay(year, 5)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-prev' data-last-day={getLastDay(year, 6)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-exec' data-last-day={getLastDay(year, 6)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-prev' data-last-day={getLastDay(year, 7)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-exec' data-last-day={getLastDay(year, 7)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-prev' data-last-day={getLastDay(year, 8)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-exec' data-last-day={getLastDay(year, 8)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-prev' data-last-day={getLastDay(year, 9)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-exec' data-last-day={getLastDay(year, 9)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-prev' data-last-day={getLastDay(year, 10)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-exec' data-last-day={getLastDay(year, 10)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-prev' data-last-day={getLastDay(year, 11)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-exec' data-last-day={getLastDay(year, 11)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-prev' data-last-day={getLastDay(year, 12)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
                <td data-cell-type='cat-exec' data-last-day={getLastDay(year, 12)} data-cat-id={cat.id} data-load="true" onClick={handleClickOnCell}>...</td>
              </tr>
              )
            })}
          </>
        )})}


          {/* // <tr>
          //   <td style={{fontWeight: 'bold'}}>{group.name}</div>
          //   {group.categories.map((cat) => {
          //     return (
          //       <div>
          //         <div>{cat.name}</div>
          //         <div>Jan</div>
          //       </div>
          //     )
          //     </td>
          //   })}
          // </tr>
      //   )
      // })} */}
    </thead>
    <tbody>
        {/* <?php echo $budgetLines; ?> */}
    </tbody>
</table>

  return (
    <>
      <Header />
      <div>      
      {/* {categories.map((group) => {
        return (
          <div>
            <div style={{fontWeight: 'bold'}}>{group.name}</div>
            {group.categories.map((cat) => {
              return (
                <div>
                  <div>{cat.name}</div>
                  <div>Jan</div>
                </div>
              )
            })}
          </div>
        )
      })} */}
      {elementsToRender}
      </div>    
    </>
  )
}

export default Budget