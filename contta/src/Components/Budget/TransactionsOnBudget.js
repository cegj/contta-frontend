import React from 'react'
import AppContext from '../../Contexts/AppContext'
import TransactionsContext from '../../Contexts/TransactionsContext'
import useDate from '../../Hooks/useDate'
import AddTransactionButton from '../Elements/AddTransactionButton'
import Modal from '../Elements/Modal'
import StatementList from '../Statement/StatementList'
import styles from './Budget.module.css'

const TransactionsOnBudget = ({catId, month, hideExpected, isOpen, setIsOpen, includeHiddenAccounts}) => {

  const {year, categories} = React.useContext(AppContext)
  const {getTransactions, updateTransactions, setUpdateTransactions} = React.useContext(TransactionsContext)
  const {getFirstDay, getLastDay} = useDate()
  // const [hasNoTransactions, setHasNoTransactions] = React.useState(false)
  const [category, setCategory] = React.useState(null)
  const [transactions, setTransactions] = React.useState(null);


  function setValuesToNewTransaction(){
      const firstDay = year + "-" + month + "-01";
      const initialValues = {category: {label: category.name, value: category.id}, "transaction-date": firstDay, "payment-date": firstDay}
      window.sessionStorage.setItem('transactionForm', JSON.stringify(initialValues))  
  }

  React.useEffect(() => {
    categories.forEach((group) => {
      const category = group.categories.find(cat => cat.id === +catId)
      if (category) {
        setCategory(category)
        return
      }
    })
  }, [catId, categories])

  const getAndSet = React.useCallback(async() => {
    const firstDay = getFirstDay(year, month)
    const lastDay = getLastDay(year, month)
    const transactions = await getTransactions({from: firstDay, to: lastDay, category: catId, typeofdate: 'payment_date', hideexpected: hideExpected, includehiddenaccounts: includeHiddenAccounts})
    setTransactions(transactions)
    //eslint-disable-next-line
  }, [catId, hideExpected, includeHiddenAccounts, month, year])

  React.useEffect(() => {
    getAndSet()
  }, [getAndSet])

  React.useEffect(() => {
    if(updateTransactions){
      getAndSet()
      setUpdateTransactions(false)
    }}, [getAndSet, updateTransactions, setUpdateTransactions])

  // const getTransactionsOfSelected = React.useCallback(async(catId) => {
  //   const firstDay = getFirstDay(year, month)
  //   const lastDay = getLastDay(year, month)
  //   const transactions = await getTransactions({from: firstDay, to: lastDay, category: catId, typeofdate: 'payment_date', hideexpected: hideExpected, includehiddenaccounts: includeHiddenAccounts})
  //   if (transactions.length === 0) setHasNoTransactions(true)
  //   else setTransactionsOfSelected(transactions)
  // }, [getTransactions, getFirstDay, getLastDay, month, year, setHasNoTransactions, hideExpected, includeHiddenAccounts])

  // React.useEffect(() => {
  //   if(updateTransactions) setHasNoTransactions(false)
  // }, [updateTransactions])

  // React.useEffect(() => {
  //   if(isOpen && (transactionsOfSelected.length === 0 || updateTransactions)){
  //     if (!hasNoTransactions) getTransactionsOfSelected(catId)
  //     setUpdateTransactions(false)
  //   }}, [isOpen, getTransactionsOfSelected, transactionsOfSelected, catId, hasNoTransactions, updateTransactions, setUpdateTransactions])

  if (isOpen) return (
    <Modal title={`Transações de ${category && category.name} em ${month}/${year}`} isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={styles.transactionsOnBudgetContainer} data-on-modal="true">
      {transactions && <StatementList transactions={transactions} categoryId={catId} />}
        <div onClick={setValuesToNewTransaction}>
          <AddTransactionButton />
        </div>
      </div>
    </Modal>
  )
  else return null
}

export default TransactionsOnBudget