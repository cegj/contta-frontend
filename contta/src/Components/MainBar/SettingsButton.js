import React from 'react'
import styles from './MainBarButtons.module.css'
import {ReactComponent as SettingsIcon} from '../../assets/icons/settings_icon.svg'
import AppContext from '../../Contexts/AppContext'
import ReactTooltip from 'react-tooltip'


const SettingsButton = () => {

  const {settingModalIsOpen, setSettingModalIsOpen} = React.useContext(AppContext);

  React.useEffect(() => {
    ReactTooltip.rebuild()
    if(!settingModalIsOpen) {ReactTooltip.hide()}
  }, [settingModalIsOpen])

  function handleClick(){
    setSettingModalIsOpen(true);
  }

  return <span
    data-tip="Configurações"
    className={styles.button}
    onClick={handleClick}>
      <SettingsIcon />
    </span>
}

export default SettingsButton