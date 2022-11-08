import React from 'react'
import styles from './AppName.module.css'

const AppName = (props) => {
  return (
    <h1 className={styles.appName} style={{...props}}>Contta</h1>
  )
}

export default AppName