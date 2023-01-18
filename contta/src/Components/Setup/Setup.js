import React from 'react'
import AppName from '../Elements/AppName'
import CheckTables from './CheckTables'
import SetupDatabase from './SetupDatabase'
import CreateAdminUser from './CreateAdminUser'
import styles from './Setup.module.css'
import SetupCategories from './SetupCategories'
import { useNavigate } from 'react-router-dom'

const Setup = () => {
  const [user, setUser] = React.useState(null)
  const [step, setStep] = React.useState(5)
  const navigate = useNavigate()

  return (
    <div className={`grid g-one ${styles.setupContainer}`}>
      <div style={{fontSize: '1.6rem', margin: '0 auto'}}><AppName /></div>
      <h1 className={styles.setupTitle}>Instalação</h1>

      {step === 1 &&
      <>
        <section className={styles.setupBlock}>
        <h2>Verificação de tabelas</h2>
        <CheckTables step={step} setStep={setStep}/>
        </section>
        <div className={styles.info}>Nesta etapa, verificamos se há tabela existente no seu banco de dados, pois, por sergurança, a instalação só ocorre caso o banco de dados não possua tabelas previamente criadas.</div>
      </>
      }

      {step === 2 &&
      <>
        <section className={styles.setupBlock}>
          <h2>Configuração do banco de dados</h2>
          <SetupDatabase step={step} setStep={setStep}/>
        </section>
        <div className={styles.info}>Nesta etapa, criamos as tabelas necessárias para o funcionamento da aplicação. Esse procedimento pode demorar um pouco a depender do seu servidor de banco de dados. Por favor, aguarde a conclusão.</div>
      </>

      }

      {step === 3 &&
      <>
        <section className={styles.setupBlock}>
         <h2>Criação de usuário administrador</h2>
         <CreateAdminUser user={user} setUser={setUser} step={step} setStep={setStep}/>
        </section>
        <div className={styles.info}>Nesta etapa, você criará o usuário administrador, que poderá criar e gerenciar outros usuários posteriormente.</div>
      </>}

      {step === 4 &&
      <>
        <section className={styles.setupBlock}>
          <h2>Configuração inicial das categorias</h2>
          <SetupCategories user={user} step={step} setStep={setStep}/>
        </section>
        <div className={styles.info}>Para finalizar, você deve escolher se deseja iniciar a aplicação com as categorias pré-definidas já cadastradas ou se prefere iniciar sem nenhuma categoria. Caso escolha a primeira opção, você poderá alterar e excluir as categorias pré-definidas posteriormente.</div>
      </>
      }

      
      {step === 5 &&
      <>
        <section className={styles.setupBlock}>
          <h2>Instalação concluída</h2>
          <div className={styles.contentBlock}>
            <p><span className={`${styles.label} ${styles.success}`}>Sucesso!</span> O Contta foi configurado e está pronto para ser utilizado! Clique no botão abaixo para ser direcionado à tela de login.</p>
            <button onClick={() => {navigate('/')}}>Fazer login</button>
          </div>
        </section>
        <div className={styles.info}>Para finalizar, você deve escolher se deseja iniciar a aplicação com as categorias pré-definidas já cadastradas ou se prefere iniciar sem nenhuma categoria. Caso escolha a primeira opção, você poderá alterar e excluir as categorias pré-definidas posteriormente.</div>
      </>
      } 
    </div>
  )
}

export default Setup