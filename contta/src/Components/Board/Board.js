import React from 'react'
import AppContext from '../../Contexts/AppContext'
import Header from '../Header'

const Board = () => {

  const {setPageName} = React.useContext(AppContext)
  React.useEffect(() => {setPageName("Painel")}, [setPageName])

  return (
    <>
    <Header />
    <div className="grid g-one">
    <span className="noTransactions">O painel está em desenvolvimento e será disponibilizado em uma versão futura.</span>
    </div>
    </>
  )
}

export default Board