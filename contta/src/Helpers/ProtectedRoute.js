import React from 'react'
import { Navigate } from 'react-router-dom';
import UserContext from '../Contexts/UserContext'

const ProtectedRoute = ({children}) => {

  const {logged, getUser} = React.useContext(UserContext);

  if (logged){
    return children
  }

  const token = window.localStorage.getItem('token');
  if(token){
    getUser(token);
    return children
  }

  return <Navigate to="/" />
}

export default ProtectedRoute