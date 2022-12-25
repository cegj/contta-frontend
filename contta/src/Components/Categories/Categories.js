import React from 'react'
import AppContext from '../../Contexts/AppContext'
import Header from '../Header'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import StatementList from '../Statement/StatementList'
import CategoriesList from './CategoriesList'
import TransactionsContext from '../../Contexts/TransactionsContext'
import useDate from '../../Hooks/useDate'
import {ReactComponent as CloseIcon} from '../../assets/icons/close_icon_small.svg'
import {ReactComponent as EditIcon} from '../../assets/icons/edit_icon_small.svg'
import {ReactComponent as DeleteIcon} from '../../assets/icons/delete_icon_small.svg'
import styles from './Categories.module.css'
import ReactTooltip from 'react-tooltip'
import useFetch from '../../Hooks/useFetch'
import { DELETE_CATEGORY } from '../../api'
import MessagesContext from '../../Contexts/MessagesContext'
import CategoriesForm from './CategoriesForm'

const Categories = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const {setPageName, setPageSubName, setLoading, categories, setCategories} = React.useContext(AppContext)
  const {setMessage} = React.useContext(MessagesContext)
  const {request, fetchLoading} = useFetch();
  const [categoryName, setCategoryName] = React.useState(null)
  const {month, year, typeOfDateBalance} = React.useContext(AppContext)
  const {getTransactions, updateTransactions, setUpdateTransactions} = React.useContext(TransactionsContext);
  const {getFirstDay, getLastDay} = useDate();
  const [transactions, setTransactions] = React.useState(null)
  const [selectedCategory, setSelectedCategory] = React.useState(null)
  const [updateCategoriesList, setUpdateCategoriesList] = React.useState(true)
  const [formIsOpen, setFormIsOpen] = React.useState(false)
  const [categoryToEdit, setCategoryToEdit] = React.useState(null)

  const firstDay = getFirstDay(year, month);
  const lastDay = getLastDay(year, month);

  React.useEffect(() => {
    setLoading(fetchLoading)
  }, [fetchLoading, setLoading])

  const handleDelete = React.useCallback(async() => {
    if (
      window.confirm(`Tem certeza de que deseja excluir a categoria ${categoryName.toUpperCase()}?`) &&
      window.confirm(`ATENÇÃO: Esta ação é irreversível. Ao excluir uma categoria, as transações associadas a ela serão mantidas sem uma categoria associada. Confirme novamente para prosseguir com a exclusão da categoria ${categoryName.toUpperCase()}, ou cancele para voltar atrás.`)
      ){
        try {
          const categoryId = location.pathname.split('/categories/')[1]
          const token = window.localStorage.getItem('token')
          const {url, options} = DELETE_CATEGORY(token, categoryId)
          const {response, error} = await request(url, options)
          if (response.ok){
            setMessage({content: 'Categoria excluída com sucesso', type: 's'})
            setCategories([])
            setUpdateCategoriesList(true)
            return true  
          } else { 
            throw new Error(error)
          }
        } catch (error) {
          console.log(error)
          setMessage({content: `Erro ao excluir categoria: ${error.message}`, type: "e"})
          return false;
        }}}, [location, request, setMessage, setCategories, categoryName])

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
    if (categoryId && categories.length > 0){
      let categoryWasFound = false;
      categories.forEach((group) => {
        const category = group.categories.find(cat => cat.id === +categoryId)
        if (category){
          setCategoryName(category.name)
          setSelectedCategory(category)
          categoryWasFound = true;
          return
        }})
        if (!categoryWasFound) navigate('/categories/')
    } else {
      setCategoryName(null)
      setTransactions(null)
    }
}, [location, categories, navigate])

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
        <CategoriesList categories={categories} updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList} setFormIsOpen={setFormIsOpen}/>
        <div>
          {categoryName && 
          <div className={styles.titleBar}>
            <h3>{categoryName}</h3>
            <div className={styles.btnsContainer}>
              <span data-tip="Excluir categoria" className={styles.closeButton} onClick={handleDelete} ><DeleteIcon /></span>
              <span data-tip="Editar categoria" className={styles.closeButton} ><EditIcon /></span>
              <span data-tip="Fechar extrato" className={styles.closeButton} onClick={() => {navigate('/categories')}} ><CloseIcon /></span>
            </div>
          </div>}
          <Routes>
            <Route path="/:id" element={transactions && <StatementList transactions={transactions} categoryId={transactions.length > 0 && transactions[0].category_id}/>}/>
            <Route path="/groups/:id" element={<div>Grupo</div>}/>

          </Routes>
        </div>
        <CategoriesForm isOpen={formIsOpen} setIsOpen={setFormIsOpen} setUpdateCategoriesList={setUpdateCategoriesList} categoryToEdit={categoryToEdit} setCategoryToEdit={setCategoryToEdit}/>
      </div>
    </>
  )
}

export default Categories