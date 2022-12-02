import React from 'react'
import AppContext from './AppContext';
import { GET_TRANSACTIONS, GET_TRANSACTION_BY_ID, POST_INCOME, POST_EXPENSE, POST_TRANSFER, PATCH_INCOME, PATCH_EXPENSE, PATCH_TRANSFER, GET_BALANCE } from '../api';
import MessagesContext from './MessagesContext';
import useFetch from '../Hooks/useFetch';
import UserContext from './UserContext';
import groupBy from '../Helpers/groupBy';

const TransactionsContext = React.createContext();

export const TransactionsContextData = ({children}) => {

  const {setMessage} = React.useContext(MessagesContext)
  const {month, year, setReload} = React.useContext(AppContext)
  const {logged} = React.useContext(UserContext);
  const {request, fetchLoading} = useFetch();
  const {setLoading} = React.useContext(AppContext)
  const [transactions, setTransactions] = React.useState(null)
  const [groupedTransactions, setGroupedTransactions] = React.useState(null)
  const {accounts, categories} = React.useContext(AppContext)

  React.useEffect(() => {
    setLoading(fetchLoading)
  }, [fetchLoading, setLoading])

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

  const getTransactions = React.useCallback(async () => {
    const token = window.localStorage.getItem('token')
    const query = {from: `${year}-${month}`, to: `${year}-${month}`}
    const {url, options} = GET_TRANSACTIONS(token, query)
    const {response, json, error} = await request(url, options);  
    if (response.ok){
      setTransactions([...json.transactions])
      return true
    } else {
      console.log(error)
      setTransactions(null)
      setMessage({content: `Não foi possível obter transações: ${error}`, type: 'e'})
      return false
    } 
  }, [year, month, request, setMessage])

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
    console.log(body) 
    try {
      const {response, json, error} = await request(url, options);
      if (response.ok){
        setMessage({content: json.message, type: 's'})
        getTransactions();
        return true;
      } else {
        throw new Error(error)
      }
    } catch (error) {
      console.log(error)
      setMessage({content: `Erro ao registrar transação: ${error.message}`, type: "e"})
      return false;
    }
  }, [request, setMessage, getTransactions])

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
        getTransactions();
        return true;
      } else {
        throw new Error(error)
      }
    } catch (error) {
      console.log(error)
      setMessage({content: `Erro ao registrar transação: ${error.message}`, type: "e"})
      return false;
    }
  }, [request, setMessage, getTransactions])

  React.useEffect(() => {
    if (logged){
      getTransactions()
      setReload(false)  
    }
  }, [month, year, getTransactions, setReload, logged])

  // React.useEffect(() => {
  //   if (transactions) {
  //     const grouped = Object.entries(groupBy(transactions, "transaction_date"));
  //     const token = window.localStorage.getItem('token')
  //     grouped.forEach(async(day) => {
  //       const query = {date: day[0], typeofdate: "transaction"}
  //       const {url, options} = GET_BALANCE(token, query)
  //       const {json} = await request(url, options)
  //       delete json.message;
  //       day.push(json) 
  //     })
  //     setGroupedTransactions([...grouped])}
  // }, [transactions, request])

  React.useEffect(() => {
    if (transactions) {
      const grouped = Object.entries(groupBy(transactions, "transaction_date"));
      const token = window.localStorage.getItem('token')
      try {
        async function getBalance(){
          grouped.forEach(async (day) => {
            const query = {date: day[0], typeofdate: "transaction"}
            const {url, options} = GET_BALANCE(token, query)
            const {json} = await request(url, options)
            delete json.message;
            day.push(json)
          })}           
        getBalance();
      } catch (error) {
        
      } finally {
        setGroupedTransactions([...grouped])
      }}}, [setGroupedTransactions, request, transactions])

  //     grouped.forEach(async(day) => {
  //     })
  //     }
  // }, [transactions, request])

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
        groupedTransactions
      }
      }>
      {children}
    </TransactionsContext.Provider>
  )
}

export default TransactionsContext