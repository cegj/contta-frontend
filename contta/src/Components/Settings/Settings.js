import React from 'react'
import AppContext from '../../Contexts/AppContext'
import Modal from '../Elements/Modal'
import BalanceSettings from './BalanceSettings'

const MonthYearForm = () => {

  const {settingModalIsOpen, setSettingModalIsOpen} = React.useContext(AppContext)

  React.useEffect(() => {}, [settingModalIsOpen])

  return (
    settingModalIsOpen &&
    <Modal title="Configurações" isOpen={settingModalIsOpen} setIsOpen={setSettingModalIsOpen}>
      <BalanceSettings />
    </Modal>
)
}

export default MonthYearForm