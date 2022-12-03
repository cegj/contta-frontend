import React from 'react'
import styles from './StatementList.module.css'
import StatementItem from './StatementItem'
import TransactionsContext from '../../Contexts/TransactionsContext'
import StatementFilterBar from './StatementFilterBar'
import convertToFloat from '../../Helpers/convertToFloat'

const StatementList = () => {

  const {groupedTransactions} = React.useContext(TransactionsContext)

  const [typeFilter, setTypeFilter] = React.useState(null)
  const [categoryFilter, setCategoryFilter] = React.useState(null)
  const [accountFilter, setAccountFilter] = React.useState(null)
  const [statusFilter, setStatusFilter] = React.useState(null)
  const [hasFilter, setHasFilter] = React.useState(false)

  React.useEffect(() => {
    if(typeFilter || categoryFilter || accountFilter || statusFilter) setHasFilter(true)
    else setHasFilter(false)
  }, [typeFilter, categoryFilter, accountFilter, statusFilter, hasFilter])

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
        const dateBalance = convertToFloat(day[2].date.balance);
        const monthToDateBalance = convertToFloat(day[2].month_to_date.balance);
        const allToDateBalance = convertToFloat(day[2].all_to_date.balance);
        if(!hasFilter && day[2]){render.push(
        <div className={styles.balanceLine} key={day[0]}>
          {(dateBalance !== 'NaN') ? <span><span>Dia:</span> R$ {dateBalance}</span> : "."} 
          {(monthToDateBalance !== 'NaN') ? <span><span>Mês:</span> R$ {monthToDateBalance}</span> : "."} 
          {(allToDateBalance !== 'NaN') ? <span><span>Total:</span> R$ {allToDateBalance}</span> : "."} 
        </div>)}
      })
    }
    return render;
  }, [groupedTransactions, hasFilter, typeFilter, categoryFilter, accountFilter, statusFilter])
  
  const elementsToRender = criateElementsToRender()

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
  {(elementsToRender && elementsToRender.length > 0)
    ? elementsToRender.map((element) => {return element})
    : <span className={styles.noTransactions}>Nenhuma transação encontrada</span>     }   
 </div>

}


export default StatementList