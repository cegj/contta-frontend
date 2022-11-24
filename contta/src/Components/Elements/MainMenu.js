import React from 'react'
import styles from './MainMenu.module.css'
import {Link} from 'react-router-dom'
import { ReactComponent as ChartIcon } from '../../assets/icons/chart_icon.svg'
import { ReactComponent as StatementIcon } from '../../assets/icons/statement_icon.svg'
import { ReactComponent as TableIcon } from '../../assets/icons/table_icon.svg'
import { ReactComponent as TagIcon } from '../../assets/icons/bookmark_icon.svg'
import { ReactComponent as WalletIcon } from '../../assets/icons/wallet_icon.svg'


const MainMenu = () => {

  const [isOpen, setIsOpen] = React.useState(false);
  const menu = React.useRef(null)
  const menuBtn = React.useRef(null)
  const menuContainer = React.useRef(null)


  function toggleMenu(){
    if (isOpen){
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }

  function closeOnCLickOutside({target}){
    if (target !== menu.current && target !== menuBtn.current){
      setIsOpen(false)
      window.removeEventListener('click', closeOnCLickOutside)
    }
  }

  React.useEffect(() => {
    if(isOpen) window.addEventListener('click', closeOnCLickOutside)
  }, [isOpen])

  return (
    <div ref={menuContainer} className={styles.menuContainer}>
      <span ref={menuBtn} className={`${styles.menuBtn} ${isOpen && styles.menuBtnActive}`} onClick={toggleMenu}></span>
      {isOpen && <nav ref={menu} className={styles.menu} onClick={toggleMenu}>
        <ul>
          <li><Link to="/board"><span className={styles.icon}><ChartIcon /></span>Painel</Link></li>
          <li><Link to="/statement"><span className={styles.icon}><StatementIcon /></span>Extrato</Link></li>
          <li><Link to="/budget"><span className={styles.icon}><TableIcon /></span>Orçamento</Link></li>
          <li><Link to="/categories"><span className={styles.icon}><TagIcon /></span>Categorias</Link></li>
          <li><Link to="/accounts"><span className={styles.icon}><WalletIcon /></span>Contas</Link></li>
        </ul>
      </nav>}
    </div>
    )
}

export default MainMenu