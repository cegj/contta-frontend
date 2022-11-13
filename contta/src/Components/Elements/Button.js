import React from 'react'
import styles from './Button.module.css'

const Button = ({children, type, ...props}) => {

  if (type === "confirm") type = styles.buttonConfirm;
  else if (type === "cancel") type = styles.buttonCancel;
  else type = styles.buttonNeutral;

  return (
      <button  className={`${styles.button} ${type}`} {...props}>{children}</button>
  )
}

export default Button