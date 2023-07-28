import React from 'react'
import styles from './StatementList.module.css'
import StatementItem from './StatementItem'
import StatementFilterBar from './StatementFilterBar'
import convertToFloat from '../../Helpers/convertToFloat'
import AppContext from '../../Contexts/AppContext'
import { GET_MONTH_BALANCE } from '../../api'
import groupBy from '../../Helpers/groupBy'
import useFetch from '../../Hooks/useFetch'
import StatementSeparator from './StatementSeparator'

const StatementList = ({transactions, accountId = '', categoryId = ''}) => {

  const [groupWithBalance, setGroupWithBalance] = React.useState(null)
  const [typeFilter, setTypeFilter] = React.useState(null)
  const [categoryFilter, setCategoryFilter] = React.useState(null)
  const [accountFilter, setAccountFilter] = React.useState(null)
  const [statusFilter, setStatusFilter] = React.useState(null)
  const [showSeparators, setShowSeparators] = React.useState(true)
  const [hasFilter, setHasFilter] = React.useState(false)
  const {setMessage, typeOfDateGroup, typeOfDateBalance, includeExpectedOnBalance, includeHiddenAccounts, setLoading} = React.useContext(AppContext)
  const {request, fetchLoading} = useFetch();

  React.useEffect(() => {
    setLoading(fetchLoading)
  }, [fetchLoading, setLoading])

  const getGroupWithBalance = React.useCallback((transactions) => {
    const grouped = Object.entries(groupBy(transactions, typeOfDateGroup));
    grouped.forEach((day) => {
      day.push({date: 0, month_to_date: 0, all_to_date: 0})
      day.push({firstOnFuture: false})
    })
    if (grouped.length > 0){
      try {
        const token = window.localStorage.getItem('token')
        async function getBalance(){
          const yearMonth = grouped[0][0].slice(0, -3) //use first day as reference to get year month
          const query = {yearmonth: yearMonth, typeofdate: typeOfDateBalance, includeexpected: includeExpectedOnBalance, includehiddenaccounts: includeHiddenAccounts, account: accountId, category: categoryId}
          const {url, options} = GET_MONTH_BALANCE(token, query)
          const {response, json, error} = await request(url, options)
          if (response.ok){
            grouped.forEach(async(day) => {
              const dayChar = +day[0].slice(-2)
              day[2] = json.balances[dayChar]
            })
          } else {
            throw new Error(error)
          }
        }           
        function checkIsToday(){
          const today = new Date()
          today.setHours(0,0,0,0)
          grouped.find((day) => {
            const dayDate = new Date(`${day[0]} 00:00:00`)
            if (dayDate > today){
              day[3].firstOnFuture = true;
              return true}
            else {
              return false
            }
          })
        }
        getBalance();
        checkIsToday();
      } catch (error) {
          console.log(error)
          setMessage({content: `Erro ao obter saldos: ${error.message}`, type: "e"})
          return false;
      } finally {
        setGroupWithBalance([...grouped])  
    }
    } else setGroupWithBalance(null)
  }, [includeExpectedOnBalance, typeOfDateBalance, typeOfDateGroup, accountId, categoryId, includeHiddenAccounts, setMessage, request])

  React.useEffect(() => {
    if(typeFilter || categoryFilter || accountFilter || statusFilter) setHasFilter(true)
    else setHasFilter(false)
  }, [typeFilter, categoryFilter, accountFilter, statusFilter, hasFilter])

  const criateElementsToRender = React.useCallback(() => {
    const render = [];
    if(groupWithBalance && groupWithBalance.length > 0){
      groupWithBalance.forEach((day) => {
        {!hasFilter && day[3].firstOnFuture && render.push(<StatementSeparator text="Transações futuras:" />)}
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
  }, [groupWithBalance, hasFilter, typeFilter, categoryFilter, accountFilter, statusFilter])
  
  React.useEffect(() => {
      getGroupWithBalance(transactions)
  }, [transactions, getGroupWithBalance])

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
    : <span className="noTransactions">Nenhuma transação encontrada</span>     }   

 </div>

}


export default StatementList