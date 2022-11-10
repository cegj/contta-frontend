import React from 'react'

const MessagesContext = React.createContext();

export const MessagesContextData = ({children}) => {

  const [message, setMessage] = React.useState(null);

  return (
    <MessagesContext.Provider value={{ message, setMessage }}>
      {children}
    </MessagesContext.Provider>
  )
}

export default MessagesContext