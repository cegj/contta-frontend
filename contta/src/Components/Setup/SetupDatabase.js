import React from 'react'
import { POST_SETUP_DATABASE } from '../../api';
import AppContext from '../../Contexts/AppContext';
import MessagesContext from '../../Contexts/MessagesContext';
import useFetch from '../../Hooks/useFetch';
import styles from './Setup.module.css';

const SetupDatabase = ({step, setStep}) => {

  const {request, fetchLoading} = useFetch();
  const {setLoading} = React.useContext(AppContext)
  const {setMessage} = React.useContext(MessagesContext)
  const [setingUpDatabase, setSetingUpDatabase] = React.useState(false)
  const [databaseIsSettedUp, setDatabaseIsSettedUp] = React.useState(undefined)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    setLoading(fetchLoading)
  }, [fetchLoading, setLoading])

  React.useEffect(() => {
    async function setupDatabase(){
    try{
      const {url, options} = POST_SETUP_DATABASE();
      setSetingUpDatabase(true);
      const {response, error} = await request(url, options)
      if (response.ok){setDatabaseIsSettedUp(true)}
        else {setDatabaseIsSettedUp(false); throw new Error(error)}
    } catch (error) {
      console.log(error)
      setError(error.message)
      setMessage({content: `Erro ao configurar banco de dados: ${error.message}`, type: "e"})
      return false;
    } finally {
      setSetingUpDatabase(false)
      setLoading(false)
    }}
  
    setupDatabase()
  }, [request, setMessage, setLoading])

  return (
    <div className={styles.contentBlock}>
      {setingUpDatabase
      ? <div><span className={`${styles.label} ${styles.neutral}`}>Aguarde...</span> Configurando banco de dados</div>
      : databaseIsSettedUp
      ? <>
          <div><span className={`${styles.label} ${styles.success}`}>Sucesso!</span> O banco de dados foi configurado com sucesso.</div>
          <button onClick={() => {setStep(step + 1)}}>Cadastrar usuário administrador</button>
        </>
      : <>
          <div><span className={`${styles.label} ${styles.error}`}>Erro!</span> Não foi possível configurar o banco de dados. Erro: {error}</div>
          <button onClick={() => {window.location.reload()}}>Reiniciar instalação</button>
        </>}
    </div>
  )
}

export default SetupDatabase