import React from 'react'
import styles from '../Elements/SideList.module.css'
import AppContext from '../../Contexts/AppContext'
import convertToFloat from '../../Helpers/convertToFloat'
import { Link } from 'react-router-dom'
import useDate from '../../Hooks/useDate'
import { GET_BALANCE } from '../../api'
import useFetch from '../../Hooks/useFetch'

const CategoriesList = ({categories}) => {

const {setMessage, month, year, typeOfDateBalance, includeExpectedOnBalance, updateCategoryBalances, setUpdateCategoryBalances, setLoading} = React.useContext(AppContext)
const {getLastDay} = useDate()
const [groupWithBalance, setGroupWithBalance] = React.useState(null)
const {request, fetchLoading} = useFetch();
const lastDay = getLastDay(year, month);

const getGroupWithBalance = React.useCallback((categories) => {
  // const grouped = Object.entries(groupBy(categories, 'type'));
  categories.forEach((group) => {
    group.balance = "";
    group.categories.forEach((category) => {
      category.balance = "";
    })
  })
  try {
    const token = window.localStorage.getItem('token')
    async function getBalance(){
      categories.forEach(async (group) => {
        group.categories.forEach(async (category) => {
          const query = {date: lastDay, typeofdate: typeOfDateBalance, includeexpected: includeExpectedOnBalance, category: category.id}
          const {url, options} = GET_BALANCE(token, query)
          const {response, json, error} = await request(url, options)
          if (response.ok){
            delete json.message;
            category.balance = json
            return true
          } else throw new Error(error)
        })
      })}
    getBalance();
  } catch (error) {
      console.log(error)
      setMessage({content: `Erro ao obter saldos das categorias: ${error.message}`, type: "e"})
      return false;
  } finally {
    setGroupWithBalance([...categories])


  // grouped.forEach((typeGroup) => {
  //   typeGroup[1].forEach((category) => {
  //     category.balance = ""
  //   })})
//   try {
//     const token = window.localStorage.getItem('token')
//     async function getBalance(){
//       grouped.forEach((typeGroup) => {
//         typeGroup[1].forEach(async (category) => {
//           const query = {date: lastDay, typeofdate: typeOfDateBalance, includeexpected: includeExpectedOnBalance, category: category.id}
//           const {url, options} = GET_BALANCE(token, query)
//           const {response, json, error} = await request(url, options)
//           if (response.ok){
//             delete json.message;
//             category.balance = json
//             return true
//           } else throw new Error(error)
//         })
//     })}
//     getBalance();
//   } catch (error) {
//     console.log(error)
//     setMessage({content: `Erro ao obter saldos das categorias: ${error.message}`, type: "e"})
//     return false;
// } finally {
//   setGroupWithBalance([...grouped])
}}, [includeExpectedOnBalance, typeOfDateBalance, lastDay, request, setMessage])

React.useEffect(() => {
  setLoading(fetchLoading)
}, [fetchLoading, setLoading])

React.useEffect(() => {
  setUpdateCategoryBalances(true)
}, [month, year, includeExpectedOnBalance, setUpdateCategoryBalances, typeOfDateBalance])

React.useEffect(() => {
  if (categories && updateCategoryBalances){
    getGroupWithBalance(categories)
    setUpdateCategoryBalances(false)
  }
}, [categories, updateCategoryBalances, setUpdateCategoryBalances, getGroupWithBalance])

  if (groupWithBalance)
  return (
    <section className={styles.sideList}>
      {groupWithBalance.map((group, i) => {
        return (
          <div key={i}>
            <h4>{group.name}</h4>
            <ul>
              {group.categories.map((category) => {
              return(
                <li key={category.id} className={styles.item}>
                  <Link to={`${category.id}`}>
                    <span>{category.name}</span>
                    <span>{category.balance ? `R$ ${convertToFloat(category.balance.all_to_date.balance)}` : ""}</span>
                  </Link>
                </li>)
              })}
            </ul>
          </div>
        )
      })}

    </section>
  )
  else return null
}

export default CategoriesList