import React from 'react'
import styles from './Statement.module.css'
import Header from '../Header'
import AppContext from '../../Contexts/AppContext'
import useFetch from '../../Hooks/useFetch'
import { GET_TRANSACTIONS } from '../../api'
import MessagesContext from '../../Contexts/MessagesContext'
import StatementItem from './StatementItem'

const Statement = () => {

  const {setPageName} = React.useContext(AppContext)
  React.useEffect(() => {setPageName("Extrato")}, [setPageName])
  const {setMessage} = React.useContext(MessagesContext)
  const {firstDay, lastDay} = React.useContext(AppContext)
  const {request, loading} = useFetch();
  const [transactions, setTransactions] = React.useState(null)

  React.useEffect(() => {
    async function getData(){
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
    }
    getData()
  }, [request, firstDay, lastDay, setMessage])

  React.useEffect(() => {console.log(transactions)}, [transactions])

  if (loading)
  return (
    <>
    <Header />
    <div className={styles.statementContainer}>
      <div style={{width: "60px", height: "60px", margin: "1rem auto"}}>
        <span className="loading"></span>
      </div>
    </div>
    </>
  )
  else
  return (
    <>
    <Header />
    <div className={styles.statementContainer}>
      {(transactions && transactions.length > 0) ?
      transactions.map((transaction) => {
        return <StatementItem key={transaction.id} {...transaction} /> 
      })
      :
      <span className={styles.noTransactions}>Não foram encontradas transações neste mês</span>        
}   </div>
    </>
  )
}

export default Statement