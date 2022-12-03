import React from 'react'
import { GET_ACCOUNTS, GET_CATEGORIES } from '../api';
import useFetch from '../Hooks/useFetch';
import MessagesContext from './MessagesContext';
import UserContext from './UserContext';

const AppContext = React.createContext();

export const AppContextData = ({children}) => {

  const date = new Date();

  const [pageName, setPageName] = React.useState(null);
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
  const [typeOfDate, setTypeOfDate] = React.useState(window.localStorage.typeOfDate || 'transaction_date');
  const [reload, setReload] = React.useState(false);
  const [transactionToEdit, setTransactionToEdit] = React.useState(null);
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if(pageName) document.title = `Contta - ${pageName}`
    else document.title = `Contta`
  }, [pageName])

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

  // React.useEffect(() => {
  //   setFirstDay(getFirstDay())
  //   setLastDay(getLastDay())
  // }, [month, year, getFirstDay, getLastDay])

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
      getCategories();    
    }
}, [request, setMessage, logged])

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
    getAccounts();  
  }
}, [request, setMessage, logged])

  return (
    <AppContext.Provider value={
      {
        categories,
        accounts,
        transactionModalIsOpen,
        setTransactionModalIsOpen,
        pageName,
        setPageName,
        month,
        setMonth,
        year,
        setYear,
        monthYearModalIsOpen,
        setMonthYearModalIsOpen,
        reload,
        setReload,
        transactionToEdit,
        setTransactionToEdit,
        loading,
        setLoading,
        settingModalIsOpen,
        setSettingModalIsOpen,
        typeOfDate,
        setTypeOfDate
      }}
      >
      {children}
    </AppContext.Provider>
  )
}

export default AppContext