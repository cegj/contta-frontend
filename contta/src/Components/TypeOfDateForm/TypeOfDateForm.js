import React from 'react'
import AppContext from '../../Contexts/AppContext'
import styles from './TypeOfDate.module.css'
import MessagesContext from '../../Contexts/MessagesContext'
import Modal from '../Elements/Modal'

const MonthYearForm = () => {

  const {setMessage} = React.useContext(MessagesContext)
  const {typeOfDateModalIsOpen, setTypeOfDateModalIsOpen, typeOfDate, setTypeOfDate} = React.useContext(AppContext)

  React.useEffect(() => {}, [typeOfDateModalIsOpen])

  function selectTypeOfDate({target}){
    window.localStorage.setItem('typeOfDate', target.dataset.value)
    setTypeOfDate(target.dataset.value)
    setTypeOfDateModalIsOpen(false)
    setMessage({content: `Data dos saldos alterada para ${target.innerText}`, type: "s"})
  }

  return (
    typeOfDateModalIsOpen &&
    <Modal title="Alterar data dos saldos" isOpen={typeOfDateModalIsOpen} setIsOpen={setTypeOfDateModalIsOpen}>
        <div className={styles.typeOfDateSelector}>
          <span data-value="transaction_date" className={typeOfDate === "transaction_date" ? styles.active : ""} onClick={selectTypeOfDate}>Data da transação</span>
          <span data-value="payment_date" className={typeOfDate === "payment_date" ? styles.active : ""} onClick={selectTypeOfDate}>Data do pagamento</span>
        </div>
        <div className={styles.info}>Escolha o tipo de data a ser considerado para calcular os saldos por toda a aplicação</div>
    </Modal>
)
}

export default MonthYearForm