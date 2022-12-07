import React from 'react'
import styles from './SideList.module.css'
import groupBy from '../../Helpers/groupBy'
// import TransactionsContext from '../../Contexts/TransactionsContext'
import useFetch from '../../Hooks/useFetch'
import { GET_BALANCE } from '../../api'
import convertToFloat from '../../Helpers/convertToFloat'
import { Link } from 'react-router-dom'

const SideList = ({items, group}) => {

  const [grouped, setGrouped] = React.useState([])

  const {request} = useFetch()

  React.useEffect(() => {
    setGrouped(groupBy(items, group))
  }, [])

  React.useEffect(() => {
    Object.entries(grouped).forEach((group,i) => {
      async function setBalance(id){
        const token = window.localStorage.getItem('token')
        const {url, options} = GET_BALANCE(token, {date: "2022-11-30", typeofdate: "transaction_date", includeexpected: "false", account: id})
        const {json} = await request(url, options)
        return json.all_to_date.balance
      }
      group[1].forEach((item) => {
        item.balance = "";
      })
      group[1].forEach(async(item) => {
        item.balance = await setBalance(item.id);
      })
    })
  }, [request, grouped])

  return (
    <section className={styles.sideList}>
      {/* {elementsToRender && elementsToRender.map((element) => {return element})} */}
      {Object.entries(grouped).map((group) => {

        const list = []

        list.push(
          <ul>
            {group[1].map((item) => {
              return (
              <li className={styles.item} key={item.id}>
                <Link to={`${item.id}`}>
                  <span>{item.name}</span>
                  <span>{item.balance ? `R$ ${convertToFloat(item.balance)}` : ""}</span>
                </Link>
              </li>
              )})}
          </ul>
        )
    
      return (
          <div>
            <h4>{group[0]}</h4>
            {list}
          </div>
        )
      })}
    </section>
  )
}

export default SideList