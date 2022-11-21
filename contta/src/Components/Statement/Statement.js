import React from 'react'
import styles from './Statement.module.css'
import Header from '../Header'
import AppContext from '../../Contexts/AppContext'
import StatementItem from './StatementItem'
import TransactionsContext from '../../Contexts/TransactionsContext'

const Statement = () => {

  const {setPageName} = React.useContext(AppContext)
  React.useEffect(() => {setPageName("Extrato")}, [setPageName])
  const {transactions} = React.useContext(TransactionsContext)

  return (
    <>
    <Header />
    <div className={styles.statementContainer}>
      {(transactions && transactions.length > 0) ?
      transactions.map((transaction) => {
        return <StatementItem key={transaction.id} {...transaction} /> 
      })
      :
      <span className={styles.noTransactions}>Não foram encontradas transações neste mês</span>        
}   </div>
    </>
  )
}

export default Statement