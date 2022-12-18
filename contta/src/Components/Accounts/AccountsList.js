import React from 'react'
import styles from '../Elements/SideList.module.css'
import AppContext from '../../Contexts/AppContext'
import convertToFloat from '../../Helpers/convertToFloat'
import { Link } from 'react-router-dom'

const AccountsList = () => {

  const {groupedAccounts} = React.useContext(AppContext)

  console.log(groupedAccounts)

  return (
    <section className={styles.sideList}>
      {groupedAccounts.map((group, i) => {
        return (
          <div key={i}>
            <h4>{group[0]}</h4>
            <ul>
              {group[1].map((account) => {
              return(
                <li key={account.id} className={styles.item}>
                  <Link to={`${account.id}`}>
                    <span>{account.name}</span>
                    <span>{account.balance ? `R$ ${convertToFloat(account.balance.all_to_date.balance)}` : ""}</span>
                  </Link>
                </li>)
              })}
            </ul>
          </div>
        )
      })}

    </section>
  )
}

export default AccountsList