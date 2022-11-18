import React from 'react'
import AppContext from '../../Contexts/AppContext'
import Header from '../Header'

const Accounts = () => {

  const {setPageName} = React.useContext(AppContext)
  React.useEffect(() => {setPageName("Contas")}, [setPageName])

  return (
    <>
      <Header />
      <div>Accounts</div>
    </>
  )
}

export default Accounts