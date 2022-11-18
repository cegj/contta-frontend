import React from 'react'
import AppName from './Elements/AppName'
import styles from './Header.module.css'
import MainBar from './MainBar/MainBar'

const Header = () => {
  return (
    <>
      <header className={styles.header}>
        <div style={{fontSize: '1.6rem'}}><AppName /></div>
      </header>
      <MainBar />
    </>
  )
}

export default Header