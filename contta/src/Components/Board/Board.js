import React from 'react'
import Header from '../Header'
import AnnualHistoryChart from './AnnualHistoryChart'
import AppContext from '../../Contexts/AppContext'
import MonthCategoryChart from './MonthCategoryChart'
import styles from './Board.module.css'

const Board = () => {

  const {setPageName, setPageSubName} = React.useContext(AppContext)
  React.useEffect(() => {setPageName("Painel"); setPageSubName(null)}, [setPageName, setPageSubName])

  return (
    <>
    <Header />
    <div className={`grid g-one ${styles.boardContainer}`}>
    <span className="noTransactions">O painel está em desenvolvimento.</span>
    <AnnualHistoryChart />
    <MonthCategoryChart />
    </div>
    </>
  )
}

export default Board