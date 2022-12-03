import React from 'react'
import AppContext from '../../Contexts/AppContext';
import UserContext from '../../Contexts/UserContext'
import styles from './AddTransactionButton.module.css'

const AddTransactionButton = () => {

  const {logged} = React.useContext(UserContext);
  const {setTransactionModalIsOpen} = React.useContext(AppContext);

  function handleClick(){
    setTransactionModalIsOpen(true);
  }

  return (
    logged && <div data-tip="Adicionar transação" className={styles.addTransactionButton} onClick={handleClick}></div>
  )
}

export default AddTransactionButton