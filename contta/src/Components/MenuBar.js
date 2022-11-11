import React from 'react'
import MainMenu from './Elements/MainMenu';
import OptionsButton from './Elements/OptionsButton';
import styles from './MenuBar.module.css'

const MenuBar = () => {

  const pageName = 'Extrato';

  return (
    <section className={styles.menuBar}>
      <div className={styles.menuPageNameContainer}>
        <MainMenu />
        <span className={styles.pageName}>{pageName}</span>
      </div>
      <div className={styles.optionsContainer}>
        <OptionsButton />
      </div>
    </section>
  )
}

export default MenuBar