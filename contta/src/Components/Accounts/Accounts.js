import React from 'react'
import AppContext from '../../Contexts/AppContext'
import SideList from '../Elements/SideList'
import Header from '../Header'

const Accounts = () => {

  const {setPageName} = React.useContext(AppContext)
  React.useEffect(() => {setPageName("Contas")}, [setPageName])

  const {accounts} = React.useContext(AppContext)

  return (
    <>
      <Header />
      <div className="grid-two">
        <SideList items={accounts} group="type"/>
      </div>
    </>
  )
}

export default Accounts