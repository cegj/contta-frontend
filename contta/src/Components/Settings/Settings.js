import React from 'react'
import AppContext from '../../Contexts/AppContext'
import BudgetSettings from './BudgetSettings'
import Modal from '../Elements/Modal'
import StatementBalanceSettings from './StatementBalanceSettings'
import styles from './Settings.module.css'

const Settings = () => {

  const {settingModalIsOpen, setSettingModalIsOpen} = React.useContext(AppContext)

  React.useEffect(() => {}, [settingModalIsOpen])

  return (
    settingModalIsOpen &&
    <Modal title="Configurações" isOpen={settingModalIsOpen} setIsOpen={setSettingModalIsOpen}>
      <div className={styles.settingsContainer}>
        <StatementBalanceSettings />
        <BudgetSettings />
      </div>
    </Modal>
)
}

export default Settings