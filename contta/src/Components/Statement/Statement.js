import React from 'react'
import Header from '../Header'
import AppContext from '../../Contexts/AppContext'
import StatementList from './StatementList'
import TransactionsContext from '../../Contexts/TransactionsContext'
import useDate from '../../Hooks/useDate'

const Statement = () => {

  const {setPageName, setPageSubName, includeHiddenAccounts} = React.useContext(AppContext)
  React.useEffect(() => {setPageName("Extrato"); setPageSubName(null)}, [setPageName, setPageSubName])

  const {month, year, typeOfDateGroup} = React.useContext(AppContext)
  const {getTransactions, updateTransactions, setUpdateTransactions} = React.useContext(TransactionsContext);
  const {getFirstDay, getLastDay} = useDate();
  const [transactions, setTransactions] = React.useState(null)

  const firstDay = getFirstDay(year, month);
  const lastDay = getLastDay(year, month);

  const getAndSet = React.useCallback(async() => {
    console.log(typeOfDateGroup)
    const transactions = await getTransactions({from: firstDay, to: lastDay, typeofdate: typeOfDateGroup, includehiddenaccounts: includeHiddenAccounts})
    setTransactions(transactions)    
  }, [firstDay, lastDay, typeOfDateGroup, includeHiddenAccounts, getTransactions])

  React.useEffect(() => {
    getAndSet()
  }, [firstDay, lastDay, getAndSet])

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