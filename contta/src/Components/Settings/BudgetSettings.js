import React from 'react'
import styles from './Settings.module.css'
import AppContext from '../../Contexts/AppContext'

const BudgetSettings = () => {

  const { hideUnsellectedMonthsOnBudget, setHideUnsellectedMonthsOnBudget } = React.useContext(AppContext)

  function selectHideUnsellectedMonths({target}){
    window.localStorage.setItem('hideUnsellectedMonthsOnBudget', target.dataset.value)
    setHideUnsellectedMonthsOnBudget(JSON.parse(target.dataset.value))
  }

  return (
    <section className={styles.settingsGroup}>
      <h3>Orçamento</h3>
        <section className={styles.setting}>
          <h4>Tipo de tabela de orçamento</h4>
          <div className={styles.optionsSelector}>
            <span data-value="false" className={hideUnsellectedMonthsOnBudget === false ? styles.active : ""} onClick={selectHideUnsellectedMonths}>Anual</span>
            <span data-value="true" className={hideUnsellectedMonthsOnBudget ? styles.active : ""} onClick={selectHideUnsellectedMonths}>Mensal</span>
          </div>
          {/* <div className={styles.info}>Tipo de data a ser considerada para calcular os saldos</div> */}
        </section>
    </section>)
}

export default BudgetSettings