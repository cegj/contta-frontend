import React from 'react'
import AppContext from './AppContext';
import { GET_TRANSACTIONS, GET_TRANSACTION_BY_ID } from '../api';
import MessagesContext from './MessagesContext';
import useFetch from '../Hooks/useFetch';
import UserContext from './UserContext';

const TransactionsContext = React.createContext();

export const TransactionsContextData = ({children}) => {

  const {setMessage} = React.useContext(MessagesContext)
  const {month, year, firstDay, lastDay, setReload} = React.useContext(AppContext)
  const {logged} = React.useContext(UserContext);
  const {request, loading} = useFetch();
  const [transactions, setTransactions] = React.useState(null)

  const getTransactions = React.useCallback(async () => {
    const token = window.localStorage.getItem('token')
    const query = {from: firstDay, to: lastDay}
    const {url, options} = GET_TRANSACTIONS(token, query)
    const {response, json, error} = await request(url, options);  
    if (response.ok){
      setTransactions(json.transactions)
    } else {
      console.log(error)
      setMessage({content: `Não foi possível obter transações: ${error}}`, type: 'e'})
    } 
  }, [firstDay, lastDay, request, setMessage])

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

  React.useEffect(() => {
    if (logged){
      getTransactions()
      setReload(false)  
    }
  }, [month, year, getTransactions, setReload, logged])

  return (
    <TransactionsContext.Provider value={
      {     
        transactions,
        setTransactions,
        getTransactions,
        getTransactionById,
        loading,
      }
      }>
      {children}
    </TransactionsContext.Provider>
  )
}

export default TransactionsContext