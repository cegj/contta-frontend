import React from 'react'
import AppContext from '../../Contexts/AppContext'
import Header from '../Header'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import StatementList from '../Statement/StatementList'
import CategoriesList from './CategoriesList'
import TransactionsContext from '../../Contexts/TransactionsContext'
import useDate from '../../Hooks/useDate'
import {ReactComponent as CloseIcon} from '../../assets/icons/close_icon.svg'
import styles from './Categories.module.css'
import ReactTooltip from 'react-tooltip'

const Categories = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const {setPageName, setPageSubName, categories} = React.useContext(AppContext)
  const [categoryName, setCategoryName] = React.useState(null)
  const {month, year, typeOfDateBalance} = React.useContext(AppContext)
  const {getTransactions, updateTransactions, setUpdateTransactions} = React.useContext(TransactionsContext);
  const {getFirstDay, getLastDay} = useDate();
  const [transactions, setTransactions] = React.useState(null)

  const firstDay = getFirstDay(year, month);
  const lastDay = getLastDay(year, month);

  console.log(categories)

  const getAndSet = React.useCallback(async(categoryId) => {
    const transactions = await getTransactions({from: firstDay, to: lastDay, typeofdate: typeOfDateBalance, category: categoryId})
    setTransactions(transactions)    
  }, [firstDay, lastDay, typeOfDateBalance, getTransactions])

  React.useEffect(() => {
    ReactTooltip.rebuild()
    if(!transactions) {ReactTooltip.hide()}
  }, [transactions])

  React.useEffect(() => {
    const categoryId = location.pathname.split('/categories/')[1]
    if (categoryId){
      let name;
      categories.forEach((group) => {
        const result = group.categories.find(cat => cat.id === +categoryId)
        if (result) name = result.name
      })
      setCategoryName(name)
    } else {
      setCategoryName(null)
      setTransactions(null)
    }
}, [location, categories])

  React.useEffect(() => {
    const categoryId = location.pathname.split('/categories/')[1]
    if (categoryId) getAndSet(categoryId)
    setUpdateTransactions(false)
  }, [location, year, month, updateTransactions, setUpdateTransactions, getAndSet])

  React.useEffect(() => {
    setPageName('Categorias')
    if(categoryName) setPageSubName(categoryName)
    else setPageSubName(null)
  }, [setPageName, setPageSubName, categoryName])
  
  return (
    <>
      <Header />
      <div className="grid g-two">
        <CategoriesList categories={categories}/>
        <div>
          {categoryName && 
          <div className={styles.titleBar}>
            <h3>{categoryName}</h3>
            <span data-tip="Fechar extrato" className={styles.closeButton} onClick={() => {navigate('/categories')}} ><CloseIcon /></span>
          </div>}
          <Routes>
            <Route path="/:id" element={transactions && <StatementList transactions={transactions} categoryId={transactions.length > 0 && transactions[0].category_id}/>}/>
          </Routes>
        </div>
      </div>
    </>
  )
}

export default Categories