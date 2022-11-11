import React from 'react'

const MessagesContext = React.createContext();

export const MessagesContextData = ({children}) => {

  const [message, setMessage] = React.useState(null);
  const [showMessages, setShowMessages] = React.useState(false);

  return (
    <MessagesContext.Provider value={{ message, setMessage, showMessages, setShowMessages }}>
      {children}
    </MessagesContext.Provider>
  )
}

export default MessagesContext