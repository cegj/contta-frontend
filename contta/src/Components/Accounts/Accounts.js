import React from 'react'
import AppContext from '../../Contexts/AppContext'
import Header from '../Header'
import { Routes, Route, useLocation } from 'react-router-dom'
import StatementList from '../Statement/StatementList'
import AccountsList from './AccountsList'
import TransactionsContext from '../../Contexts/TransactionsContext'
import useDate from '../../Hooks/useDate'

const Accounts = () => {

  const {setPageName, accounts} = React.useContext(AppContext)
  const [accountId, setAccountId] = React.useState(null)
  const [accountName, setAccountName] = React.useState(null)
  const {month, year, typeOfDateBalance} = React.useContext(AppContext)
  const location = useLocation();
  const {getTransactions, updateTransactions, setUpdateTransactions} = React.useContext(TransactionsContext);
  const {getFirstDay, getLastDay} = useDate();
  const [transactions, setTransactions] = React.useState(null)

  React.useEffect(() => {
    const accountId = location.pathname.split('/accounts/')[1]
    if (accountId){
      setAccountId(accountId)
      const {name} = accounts.find(account => account.id === +accountId)
      setAccountName(name)
    }
}, [location, accounts])

  React.useEffect(() => {
    setPageName('Contas')
  }, [setPageName, accountName])

  const firstDay = getFirstDay(year, month);
  const lastDay = getLastDay(year, month);

  const getAndSet = React.useCallback(async() => {
    const transactions = await getTransactions({from: firstDay, to: lastDay, typeofdate: typeOfDateBalance, account: accountId})
    setTransactions(transactions)    
  }, [firstDay, lastDay, accountId, typeOfDateBalance, getTransactions])

  React.useEffect(() => {
    if(accountId){
      getAndSet()
    }
  }, [firstDay, lastDay, accountId, typeOfDateBalance, getAndSet])

  React.useEffect(() => {
    if(updateTransactions){
      getAndSet()
      setUpdateTransactions(false)
    }}, [getAndSet, updateTransactions, setUpdateTransactions])

  return (
    <>
      <Header />
      <div className="grid g-two">
        <AccountsList/>
        <div>
          {accountName && <h3>{accountName}</h3>}
          <Routes>
            <Route path="/:id" element={transactions && <StatementList transactions={transactions}/>}/>
          </Routes>
        </div>
      </div>
    </>
  )
}

export default Accounts