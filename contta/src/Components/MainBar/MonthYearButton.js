import React from 'react'
import styles from './MainBarButtons.module.css'
import {ReactComponent as EditDateIcon} from '../../assets/icons/calendar_icon.svg'
import AppContext from '../../Contexts/AppContext'
import ReactTooltip from 'react-tooltip'


const MonthYearButton = () => {

  const {monthYearModalIsOpen, setMonthYearModalIsOpen} = React.useContext(AppContext);

  React.useEffect(() => {
    ReactTooltip.rebuild()
    if(!monthYearModalIsOpen) {ReactTooltip.hide()}
  }, [monthYearModalIsOpen])

  function handleClick(){
    setMonthYearModalIsOpen(true);
  }

  return <span
    data-tip="Alterar mês/ano"
    className={styles.button}
    onClick={handleClick}>
      <EditDateIcon />
    </span>
}

export default MonthYearButton