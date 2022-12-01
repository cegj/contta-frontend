import React from 'react'
import styles from './StatementList.module.css'
import StatementItem from './StatementItem'
import TransactionsContext from '../../Contexts/TransactionsContext'
import groupBy from '../../Helpers/groupBy'
import { GET_BALANCE } from '../../api'
import useFetch from '../../Hooks/useFetch'
import StatementFilterBar from './StatementFilterBar'

const StatementList = () => {

  const {transactions} = React.useContext(TransactionsContext)
  const {request} = useFetch();

  const [typeFilter, setTypeFilter] = React.useState(null)
  const [categoryFilter, setCategoryFilter] = React.useState(null)
  const [accountFilter, setAccountFilter] = React.useState(null)
  const [statusFilter, setStatusFilter] = React.useState(null)
  const [hasFilter, setHasFilter] = React.useState(false)

  React.useEffect(() => {
    if(typeFilter || categoryFilter || accountFilter || statusFilter) setHasFilter(true)
    else setHasFilter(false)
  }, [typeFilter, categoryFilter, accountFilter, statusFilter, hasFilter])

  const groupedTransactions = React.useMemo(() => {
    console.log(1);
    if (transactions) {
    const grouped = Object.entries(groupBy(transactions, "transaction_date"));
    const token = window.localStorage.getItem('token')
    grouped.forEach(async(day) => {
      const query = {date: day[0], typeofdate: "transaction"}
      const {url, options} = GET_BALANCE(token, query)
      const {json} = await request(url, options)
      delete json.message;
      day[2] = json
    })
    return grouped;
    } else return null},
    [transactions, request]);

  const elementsToRenter = React.useMemo(() => {
    const obj = [];
    if(groupedTransactions && groupedTransactions.length > 0){
      groupedTransactions.forEach((day) => {
        console.log(day)
        day[1].forEach((transaction) => {
          if (hasFilter){
            if (typeFilter && (transaction.type !== typeFilter.value)) return null
            if (categoryFilter && (transaction.category_id !== categoryFilter.value)) return null
            if (accountFilter && (transaction.account_id !== accountFilter.value)) return null
            if (statusFilter && (transaction.preview !== statusFilter.value)) return null
            else obj.push(<StatementItem key={transaction.id} {...transaction} />)
          } else obj.push(<StatementItem key={transaction.id} {...transaction} />)
      })
        if(!hasFilter){obj.push(<div className={styles.balanceLine} key={day[0]}>Saldo: {day[1][0].payment_date}</div>)}
      })
    }
    return obj;
  }, [groupedTransactions, accountFilter, categoryFilter, hasFilter, statusFilter, typeFilter])

  React.useEffect(() => {}, [elementsToRenter])

  React.useEffect(()=>{}, [groupedTransactions])

  return <div className={styles.statementContainer}>
    <StatementFilterBar
      typeFilter={typeFilter}
      setTypeFilter={setTypeFilter}
      categoryFilter={categoryFilter}
      setCategoryFilter={setCategoryFilter}
      accountFilter={accountFilter}
      setAccountFilter={setAccountFilter}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      hasFilter={hasFilter}
    />
  {(elementsToRenter)
    ? elementsToRenter.map((element) => {return element})
    : <span className={styles.noTransactions}>Não foram encontradas transações neste mês</span>     }   
 </div>

}


export default StatementList