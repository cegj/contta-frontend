import React from 'react'
import { GET_CHECK_TABLES } from '../../api';
import AppContext from '../../Contexts/AppContext';
import MessagesContext from '../../Contexts/MessagesContext';
import useFetch from '../../Hooks/useFetch';
import styles from './Setup.module.css';

const CheckTables = ({step, setStep}) => {

  const {request, fetchLoading} = useFetch();
  const {setLoading} = React.useContext(AppContext)
  const {setMessage} = React.useContext(MessagesContext)
  const [checkingTables, setCheckingTables] = React.useState(false)
  const [tablesAreEmpty, setTablesAreEmpty] = React.useState(undefined)

  React.useEffect(() => {
    setLoading(fetchLoading)
  }, [fetchLoading, setLoading])

  React.useEffect(() => {
    async function checkTables(){
    try{
      const {url, options} = GET_CHECK_TABLES();
      setCheckingTables(true);
      const {response, json, error} = await request(url, options)
      if (response.ok){
        if (json.hasNoTables) {setTablesAreEmpty(true)}
        else setTablesAreEmpty(false)
      }
      else throw new Error(error)
    } catch (error) {
      console.log(error)
      setMessage({content: `Erro ao verificar tabelas: ${error.message}`, type: "e"})
      return false;
    } finally {
      setCheckingTables(false)
      setLoading(false)
    }}
  
    checkTables()
  }, [request, setMessage, setLoading, setTablesAreEmpty, step, setStep])

  return (
    <div className={styles.contentBlock}>
      {checkingTables
      ? <div><span className={`${styles.label} ${styles.neutral}`}>Aguarde...</span> Verificando se o banco de dados está vazio</div>
      : tablesAreEmpty
      ? <>
          <div><span className={`${styles.label} ${styles.success}`}>Sucesso!</span> O banco de dados está vazio e pronto para ser configurado.</div>
          <button onClick={() => {setStep(step + 1)}}>Configurar banco de dados</button>
        </>
      : <>
          <div><span className={`${styles.label} ${styles.error}`}>Erro!</span> Não é possível iniciar a instalação pois já existem tabelas criadas no banco de dados. Para realizar uma instalação limpa, é necessário apagar todas as tabelas por meio do seu software gerenciador de banco de dados.</div>
          <button onClick={() => {window.location.reload()}}>Reiniciar instalação</button>
        </>}
    </div>
  )
}

export default CheckTables