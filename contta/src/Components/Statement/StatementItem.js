import React from 'react'
import convertToFloat from '../../Helpers/convertToFloat'
import styles from './StatementItem.module.css'
import {ReactComponent as IncomeIcon} from '../../assets/icons/income_icon.svg'
import {ReactComponent as ExpenseIcon} from '../../assets/icons/expense_icon.svg'
import {ReactComponent as TransferIcon} from '../../assets/icons/transfer_icon.svg'
import {ReactComponent as InitialBalanceIcon} from '../../assets/icons/initial_balance_icon.svg'
import {ReactComponent as TransactionDateIcon} from '../../assets/icons/calendar_date_icon.svg'
import {ReactComponent as PaymentDateIcon} from '../../assets/icons/calendar_pay_icon.svg'
import {ReactComponent as AccountIcon} from '../../assets/icons/account_icon_small.svg'
import {ReactComponent as CategoryIcon} from '../../assets/icons/category_icon_small.svg'
import {ReactComponent as DoneIcon} from '../../assets/icons/done_fill_icon_small.svg'
import {ReactComponent as NotDoneIcon} from '../../assets/icons/done_icon_small.svg'
import {ReactComponent as BudgetIcon} from '../../assets/icons/table_icon_small.svg'
import {ReactComponent as HiddenAccountIcon} from '../../assets/icons/visibillity_off_icon_small.svg'
import convertDateToBr from '../../Helpers/convertDateToBr'
import useFetch from '../../Hooks/useFetch'
import { PATCH_EXPENSE, PATCH_INCOME, PATCH_TRANSFER } from '../../api'
import MessagesContext from '../../Contexts/MessagesContext'
import AppContext from '../../Contexts/AppContext'
import TransactionsContext from '../../Contexts/TransactionsContext'
import RelatedTransactions from './RelatedTransactions'
import ReactTooltip from 'react-tooltip'
import { Link } from 'react-router-dom'

const StatementItem = (transaction) => {

  const [optionsIsOpen, setOptionsIsOpen] = React.useState(false);
  const {request} = useFetch();
  const {setMessage} = React.useContext(MessagesContext);
  const {setUpdateAccountBalances, setUpdateCategoryBalances, setTransactionFormValues, setTransactionModalIsOpen} = React.useContext(AppContext);
  const {setUpdateTransactions, deleteTransaction, getTransactionById, typeOptions, categoryOptions, accountOptions} = React.useContext(TransactionsContext)
  const [transactionToGetRelated, setTransactionToGetRelated] = React.useState(null);
  const [relatedModalIsOpen, setRelatedModalIsOpen] = React.useState(true);
  const [isOnModal, setIsOnModal] = React.useState(false);

  const optionsMenu = React.useRef(null);

  React.useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  const statementItemElement = React.useRef(null)

  React.useEffect(() => {
    if (statementItemElement.current.parentElement.dataset.onModal === 'true') setIsOnModal(true)
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
  } else if (transaction.type === 'T'){
    icon = <TransferIcon />
  } else if (transaction.type === 'I'){
    icon = <InitialBalanceIcon />
  }

  React.useEffect(() => {
    if (!relatedModalIsOpen) setTransactionToGetRelated(null);
  }, [relatedModalIsOpen])

  function toggleOptions(){
    if (transaction.type !== 'I'){
      if (optionsIsOpen) setOptionsIsOpen(false)
      else setOptionsIsOpen(true)  
    }
    else {
      setMessage({content: `Não existem opções para saldo inicial. Edite a conta ${transaction.account.name} para alterar ou excluir.`, type: "a"})
    }
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

    async function getRelatedTransactions(id){
      const transactions = await getTransactionById(id);
      return transactions.allRelated
    }

    async function setEdittingValuesAndOpenForm(transaction) {
      const edittingValues = {}
      edittingValues.id = transaction.id
      edittingValues.type = typeOptions.find(type => type.value === transaction.type)
      edittingValues["transaction-date"] = transaction.transaction_date;
      edittingValues["payment-date"] = transaction.payment_date;
      edittingValues.value = transaction.value.toString();
      edittingValues.description = transaction.description;
      categoryOptions.forEach((group) => {
        const cat = group.options.find((category) => category.value === transaction.category_id)
        if (cat) {edittingValues.category = cat; return};
      })
      let relatedTransactions = null;
      if (transaction.type === "T") {relatedTransactions = await getRelatedTransactions(transaction.id)}
      if (transaction.type === "T"){
        edittingValues.account = accountOptions.find(account => account.value === relatedTransactions[0].account_id)
        edittingValues.destinationAccount = accountOptions.find(account => account.value === relatedTransactions[1].account_id)
      } else {
        edittingValues.account = accountOptions.find(account => account.value === transaction.account_id)
      }
      edittingValues.preview = transaction.preview;
      edittingValues.usual = transaction.usual;
      edittingValues["budget-control"] = transaction.budget_control;

      window.localStorage.setItem('transactionForm', JSON.stringify(edittingValues))  
      setTransactionModalIsOpen(true)
      }
  
    setEdittingValuesAndOpenForm(transaction)
    setOptionsIsOpen(false)
  }

  async function togglePreview(){
    if (transaction.type !== 'T' && transaction.type !== 'I' && !transaction.budget_control){
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
      if (transaction.type === 'T'){
        setMessage({content: 'Não é possível definir uma transferência como prevista', type: 'a'})
      } else
      if (transaction.type === 'I'){
        setMessage({content: 'Não é possível definir um saldo inicial como previsto', type: 'a'})
      } else 
      if (transaction.budget_control){
        setMessage({content: 'Não é possível definir uma transação de controle de orçamento como consolidada', type: 'a'})
      }
    }
  }

  return (
    <>
      <div className={`${styles.statementItem} ${styles[transaction.type]} ${(transaction.account && transaction.account.show === 0) ? styles.fromHiddenAccount : ""}`} ref={statementItemElement}>
        <div>
          <span className={styles.typeIcon}>{icon}</span>
        </div>
        <div>
          <div className={styles.line}>
            <span className={styles.description}>{transaction.description}</span>
            <span className={styles.value}>R$ {convertToFloat(transaction.value)}</span>
            {transaction.budget_control ?
            <span classList={styles.budgetControl} data-background-color="#a19f9f" data-delay-show="700" data-tip="Transação de controle de orçamento: não é considerada no cálculo dos saldos dos extratos e sofre abatimento automático"><BudgetIcon /></span> : ""}
            {(transaction.account && transaction.account.show === 0) ?
            <span classList={styles.hiddenAccount} data-background-color="#a19f9f" data-delay-show="700" data-tip="Transação vinculada a conta oculta: por padrão, não é considerado nos saldos, extratos e orçamentos"><HiddenAccountIcon /></span> : ""}
          </div>
          <div className={styles.line}>
            <span className={styles.metadata} data-background-color="#a19f9f" data-delay-show="700" data-tip="Data da transação"><TransactionDateIcon /> {convertDateToBr(transaction.transaction_date)}</span>
            <span className={styles.metadata} data-background-color="#a19f9f" data-delay-show="700" data-tip="Data do pagamento"><PaymentDateIcon /> {convertDateToBr(transaction.payment_date)}</span>
            <span className={styles.metadata}>{transaction.account
            ? <><AccountIcon /><Link data-background-color="#a19f9f" data-delay-show="700" data-tip="Conta" to={`/accounts/${transaction.account_id}`}>{transaction.account.name}</Link></>
            : <><AccountIcon /><Link data-background-color="#a19f9f" data-delay-show="700" data-tip="Conta" to={`/accounts/0`}>Sem conta</Link></>}</span>
            <span className={styles.metadata}>{transaction.category
            ? <><CategoryIcon /><Link data-background-color="#a19f9f" data-delay-show="700" data-tip="Categoria" to={`/categories/${transaction.category_id}`}>{transaction.category.name}</Link></>
            : <><CategoryIcon /><Link data-background-color="#a19f9f" data-delay-show="700" data-tip="Categoria" to={`/categories/0`}>Sem categoria</Link></>}</span>
          </div>
        </div>
        <div className={styles.buttonsContainer}>
        {transaction.installments_key &&
        <span
          data-tip={!isOnModal ? "Ver transações relacionadas" : null}
          onClick={!isOnModal ? () => {setTransactionToGetRelated(transaction.id); setRelatedModalIsOpen(true)} : null}
          className={`${styles.installmentNumber} ${isOnModal ? styles.onModal : ''}`}
          >{transaction.installment}</span>}
          <span data-tip={(transaction.type !== 'T' && transaction.type !== 'I' && !transaction.budget_control) ? !transaction.preview ? "Marcar como prevista" : "Marcar como consolidada" : ''} className={`${styles.preview} ${(transaction.type === 'T' || transaction.type === 'I' || transaction.budget_control) ? styles.notPointer : ''}`} onClick={togglePreview}>{!transaction.preview ? <DoneIcon /> : <NotDoneIcon />}</span>
          <span data-tip="Opções" data-menu-option className={`${styles.menuBtn} ${optionsIsOpen && styles.menuBtnActive} ${(transaction.type === 'I') ? styles.notPointer : ''}`} onClick={toggleOptions}></span>
        <div ref={optionsMenu} className={`${styles.menu} ${optionsIsOpen && styles.active}`}>
          <ul>
            <li data-menu-option className={styles.editIcon} onClick={handleEdit}>Editar</li>
            <li data-menu-option className={styles.deleteIcon} data-cascade="false" onClick={handleDelete}>Apagar</li>
            {transaction.installments_key && <li data-menu-option className={styles.deleteIcon} data-cascade="true" onClick={handleDelete}>Apagar a partir desta</li>}
          </ul>
        </div>
          </div>
      </div>
      
      {/* <div ref={statementItemElement} className={`${styles.statementItem} ${styles[transaction.type]} ${(transaction.account && transaction.account.show === 0) ? styles.fromHiddenAccount : ""}`}>
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
            {transaction.budget_control ? <span className={styles.budgetControl} data-background-color="#a19f9f" data-delay-show="700" data-tip="Transação de controle de orçamento: não é considerada no cálculo dos saldos dos extratos e sofre abatimento automático"><BudgetIcon /></span> : ""}
            </span>
          <span className={styles.value}>R$ {convertToFloat(transaction.value)}</span>
        </div>
        <div className={styles.container}>
          <span className={styles.account}>
            {transaction.account
            ? <Link data-background-color="#a19f9f" data-delay-show="700" data-tip="Conta" to={`/accounts/${transaction.account_id}`}>{transaction.account.name}</Link>
            : <Link data-background-color="#a19f9f" data-delay-show="700" data-tip="Conta" to={`/accounts/0`}>Sem conta</Link>}</span>
          <span className={styles.category}>
            {transaction.category
            ? <Link data-background-color="#a19f9f" data-delay-show="700" data-tip="Categoria" to={`/categories/${transaction.category_id}`}>{transaction.category.name}</Link>
            : <Link data-background-color="#a19f9f" data-delay-show="700" data-tip="Categoria" to={`/categories/0`}>Sem categoria</Link>}</span>
        </div>
        <div className={styles.container}>
          <span data-background-color="#a19f9f" data-delay-show="700" data-tip="Data da transação" className={styles.date}><TransactionDateIcon /> {convertDateToBr(transaction.transaction_date)}</span>
          <span data-background-color="#a19f9f" data-delay-show="700" data-tip="Data do pagamento" className={styles.date}><PaymentDateIcon /> {convertDateToBr(transaction.payment_date)}</span>
        </div> 
        <div className={styles.container}>
          <span data-tip={(transaction.type !== 'T' && transaction.type !== 'I' && !transaction.budget_control) ? !transaction.preview ? "Marcar como prevista" : "Marcar como consolidada" : ''} className={`${styles.preview} ${(transaction.type === 'T' || transaction.type === 'I' || transaction.budget_control) ? styles.notPointer : ''}`} onClick={togglePreview}>{!transaction.preview ? <DoneIcon /> : <NotDoneIcon />}</span>
        </div>
        <span data-tip="Opções" data-menu-option className={`${styles.menuBtn} ${optionsIsOpen && styles.menuBtnActive} ${(transaction.type === 'I') ? styles.notPointer : ''}`} onClick={toggleOptions}></span>
        <div ref={optionsMenu} className={`${styles.menu} ${optionsIsOpen && styles.active}`}>
          <ul>
            <li data-menu-option className={styles.editIcon} onClick={handleEdit}>Editar</li>
            <li data-menu-option className={styles.deleteIcon} data-cascade="false" onClick={handleDelete}>Apagar</li>
            {transaction.installments_key && <li data-menu-option className={styles.deleteIcon} data-cascade="true" onClick={handleDelete}>Apagar a partir desta</li>}
          </ul>
        </div>
      </div> */}
      {transactionToGetRelated && <RelatedTransactions id={transactionToGetRelated} isOpen={relatedModalIsOpen} setIsOpen={setRelatedModalIsOpen}/>}
    </>
  )
}

export default StatementItem