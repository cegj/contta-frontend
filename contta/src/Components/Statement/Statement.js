import React from 'react'
import Header from '../Header'
import AppContext from '../../Contexts/AppContext'
import StatementList from './StatementList'
import TransactionsContext from '../../Contexts/TransactionsContext'
import useDate from '../../Hooks/useDate'

const Statement = () => {

  const {setPageName, setPageSubName, includeHiddenAccounts} = React.useContext(AppContext)
  React.useEffect(() => {setPageName("Extrato"); setPageSubName(null)}, [setPageName, setPageSubName])

  const {month, year, typeOfDateBalance} = React.useContext(AppContext)
  const {getTransactions, updateTransactions, setUpdateTransactions} = React.useContext(TransactionsContext);
  const {getFirstDay, getLastDay} = useDate();
  const [transactions, setTransactions] = React.useState(null)

  const firstDay = getFirstDay(year, month);
  const lastDay = getLastDay(year, month);

  const getAndSet = React.useCallback(async() => {
    const transactions = await getTransactions({from: firstDay, to: lastDay, typeofdate: typeOfDateBalance, includehiddenaccounts: includeHiddenAccounts})
    setTransactions(transactions)    
  }, [firstDay, lastDay, typeOfDateBalance, includeHiddenAccounts, getTransactions])

  React.useEffect(() => {
    getAndSet()
  }, [firstDay, lastDay, typeOfDateBalance, getAndSet])

  React.useEffect(() => {
    if(updateTransactions){
      getAndSet()
      setUpdateTransactions(false)
    }}, [getAndSet, updateTransactions, setUpdateTransactions])

  return (
    <>
    <Header />
    <div className="grid g-one">
      {transactions && <StatementList transactions={transactions}/>}
    </div>
    </>
  )
}

export default Statement