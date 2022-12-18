import React from 'react'
import AppContext from './AppContext';
import { GET_TRANSACTIONS, GET_TRANSACTION_BY_ID, POST_INCOME, POST_EXPENSE, POST_TRANSFER, PATCH_INCOME, PATCH_EXPENSE, PATCH_TRANSFER } from '../api';
import MessagesContext from './MessagesContext';
import useFetch from '../Hooks/useFetch';

const TransactionsContext = React.createContext();

export const TransactionsContextData = ({children}) => {

  const {setMessage} = React.useContext(MessagesContext)
  const {request, fetchLoading} = useFetch();
  const {setLoading} = React.useContext(AppContext)
  const {accounts, categories} = React.useContext(AppContext)
  const [updateTransactions, setUpdateTransactions] = React.useState(true)
  
  // const getGroupedTransactions = React.useCallback((transactions) => {
  //   const grouped = Object.entries(groupBy(transactions, typeOfDateGroup));
  //   grouped.forEach((day) => {
  //     day.push({date: 0, month_to_date: 0, all_to_date: 0})
  //   })
  //   try {
  //     const token = window.localStorage.getItem('token')
  //     async function getBalance(){
  //       grouped.forEach(async (day) => {
  //         const query = {date: day[0], typeofdate: typeOfDateBalance, includeexpected: includeExpectedOnBalance}
  //         const {url, options} = GET_BALANCE(token, query)
  //         const {json} = await request(url, options)
  //         delete json.message;
  //         day[2] = json}
  //       )}           
  //     getBalance();
  //   } catch (error) {
  //   } finally {
  //     setGroupedTransactions([...grouped])
  //   }}, [includeExpectedOnBalance, request, typeOfDateBalance, typeOfDateGroup])

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
        updateTransactions, setUpdateTransactions
      }
      }>
      {children}
    </TransactionsContext.Provider>
  )
}

export default TransactionsContext