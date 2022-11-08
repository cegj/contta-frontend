import React from 'react'
import AppName from './Elements/AppName'
import styles from './Header.module.css'

const Header = () => {
  return (
    <header className={styles.header}>
      <div style={{fontSize: '1.8rem'}}><AppName /></div>
    </header>
  )
}

export default Header