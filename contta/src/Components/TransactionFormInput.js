import React from 'react'
import styles from './TransactionFormInput.module.css'
import Select from 'react-select'
import selectStyles from '../options/selectStyles'
import {ReactComponent as AttachIcon} from '../assets/icons/attach_icon_small.svg'
import setCurrencyMask from '../Helpers/setCurrencyMask'

const TransactionFormInput = ({type, name, label, value, onChange, style, options, setValue, reload, currency = false, keepAllValues, disabled = false}) => {

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

  React.useEffect(() => {
    setKeepValue(keepAllValues)
  }, [keepAllValues])

  if (type==='select') return(
  <span className={`${styles.formControl}`} style={style}>
    <span className={styles.labelContainer}>
      <label htmlFor={name}>{label}</label>
      <span data-tip="Manter valor" data-background-color="#a19f9f" className={`${styles.pinIconContainer} ${keepValue && styles.active}`} onClick={toggleKeepValue}><AttachIcon /></span>
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
    isDisabled={disabled}
    />
  </span>)
  else if (type==='checkbox') return (
    <span className={styles.checkboxControl} style={style}>
      <span className={styles.checkboxAndLabelContainer}>
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          checked={value}
          disabled={disabled}
          />
        <label htmlFor={name}>{label}</label>
      </span>
    <span data-tip="Manter valor" data-background-color="#a19f9f" className={`${styles.pinIconContainer} ${keepValue && styles.active}`} onClick={toggleKeepValue}><AttachIcon /></span>
  </span>)
  else return (
    <span className={`${styles.formControl}`} style={style}>
      <span className={styles.labelContainer}>
        <label htmlFor={name}>{label}</label>
        <span data-tip="Manter valor" data-background-color="#a19f9f" className={`${styles.pinIconContainer} ${keepValue && styles.active}`} onClick={toggleKeepValue}><AttachIcon /></span>
      </span>
        <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        >
        </input>
    </span>)
}

export default TransactionFormInput