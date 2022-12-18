import React from 'react'
import { GET_ACCOUNTS, GET_CATEGORIES } from '../api';
import useFetch from '../Hooks/useFetch';
import MessagesContext from './MessagesContext';
import UserContext from './UserContext';
import groupBy from '../Helpers/groupBy';
import { GET_BALANCE } from '../api';

const AppContext = React.createContext();

export const AppContextData = ({children}) => {

  const date = new Date();

  const [pageName, setPageName] = React.useState(null);
  const [pageSubName, setPageSubName] = React.useState(null);
  const [month, setMonth] = React.useState(window.localStorage.getItem('month') || date.getMonth());
  const [year, setYear] = React.useState(window.localStorage.getItem('year') || date.getFullYear());
  const [categories, setCategories] = React.useState([]);
  const [accounts, setAccounts] = React.useState([]);
  const {setMessage} = React.useContext(MessagesContext);
  const {logged} = React.useContext(UserContext);
  const {request} = useFetch();
  const [transactionModalIsOpen, setTransactionModalIsOpen] = React.useState(false);
  const [monthYearModalIsOpen, setMonthYearModalIsOpen] = React.useState(false);
  const [settingModalIsOpen, setSettingModalIsOpen] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [transactionToEdit, setTransactionToEdit] = React.useState(null);
  const [loading, setLoading] = React.useState(false)
  const [groupedAccounts, setGroupedAccounts] = React.useState([])
  const [groupedCategories, setGroupedCategories] = React.useState([])
  const [typeOfDateBalance, setTypeOfDateBalance] = React.useState(window.localStorage.typeOfDateBalance || 'transaction_date');
  const [typeOfDateGroup, setTypeOfDateGroup] = React.useState(window.localStorage.typeOfDateGroup || 'transaction_date');
  const [includeExpectedOnBalance, setIncludeExpectedOnBalance] = React.useState(window.localStorage.includeExpectedOnBalance ? JSON.parse(window.localStorage.includeExpectedOnBalance) : false);


  React.useEffect(() => {
    if(pageName) document.title = `Contta - ${pageName} ${pageSubName ? ` / ${pageSubName}` : ""}`
    else document.title = `Contta`
  }, [pageName, pageSubName])

  // const getFirstDay = React.useCallback(() => {
  //   let first = new Date(year, +month-1, 1)
  //   first = first.toISOString().split('T')[0]
  //   return first;
  // }, [month, year])

  // const getLastDay = React.useCallback(() => {
  //   let last = new Date(year, month, 0)
  //   last = last.toISOString().split('T')[0]
  //   return last;
  // }, [month, year])

  // const [firstDay, setFirstDay] = React.useState(getFirstDay());
  // const [lastDay, setLastDay] = React.useState(getLastDay());

  const getBalance = React.useCallback(async({date = "", from = "", to = "", typeofdate = typeOfDateBalance, includeexpected = includeExpectedOnBalance, category = "", account = ""}) => {
    const token = window.localStorage.getItem('token')
    const query = { date, from, to, typeofdate, includeexpected, category, account}
    const {url, options} = GET_BALANCE(token, query)
    const {json, error} = await request(url, options)
    if (error) setMessage({content: `Erro ao obter saldo: ${error}`, type: 'e'})
    else return json
  }, [includeExpectedOnBalance, request, setMessage, typeOfDateBalance])

  React.useEffect(() => {
    if(logged){
      async function getCategories(){
        try {
          const {url, options} = GET_CATEGORIES(window.localStorage.getItem('token'));
          const {response, json, error} = await request(url, options);
          if (response.ok){
            setCategories(json.groups);
            setMessage({content: `${json.message}`, type: 'n'});
          } else {
            throw new Error(error)
          }
        } catch (error) {
          setMessage({content: `Não foi possível recuperar categorias: ${error.message}`, type: 'e'});
        }
      }
      if (categories.length === 0) getCategories()
    }
}, [request, setMessage, logged, categories.length])

React.useEffect(() => {
  if(logged){
    async function getAccounts(){
      try {
        const {url, options} = GET_ACCOUNTS(window.localStorage.getItem('token'));
        const {response, json, error} = await request(url, options);
        if (response.ok){
          setAccounts(json.accounts);
          setMessage({content: `${json.message}`, type: 'n'});
        } else {
          throw new Error(error)
        }
      } catch (error) {
        setMessage({content: `Não foi possível recuperar contas: ${error.message}`, type: 'e'});
      }
    }
    if (accounts.length === 0) getAccounts();  
  }
  }, [request, setMessage, logged, accounts.length])

  React.useEffect(() => {
    if (groupedAccounts.length === 0 && accounts.length > 0) {
      const grouped = Object.entries(groupBy(accounts, 'type'));
      grouped.forEach((typeGroup) => {
        typeGroup[1].forEach((account) => {
          account.balance = ""
        })
      })
      try {
        const token = window.localStorage.getItem('token')
        async function getBalance(){
          grouped.forEach((typeGroup) => {
            typeGroup[1].forEach(async(account) => {
              const query = {date: '2022-12-31', typeofdate: typeOfDateBalance, includeexpected: includeExpectedOnBalance, account: account.id}
              const {url, options} = GET_BALANCE(token, query)
              const {json} = await request(url, options)
              delete json.message;
              account.balance = json
            })  
        })}      
        getBalance();
      } catch (error) {
      } finally {
        setGroupedAccounts([...grouped])
      }
    }}, [accounts, groupedAccounts.length, request, includeExpectedOnBalance, typeOfDateBalance])

  React.useEffect(() => {
    if (groupedCategories.length === 0 && categories.length > 0) {
      const grouped = [...categories]
      grouped.forEach((group) => {
        group.categories.forEach((category) => {
          category.balance = ""
        })
      })
      try {
        const token = window.localStorage.getItem('token')
        async function getBalance(){
          grouped.forEach((group) => {
            group.categories.forEach(async(category) => {
              const query = {date: '2022-11-30', typeofdate: 'transaction_date', includeexpected: 'false', category: category.id}
              const {url, options} = GET_BALANCE(token, query)
              const {json} = await request(url, options)
              delete json.message;
              category.balance = json
            })  
        })}      
        getBalance();
      } catch (error) {
      } finally {
        setGroupedCategories([...grouped])
      }
    }}, [categories, groupedCategories.length, request])

  return (
    <AppContext.Provider value={
      {
        categories, groupedCategories,
        accounts, groupedAccounts,
        transactionModalIsOpen, setTransactionModalIsOpen,
        pageName, setPageName,
        pageSubName, setPageSubName,
        month, setMonth,
        year, setYear,
        monthYearModalIsOpen, setMonthYearModalIsOpen,
        reload, setReload,
        transactionToEdit, setTransactionToEdit,
        loading, setLoading,
        settingModalIsOpen, setSettingModalIsOpen,
        typeOfDateBalance, setTypeOfDateBalance,
        typeOfDateGroup, setTypeOfDateGroup,
        includeExpectedOnBalance, setIncludeExpectedOnBalance,
        getBalance
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppContext