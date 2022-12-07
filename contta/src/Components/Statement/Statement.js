import React from 'react'
import Header from '../Header'
import AppContext from '../../Contexts/AppContext'
import StatementList from './StatementList'

const Statement = () => {

  const {setPageName} = React.useContext(AppContext)
  React.useEffect(() => {setPageName("Extrato")}, [setPageName])

  return (
    <>
    <Header />
    <div className="grid g-one">
      <StatementList />
    </div>
    </>
  )
}

export default Statement