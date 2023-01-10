import React from 'react'
import AppContext from '../../Contexts/AppContext'
import TransactionsContext from '../../Contexts/TransactionsContext'
import useDate from '../../Hooks/useDate'
import Modal from '../Elements/Modal'
import StatementList from '../Statement/StatementList'

const TransactionsOnBudget = ({catId, month, isOpen, setIsOpen}) => {

  const {year, typeOfDateBalance, categories} = React.useContext(AppContext)
  const {getTransactions} = React.useContext(TransactionsContext)
  const [transactionsOfSelected, setTransactionsOfSelected] = React.useState([]);
  const {getFirstDay, getLastDay} = useDate()
  const [hasNoTransactions, setHasNoTransactions] = React.useState(false)
  const [category, setCategory] = React.useState(null)

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
    const transactions = await getTransactions({from: firstDay, to: lastDay, category: catId, typeofdate: typeOfDateBalance})
    if (transactions.length === 0) setHasNoTransactions(true)
    else setTransactionsOfSelected(transactions)
    console.log(transactions)
  }, [getTransactions, getFirstDay, getLastDay, month, year, typeOfDateBalance, setHasNoTransactions])

  React.useEffect(() => {
    if(isOpen && transactionsOfSelected.length === 0){
      if (!hasNoTransactions) getTransactionsOfSelected(catId)
    }}, [isOpen, getTransactionsOfSelected, transactionsOfSelected.length, catId, hasNoTransactions])

  if (isOpen) return (
    <Modal title={`Transações de ${category && category.name} em ${month}/${year}`} isOpen={isOpen} setIsOpen={setIsOpen}>
      <div data-on-modal="true" style={{maxHeight: '350px', overflow: 'auto'}}>
        <StatementList transactions={transactionsOfSelected} categoryId={catId} />
      </div>
    </Modal>
  )
  else return null
}

export default TransactionsOnBudget