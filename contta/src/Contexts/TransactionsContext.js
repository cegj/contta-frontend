import React from 'react'
import AppContext from './AppContext';
import { GET_TRANSACTIONS, GET_TRANSACTION_BY_ID, POST_INCOME, POST_EXPENSE, POST_TRANSFER, PATCH_INCOME, PATCH_EXPENSE, PATCH_TRANSFER, DELETE_TRANSACTION } from '../api';
import MessagesContext from './MessagesContext';
import useFetch from '../Hooks/useFetch';

const TransactionsContext = React.createContext();

export const TransactionsContextData = ({children}) => {

  const {setMessage} = React.useContext(MessagesContext)
  const {request, fetchLoading} = useFetch();
  const {setLoading, setUpdateAccountBalances, setUpdateCategoryBalances} = React.useContext(AppContext)
  const {accounts, categories} = React.useContext(AppContext)
  const [updateTransactions, setUpdateTransactions] = React.useState(true)
  const [sendingTransaction, setSendingTransaction] = React.useState(false)
  
  const getTransactions = React.useCallback(async (query = {from: '', to: '', typeofdate: '', account: '', category: ''}) => {
    try {
      const token = window.localStorage.getItem('token')
      const {url, options} = GET_TRANSACTIONS(token, query)
      const {response, json, error} = await request(url, options);  
      if (response.ok){
        return json.transactions
      }
      else throw new Error(error)
    } catch (error) {
        console.log(error)
        setMessage({content: `Erro ao obter transações: ${error.message}`, type: "e"})
        return null;
    }}, [request, setMessage])

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
      setSendingTransaction(true)
      const {response, json, error} = await request(url, options);
      if (response.ok){
        setMessage({content: json.message, type: 's'})
        setUpdateTransactions(true)
        setUpdateAccountBalances(true)
        setUpdateCategoryBalances(true)
        return true;
      } else {
        throw new Error(error)
      }
    } catch (error) {
      console.log(error)
      setMessage({content: `Erro ao registrar transação: ${error.message}`, type: "e"})
      return false;
    } finally {
      setSendingTransaction(false)
    }
  }, [request, setMessage, setUpdateAccountBalances, setUpdateCategoryBalances])

  const editTransaction = React.useCallback(async(body, type, id, cascade) => {
    const token = window.localStorage.getItem('token');
    let url;
    let options;
    if (type === 'R') {({url, options} = PATCH_INCOME(body, token, id, cascade))}
    else if (type === 'D') {({url, options} = PATCH_EXPENSE(body, token, id, cascade))}
    else if (type === 'T') {({url, options} = PATCH_TRANSFER(body, token, id, cascade))}  
    try {
      setSendingTransaction(true)
      const {response, json, error} = await request(url, options);
      if (response.ok){
        setMessage({content: json.message, type: 's'})
        setUpdateTransactions(true)
        setUpdateAccountBalances(true)
        setUpdateCategoryBalances(true)
        return true;
      } else {
        throw new Error(error)
      }
    } catch (error) {
      console.log(error)
      setMessage({content: `Erro ao editar transação: ${error.message}`, type: "e"})
      return false;
    } finally {
      setSendingTransaction(false)
    }
  }, [request, setMessage, setUpdateAccountBalances, setUpdateCategoryBalances])

  const deleteTransaction = React.useCallback(async (transaction, cascade) => {
    const token = window.localStorage.getItem('token')
    const {url, options} = DELETE_TRANSACTION(token, transaction.id, transaction.type, cascade)
    try {
      setSendingTransaction(true)
      const {response, error} = await request(url, options);
      if (response.ok){
        setMessage({content: `${cascade ? 'Transação e parcelas seguintes apagadas' : 'Transação apagada'}`, type: 's'})
        setUpdateTransactions(true)
        setUpdateAccountBalances(true)
        setUpdateCategoryBalances(true)
        return true;
      } else {
        throw new Error(error)
      }
    } catch (error) {
      console.log(error)
      setMessage({content: `Erro ao apagar transação: ${error.message}`, type: "e"})
      return false;
    } finally {
      setSendingTransaction(false)
    }
  }, [request, setMessage, setUpdateAccountBalances, setUpdateCategoryBalances])

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

  return (
    <TransactionsContext.Provider value={
      {     
        typeOptions,
        accountOptions,
        categoryOptions,
        getTransactions,
        getTransactionById,
        storeTransaction,
        editTransaction,
        deleteTransaction,
        updateTransactions, setUpdateTransactions,
        sendingTransaction
      }
      }>
      {children}
    </TransactionsContext.Provider>
  )
}

export default TransactionsContext