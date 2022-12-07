import React from 'react'
import AppContext from '../../Contexts/AppContext'
import SideList from '../Elements/SideList'
import Header from '../Header'
import { Routes, Route } from 'react-router-dom'
import StatementList from '../Statement/StatementList'

const Accounts = () => {

  const {setPageName} = React.useContext(AppContext)
  React.useEffect(() => {setPageName("Contas")}, [setPageName])

  const {accounts} = React.useContext(AppContext)
  
  return (
    <>
      <Header />
      <div className="grid g-two">
        <SideList items={accounts} group="type"/>
        <Routes>
          <Route path="/:id" element={<StatementList />}/>
        </Routes>
      </div>
    </>
  )
}

export default Accounts