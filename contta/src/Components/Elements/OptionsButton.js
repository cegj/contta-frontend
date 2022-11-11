import React from 'react'
import styles from './OptionsButton.module.css'
import {ReactComponent as ExitIcon} from '../../assets/icons/exit_icon.svg'
import UserContext from '../../Contexts/UserContext'

const OptionsButton = () => {

  const {userLogout} = React.useContext(UserContext);


  return (
    <>
      <span className={styles.button} onClick={userLogout}><ExitIcon /></span>
    </>
  )
}

export default OptionsButton