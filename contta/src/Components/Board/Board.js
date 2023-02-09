import React from 'react'
import Header from '../Header'
import AnnualHistoryChart from './AnnualHistoryChart'
import AppContext from '../../Contexts/AppContext'
import MonthCategoryChartDonut from './MonthCategoryChartDonut'
import MonthCategoryChartTreemap from './MonthCategoryChartTreemap'
import styles from './Board.module.css'

const Board = () => {

  const {setPageName, setPageSubName} = React.useContext(AppContext)
  React.useEffect(() => {setPageName("Painel"); setPageSubName(null)}, [setPageName, setPageSubName])

  return (
    <>
    <Header />
    <div className={`grid ${styles.boardContainer}`}>
    <AnnualHistoryChart />
    <MonthCategoryChartDonut />
    <MonthCategoryChartTreemap />
    </div>
    </>
  )
}

export default Board