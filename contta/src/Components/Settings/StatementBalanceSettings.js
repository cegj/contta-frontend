import React from 'react'
import TransactionsContext from '../../Contexts/TransactionsContext'
import styles from './Settings.module.css'

const StatementBalanceSettings = () => {

  const {typeOfDateBalance, setTypeOfDateBalance, typeOfDateGroup, setTypeOfDateGroup} = React.useContext(TransactionsContext)

  function selectTypeOfDateBalance({target}){
    window.localStorage.setItem('typeOfDateBalance', target.dataset.value)
    setTypeOfDateBalance(target.dataset.value)
  }

  function selectTypeOfDateGroup({target}){
    window.localStorage.setItem('typeOfDateGroup', target.dataset.value)
    setTypeOfDateGroup(target.dataset.value)
  }

  return (
    <section className={styles.settingsGroup}>
      <h3>Extrato e saldo</h3>
        <section className={styles.setting}>
          <h4>Data para agrupamento das transações</h4>
          <div className={styles.optionsSelector}>
            <span data-value="transaction_date" className={typeOfDateGroup === "transaction_date" ? styles.active : ""} onClick={selectTypeOfDateGroup}>Data da transação</span>
            <span data-value="payment_date" className={typeOfDateGroup === "payment_date" ? styles.active : ""} onClick={selectTypeOfDateGroup}>Data do pagamento</span>
          </div>
          {/* <div className={styles.info}>Tipo de data a ser considerada para calcular os saldos</div> */}
        </section>
        <section className={styles.setting}>
        <h4>Data para cálculo dos saldos</h4>
          <div className={styles.optionsSelector}>
            <span data-value="transaction_date" className={typeOfDateBalance === "transaction_date" ? styles.active : ""} onClick={selectTypeOfDateBalance}>Data da transação</span>
            <span data-value="payment_date" className={typeOfDateBalance === "payment_date" ? styles.active : ""} onClick={selectTypeOfDateBalance}>Data do pagamento</span>
          </div>
        </section>
    </section>)
}

export default StatementBalanceSettings