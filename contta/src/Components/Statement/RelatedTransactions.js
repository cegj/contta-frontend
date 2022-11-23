import React from 'react'
import TransactionsContext from '../../Contexts/TransactionsContext'
import Modal from '../Elements/Modal'
import StatementItem from './StatementItem'

const RelatedTransactions = ({id, isOpen, setIsOpen}) => {

  const {getTransactionById, transactions} = React.useContext(TransactionsContext)
  const [related, setRelated] = React.useState(null);

  const getRelatedTransactions = React.useCallback(async(id) => {
    const transactions = await getTransactionById(id)
    setRelated(transactions.allRelated)
  }, [getTransactionById])

  React.useEffect(() => {
    getRelatedTransactions(id)
  }, [id, getRelatedTransactions, transactions])

  if (related) return (
    <Modal title={related.length > 1 ? `${related.length} transações relacionadas` : '1 transação relacionada'} isOpen={isOpen} setIsOpen={setIsOpen}>
      {related.map((transaction) => {
        return <StatementItem key={transaction.id} {...transaction}/>
      })}
    </Modal>
  )
  else return null
}

export default RelatedTransactions