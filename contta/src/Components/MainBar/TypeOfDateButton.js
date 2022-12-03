import React from 'react'
import styles from './MainBarButtons.module.css'
import {ReactComponent as EditTypeOfDateIcon} from '../../assets/icons/settings_icon.svg'
import AppContext from '../../Contexts/AppContext'
import ReactTooltip from 'react-tooltip'


const TypeOfDateButton = () => {

  const {typeOfDateModalIsOpen, setTypeOfDateModalIsOpen} = React.useContext(AppContext);

  React.useEffect(() => {
    ReactTooltip.rebuild()
    if(!typeOfDateModalIsOpen) {ReactTooltip.hide()}
  }, [typeOfDateModalIsOpen])

  function handleClick(){
    setTypeOfDateModalIsOpen(true);
  }

  return <span
    data-tip="Configurações"
    className={styles.button}
    onClick={handleClick}>
      <EditTypeOfDateIcon />
    </span>
}

export default TypeOfDateButton