import React from 'react'
import { GET_ACCOUNTS, GET_CATEGORIES } from '../api';
import useFetch from '../Hooks/useFetch';
import MessagesContext from './MessagesContext';
import UserContext from './UserContext';
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
  const [transactionFormValues, setTransactionFormValues] = React.useState({});
  const [monthYearModalIsOpen, setMonthYearModalIsOpen] = React.useState(false);
  const [settingModalIsOpen, setSettingModalIsOpen] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [loading, setLoading] = React.useState(false)
  const [groupedCategories, setGroupedCategories] = React.useState([])
  const [typeOfDateBalance, setTypeOfDateBalance] = React.useState(window.localStorage.typeOfDateBalance || 'transaction_date');
  const [typeOfDateGroup, setTypeOfDateGroup] = React.useState(window.localStorage.typeOfDateGroup || 'transaction_date');
  const [includeExpectedOnBalance, setIncludeExpectedOnBalance] = React.useState(window.localStorage.includeExpectedOnBalance ? JSON.parse(window.localStorage.includeExpectedOnBalance) : false);
  const [updateAccountBalances, setUpdateAccountBalances] = React.useState(true);
  const [updateCategoryBalances, setUpdateCategoryBalances] = React.useState(true);

  React.useEffect(() => {
    if(pageName) document.title = `Contta - ${pageName} ${pageSubName ? ` / ${pageSubName}` : ""}`
    else document.title = `Contta`
  }, [pageName, pageSubName])

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
            // setMessage({content: `${json.message}`, type: 'n'});
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
          // setMessage({content: `${json.message}`, type: 'n'});
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
        categories, setCategories, groupedCategories,
        accounts, setAccounts,
        transactionModalIsOpen, setTransactionModalIsOpen,
        transactionFormValues, setTransactionFormValues,
        pageName, setPageName,
        pageSubName, setPageSubName,
        month, setMonth,
        year, setYear,
        monthYearModalIsOpen, setMonthYearModalIsOpen,
        reload, setReload,
        loading, setLoading,
        settingModalIsOpen, setSettingModalIsOpen,
        typeOfDateBalance, setTypeOfDateBalance,
        typeOfDateGroup, setTypeOfDateGroup,
        includeExpectedOnBalance, setIncludeExpectedOnBalance,
        updateAccountBalances, setUpdateAccountBalances,
        updateCategoryBalances, setUpdateCategoryBalances,
        getBalance
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppContext