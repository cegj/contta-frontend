import React from 'react'
import AppName from '../Elements/AppName'
import style from './Login.module.css'

const Home = () => {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleSubmit(event){
    event.preventDefault();
    fetch('http://3.220.229.85:8000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password})
    })
    .then(response => {
      console.log(response)
      return response.json()})
    .then(json => {console.log(json)})
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
            <input type="text" onChange={({target}) => setEmail(target.value)} value={email}/>
            <input type="password" onChange={({target}) => setPassword(target.value)} value={password}/>
            <button>Entrar</button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Home