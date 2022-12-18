import React from 'react'
import AppContext from '../../Contexts/AppContext'
import Header from '../Header'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import StatementList from '../Statement/StatementList'
import AccountsList from './AccountsList'
import TransactionsContext from '../../Contexts/TransactionsContext'
import useDate from '../../Hooks/useDate'
import {ReactComponent as CloseIcon} from '../../assets/icons/close_icon.svg'
import styles from './Accounts.module.css'
import ReactTooltip from 'react-tooltip'

const Accounts = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const {setPageName, setPageSubName, accounts} = React.useContext(AppContext)
  const [accountName, setAccountName] = React.useState(null)
  const {month, year, typeOfDateBalance} = React.useContext(AppContext)
  const {getTransactions, updateTransactions, setUpdateTransactions} = React.useContext(TransactionsContext);
  const {getFirstDay, getLastDay} = useDate();
  const [transactions, setTransactions] = React.useState(null)

  const firstDay = getFirstDay(year, month);
  const lastDay = getLastDay(year, month);

  const getAndSet = React.useCallback(async(accountId) => {
    const transactions = await getTransactions({from: firstDay, to: lastDay, typeofdate: typeOfDateBalance, account: accountId})
    setTransactions(transactions)    
  }, [firstDay, lastDay, typeOfDateBalance, getTransactions])

  React.useEffect(() => {
    ReactTooltip.rebuild()
    if(!transactions) {ReactTooltip.hide()}
  }, [transactions])

  React.useEffect(() => {
    const accountId = location.pathname.split('/accounts/')[1]
    if (accountId){
      const {name} = accounts.find(account => account.id === +accountId)
      setAccountName(name)
    } else {
      setAccountName(null)
      setTransactions(null)
    }
}, [location, accounts])

  React.useEffect(() => {
    const accountId = location.pathname.split('/accounts/')[1]
    if (accountId) getAndSet(accountId)
    setUpdateTransactions(false)
  }, [location, year, month, updateTransactions, setUpdateTransactions, getAndSet])

  React.useEffect(() => {
    setPageName('Contas')
    if(accountName) setPageSubName(accountName)
  }, [setPageName, setPageSubName, accountName])
  
  return (
    <>
      <Header />
      <div className="grid g-two">
        <AccountsList accounts={accounts}/>
        <div>
          {accountName && 
          <div className={styles.titleBar}>
            <h3>{accountName}</h3>
            <span data-tip="Fechar extrato" className={styles.closeButton} onClick={() => {navigate('/accounts')}} ><CloseIcon /></span>
          </div>}
          <Routes>
            <Route path="/:id" element={transactions && <StatementList transactions={transactions} accountId={transactions.length > 0 && transactions[0].account_id}/>}/>
          </Routes>
        </div>
      </div>
    </>
  )
}

export default Accounts