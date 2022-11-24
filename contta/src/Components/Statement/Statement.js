import React from 'react'
import styles from './Statement.module.css'
import Header from '../Header'
import AppContext from '../../Contexts/AppContext'
import StatementItem from './StatementItem'
import TransactionsContext from '../../Contexts/TransactionsContext'
import StatementFilterBar from './StatementFilterBar'

const Statement = () => {

  const {setPageName} = React.useContext(AppContext)
  React.useEffect(() => {setPageName("Extrato")}, [setPageName])
  const {transactions} = React.useContext(TransactionsContext)

  React.useEffect(() => {}, [transactions])
  const [typeFilter, setTypeFilter] = React.useState(null)
  const [categoryFilter, setCategoryFilter] = React.useState(null)
  const [accountFilter, setAccountFilter] = React.useState(null)
  const [statusFilter, setStatusFilter] = React.useState(null)
  const [hasFilter, setHasFilter] = React.useState(false)

  React.useEffect(() => {
    if(typeFilter || categoryFilter || accountFilter || statusFilter) setHasFilter(true)
    else setHasFilter(false)
  }, [typeFilter, categoryFilter, accountFilter, statusFilter, hasFilter])

  return (
    <>
    <Header />
    <StatementFilterBar
      typeFilter={typeFilter}
      setTypeFilter={setTypeFilter}
      categoryFilter={categoryFilter}
      setCategoryFilter={setCategoryFilter}
      accountFilter={accountFilter}
      setAccountFilter={setAccountFilter}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      hasFilter={hasFilter}
    />
    <div className={styles.statementContainer}>
      {(transactions && transactions.length > 0) ?
      transactions.map((transaction) => {
        if (hasFilter){
          if (typeFilter && (transaction.type !== typeFilter.value)) return null
          if (categoryFilter && (transaction.category_id !== categoryFilter.value)) return null
          if (accountFilter && (transaction.account_id !== accountFilter.value)) return null
          if (statusFilter && (transaction.preview !== statusFilter.value)) return null
          else return <StatementItem key={transaction.id} {...transaction} />
        } else return <StatementItem key={transaction.id} {...transaction} /> 
      })
      :
      <span className={styles.noTransactions}>Não foram encontradas transações neste mês</span>        
}   </div>
    </>
  )
}

export default Statement