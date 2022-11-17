import React from 'react'
import styles from './TransactionFormInput.module.css'
import Select from 'react-select'
import selectStyles from '../options/selectStyles'
import {ReactComponent as SaveIcon} from '../assets/icons/save_icon.svg'

const TransactionFormInput = ({type, name, label, value, onChange, gridColumn, options, setValue}) => {

  const [keepValue, setKeepValue] = React.useState(false);

  React.useEffect(() => {
    if (window.localStorage.getItem(`keep-${name}`) === 'true') setKeepValue(window.localStorage.getItem(`keep-${name}`))
  }, [name])

  React.useEffect(() => {
    if (keepValue){
      if(window.localStorage.getItem(name)){
        if (type === 'select') setValue(JSON.parse(window.localStorage.getItem(name)))
        else setValue(window.localStorage.getItem(name))
      }}
  }, [name, keepValue, setValue, type])

  React.useEffect(() => {
    const wait = setTimeout(() => {
      if (type === 'select' && value.value) window.localStorage.setItem(name, JSON.stringify(value))
      else window.localStorage.setItem(name, value)  
    }, 50);
    return () => clearTimeout(wait);
  }, [name, type, value]);

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

  return (
    <span className={`${styles.formControl}`} style={{gridColumn: gridColumn}}>
      <span className={styles.labelContainer}>
        <label htmlFor={name}>{label}</label>
        <span className={`${styles.pinIconContainer} ${keepValue && styles.active}`} onClick={toggleKeepValue}><SaveIcon /></span>
      </span>
      {type==="select" ? 
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
  :
    <input
    type={type}
    name={name}
    id={name}
    value={value}
    onChange={onChange}>
    </input>
  }
  </span>
)
}

export default TransactionFormInput