import React from 'react'
import styles from './Input.module.css'

const Input = ({ label, type, name, value, onChange, onBlur, error, required}) => {

  return (
    <div className={styles.formControl}>
      <label
        className={styles.label}
        htmlFor={name}>
          {label}
      </label>
      <input
        className={styles.input}
        type={type}
        name={name}
        id={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        required={required}
        />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}

export default Input