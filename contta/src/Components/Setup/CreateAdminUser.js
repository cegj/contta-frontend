import React from 'react'
import MessagesContext from '../../Contexts/MessagesContext'
import UserContext from '../../Contexts/UserContext'
import useForm from '../../Hooks/useForm'
import Button from '../Elements/Button'
import Input from '../Login/Form/Input'
import styles from './Setup.module.css'

const CreateAdminUser = ({user, setUser, step, setStep}) => {

  const { createUser, fetchLoading } = React.useContext(UserContext);
  const name = useForm();
  const username = useForm();
  const email = useForm('email');
  const password = useForm();  
  const confirmPassword = useForm();
  const {setMessage} = React.useContext(MessagesContext)
  const [creatingUser, setCreatingUser] = React.useState(false)
  const [userIsCreated, setUserIsCreated] = React.useState(false)
  const [error, setError] = React.useState(null)
  
  function handleSubmit(event){
    event.preventDefault();
    async function createFirstUser(){
      try {
        if(email.validate() && password.validate() && confirmPassword.validate()){
          if (password.value === confirmPassword.value){
            const body = {
              "name": name.value,
              "username": username.value,
              "email": email.value,
              "password": password.value,
              "confirm_password": confirmPassword.value
            }
            setCreatingUser(true)
            const createdUser = await createUser(body);
            if (createdUser){
              createdUser.password = password.value
              setError(null)
              setUser(createdUser)
              setUserIsCreated(true)
              return true
            }
          } else {
            setMessage({content: "A senha e a confirmação devem ser iguais", type: "a"})
          }
        }   
      } catch (error) {
        console.log(error)
        setError(error)
        setMessage({content: `Erro ao criar usuário administrador: ${error.message}`, type: "e"})
        return false;
      } finally {
        setCreatingUser(false)
      }}  

      createFirstUser()
  }


  return (
    <div className={styles.contentBlock}>
      {!userIsCreated ?
      <>
      {error && <div style={{marginBottom: "1rem"}}><span className={`${styles.label} ${styles.error}`}>Erro!</span> Ocorreu um erro ao criar o usuário administrador: {error}. Tente novamente.</div>}
      <form style={{backgroundColor: "rgb(252 252 252)", padding: "1rem", borderRadius: "5px"}} action='' onSubmit={handleSubmit}>
        <Input
          label="Nome"
          type="text" name="name"
          required={true}
          {...name}/>
        <Input
          label="Nome de usuário (username)"
          type="text" name="username"
          required={true}
          {...username}/>         
        <Input
          label="E-mail do usuário"
          type="email" name="email"
          required={true}
          {...email}/>
        <Input
          label="Senha"
          type="password"
          name="password"
          required={true}
          {...password}/>
        <Input
          label="Confirmação de senha"
          type="password"
          name="confirm_password"
          required={true}
          {...confirmPassword}/>
        {!fetchLoading
        ? <Button style={{display: 'block', marginLeft: 'auto'}} type="confirm">Criar usuário</Button>
        : <Button style={{display: 'block', marginLeft: 'auto'}} type="confirm" disabled>Criando usuário...</Button>}
      </form>
      </>
    : creatingUser
    ? <div><span className={`${styles.label} ${styles.neutral}`}>Aguarde...</span> Criando usuário administrador</div>
    : userIsCreated && 
    <>
      <div><span className={`${styles.label} ${styles.success}`}>Sucesso!</span> O usuário <span styles={{color: "#556678"}}>{user.name} ({user.email})</span> foi criado.</div>
      <button onClick={() => {setStep(step + 1)}}>Configurar categorias</button>
    </>
    }
    </div>
  )
}

export default CreateAdminUser