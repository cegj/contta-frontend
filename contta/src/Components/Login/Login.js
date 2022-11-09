import React from 'react'
import AppName from '../Elements/AppName'
import Input from '../Elements/Forms/Input';
import Button from '../Elements/Forms/Button';
import style from './Login.module.css'
import useForm from '../../Hooks/useForm';
import { POST_LOGIN, GET_USER } from '../../api';

const Home = () => {

  const email = useForm('email');
  const password = useForm();

  React.useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) getUser(token)
  }, [])

  async function getUser(token){
    const {url, options} = GET_USER(token);
    console.log(options);
    const response = await fetch(url, options);
    const json = await response.json();
    console.log(json);
  }

  async function handleSubmit(event){
    event.preventDefault();
    const { url, options } = POST_LOGIN({ email: email.value, password: password.value });
    
    const response = await fetch(url, options);
    const json = await response.json();
    console.log(json)
    window.localStorage.setItem('token', json.access_token);
    getUser(json.access_token);
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
            <Button style={{display: 'block', marginLeft: 'auto'}}>Entrar</Button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Home