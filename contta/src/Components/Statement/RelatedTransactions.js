import React from 'react'
import TransactionsContext from '../../Contexts/TransactionsContext'
import Modal from '../Elements/Modal'
import StatementItem from './StatementItem'
import styles from './StatementList.module.css'

const RelatedTransactions = ({id, isOpen, setIsOpen}) => {

  const {getTransactionById, transactions, updateTransactions, setUpdateTransactions} = React.useContext(TransactionsContext)
  const [related, setRelated] = React.useState(null);

  const getRelatedTransactions = React.useCallback(async(id) => {
    const transactions = await getTransactionById(id)
    setRelated(transactions.allRelated)
    setUpdateTransactions(false)
  }, [getTransactionById, setUpdateTransactions])

  React.useEffect(() => {
    getRelatedTransactions(id)
  }, [id, getRelatedTransactions, transactions, updateTransactions])

  if (related) return (
    <Modal title={related.length > 1 ? `${related.length} transações relacionadas` : `${related.length} transação relacionada`} isOpen={isOpen} setIsOpen={setIsOpen}>
      <div data-on-modal="true" className={styles.relatedTransactionsContainer}>
        {related.map((transaction) => {
          return <StatementItem key={transaction.id} {...transaction}/>
        })}
      </div>
    </Modal>
  )
  else return null
}

export default RelatedTransactions