import React from 'react'
import styles from './Settings.module.css'
import AppContext from '../../Contexts/AppContext'
import ReactTooltip from 'react-tooltip'

const BudgetSettings = () => {

  const { hideUnsellectedMonthsOnBudget, setHideUnsellectedMonthsOnBudget, includeHiddenAccountsOnBudget, setIncludeHiddenAccountsOnBudget } = React.useContext(AppContext)

  React.useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  function selectHideUnsellectedMonths({target}){
    window.localStorage.setItem('hideUnsellectedMonthsOnBudget', target.dataset.value)
    setHideUnsellectedMonthsOnBudget(JSON.parse(target.dataset.value))
  }

  function selectIncludeHiddenAccountsOnBudget({target}){
    window.localStorage.setItem('includeHiddenAccountsOnBudget', target.dataset.value)
    setIncludeHiddenAccountsOnBudget(JSON.parse(target.dataset.value))
  }

  return (
    <section className={styles.settingsGroup}>
      <h3>Orçamento</h3>
        <section className={styles.setting}>
          <div className={styles.settingTitle}>
            <h4>Tipo de tabela de orçamento</h4>
            <div data-tip='Define se a tabela de orçamento deve exibir somente o mês atualmente selecionado ou se deve exibir todos os meses do ano' data-background-color="#a19f9f" className={styles.helpIcon}>?</div>
          </div>
          <div className={styles.optionsSelector}>
            <span data-value="false" className={hideUnsellectedMonthsOnBudget === false ? styles.active : ""} onClick={selectHideUnsellectedMonths}>Anual</span>
            <span data-value="true" className={hideUnsellectedMonthsOnBudget ? styles.active : ""} onClick={selectHideUnsellectedMonths}>Mensal</span>
          </div>
        </section>
        <section className={styles.setting}>
          <div className={styles.settingTitle}>
            <h4>Considerar transações de contas ocultas no orçamento</h4>
            <div data-tip='Define se os valores exibidos no orçamento devem incluir os valores de transações associadas a contas ocultas' data-background-color="#a19f9f" className={styles.helpIcon}>?</div>
          </div>
          <div className={styles.optionsSelector}>
            <span data-value="false" className={includeHiddenAccountsOnBudget === false ? styles.active : ""} onClick={selectIncludeHiddenAccountsOnBudget}>Não</span>
            <span data-value="true" className={includeHiddenAccountsOnBudget ? styles.active : ""} onClick={selectIncludeHiddenAccountsOnBudget}>Sim</span>
          </div>
          {/* <div className={styles.info}>Tipo de data a ser considerada para calcular os saldos</div> */}
        </section>
    </section>)
}

export default BudgetSettings