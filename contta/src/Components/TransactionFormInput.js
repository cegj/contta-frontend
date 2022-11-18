import React from 'react'
import styles from './TransactionFormInput.module.css'
import Select from 'react-select'
import selectStyles from '../options/selectStyles'
import {ReactComponent as SaveIcon} from '../assets/icons/save_icon.svg'
import setCurrencyMask from '../Helpers/setCurrencyMask'

const TransactionFormInput = ({type, name, label, value, onChange, gridColumn, options, setValue, reload, currency = false}) => {

  const [keepValue, setKeepValue] = React.useState(false);

  React.useEffect(() => {
    if (window.localStorage.getItem(`keep-${name}`) === 'true') setKeepValue(window.localStorage.getItem(`keep-${name}`))
  }, [name])

  React.useEffect(() => {
    if (keepValue){
      const savedValue = window.localStorage.getItem(name);
      if(savedValue){
        if (type === 'select') setValue(JSON.parse(savedValue))
        else if (savedValue === "true" || savedValue === "false") setValue(JSON.parse(savedValue))
        else setValue(savedValue)
      }}
  }, [name, keepValue, setValue, type, reload])

  React.useEffect(() => {
    const wait = setTimeout(() => {
      if (type === 'select' && value) window.localStorage.setItem(name, JSON.stringify(value))
      else window.localStorage.setItem(name, value)  
    }, 50);
    return () => clearTimeout(wait);
  }, [name, type, value]);

  React.useEffect(() => {
    if(currency){
      setCurrencyMask(value, setValue)
    }
  }, [value, setValue, currency])

  function toggleKeepValue(){
    if (!keepValue) {
      setKeepValue(true)
      window.localStorage.setItem(`keep-${name}`, true)
    } else {
      setKeepValue(false)
      window.localStorage.setItem(`keep-${name}`, false)
      if (window.localStorage.getItem(name)) window.localStorage.removeItem(name)
    }
  }

  if (type==='select') return(
  <span className={`${styles.formControl}`} style={{gridColumn: gridColumn}}>
    <span className={styles.labelContainer}>
      <label htmlFor={name}>{label}</label>
      <span className={`${styles.pinIconContainer} ${keepValue && styles.active}`} onClick={toggleKeepValue}><SaveIcon /></span>
    </span>
    <Select
    name={name}
    id={name}
    placeholder="Selecione..."
    isClearable={true}
    styles={selectStyles}
    value={value}
    onChange={onChange}
    options={options}
    />
  </span>)
  else if (type==='checkbox') return (
    <span className={styles.checkboxControl}>
      <span className={styles.checkboxAndLabelContainer}>
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          checked={value}
          />
        <label htmlFor={name}>{label}</label>
      </span>
    <span className={`${styles.pinIconContainer} ${keepValue && styles.active}`} onClick={toggleKeepValue}><SaveIcon /></span>
  </span>)
  else return (
    <span className={`${styles.formControl}`} style={{gridColumn: gridColumn}}>
      <span className={styles.labelContainer}>
        <label htmlFor={name}>{label}</label>
        <span className={`${styles.pinIconContainer} ${keepValue && styles.active}`} onClick={toggleKeepValue}><SaveIcon /></span>
      </span>
        <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        >
        </input>
    </span>)
}

export default TransactionFormInput