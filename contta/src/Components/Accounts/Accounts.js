import React from 'react'
import AppContext from '../../Contexts/AppContext'
import Header from '../Header'
import { Routes, Route, useLocation } from 'react-router-dom'
import StatementList from '../Statement/StatementList'
import AccountsList from './AccountsList'

const Accounts = () => {

  const {setPageName, accounts} = React.useContext(AppContext)
  const [accountName, setAccountName] = React.useState(null)
  const location = useLocation();
  React.useEffect(() => {setPageName("Contas")}, [setPageName])
  
  React.useEffect(() => {
      const accountId = location.pathname.split('/accounts/')[1]
      if (accountId){
        const account = accounts.find(account => account.id === +accountId)
        setAccountName(account.name)
      }
  }, [location, accounts])

  return (
    <>
      <Header />
      <div className="grid g-two">
        <AccountsList/>
        <div>
          {accountName && <h3>{accountName}</h3>}
          <Routes>
            <Route path="/:id" element={<StatementList />}/>
          </Routes>
        </div>
      </div>
    </>
  )
}

export default Accounts