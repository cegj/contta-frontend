import React from 'react'
import UserContext from '../../Contexts/UserContext'

const Accounts = () => {
  const user = React.useContext(UserContext);
  console.log(user)

  return (
    <div>Accounts</div>
  )
}

export default Accounts