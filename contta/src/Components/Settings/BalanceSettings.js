import React from 'react'
import TransactionsContext from '../../Contexts/TransactionsContext'
import styles from './Settings.module.css'

const MonthYearForm = () => {

  const {typeOfDate, setTypeOfDate} = React.useContext(TransactionsContext)

  function selectTypeOfDate({target}){
    window.localStorage.setItem('typeOfDate', target.dataset.value)
    setTypeOfDate(target.dataset.value)
  }

  return (
    <section className={styles.settingsSection}>
      <h3>Saldo</h3>
      <h4>Data para cálculo dos saldos</h4>
        <div className={styles.typeOfDateSelector}>
          <span data-value="transaction_date" className={typeOfDate === "transaction_date" ? styles.active : ""} onClick={selectTypeOfDate}>Data da transação</span>
          <span data-value="payment_date" className={typeOfDate === "payment_date" ? styles.active : ""} onClick={selectTypeOfDate}>Data do pagamento</span>
        </div>
        <div className={styles.info}>Tipo de data a ser considerada para calcular os saldos</div>
    </section>)
}

export default MonthYearForm