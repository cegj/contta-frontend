import React from 'react'
import AppContext from '../../Contexts/AppContext'
import TransactionsContext from '../../Contexts/TransactionsContext'
import useDate from '../../Hooks/useDate'
import Modal from '../Elements/Modal'
import StatementItem from '../Statement/StatementItem'

const TransactionsOnBudget = ({catId, month, isOpen, setIsOpen}) => {

  const year = React.useContext(AppContext)
  const {getTransactions} = React.useContext(TransactionsContext)
  const [transactions, setTransactions] = React.useState(null);
  const {getFirstDay, getLastDay} = useDate()

  const getTransactionsOfSelected = React.useCallback(async(catId) => {
    const firstDay = getFirstDay(year, month)
    const lastDay = getLastDay(year, month)
    const transactions = await getTransactions({from: firstDay, to: lastDay, category: catId})
    setTransactions(transactions)
    console.log(transactions)
  }, [getTransactions, getFirstDay, getLastDay, month, year])

  React.useEffect(() => {
    getTransactionsOfSelected(catId)
  }, [catId, getTransactionsOfSelected])

  if (transactions) return (
    <div></div>
    // <Modal title={related.length > 1 ? `${related.length} transações relacionadas` : '1 transação relacionada'} isOpen={isOpen} setIsOpen={setIsOpen}>
    //   <div data-on-modal="true" style={{maxHeight: '350px', overflow: 'auto'}}>
    //     {related.map((transaction) => {
    //       return <StatementItem key={transaction.id} {...transaction}/>
    //     })}
    //   </div>
    // </Modal>
  )
  else return null
}

export default TransactionsOnBudget