import React from 'react'
import AppContext from '../../Contexts/AppContext'
import Modal from '../Elements/Modal'
import StatementBalanceSettings from './StatementBalanceSettings'

const Settings = () => {

  const {settingModalIsOpen, setSettingModalIsOpen} = React.useContext(AppContext)

  React.useEffect(() => {}, [settingModalIsOpen])

  return (
    settingModalIsOpen &&
    <Modal title="Configurações" isOpen={settingModalIsOpen} setIsOpen={setSettingModalIsOpen}>
      <StatementBalanceSettings />
    </Modal>
)
}

export default Settings