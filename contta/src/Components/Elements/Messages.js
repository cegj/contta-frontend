import React from 'react'
import MessagesContext from '../../Contexts/MessagesContext'
import styles from './Messages.module.css'

const Messages = () => {

  const {message, setMessage} = React.useContext(MessagesContext);

  const messages = React.useMemo(() => {
    return [];
  }, [])

  React.useEffect(() => {
    if (message){
      messages.push(message)
    }
    setMessage(null)
  },[message, messages, setMessage])

  return (
    <div className={styles.placeholder}>
      {messages.map((message, i) => {
        return <div className={`${styles.message} m-type-${message.type}`} key={i}>{message.content}</div>
      })}
    </div>
  )
}

export default Messages