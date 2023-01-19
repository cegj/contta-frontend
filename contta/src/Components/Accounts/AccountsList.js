import React from 'react'
import styles from '../Elements/SideList.module.css'
import AppContext from '../../Contexts/AppContext'
import convertToFloat from '../../Helpers/convertToFloat'
import { Link } from 'react-router-dom'
import useDate from '../../Hooks/useDate'
import { GET_BALANCE } from '../../api'
import useFetch from '../../Hooks/useFetch'
import groupBy from '../../Helpers/groupBy'
import {ReactComponent as AddIcon} from '../../assets/icons/add_icon.svg'

const AccountsList = ({accounts, setFormIsOpen, updateAccountsList, setUpdateAccountsList}) => {

const {setMessage, month, year, typeOfDateBalance, includeExpectedOnBalance, updateAccountBalances, setUpdateAccountBalances, setLoading} = React.useContext(AppContext)
const {getLastDay} = useDate()
const [groupWithBalance, setGroupWithBalance] = React.useState(null)
const {request, fetchLoading} = useFetch();
const lastDay = getLastDay(year, month);

const getGroupWithBalance = React.useCallback((accounts) => {
  const grouped = Object.entries(groupBy(accounts, 'type'));
  grouped.forEach((typeGroup) => {
    typeGroup[1].forEach((account) => {
      account.balance = ""
    })})
  try {
    const token = window.localStorage.getItem('token')
    async function getBalance(){
      grouped.forEach((typeGroup) => {
        typeGroup[1].forEach(async (account) => {
          const query = {date: lastDay, typeofdate: typeOfDateBalance, includeexpected: includeExpectedOnBalance, account: account.id, includehiddenaccounts: true}
          const {url, options} = GET_BALANCE(token, query)
          const {response, json, error} = await request(url, options)
          if (response.ok){
            delete json.message;
            account.balance = json
            return true
          } else throw new Error(error)
        })
    })}
    getBalance();
  } catch (error) {
    console.log(error)
    setMessage({content: `Erro ao obter saldos das contas: ${error.message}`, type: "e"})
    return false;
} finally {
  setGroupWithBalance([...grouped])
}}, [includeExpectedOnBalance, typeOfDateBalance, lastDay, request, setMessage])

React.useEffect(() => {
  setLoading(fetchLoading)
}, [fetchLoading, setLoading])

React.useEffect(() => {
  setUpdateAccountBalances(true)
}, [month, year, includeExpectedOnBalance, setUpdateAccountBalances, typeOfDateBalance])

React.useEffect(() => {
  if (accounts.length > 0 && (updateAccountBalances || updateAccountsList)){
    getGroupWithBalance(accounts)
    setUpdateAccountBalances(false)
    setUpdateAccountsList(false)
  }
}, [accounts, accounts.length, updateAccountBalances, setUpdateAccountBalances, updateAccountsList, setUpdateAccountsList, getGroupWithBalance])

  if (groupWithBalance)
  return (
    <section className={styles.sideList}>
      <div className={styles.buttonsContainer}>
        <span data-tip="Criar conta" className={styles.closeButton} onClick={() => {setFormIsOpen(true)}} ><AddIcon /></span>
      </div>
      {groupWithBalance.map((group, i) => {
        return (
          <div key={i}>
            <h4>{group[0]}</h4>
            <ul>
              {group[1].map((account) => {
              return(
                <li key={account.id} className={`${styles.item} ${(account.show === 0) ? styles.hidden : ""}`}>
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
  else return null
}

export default AccountsList