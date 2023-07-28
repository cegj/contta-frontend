import React from 'react'
import styles from './StatementSeparator.module.css'

const StatementSeparator = ({text}) => {
  return (
    <div className={styles.separator}>{text}</div>
  )
}

export default StatementSeparator