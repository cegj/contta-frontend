import React from 'react'
import AppContext from '../../Contexts/AppContext';
import MainMenu from '../Elements/MainMenu';
import styles from './MainBar.module.css'
import ExitButton from './ExitButton';
import MonthYearButton from './MonthYearButton';
import SettingsButton from './SettingsButton';

const MainBar = () => {

  const {pageName, month, year, loading} = React.useContext(AppContext)

  return (
    <section className={styles.mainBar}>
      <div className={styles.menuPageNameContainer}>
        <MainMenu />
        <span className={styles.pageName}>{pageName}</span>
        <span className={styles.monthYear}>{month}/{year}</span>
        {loading && <div style={{width: "30px", height: "30px", margin: "1rem 1rem"}}>
          <span className="loading"></span>
        </div>}
      </div>
      <div className={styles.optionsContainer}>
        <MonthYearButton />
        <SettingsButton />
        <ExitButton />
      </div>
    </section>
  )
}

export default MainBar