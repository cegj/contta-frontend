import React from 'react'
import AppContext from '../../Contexts/AppContext'
import styles from './MonthYearForm.module.css'
import {ReactComponent as CloseIcon} from '../../assets/icons/close_icon.svg'
import Button from '../Elements/Button'
import MessagesContext from '../../Contexts/MessagesContext'

const MonthYearForm = () => {

  const {setMessage} = React.useContext(MessagesContext)
  const {monthYearModalIsOpen, setMonthYearModalIsOpen, month, year, setMonth, setYear} = React.useContext(AppContext)
  const [monthValue, setMonthValue] = React.useState(month);
  const [yearValue, setYearValue] = React.useState(year);

  React.useEffect(() => {}, [monthYearModalIsOpen])
  React.useEffect(() => {}, [month, year])

  function handleCloseForm(){
    setMonthYearModalIsOpen(false)
  }

  function selectMonth({target}){
    window.localStorage.setItem('month', target.innerText)
    setMonth(target.innerText)
    setMonthYearModalIsOpen(false)
  }

  function selectYear({target}){
    window.localStorage.setItem('year', target.innerText)
    setYear(target.innerText)
    setMonthYearModalIsOpen(false)
  }

  function validate(month, year){
    let monthIsInvalid = false;
    let yearIsInvalid = false;
    if (!month || month < 1 || month > 12) monthIsInvalid = true
    if (!year || !/^[12][0-9]{3}$/.test(year)) yearIsInvalid = true

    if (monthIsInvalid || yearIsInvalid){
      if (monthIsInvalid && yearIsInvalid){
        setMessage({content: "Informe um mês e um ano válidos", type: 'a'})
      } else if (monthIsInvalid){
        setMessage({content: "Informe um mês válido", type: 'a'})
      } else {
        setMessage({content: "Informe um ano válido", type: 'a'})
      }
      return false
    } else {
      return true
    }
  }

  function handleSubmit(event){
    event.preventDefault();
    if (!validate(monthValue, yearValue)){
      return false
    }
    window.localStorage.setItem('month', monthValue)
    window.localStorage.setItem('year', yearValue)
    setMonth(monthValue)
    setYear(yearValue)
    setMonthYearModalIsOpen(false)
  }

  return (
    monthYearModalIsOpen &&
    <div className={styles.modalContainer}>
      <div className={styles.formContainer}>
        <div className={styles.titleBar}>
          <h2>Editar mês/ano</h2>
          <span className={styles.buttonsContainer}>
            <span data-tip="Fechar" className={styles.closeButton} onClick={handleCloseForm} ><CloseIcon /></span>
          </span>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <span className={styles.inputsContainer}>
          <input
            className={`${styles.input} ${styles.month}`}
            type="number"
            value={monthValue}
            onChange={({target}) => {setMonthValue(target.value)}}
            ></input>
          /
          <input
            className={`${styles.input} ${styles.year}`}
            type="number"
            value={yearValue}
            onChange={({target}) => {setYearValue(target.value)}}></input>
          </span>
        <Button type="confirm" style={{gridColumn: '6', alignSelf: 'end'}}>Selecionar</Button>
        </form>
        <div className={styles.monthSelector}>
          <span onClick={selectMonth}>01</span>
          <span onClick={selectMonth}>02</span>
          <span onClick={selectMonth}>03</span>
          <span onClick={selectMonth}>04</span>
          <span onClick={selectMonth}>05</span>
          <span onClick={selectMonth}>06</span>
          <span onClick={selectMonth}>07</span>
          <span onClick={selectMonth}>08</span>
          <span onClick={selectMonth}>09</span>
          <span onClick={selectMonth}>10</span>
          <span onClick={selectMonth}>11</span>
          <span onClick={selectMonth}>12</span>
        </div>
        <div className={styles.yearSelector}>
          <span onClick={selectYear}>{+year-1}</span>
          <span onClick={selectYear}>{+year}</span>
          <span onClick={selectYear}>{+year+1}</span>
        </div>
      </div>
  </div>
)
}

export default MonthYearForm