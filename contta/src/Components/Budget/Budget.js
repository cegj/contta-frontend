import React from 'react'
import { GET_BALANCE } from '../../api'
import useFetch from '../../Hooks/useFetch'
import Header from '../Header'
import styles from './Budget.module.css'

const Budget = () => {

  const {request} = useFetch()

  const get = React.useCallback(async () => {
    const token = window.localStorage.getItem('token')
  
    const api = GET_BALANCE(token, {from: '2022-11-01', to: '2022-11-30', typeofdate: 'transaction_date', includeexpected: 'true', category: 4})
  
    const req = await request(api.url, api.options)
  
    console.log(req.json)

    const api2 = GET_BALANCE(token, {from: '2022-11-01', to: '2022-11-30', typeofdate: 'transaction_date', includeexpected: 'false', category: 4})
  
    const req2 = await request(api2.url, api2.options)
  
    console.log(req2.json)

  }, [request])

  React.useEffect(() => {get()}, [get])

  return (
    <>
      <Header />
      <div style={styles.div}>Budget</div>    
    </>
  )
}

export default Budget