import React from 'react'
import convertToFloat from '../../Helpers/convertToFloat'
import styles from './StatementItem.module.css'
import {ReactComponent as IncomeIcon} from '../../assets/icons/income_icon.svg'
import {ReactComponent as ExpenseIcon} from '../../assets/icons/expense_icon.svg'
import {ReactComponent as TransferIcon} from '../../assets/icons/transfer_icon.svg'
import {ReactComponent as TransactionDateIcon} from '../../assets/icons/calendar_date_icon.svg'
import {ReactComponent as PaymentDateIcon} from '../../assets/icons/calendar_pay_icon.svg'
import {ReactComponent as DoneIcon} from '../../assets/icons/done_icon_small.svg'
import {ReactComponent as NotDoneIcon} from '../../assets/icons/done_fill_icon_small.svg'
import convertDateToBr from '../../Helpers/convertDateToBr'

const StatementItem = ({type, description, value, account, category, transaction_date, payment_date, installments_key, installment, preview}) => {

  const [optionsIsOpen, setOptionsIsOpen] = React.useState(false);

  let icon;
  if(type === 'R'){
    icon = <IncomeIcon />
  } else if (type === 'D'){
    icon = <ExpenseIcon />
  } else {
    icon = <TransferIcon />
  }

  function toggleOptions(){
    if (optionsIsOpen) setOptionsIsOpen(false)
    else setOptionsIsOpen(true)
  }

  function handleDelete(){
   
    const confirmDelete = window.confirm("Confirmar exclusão?")
    console.log(confirmDelete);
  }

  return (
    <div className={`${styles.statementItem} ${styles[type]}`}>
      <div className={styles.container}>
        <span className={styles.typeIcon}>{icon}</span>
      </div>
      <div className={styles.container}>
        <span className={styles.description}>{description} {installments_key && `(${installment})`}</span>
        <span className={styles.value}>R$ {convertToFloat(value)}</span>
      </div>
      <div className={styles.container}>
        <span className={styles.account}>{account.name}</span>
        {category ? <span className={styles.category}>{category.name}</span> : <span></span>}
      </div>
      <div className={styles.container}>
        <span className={styles.date}><TransactionDateIcon /> {convertDateToBr(transaction_date)}</span>
        <span className={styles.date}><PaymentDateIcon /> {convertDateToBr(payment_date)}</span>
      </div>
      <div className={styles.container}>
        <span className={styles.date}>{!preview ? <DoneIcon /> : <NotDoneIcon />}</span>
      </div>
      <span className={`${styles.menuBtn} ${optionsIsOpen && styles.menuBtnActive}`} onClick={toggleOptions}></span>
      <div className={`${styles.menu} ${optionsIsOpen && styles.active}`}>
          <ul>
            <li className={styles.editIcon}>Editar</li>
            <li className={styles.deleteIcon} onClick={handleDelete}>Apagar</li>
          </ul>
        </div>
    </div>
  )
}

export default StatementItem