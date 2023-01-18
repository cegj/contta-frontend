import React from 'react'
import { POST_LOGIN, POST_SETUP_CATEGORIES } from '../../api'
import MessagesContext from '../../Contexts/MessagesContext'
import useFetch from '../../Hooks/useFetch'
import Button from '../Elements/Button'
import styles from './Setup.module.css'

const SetupCategories = ({step, setStep, user}) => {
  const [setupStandardCategories, setSetupStandardCategories] = React.useState(true)
  const [showCategoriesList, setShowCategoriesList] = React.useState(false)
  const [creatingCategories, setCreatingCategories] = React.useState(false)
  const [categoriesAreCreated, setCategoriesAreCreated] = React.useState(false)
  const [error, setError] = React.useState(null)
  const {request, fetchLoading} = useFetch();
  const {setMessage} = React.useContext(MessagesContext)

  const standardCategories = {
    "Automóvel": ["Combustível", "Estacionamento", "IPVA", "Manutenção veicular", "Multas", "Pedágio", "Seguro veicular", "Outros (Automóvel)"],
    "Compras": ["Presentes e doações", "Produtos em geral", "Supermercado", "Vestuário", "Outros (Compras)"],
    "Dívidas": ["Cartões de crédito", "Empréstimos", "Financiamentos", "Outros (Dívidas)"],
    "Educação": ["Cursos", "Faculdade", "Material escolar", "Outros (Educação)"],
    "Lazer": ["Cinema e filmes", "Comida e bebida", "Gastos gerais com viagens", "Hospedagem", "Passagens", "Passeios", "Shows e teatro", "Outros (Lazer)"],
    "Moradia": ["Água e gás", "Aluguel", "Condomínio", "Energia elétrica", "IPTU", "Manutenção residencial", "TV e internet", "Outros (Moradia)"],
    "Pets": ["Acessórios e brinquedos pet", "Alimentação pet", "Hospedagem pet", "Saúde e higiene pet", "Outros (Pet)"],
    "Receitas": ["Salário", "Outros (Receitas)"],
    "Saúde": ["Academia e exercícios", "Consultas e exames", "Medicamentos e produtos", "Plano de saúde", "Outros (Saúde)"],
    "Serviços": ["Burocracias", "Cabelereiro e estética", "Celular", "Lavanderia", "Seguros diversos", "Serviços online", "Outros (Serviços)"],
    "Transporte": ["Transporte público", "Táxi/Uber", "Outros (Transporte)"]
  }

  function selectSetupStandardCategories({target}){
    setSetupStandardCategories(JSON.parse(target.dataset.value))
  }

  function handleSetupCategories(){
    async function createStandardCategories(){
      try {
        setCreatingCategories(true)
        let token;
        const loginBody = {email: user.email, password: user.password}
        const logimParams = POST_LOGIN(loginBody)
        const login = await request(logimParams.url, logimParams.options)
        if (login.response.ok){
          token = login.json.access_token
        } else {
          throw new Error(login.error)
        }
        const {url, options} = POST_SETUP_CATEGORIES(token)
        const {response, json, error} = await request(url, options)
        if (response.ok){
          setError(null)
          setMessage({content: json.message, type: "s"})
          setCategoriesAreCreated(true)
          return true
        } else {
          throw new Error(error)
        } 
      } catch (error) {
        console.log(error)
        setError(error)
        setMessage({content: `Erro ao criar categorias pré-definidas: ${error.message}`, type: "e"})
        return false;
      } finally {
        setCreatingCategories(false)
      }}  

      if (setupStandardCategories){
        createStandardCategories()
      } else {
        setError(null)
        setCategoriesAreCreated(true)
      }
  }

  return (
      <div className={styles.contentBlock}>
        {!categoriesAreCreated
        ? 
        <>
          {error && <div style={{marginBottom: "1rem"}}><span className={`${styles.label} ${styles.error}`}>Erro!</span> Ocorreu um erro ao criar o usuário administrador: {error}. Tente novamente.</div>}
          <div style={{backgroundColor: "rgb(252 252 252)", padding: "1rem", borderRadius: "5px"}}>
            <p>Deseja iniciar com as categorias pré-definidas?</p>
            <div className={styles.optionsSelector}>
              <span data-value="true" className={setupStandardCategories === true ? styles.active : ""} onClick={selectSetupStandardCategories}>Sim</span> 
              <span data-value="false" className={setupStandardCategories === false ? styles.active : ""} onClick={selectSetupStandardCategories}>Não</span>
            </div>
            {!fetchLoading
              ? <Button style={{display: 'block', marginLeft: 'auto'}} type="confirm" onClick={handleSetupCategories}>Configurar categorias</Button>
              : <Button style={{display: 'block', marginLeft: 'auto'}} type="confirm" disabled>Configurando categorias...</Button>}
            <div className={styles.categoriesListContainer}>
              <span className={styles.showCategoriesListBtn} onClick={() => {showCategoriesList ? setShowCategoriesList(false) : setShowCategoriesList(true)}}>{showCategoriesList ? "Ocultar" : "Ver"} relação de grupos e categorias pré-definidas</span>
              {showCategoriesList &&
                <dl>
                {Object.entries(standardCategories).map((group, i) => {
                  return (
                    <>
                    <dt key={i}>{group[0]}</dt>
                    <div>
                      {group[1].map((category, i) => {
                        return <dd key={i}>{category}</dd>
                      })}
                    </div>
                    </>
                  )
                })}
                </dl>}
            </div>
          </div>
        </>    
        : creatingCategories
        ? <div><span className={`${styles.label} ${styles.neutral}`}>Aguarde...</span> Configurando categorias conforme opção selecionada</div>
        : categoriesAreCreated &&
        <>
          <div><span className={`${styles.label} ${styles.success}`}>Sucesso!</span> As categorias foram configuradas.</div>
          <button onClick={() => {setStep(step + 1)}}>Concluir instalação</button> 
        </>
      }
      </div>
  )
}

export default SetupCategories