import React from 'react'
import convertToFloat from '../../Helpers/convertToFloat'
import styles from './StatementItem.module.css'
import {ReactComponent as IncomeIcon} from '../../assets/icons/income_icon.svg'
import {ReactComponent as ExpenseIcon} from '../../assets/icons/expense_icon.svg'
import {ReactComponent as TransferIcon} from '../../assets/icons/transfer_icon.svg'
import {ReactComponent as TransactionDateIcon} from '../../assets/icons/calendar_date_icon.svg'
import {ReactComponent as PaymentDateIcon} from '../../assets/icons/calendar_pay_icon.svg'
import {ReactComponent as DoneIcon} from '../../assets/icons/done_fill_icon_small.svg'
import {ReactComponent as NotDoneIcon} from '../../assets/icons/done_icon_small.svg'
import convertDateToBr from '../../Helpers/convertDateToBr'
import useFetch from '../../Hooks/useFetch'
import { PATCH_EXPENSE, PATCH_INCOME, PATCH_TRANSFER } from '../../api'
import MessagesContext from '../../Contexts/MessagesContext'
import AppContext from '../../Contexts/AppContext'
import TransactionsContext from '../../Contexts/TransactionsContext'
import RelatedTransactions from './RelatedTransactions'
import ReactTooltip from 'react-tooltip'

const StatementItem = (transaction) => {

  const [optionsIsOpen, setOptionsIsOpen] = React.useState(false);
  const {request} = useFetch();
  const {setMessage} = React.useContext(MessagesContext);
  const {setTransactionToEdit, setUpdateAccountBalances, setUpdateCategoryBalances} = React.useContext(AppContext);
  const {setUpdateTransactions, deleteTransaction} = React.useContext(TransactionsContext)
  const [transactionToGetRelated, setTransactionToGetRelated] = React.useState(null);
  const [relatedModalIsOpen, setRelatedModalIsOpen] = React.useState(true);
  const [isOnModal, setIsOnModal] = React.useState(false);

  const optionsMenu = React.useRef(null);

  React.useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  const statementItemElement = React.useRef(null)

  React.useEffect(() => {
    if (statementItemElement.current.parentElement.id === 'modalContent') setIsOnModal(true)
    else setIsOnModal(false)
  }, [])

  const closeOptionsMenuOnClick = React.useCallback((event) => {
    if (!event.target.dataset.menuOption){
      setOptionsIsOpen(false)
      window.removeEventListener('click', closeOptionsMenuOnClick)
    }}, [])

  React.useEffect(() => {
    if (optionsIsOpen) window.addEventListener('click', closeOptionsMenuOnClick)
  }, [optionsIsOpen, closeOptionsMenuOnClick])

  let icon;
  if(transaction.type === 'R'){
    icon = <IncomeIcon />
  } else if (transaction.type === 'D'){
    icon = <ExpenseIcon />
  } else {
    icon = <TransferIcon />
  }

  React.useEffect(() => {
    if (!relatedModalIsOpen) setTransactionToGetRelated(null);
  }, [relatedModalIsOpen])

  function toggleOptions(){
    if (optionsIsOpen) setOptionsIsOpen(false)
    else setOptionsIsOpen(true)
  }

  async function handleDelete({target}){
    setOptionsIsOpen(false)
    const cascade = JSON.parse(target.dataset.cascade)
    const confirmDelete = window.confirm(`Confirmar a exclusão da transação "${transaction.description}" (${convertDateToBr(transaction.transaction_date)})${cascade ? ' e das suas parcelas seguintes?' : '?'}`)
    if (confirmDelete){
      deleteTransaction(transaction, cascade)
    }
  }

  async function handleEdit(){
    setOptionsIsOpen(false)
    setTransactionToEdit(transaction)
  }

  async function togglePreview(){
    if (transaction.type !== 'T'){
      const token = window.localStorage.getItem('token');
      let body;
      if (transaction.preview === 1){
        body = {preview: false}
      } else {
        body = {preview: true}
      }
      let url;
      let options;
      if (transaction.type === 'R') {({url, options} = PATCH_INCOME(body, token, transaction.id))}
      else if (transaction.type === 'D') {({url, options} = PATCH_EXPENSE(body, token, transaction.id))}
      else if (transaction.type === 'T') {({url, options} = PATCH_TRANSFER(body, token, transaction.id))}  
      try {
        const {response, error} = await request(url, options);
        if (response.ok){
          setUpdateTransactions(true)
          setUpdateAccountBalances(true)
          setUpdateCategoryBalances(true)
        } else {
          throw new Error(error)
        }
      } catch (error) {
        console.log(error)
        setMessage({content: `Erro ao alterar transação: ${error.message}`, type: "e"})
      }  
    } else {
      setMessage({content: 'Não é possível definir uma transferência como prevista', type: 'a'})
    }
  }

  return (
    <>
      <div ref={statementItemElement} className={`${styles.statementItem} ${styles[transaction.type]}`}>
        <div className={styles.container}>
          <span className={styles.typeIcon}>{icon}</span>
        </div>
        <div className={styles.container}>
          <span className={styles.description}>{transaction.description}
            {transaction.installments_key &&
            <span
              data-tip={!isOnModal ? "Ver transações relacionadas" : null}
              onClick={!isOnModal ? () => {setTransactionToGetRelated(transaction.id); setRelatedModalIsOpen(true)} : null}
              className={`${styles.installmentNumber} ${isOnModal ? styles.onModal : ''}`}>{transaction.installment}
            </span>}
            </span>
          <span className={styles.value}>R$ {convertToFloat(transaction.value)}</span>
        </div>
        <div className={styles.container}>
          <span className={styles.account}>{transaction.account.name}</span>
          {transaction.category ? <span className={styles.category}>{transaction.category.name}</span> : <span></span>}
        </div>
        <div className={styles.container}>
          <span className={styles.date}><TransactionDateIcon /> {convertDateToBr(transaction.transaction_date)}</span>
          <span className={styles.date}><PaymentDateIcon /> {convertDateToBr(transaction.payment_date)}</span>
        </div>
        <div className={styles.container}>
          <span data-tip={transaction.type !== 'T' ? !transaction.preview ? "Marcar como prevista" : "Marcar como consolidada" : ''} className={`${styles.preview} ${transaction.type === 'T' ? styles.notPointer : ''}`} onClick={togglePreview}>{!transaction.preview ? <DoneIcon /> : <NotDoneIcon />}</span>
        </div>
        <span data-menu-option className={`${styles.menuBtn} ${optionsIsOpen && styles.menuBtnActive}`} onClick={toggleOptions}></span>
        <div ref={optionsMenu} className={`${styles.menu} ${optionsIsOpen && styles.active}`}>
            <ul>
              <li data-menu-option className={styles.editIcon} onClick={handleEdit}>Editar</li>
              <li data-menu-option className={styles.deleteIcon} data-cascade="false" onClick={handleDelete}>Apagar</li>
              {transaction.installments_key && <li data-menu-option className={styles.deleteIcon} data-cascade="true" onClick={handleDelete}>Apagar a partir desta</li>}
            </ul>
          </div>
      </div>
      {transactionToGetRelated && <RelatedTransactions id={transactionToGetRelated} isOpen={relatedModalIsOpen} setIsOpen={setRelatedModalIsOpen}/>}
    </>
  )
}

export default StatementItem