import React from 'react'
import { GET_USER, POST_LOGIN } from '../api';
import MessagesContext from './MessagesContext';

const UserContext = React.createContext();

export const UserContextData = ({children}) => {

  const { setMessage } = React.useContext(MessagesContext);

  const [user, setUser] = React.useState(null);
  const [logged, setLogged] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // React.useEffect(() => {
  //   console.log('User: ' + user);
  //   console.log('Logged ' + logged);
  //   console.log('Loading: ' + loading);
  //   console.log('Message: ' + message);
  // }, [user, logged, loading, message])

  const getUser = React.useCallback(async (token) => {
    try {
      setMessage(null);
      setLoading(true);
      const {url, options} = GET_USER(token);
      const response = await fetch(url, options);
      if (response.ok){
        const user = await response.json();
        setUser(user);
        setLogged(true);
        console.log(user)
        setMessage({content: `Usuário ${user.name} autenticado com sucesso`, type: 's'})
      } else {
        const json = await response.json();
        throw new Error(json.message);
      }
    } catch (error) {
      window.localStorage.removeItem('token');
      setMessage({content: `Não foi possível entrar: ${error.message}`, type: 'e'});
    } finally {
      setLoading(false); 
    }
  }, [setMessage])

  React.useEffect(() => {
    async function autoLogin(){
      const token = window.localStorage.getItem('token');
      if (token){
        getUser(token);
      }
    }
    autoLogin();
  }, [getUser])


  // async function getUser(token){
  //   try {
  //     setMessage(null);
  //     setLoading(true);
  //     const {url, options} = GET_USER(token);
  //     const response = await fetch(url, options);
  //     if (response.ok){
  //       const user = await response.json();
  //       setUser(user);
  //       setLogged(true);
  //     } else {
  //       const { message } = await response.json();
  //       throw new Error(message);
  //     }
  //   } catch (error) {
  //     window.localStorage.removeItem('token');
  //     setMessage(error);
  //   } finally {
  //     setLoading(false); 
  //   }
  // }

  async function userLogin(email, password) {
    try {
      setMessage(null);
      setLoading(true);
      const {url, options} = POST_LOGIN({email, password});
      const response = await fetch(url, options);
      if (response.ok){
        const {access_token} = await response.json()
        window.localStorage.setItem('token', access_token);
        getUser(access_token);  
      } else {
        const json = await response.json();
        throw new Error(json.error);
      }
    } catch (error) {
      window.localStorage.removeItem('token');
      setMessage({content: `Não foi possível entrar: ${error.message}`, type: 'e'});  
    } finally {
      setLoading(false);
    }
  }

  async function userLogout(){
    window.localStorage.removeItem('token');
    setUser(null);
    setLogged(false);
    setLoading(false);
    setMessage(null);
  }

  return (
    <UserContext.Provider value={{ userLogin, userLogout, user, logged, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext