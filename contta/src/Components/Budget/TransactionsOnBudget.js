import React from 'react'
import AppContext from '../../Contexts/AppContext'
import TransactionsContext from '../../Contexts/TransactionsContext'
import useDate from '../../Hooks/useDate'
import AddTransactionButton from '../Elements/AddTransactionButton'
import Modal from '../Elements/Modal'
import StatementList from '../Statement/StatementList'

const TransactionsOnBudget = ({catId, month, includeExpected, isOpen, setIsOpen}) => {

  const {year, typeOfDateBalance, categories, setTransactionFormValues} = React.useContext(AppContext)
  const {getTransactions, updateTransactions, setUpdateTransactions} = React.useContext(TransactionsContext)
  const [transactionsOfSelected, setTransactionsOfSelected] = React.useState([]);
  const {getFirstDay, getLastDay} = useDate()
  const [hasNoTransactions, setHasNoTransactions] = React.useState(false)
  const [category, setCategory] = React.useState(null)

  function setValuesToNewTransaction(){
    setTransactionFormValues({category: {label: category.name, value: category.id}, transactionDate: `${year}-${month}-01`, paymentDate: `${year}-${month}-01`})
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

  const getTransactionsOfSelected = React.useCallback(async(catId) => {
    const firstDay = getFirstDay(year, month)
    const lastDay = getLastDay(year, month)
    const transactions = await getTransactions({from: firstDay, to: lastDay, category: catId, typeofdate: typeOfDateBalance, includeexpected: includeExpected})
    if (transactions.length === 0) setHasNoTransactions(true)
    else setTransactionsOfSelected(transactions)
  }, [getTransactions, getFirstDay, getLastDay, month, year, typeOfDateBalance, setHasNoTransactions, includeExpected])

  React.useEffect(() => {
    if(isOpen && (transactionsOfSelected.length === 0 || updateTransactions)){
      if (!hasNoTransactions) getTransactionsOfSelected(catId)
      setUpdateTransactions(false)
    }}, [isOpen, getTransactionsOfSelected, transactionsOfSelected.length, catId, hasNoTransactions, updateTransactions, setUpdateTransactions])

  if (isOpen) return (
    <Modal title={`Transações de ${category && category.name} em ${month}/${year}`} isOpen={isOpen} setIsOpen={setIsOpen}>
      <div data-on-modal="true" style={{maxHeight: '350px', overflow: 'auto'}}>
        <StatementList transactions={transactionsOfSelected} categoryId={catId} />
        <div onClick={setValuesToNewTransaction}>
          <AddTransactionButton />
        </div>
      </div>
    </Modal>
  )
  else return null
}

export default TransactionsOnBudget