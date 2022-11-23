import React from 'react'
import styles from './Modal.module.css'
import {ReactComponent as CloseIcon} from '../../assets/icons/close_icon.svg'
import ReactTooltip from 'react-tooltip'

const Modal = ({title, isOpen, setIsOpen, children}) => {
  
  const modalContainer = React.useRef(null);

  React.useEffect(() => {
    ReactTooltip.rebuild()
    if(!isOpen) {ReactTooltip.hide()}
  }, [isOpen])


  React.useEffect(() => {
    function closeOnClick(event){
      const clickOutside = modalContainer.current === event.target
      if (clickOutside) {
        setIsOpen(false)
        modalContainer.current.removeEventListener('click', closeOnClick)
      }
    }

    modalContainer.current.addEventListener('click', closeOnClick)
  }, [setIsOpen])

  return (
    isOpen &&
    <div ref={modalContainer} className={styles.modalContainer}>
      <div className={styles.modal}>
        <div className={`${styles.titleBar} ${title ? '' : styles.noTitle}`}>
          {title &&<h2 className={styles.modalTitle}>{title}</h2>}
          <span className={styles.buttonsContainer}>
            <span data-tip="Fechar" className={styles.closeButton} onClick={() => {setIsOpen(false)}} ><CloseIcon /></span>
          </span>
        </div>
        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </div>
)
}

export default Modal