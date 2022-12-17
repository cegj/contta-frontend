import React from 'react'
import AppContext from './AppContext';
import { GET_TRANSACTIONS, GET_TRANSACTION_BY_ID, POST_INCOME, POST_EXPENSE, POST_TRANSFER, PATCH_INCOME, PATCH_EXPENSE, PATCH_TRANSFER, GET_BALANCE } from '../api';
import MessagesContext from './MessagesContext';
import useFetch from '../Hooks/useFetch';
import UserContext from './UserContext';
import groupBy from '../Helpers/groupBy';
import { useLocation } from 'react-router-dom';

const TransactionsContext = React.createContext();

export const TransactionsContextData = ({children}) => {

  const {setMessage} = React.useContext(MessagesContext)
  const {month, year} = React.useContext(AppContext)
  const {logged} = React.useContext(UserContext);
  const {request, fetchLoading} = useFetch();
  const {setLoading} = React.useContext(AppContext)
  const [transactions, setTransactions] = React.useState([])
  const [groupedTransactions, setGroupedTransactions] = React.useState([])
  const {accounts, categories} = React.useContext(AppContext)
  const {typeOfDateBalance} = React.useContext(AppContext)
  const {typeOfDateGroup} = React.useContext(AppContext)
  const {includeExpectedOnBalance} = React.useContext(AppContext);
  const [updateTransactions, setUpdateTransactions] = React.useState(false)
  const [isEmpty, setIsEmpty] = React.useState(false)
  const location = useLocation()
  const [selectedAccount, setSelectedAccount] = React.useState(null)
  // const [selectedCategory, setSelectedCategory] = React.useState(null)
  
  const getGroupedTransactions = React.useCallback(() => {
    const grouped = Object.entries(groupBy(transactions, typeOfDateGroup));
    grouped.forEach((day) => {
      day.push({date: 0, month_to_date: 0, all_to_date: 0})
    })
    try {
      const token = window.localStorage.getItem('token')
      async function getBalance(){
        grouped.forEach(async (day) => {
          const query = {date: day[0], typeofdate: typeOfDateBalance, includeexpected: includeExpectedOnBalance}
          const {url, options} = GET_BALANCE(token, query)
          const {json} = await request(url, options)
          delete json.message;
          day[2] = json}
        )}           
      getBalance();
    } catch (error) {
    } finally {
      setGroupedTransactions([...grouped])
    }}, [includeExpectedOnBalance, request, transactions, typeOfDateBalance, typeOfDateGroup])

  const getTransactions = React.useCallback(async () => {
    const token = window.localStorage.getItem('token')
    const query = {from: `${year}-${month}`, to: `${year}-${month}`, typeofdate: typeOfDateGroup, account: (selectedAccount ? selectedAccount : '')}
    const {url, options} = GET_TRANSACTIONS(token, query)
    const {response, json, error} = await request(url, options);  
    if (response.ok){
      if (json.transactions.length === 0) setIsEmpty(true)
      else setIsEmpty(false)
      setTransactions([...json.transactions])
      getGroupedTransactions()
      return true
    } else {
      console.log(error)
      setTransactions([])
      setMessage({content: `Não foi possível obter transações: ${error}`, type: 'e'})
      return false
    } 
  }, [year, month, request, setMessage, typeOfDateGroup, getGroupedTransactions, selectedAccount])

  const getTransactionById = React.useCallback(async(id) => {
    const token = window.localStorage.getItem('token')
    const {url, options} = GET_TRANSACTION_BY_ID(token, id)
    const {response, json, error} = await request(url, options);  
    if (response.ok){
      return json
    } else {
      console.log(error)
      setMessage({content: `Não foi possível obter transações: ${error}}`, type: 'e'})
      return null
    } 
  }, [request, setMessage])

  const storeTransaction = React.useCallback(async(body, type) => {
    const token = window.localStorage.getItem('token');
    let url;
    let options;
    if (type === 'R') {({url, options} = POST_INCOME(body, token))}
    else if (type === 'D') {({url, options} = POST_EXPENSE(body, token))}
    else if (type === 'T') {({url, options} = POST_TRANSFER(body, token))} 
    try {
      const {response, json, error} = await request(url, options);
      if (response.ok){
        setMessage({content: json.message, type: 's'})
        setUpdateTransactions(true)
        return true;
      } else {
        throw new Error(error)
      }
    } catch (error) {
      console.log(error)
      setMessage({content: `Erro ao registrar transação: ${error.message}`, type: "e"})
      return false;
    }
  }, [request, setMessage])

  const editTransaction = React.useCallback(async(body, type, id, cascade) => {
    const token = window.localStorage.getItem('token');
    let url;
    let options;
    if (type === 'R') {({url, options} = PATCH_INCOME(body, token, id, cascade))}
    else if (type === 'D') {({url, options} = PATCH_EXPENSE(body, token, id, cascade))}
    else if (type === 'T') {({url, options} = PATCH_TRANSFER(body, token, id, cascade))}  
    try {
      const {response, json, error} = await request(url, options);
      if (response.ok){
        setMessage({content: json.message, type: 's'})
        setUpdateTransactions(true)
        return true;
      } else {
        throw new Error(error)
      }
    } catch (error) {
      console.log(error)
      setMessage({content: `Erro ao registrar transação: ${error.message}`, type: "e"})
      return false;
    }
  }, [request, setMessage])

  //Set type options object to SELECT fields
  const typeOptions = React.useMemo(() => {
    return [
      {value: 'D', label: 'Despesa'},
      {value: 'R', label: 'Receita'},
      {value: 'T', label: 'Transferência'},
    ]
  }, [])

  //Set account options object to SELECT fields
  const accountOptions = React.useMemo(() => {return []}, []);
  React.useEffect(() => {
    accountOptions.length = 0;
    accounts.forEach((account) => {
      const accountOption = {label: account.name, value: account.id};
      accountOptions.push(accountOption);
    })
  }, [accounts, accountOptions])

  //Set categories options object to SELECT fields
  const categoryOptions = React.useMemo(() => {return []}, []);
  React.useEffect(() => {
    categories.forEach((group) => {
      const categories = [];
      group.categories.forEach((cat) => {
        categories.push({value: cat.id, label: cat.name})
      })
      categoryOptions.push({
        label: group.name,
        options: categories
      })
    })
  }, [categories, categoryOptions])

  React.useEffect(() => {
    setLoading(fetchLoading)
  }, [fetchLoading, setLoading])

  React.useEffect(() => {
    if (location.pathname.includes('/statement')){
      setSelectedAccount(null)
      setUpdateTransactions(true)
    }
    if (location.pathname.includes('/accounts/')){
      const account = location.pathname.split('/accounts/')[1]
      if (account) setSelectedAccount(account)
      setUpdateTransactions(true)
    }
  }, [location])

  React.useEffect(() => {
    if (logged){
      if (transactions.length === 0 && !isEmpty){
        getTransactions()
      }}
  }, [getTransactions, logged, transactions.length, isEmpty])

  React.useEffect(() => {
    setUpdateTransactions(true)
    setIsEmpty(false)
  }, [month, year])

  React.useEffect(() => {
    if (updateTransactions){
      setTransactions([])
      setGroupedTransactions([])
      setUpdateTransactions(false)
    }}, [updateTransactions, getTransactions])

  //Load grouped transactions with balance if groupedTansactions is empty
  React.useEffect(() => {
    if ((groupedTransactions.length === 0 && transactions.length > 0)) {
      getTransactions();
    }}, [groupedTransactions.length, transactions.length, getGroupedTransactions, getTransactions])

  return (
    <TransactionsContext.Provider value={
      {     
        transactions,
        setTransactions,
        typeOptions,
        accountOptions,
        categoryOptions,
        getTransactions,
        getTransactionById,
        storeTransaction,
        editTransaction,
        groupedTransactions,
        setUpdateTransactions
      }
      }>
      {children}
    </TransactionsContext.Provider>
  )
}

export default TransactionsContext