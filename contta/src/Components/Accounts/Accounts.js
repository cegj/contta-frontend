import React from 'react'
import AppContext from '../../Contexts/AppContext'
import Header from '../Header'
import { Routes, Route } from 'react-router-dom'
import StatementList from '../Statement/StatementList'
import AccountsList from './AccountsList'

const Accounts = () => {

  const {setPageName} = React.useContext(AppContext)
  React.useEffect(() => {setPageName("Contas")}, [setPageName])
  
  return (
    <>
      <Header />
      <div className="grid g-two">
        <AccountsList/>
        <Routes>
          <Route path="/:id" element={<StatementList />}/>
        </Routes>
      </div>
    </>
  )
}

export default Accounts