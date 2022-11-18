import React from 'react'
import styles from './Statement.module.css'
import Header from '../Header'
import AppContext from '../../Contexts/AppContext'

const Statement = () => {

  const {setPageName} = React.useContext(AppContext)
  React.useEffect(() => {setPageName("Extrato")}, [setPageName])

  return (
    <>
      <Header />
      <div className={styles.container}>Statement</div>
    </>
  )
}

export default Statement