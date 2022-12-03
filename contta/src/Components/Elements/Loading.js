import React from 'react'
import AppContext from '../../Contexts/AppContext';
import styles from './Loading.module.css'

const Loading = () => {

  const {loading} = React.useContext(AppContext)

  return (
    loading && <div data-tip="Carregando..." className={styles.Loading}>
      <span className={styles.loadingIcon}></span>
    </div>
  )
}

export default Loading