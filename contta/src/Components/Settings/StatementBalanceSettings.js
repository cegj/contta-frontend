import React from 'react'
import styles from './Settings.module.css'
import AppContext from '../../Contexts/AppContext'
import TransactionsContext from '../../Contexts/TransactionsContext'
import ReactTooltip from 'react-tooltip'

const StatementBalanceSettings = () => {

  const {
    typeOfDateBalance,
    setTypeOfDateBalance,
    typeOfDateGroup,
    setTypeOfDateGroup,
    includeExpectedOnBalance,
    setIncludeExpectedOnBalance,
    includeHiddenAccounts,
    setIncludeHiddenAccounts
  } = React.useContext(AppContext)

  const {setUpdateTransactions} = React.useContext(TransactionsContext)

  React.useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  function selectTypeOfDateBalance({target}){
    window.localStorage.setItem('typeOfDateBalance', target.dataset.value)
    setTypeOfDateBalance(target.dataset.value)
    setUpdateTransactions(true)
  }

  function selectTypeOfDateGroup({target}){
    window.localStorage.setItem('typeOfDateGroup', target.dataset.value)
    setTypeOfDateGroup(target.dataset.value)
    setUpdateTransactions(true)
  }

  function selectIncludeExpectedOnBalance({target}){
    window.localStorage.setItem('includeExpectedOnBalance', target.dataset.value)
    setIncludeExpectedOnBalance(JSON.parse(target.dataset.value))
    setUpdateTransactions(true)
  }

  function selectIncludeHiddenAccountsOnBalance({target}){
    window.localStorage.setItem('includeHiddenAccounts', target.dataset.value)
    setIncludeHiddenAccounts(JSON.parse(target.dataset.value))
    setUpdateTransactions(true)
  }

  React.useEffect(() => {
    console.log(includeExpectedOnBalance)
  }, [includeExpectedOnBalance])

  return (
    <section className={styles.settingsGroup}>
      <h3>Extrato e saldo</h3>
        <section className={styles.setting}>
          <div className={styles.settingTitle}>
            <h4>Data para agrupamento das transações</h4>
            <div data-tip="Define por qual data as transações devem ser agrupadas e exibidas nos extratos" data-background-color="#a19f9f" className={styles.helpIcon}>?</div>
          </div>
          <div className={styles.optionsSelector}>
            <span data-value="transaction_date" className={typeOfDateGroup === "transaction_date" ? styles.active : ""} onClick={selectTypeOfDateGroup}>Data da transação</span>
            <span data-value="payment_date" className={typeOfDateGroup === "payment_date" ? styles.active : ""} onClick={selectTypeOfDateGroup}>Data do pagamento</span>
          </div>
        </section>
        <section className={styles.setting}>
          <div className={styles.settingTitle}>
            <h4>Data para cálculo dos saldos</h4>
            <div data-tip="Define qual data deve ser considerada para calcular os saldos nos extratos" data-background-color="#a19f9f" className={styles.helpIcon}>?</div>
          </div>
          <div className={styles.optionsSelector}>
            <span data-value="transaction_date" className={typeOfDateBalance === "transaction_date" ? styles.active : ""} onClick={selectTypeOfDateBalance}>Data da transação</span>
            <span data-value="payment_date" className={typeOfDateBalance === "payment_date" ? styles.active : ""} onClick={selectTypeOfDateBalance}>Data do pagamento</span>
          </div>
        </section>
        <section className={styles.setting}>
          <div className={styles.settingTitle}>
            <h4>Considerar transações previstas nos saldos</h4>
            <div data-tip='Define se as transações marcadas como "previstas" (não consolidadas) devem ser consideradas para o cálculo dos saldos nos extratos' data-background-color="#a19f9f" className={styles.helpIcon}>?</div>
          </div>
          <div className={styles.optionsSelector}>
            <span data-value="false" className={includeExpectedOnBalance === false ? styles.active : ""} onClick={selectIncludeExpectedOnBalance}>Não</span>
            <span data-value="true" className={includeExpectedOnBalance ? styles.active : ""} onClick={selectIncludeExpectedOnBalance}>Sim</span>
          </div>
        </section>
        <section className={styles.setting}>
          <div className={styles.settingTitle}>
            <h4>Incluir transações de contas ocultas nos extratos e saldos</h4>
            <div data-tip='Define se as transações associadas a contas ocultas devem ser exibidas nos extratos e consideradas no cálculo dos seus saldos' data-background-color="#a19f9f" className={styles.helpIcon}>?</div>
          </div>
          <div className={styles.optionsSelector}>
            <span data-value="false" className={includeHiddenAccounts === false ? styles.active : ""} onClick={selectIncludeHiddenAccountsOnBalance}>Não</span>
            <span data-value="true" className={includeHiddenAccounts ? styles.active : ""} onClick={selectIncludeHiddenAccountsOnBalance}>Sim</span>
          </div>
          <div className={styles.info}>Atenção: no gerenciador de Contas, os extratos e saldos sempre incluem as transações das contas ocultas.</div>
        </section>
    </section>)
}

export default StatementBalanceSettings