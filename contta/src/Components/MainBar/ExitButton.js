import React from 'react'
import styles from './MainBarButtons.module.css'
import {ReactComponent as ExitIcon} from '../../assets/icons/exit_icon.svg'
import UserContext from '../../Contexts/UserContext'
import ReactTooltip from 'react-tooltip'

const ExitButton = () => {

  const {userLogout} = React.useContext(UserContext);

  ReactTooltip.rebuild()

  return <span data-tip="Sair" className={styles.button} onClick={userLogout}><ExitIcon /></span>
}

export default ExitButton