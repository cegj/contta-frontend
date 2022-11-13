import React from 'react'
import AppContext from '../../Contexts/AppContext';
import UserContext from '../../Contexts/UserContext'
import styles from './AddTransactionButton.module.css'

const AddTransactionButton = () => {

  const {logged} = React.useContext(UserContext);
  const {setTransactionFormIsOpen} = React.useContext(AppContext);

  function handleClick(){
    setTransactionFormIsOpen(true);
  }

  return (
    logged && <div className={styles.addTransactionButton} onClick={handleClick}></div>
  )
}

export default AddTransactionButton