import React from 'react'
import AppName from './Elements/AppName'
import styles from './Header.module.css'
import MenuBar from './MenuBar'

const Header = () => {
  return (
    <>
      <header className={styles.header}>
        <div style={{fontSize: '1.6rem'}}><AppName /></div>
      </header>
      <MenuBar />
    </>
  )
}

export default Header