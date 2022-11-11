import React from 'react'
import MessagesContext from '../../Contexts/MessagesContext'
import styles from './Messages.module.css'

const Messages = () => {

  const {message, setMessage, showMessages, setShowMessages} = React.useContext(MessagesContext);

  const messages = React.useMemo(() => {
    return [];
  }, [])

  React.useEffect(() => {
    if (message){
      messages.push(message)
      setShowMessages(true)
    }
    setMessage(null)
  },[message, messages, setMessage, setShowMessages])

  React.useEffect(() => {
    if(messages.length > 0){
      const timer = setTimeout(() => {
        setShowMessages(false)
        messages.length = 0;
      }, 10000);
      return () => clearTimeout(timer);  
    }}, [messages, messages.length, setShowMessages]);

    function closeMessage(event){
      event.target.parentElement.remove();
    }

  return (
    showMessages && <div className={styles.placeholder}>
      {messages.map((message, i) => {
        return <div className={`${styles.message} m-type-${message.type}`} key={i}>
          {message.content}
          <span className={styles.closeMessageBtn} onClick={closeMessage}>X</span>
        </div>
      })}
    </div>
  )
}

export default Messages