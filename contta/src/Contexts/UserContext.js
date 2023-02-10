import React from 'react'
import { GET_USER, POST_CREATE_USER, POST_LOGIN } from '../api';
import MessagesContext from './MessagesContext';
import useFetch from '../Hooks/useFetch';
import { useNavigate } from 'react-router-dom';

const UserContext = React.createContext();

export const UserContextData = ({children}) => {

  const { setMessage } = React.useContext(MessagesContext);
  const {request, fetchLoading} = useFetch();
  const [user, setUser] = React.useState(null);
  const [logged, setLogged] = React.useState(false);
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
        navigate('/board')
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
    if(!logged){
      autoLogin();
    }
  }, [getUser, logged])

  async function userLogin(email, password) {
    try {
      const {url, options} = POST_LOGIN({email, password});
      const {response, json, error} = await request(url, options);
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

    async function createUser(body) {
      try {
        const {url, options} = POST_CREATE_USER(body);
        const {response, json, error} = await request(url, options);
        if (response.ok){
          setMessage({content: `Usuário ${body.name} criado com sucesso`, type: 's'})
          return json.createdUser;
        } else {
          throw new Error(error);
        }
      } catch (error) {
        setMessage({content: `Não foi possível criar usuário: ${error.message}`, type: 'e'});
        return false;  
      }}  

  return (
    <UserContext.Provider value={{ userLogin, userLogout, createUser, user, logged, fetchLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext