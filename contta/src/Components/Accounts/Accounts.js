import React from 'react'
import AppContext from '../../Contexts/AppContext'
import Header from '../Header'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import StatementList from '../Statement/StatementList'
import AccountsList from './AccountsList'
import TransactionsContext from '../../Contexts/TransactionsContext'
import useDate from '../../Hooks/useDate'
import {ReactComponent as CloseIcon} from '../../assets/icons/close_icon_small.svg'
import {ReactComponent as EditIcon} from '../../assets/icons/edit_icon_small.svg'
import {ReactComponent as DeleteIcon} from '../../assets/icons/delete_icon_small.svg'
import styles from './Accounts.module.css'
import ReactTooltip from 'react-tooltip'
import AccountsForm from './AccountsForm'
import { DELETE_ACCOUNT, DELETE_INITIAL_BALANCE } from '../../api'
import useFetch from '../../Hooks/useFetch'
import MessagesContext from '../../Contexts/MessagesContext'

const Accounts = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const {setPageName, setPageSubName, setAccounts, setLoading, accounts} = React.useContext(AppContext)
  const [accountName, setAccountName] = React.useState(null)
  const [updateAccountsList, setUpdateAccountsList] = React.useState(true)
  const {month, year, typeOfDateBalance} = React.useContext(AppContext)
  const {getTransactions, updateTransactions, setUpdateTransactions} = React.useContext(TransactionsContext);
  const {getFirstDay, getLastDay} = useDate();
  const [transactions, setTransactions] = React.useState(null)
  const [formIsOpen, setFormIsOpen] = React.useState(false)
  const {request, fetchLoading} = useFetch()
  const {setMessage} = React.useContext(MessagesContext)
  const [selectedAccount, setSelectedAccount] = React.useState(null)
  const [accountToEdit, setAccountToEdit] = React.useState(null)

  const firstDay = getFirstDay(year, month);
  const lastDay = getLastDay(year, month);

  React.useEffect(() => {
    setLoading(fetchLoading)
  }, [fetchLoading, setLoading])  

  const handleDelete = React.useCallback(async() => {
    if (
      window.confirm(`Tem certeza de que deseja excluir a conta ${accountName.toUpperCase()}?`) &&
      window.confirm(`ATENÇÃO: Esta ação é irreversível. Ao excluir uma conta, as transações associadas a ela serão mantidas sem uma conta associada. Confirme novamente para prosseguir com a exclusão da conta ${accountName.toUpperCase()}, ou cancele para voltar atrás.`)
      ){
        try {
          const accountId = location.pathname.split('/accounts/')[1]
          const token = window.localStorage.getItem('token')
          const {url, options} = DELETE_INITIAL_BALANCE(token, accountId)
          const {response, error} = await request(url, options)
          if (response.ok){ //Initial balance is deleted
            const {url, options} = DELETE_ACCOUNT(token, accountId)
            const {response, error} = await request(url, options)
            if (response.ok){
              setMessage({content: 'Conta excluída com sucesso', type: 's'})
              setAccounts([])
              setUpdateAccountsList(true)
              return true  
            } else { // Initial balance is deleted, but account isn't
              console.log(error)
              throw new Error("O saldo inicial foi excluído, mas a conta não. Por favor, exclua novamente a conta.")
            }
          } else { //Initial balance isn't deleted
            throw new Error(error)
          }  
        } catch (error) {
          console.log(error)
          setMessage({content: `Erro ao excluir conta: ${error.message}`, type: "e"})
          return false;
        }}}, [location, request, setMessage, setAccounts, accountName])

  const handleEdit = React.useCallback(() => {
    setAccountToEdit(selectedAccount)
    setFormIsOpen(true)
  }, [selectedAccount])

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
    if (accountId && accounts.length > 0){
      const account = accounts.find(account => account.id === +accountId)
      if (account) {
        setAccountName(account.name)
        setSelectedAccount(account)  
      }
      else navigate('/accounts/')
    } else {
      setAccountName(null)
      setTransactions(null)
    }
}, [location, accounts, navigate])

  React.useEffect(() => {
    const accountId = location.pathname.split('/accounts/')[1]
    if (accountId) getAndSet(accountId)
    setUpdateTransactions(false)
  }, [location, year, month, updateTransactions, setUpdateTransactions, getAndSet])

  React.useEffect(() => {
    setPageName('Contas')
    if(accountName) setPageSubName(accountName)
    else setPageSubName(null)
  }, [setPageName, setPageSubName, accountName])
  
  return (
    <>
      <Header />
      <div className="grid g-two">
        <AccountsList accounts={accounts} setFormIsOpen={setFormIsOpen} updateAccountsList={updateAccountsList} setUpdateAccountsList={setUpdateAccountsList}/>
        <div>
          {accountName && 
          <div className={styles.titleBar}>
            <h3>{accountName}</h3>
            <div className={styles.btnsContainer}>
              <span data-tip="Excluir conta" className={styles.closeButton} onClick={handleDelete} ><DeleteIcon /></span>
              <span data-tip="Editar conta" className={styles.closeButton} onClick={handleEdit} ><EditIcon /></span>
              <span data-tip="Fechar extrato" className={styles.closeButton} onClick={() => {navigate('/accounts')}} ><CloseIcon /></span>
            </div>
          </div>}
          <Routes>
            <Route path="/" element={<div className="noTransactions">Selecione uma conta para ver o seu extrato e demais opções.</div>}/>
            <Route path="/:id" element={transactions && <StatementList transactions={transactions} accountId={transactions.length > 0 && transactions[0].account_id}/>}/>
          </Routes>
        </div>
        <AccountsForm isOpen={formIsOpen} setIsOpen={setFormIsOpen} setUpdateAccountsList={setUpdateAccountsList} accountToEdit={accountToEdit} setAccountToEdit={setAccountToEdit}/>
      </div>
    </>
  )
}

export default Accounts