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
    <div className={`grid g-one ${styles.boardContainer}`}>
      <div>
        <h2 className={styles.sectionTitle}>Geral</h2>
      <AnnualHistoryChart />
      </div>
      <div style={{display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr"}}>
        <h2 className={styles.sectionTitle} style={{gridColumn: "span 2"}}>Categorias</h2>
        <MonthCategoryChartDonut />
        <MonthCategoryChartTreemap />
      </div>
    </div>
    </>
  )
}

export default Board