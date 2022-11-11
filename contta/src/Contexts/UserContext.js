import React from 'react'
import { GET_USER, POST_LOGIN } from '../api';
import MessagesContext from './MessagesContext';
import useFetch from '../Hooks/useFetch';
import { useNavigate } from 'react-router-dom';

const UserContext = React.createContext();

export const UserContextData = ({children}) => {

  const { setMessage } = React.useContext(MessagesContext);
  const {request, loading} = useFetch();
  const [user, setUser] = React.useState(null);
  const [logged, setLogged] = React.useState(null);
  const navigate = useNavigate();

  const userLogout = React.useCallback(() => {
    window.localStorage.removeItem('token');
    setUser(null);
    setLogged(false);
    setMessage({content: "Sessão encerrada", type: 'n'});  
  }, [setMessage])

  const getUser = React.useCallback(async (token) => {
    try {
      const {url, options} = GET_USER(token);
      const {response, json, error} = await request(url, options);
      if (response.ok){
        const user = json;
        setUser(user);
        setLogged(true);
        setMessage({content: `${user.name} autenticado com sucesso`, type: 's'})
        navigate('/accounts')
      } else {
        throw new Error(error);
      }
    } catch (error) {
      userLogout();
      setMessage({content: `Não foi possível entrar: ${error.message}`, type: 'e'});
    }}, [setMessage, userLogout, request, navigate])

  React.useEffect(() => {
    async function autoLogin(){
      const token = window.localStorage.getItem('token');
      if (token){
        getUser(token);
      }
    }
    autoLogin();
  }, [getUser])

  async function userLogin(email, password) {
    try {
      const {url, options} = POST_LOGIN({email, password});
      const {response, json, error} = await request(url, options);
      console.log(error)
      if (response.ok){
        const {access_token} = json;
        window.localStorage.setItem('token', access_token);
        getUser(access_token);  
      } else {
        throw new Error(error);
      }
    } catch (error) {
      window.localStorage.removeItem('token');
      setMessage({content: `Não foi possível entrar: ${error.message}`, type: 'e'});  
    }}

  return (
    <UserContext.Provider value={{ userLogin, userLogout, user, logged, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext