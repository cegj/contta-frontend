import React from 'react'
import AppContext from '../../Contexts/AppContext';
import MainMenu from '../Elements/MainMenu';
import styles from './MainBar.module.css'
import ExitButton from './ExitButton';
import MonthYearButton from './MonthYearButton';

const MainBar = () => {

  const {pageName, month, year} = React.useContext(AppContext)

  return (
    <section className={styles.mainBar}>
      <div className={styles.menuPageNameContainer}>
        <MainMenu />
        <span className={styles.pageName}>{pageName}</span>
        <span className={styles.monthYear}>{month}/{year}</span>
      </div>
      <div className={styles.optionsContainer}>
        <MonthYearButton />
        <ExitButton />
      </div>
    </section>
  )
}

export default MainBar