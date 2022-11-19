import React from 'react'
import { GET_ACCOUNTS, GET_CATEGORIES } from '../api';
import useFetch from '../Hooks/useFetch';
import MessagesContext from './MessagesContext';
import UserContext from './UserContext';

const AppContext = React.createContext();

export const AppContextData = ({children}) => {

  const date = new Date();

  const [pageName, setPageName] = React.useState(null);
  const [month, setMonth] = React.useState(date.getMonth());
  const [year, setYear] = React.useState(date.getFullYear());
  const [categories, setCategories] = React.useState([]);
  const [accounts, setAccounts] = React.useState([]);
  const {setMessage} = React.useContext(MessagesContext);
  const {logged} = React.useContext(UserContext);
  const {request} = useFetch();
  const [transactionFormIsOpen, setTransactionFormIsOpen] = React.useState(false);
  const [monthYearModalIsOpen, setMonthYearModalIsOpen] = React.useState(false);
  const [firstDay, setFirstDay] = React.useState(null);
  const [lastDay, setLastDay] = React.useState(null);

  React.useEffect(() => {
    if(pageName) document.title = `Contta - ${pageName}`
    else document.title = `Contta`
  }, [pageName])

  React.useEffect(() => {
    let first = new Date(year, +month-1, 1)
    first = first.toISOString().split('T')[0]
    let last = new Date(year, month, 0)
    last = last.toISOString().split('T')[0]
    setFirstDay(first)
    setLastDay(last)
  }, [month, year])

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
        transactionFormIsOpen,
        setTransactionFormIsOpen,
        pageName,
        setPageName,
        month,
        setMonth,
        year,
        setYear,
        firstDay,
        lastDay,
        monthYearModalIsOpen,
        setMonthYearModalIsOpen
      }}
      >
      {children}
    </AppContext.Provider>
  )
}

export default AppContext