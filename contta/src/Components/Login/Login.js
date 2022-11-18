import React from 'react'
import AppName from '../Elements/AppName'
import Input from './Form/Input';
import Button from '../Elements/Button';
import style from './Login.module.css'
import useForm from '../../Hooks/useForm';
import UserContext from '../../Contexts/UserContext';
import ReactTooltip from 'react-tooltip';

const Login = () => {

  ReactTooltip.hide()

  const email = useForm('email');
  const password = useForm();

  const { userLogin, loading } = React.useContext(UserContext);

  async function handleSubmit(event){
    event.preventDefault();

    if(email.validate() && password.validate()){
      userLogin(email.value, password.value);
    }
  }

  return (
    <div className={style.container}>
      <section>
        <AppName fontSize="3.75rem" textAlign="center"/>
        <h2 className={style.subtitle}>Gestão de finanças pessoais</h2>
      </section>
      <section>
        <div className={style.loginContainer}>
          <form action='' onSubmit={handleSubmit}>
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
            {!loading
            ? <Button style={{display: 'block', marginLeft: 'auto'}} type="confirm">Entrar</Button>
            : <Button style={{display: 'block', marginLeft: 'auto'}} type="confirm" disabled>Entrando...</Button>}
          </form>
        </div>
      </section>
    </div>
  )
}

export default Login