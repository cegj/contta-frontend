import React from 'react'
import convertToFloat from '../../Helpers/convertToFloat'
import styles from './StatementItem.module.css'
import {ReactComponent as IncomeIcon} from '../../assets/icons/income_icon.svg'
import {ReactComponent as ExpenseIcon} from '../../assets/icons/expense_icon.svg'
import {ReactComponent as TransferIcon} from '../../assets/icons/transfer_icon.svg'
import {ReactComponent as TransactionDateIcon} from '../../assets/icons/calendar_date_icon.svg'
import {ReactComponent as PaymentDateIcon} from '../../assets/icons/calendar_pay_icon.svg'
import convertDateToBr from '../../Helpers/convertDateToBr'

const StatementItem = ({type, description, value, account, category, transaction_date, payment_date}) => {

  let icon;
  if(type === 'R'){
    icon = <IncomeIcon />
  } else if (type === 'D'){
    icon = <ExpenseIcon />
  } else {
    icon = <TransferIcon />
  }

  return (
    <div className={`${styles.statementItem} ${styles[type]}`}>
      <span className={styles.typeIcon}>{icon}</span>
      <span className={styles.description}>{description}</span>
      <span className={styles.value}>R$ {convertToFloat(value)}</span>
      <span className={styles.account}>{account.name}</span>
      {category ? <span className={styles.category}>{category.name}</span> : <span></span>}
      <span className={styles.date}><TransactionDateIcon /> {convertDateToBr(transaction_date)}</span>
      <span className={styles.date}><PaymentDateIcon /> {convertDateToBr(payment_date)}</span>
      <span className={`${styles.menuBtn}`}></span>
    </div>
  )
}

export default StatementItem