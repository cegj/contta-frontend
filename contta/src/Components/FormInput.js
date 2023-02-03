import React from 'react'
import styles from './FormInput.module.css'
import Select from 'react-select'
import selectStyles from '../options/selectStyles'
import {ReactComponent as AttachIcon} from '../assets/icons/attach_icon_small.svg'
import setCurrencyMask from '../Helpers/setCurrencyMask'

const FormInput = ({formName, type, name, label, value, onChange, style, options, setValue, reload, currency = false, disabled = false}) => {

  const [keepValue, setKeepValue] = React.useState(window.localStorage.getItem(`${formName}KeepValues`) ? JSON.parse(window.localStorage.getItem(`${formName}KeepValues`))[name] : false);

  React.useEffect(() => {
    const storedValues = JSON.parse(window.localStorage.getItem(formName))
    if (storedValues){
      storedValues[name] && setValue(storedValues[name]);
    }
    //eslint-disable-next-line  
  }, [name, formName])

  React.useEffect(() => {
    if (!keepValue) {
      const storedValues = JSON.parse(window.localStorage.getItem(formName));
      if (storedValues){
        delete storedValues[name];
        window.localStorage.setItem(formName, JSON.stringify(storedValues))  
      }
      const settedKeepValues = JSON.parse(window.localStorage.getItem(`${formName}KeepValues`))
      if (settedKeepValues){
        settedKeepValues[name] = false;
        window.localStorage.setItem(`${formName}KeepValues`, JSON.stringify(settedKeepValues))  
      }
    }

    if (keepValue){
      const settedKeepValues = JSON.parse(window.localStorage.getItem(`${formName}KeepValues`))
      if (settedKeepValues){
        settedKeepValues[name] = true;
        window.localStorage.setItem(`${formName}KeepValues`, JSON.stringify(settedKeepValues))  
      } else {
        window.localStorage.setItem(`${formName}KeepValues`, JSON.stringify({[name]: true}))  
      }
    }
  }, [keepValue, name, formName])

  React.useEffect(() => {
    if(keepValue){
      const storedValues = JSON.parse(window.localStorage.getItem(formName));
      if (storedValues){
        storedValues[name] = value;
        window.localStorage.setItem(formName, JSON.stringify(storedValues))  
      } else {
        window.localStorage.setItem(formName, JSON.stringify({[name]: value}))  
      }  
    }
  }, [name, formName, value, keepValue])

  React.useEffect(() => {
    if(currency){
      setCurrencyMask(value, setValue)
    }
  }, [value, setValue, currency])

  if (type==='select') return(
  <span className={`${styles.formControl}`} style={style}>
    <span className={styles.labelContainer}>
      <label htmlFor={name}>{label}</label>
      <span data-tip="Manter valor" data-background-color="#a19f9f" className={`${styles.pinIconContainer} ${keepValue && styles.active}`} onClick={() => {keepValue ? setKeepValue(false) : setKeepValue(true)}}><AttachIcon /></span>
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
    <span data-tip="Manter valor" data-background-color="#a19f9f" className={`${styles.pinIconContainer} ${keepValue && styles.active}`} onClick={() => {keepValue ? setKeepValue(false) : setKeepValue(true)}}><AttachIcon /></span>
  </span>)
  else return (
    <span className={`${styles.formControl}`} style={style}>
      <span className={styles.labelContainer}>
        <label htmlFor={name}>{label}</label>
        <span data-tip="Manter valor" data-background-color="#a19f9f" className={`${styles.pinIconContainer} ${keepValue && styles.active}`} onClick={() => {keepValue ? setKeepValue(false) : setKeepValue(true)}}><AttachIcon /></span>
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

export default FormInput