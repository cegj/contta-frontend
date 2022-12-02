import React from 'react'
import styles from './StatementList.module.css'
import StatementItem from './StatementItem'
import TransactionsContext from '../../Contexts/TransactionsContext'
import groupBy from '../../Helpers/groupBy'
import { GET_BALANCE } from '../../api'
import useFetch from '../../Hooks/useFetch'
import StatementFilterBar from './StatementFilterBar'
import convertToFloat from '../../Helpers/convertToFloat'
import AppContext from '../../Contexts/AppContext'

const StatementList = () => {

  const {transactions} = React.useContext(TransactionsContext)
  const {request} = useFetch();
  const {setLoading} = React.useContext(AppContext);

  const [typeFilter, setTypeFilter] = React.useState(null)
  const [categoryFilter, setCategoryFilter] = React.useState(null)
  const [accountFilter, setAccountFilter] = React.useState(null)
  const [statusFilter, setStatusFilter] = React.useState(null)
  const [hasFilter, setHasFilter] = React.useState(false)
  // const [groupedTransactions, setGroupedTransactions] = React.useState(null)
  // const [elementsToRender, setElementsToRender] = React.useState(null)

  React.useEffect(() => {
    if(typeFilter || categoryFilter || accountFilter || statusFilter) setHasFilter(true)
    else setHasFilter(false)
  }, [typeFilter, categoryFilter, accountFilter, statusFilter, hasFilter])


  const groupedTransactions = React.useMemo(() => {
    if (transactions) {
      const grouped = Object.entries(groupBy(transactions, "transaction_date"));
      const token = window.localStorage.getItem('token')
      grouped.forEach(async(day) => {
        const query = {date: day[0], typeofdate: "transaction"}
        const {url, options} = GET_BALANCE(token, query)
        setLoading(true)
        const {json} = await request(url, options)
        setLoading(false)
        delete json.message;
        day.push(json) 
      })
      return grouped}
  }, [transactions, request])

  const criateElementsToRender = React.useCallback(() => {
    const render = [];
    if(groupedTransactions && groupedTransactions.length > 0){
      groupedTransactions.forEach((day) => {
        day[1].forEach((transaction) => {
          if (hasFilter){
            if (typeFilter && (transaction.type !== typeFilter.value)) return null
            if (categoryFilter && (transaction.category_id !== categoryFilter.value)) return null
            if (accountFilter && (transaction.account_id !== accountFilter.value)) return null
            if (statusFilter && (transaction.preview !== statusFilter.value)) return null
            else render.push(<StatementItem key={transaction.id} {...transaction} />)
          } else render.push(<StatementItem key={transaction.id} {...transaction} />)
      })
        if(!hasFilter && day[2]){render.push(<div className={styles.balanceLine} key={day[0]}>
          <span><span>Dia:</span> {convertToFloat(day[2].date.balance)}</span>
          <span><span>Mês:</span> {convertToFloat(day[2].month_to_date.balance)}</span>
          <span><span>Total:</span> {convertToFloat(day[2].all_to_date.balance)}</span>
        </div>)}
      })
    }
    return render;
  }, [groupedTransactions, hasFilter, typeFilter, categoryFilter, accountFilter, statusFilter])
  
  // function criateElementsToRender(){
  //   const render = [];
  //   if(groupedTransactions && groupedTransactions.length > 0){
  //     groupedTransactions.forEach((day) => {
  //       day[1].forEach((transaction) => {
  //         if (hasFilter){
  //           if (typeFilter && (transaction.type !== typeFilter.value)) return null
  //           if (categoryFilter && (transaction.category_id !== categoryFilter.value)) return null
  //           if (accountFilter && (transaction.account_id !== accountFilter.value)) return null
  //           if (statusFilter && (transaction.preview !== statusFilter.value)) return null
  //           else render.push(<StatementItem key={transaction.id} {...transaction} />)
  //         } else render.push(<StatementItem key={transaction.id} {...transaction} />)
  //     })
  //       if(!hasFilter && day[2]){render.push(<div className={styles.balanceLine} key={day[0]}>Saldo: {convertToFloat(day[2].date.balance)}</div>)}
  //     })
  //   }
  //   return render;
  // }

  const elementsToRender = criateElementsToRender()

  // React.useEffect(() => {
  //   setElementsToRender(criateElementsToRender())
  // }, [groupedTransactions, criateElementsToRender])

  // React.useEffect(() => {console.log("grouped", groupedTransactions)}, [groupedTransactions])
  // React.useEffect(() => {console.log("toRender", elementsToRender)}, [elementsToRender])

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
  {(elementsToRender)
    ? elementsToRender.map((element) => {return element})
    : <span className={styles.noTransactions}>Não foram encontradas transações neste mês</span>     }   
 </div>

}


export default StatementList