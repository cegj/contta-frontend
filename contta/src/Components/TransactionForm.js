import React from 'react'
import styles from './TransactionForm.module.css'
import AppContext from '../Contexts/AppContext'
// import {ReactComponent as AttachIcon} from '../assets/icons/attach_icon.svg'
import {ReactComponent as PinIcon} from '../assets/icons/pin_icon.svg'
import Button from './Elements/Button'
import useFetch from '../Hooks/useFetch'
import useForm from '../Hooks/useForm'
import MessagesContext from '../Contexts/MessagesContext'
import FormInput from './FormInput'
import convertToInteger from '../Helpers/convertToInteger'
import ReactTooltip from 'react-tooltip'
// import convertToFloat from '../Helpers/convertToFloat'
import TransactionsContext from '../Contexts/TransactionsContext'
import Modal from './Elements/Modal'
// import reactSelect from 'react-select'

const TransactionForm = () => {

  const {setMessage} = React.useContext(MessagesContext);
  const {fetchLoading} = useFetch();
  const {categories, accounts, transactionModalIsOpen, setTransactionModalIsOpen, setLoading} = React.useContext(AppContext);
  const [modalIsFixed, setModalIsFixed] = React.useState(false);
  const [keepAllValues] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const {storeTransaction, editTransaction, typeOptions, categoryOptions, accountOptions} = React.useContext(TransactionsContext);
  
  const id = useForm();
  const [type, setType] = React.useState([]);
  const transactionDate = useForm();
  const paymentDate = useForm();
  const value = useForm();
  const description = useForm();
  const [category, setCategory] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [destinationAccount, setDestinationAccount] = React.useState(null);
  const totalInstallments = useForm();
  const preview = useForm('checkbox');
  const budgetControl = useForm('checkbox');
  const usual = useForm('checkbox');
  const cascade = useForm('checkbox');

  const clearForm = React.useCallback(() => {
    id.setValue('');
    setType([]);
    transactionDate.setValue('');
    paymentDate.setValue('');
    value.setValue('');
    description.setValue('');
    setCategory('');
    setAccount('');
    setDestinationAccount('');
    totalInstallments.setValue('');
    preview.setValue(false);
    usual.setValue(false);
    budgetControl.setValue(false);
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    ReactTooltip.rebuild()
    if(!transactionModalIsOpen) {ReactTooltip.hide()}
  }, [transactionModalIsOpen])

  React.useEffect(() => {
    setLoading(fetchLoading)
  }, [fetchLoading, setLoading])

  //Update form is reload if it's setted true by some child
  React.useEffect(() => {
    if(reload){
      setReload(false)
    }
  }, [reload])

  //Update transaction form component if some of this dependencies changes
  React.useEffect(() => {}, [transactionModalIsOpen, accounts, categories, accountOptions, categoryOptions]);

  //Set options and values to default when form is closed
  React.useEffect(() => {
    if (!transactionModalIsOpen){
      clearForm();
    }
  }, [transactionModalIsOpen, clearForm, keepAllValues])

  React.useEffect(() => {
    const today = new Date().toLocaleString("sv", {timeZone: "America/Sao_Paulo"}).split(' ')[0];
    if (!transactionDate.value) transactionDate.setValue(today)
    if (!paymentDate.value) paymentDate.setValue(today)
  }, [transactionDate, paymentDate])

  function validateSubmit(fields){
    function validate(field){
      if (!field || !field.value || field.value === "" || field.value === null){
        return false;
      } else {
        return true;
      }
    }
    let invalidFieldsNames = []
    fields.forEach((field) => {
      if(!validate(field.field)){
        invalidFieldsNames.push(field.name)
      }
    })
    if(invalidFieldsNames.length > 0){
      let fieldsAsString = invalidFieldsNames.toString().replace(/,(?=[^,]*$)/, ' e ').replace(/,/g, ', ')
      if (invalidFieldsNames.length > 1){
        setMessage({content: `Os campos ${fieldsAsString} devem ser preenchidos`, type: 'a'})
      } else {
        setMessage({content: `O campo ${fieldsAsString} deve ser preenchido`, type: 'a'})
      }
      return false;
    } else {
      return true;
    }
  }

  async function handleSubmit(event){
    event.preventDefault();
    let body = {};
    if (type.value === 'R' || type.value === 'D' || type.value === 'T') {
      if (type.value === 'R' || type.value === 'D'){
        let fields = [
          {field: transactionDate, name: 'data da transação'},
          {field: paymentDate, name: 'data do pagamento'}, 
          {field: value, name: 'valor'}, 
          {field: description, name: 'descrição'} 
        ]

        if (!validateSubmit(fields)){
          return;
        }

        body = {
          transaction_date: transactionDate.value,
          payment_date: paymentDate.value,
          value: convertToInteger(value.value),
          description: description.value,
          category_id: category && category.value,
          account_id: account && account.value,
          preview: preview.value,
          usual: usual.value,
          budget_control: budgetControl.value,
          total_installments: totalInstallments.value
        }} else {
          let fields = [
            {field: transactionDate, name: 'data da transação'},
            {field: value, name: 'valor'}, 
            {field: description, name: 'descrição'}, 
            {field: account, name: 'conta de origem'},
            {field: destinationAccount, name: 'conta de destino'},
          ]
          if (!validateSubmit(fields)){
            return;
          }
          body = {
            transaction_date: transactionDate.value,
            value: convertToInteger(value.value),
            description: description.value,
            account_id: account.value,
            destination_account_id: destinationAccount.value,
            usual: usual.value      
          }
      }} else {
          setMessage({content: "O tipo de transação deve ser informado", type: 'a'})
          return
      }

      if (id.value){
        const editted = editTransaction(body, type.value, id.value, cascade.value)
        if (editted){
          clearForm();
          setReload(true);
          if(!modalIsFixed){
            setTransactionModalIsOpen(false);
          }  
        }
      } else {
        const stored = storeTransaction(body, type.value)
        if (stored){
          clearForm();
          setReload(true);
          if(!modalIsFixed){
            setTransactionModalIsOpen(false);
          }  
      }
    }}

  const additionalBtns = [
    // <span key="1" data-tip="Manter valores" className={`${styles.pinButton} ${keepAllValues && styles.active}`} onClick={handleKeepAllValues}><AttachIcon /></span>,
    <span key="2" data-tip="Manter janela aberta após envio" className={`${styles.pinButton} ${modalIsFixed && styles.active}`} onClick={() => {modalIsFixed ? setModalIsFixed(false) : setModalIsFixed(true)}}><PinIcon /></span>]
    
  return (
      transactionModalIsOpen &&
        <Modal
        title={id.value ? 'Editar transação' : 'Registrar transação'}
        isOpen={transactionModalIsOpen}
        setIsOpen={setTransactionModalIsOpen}
        additionalBtns={additionalBtns}
        >
            <form className={styles.transactionForm} onSubmit={handleSubmit}>
            <FormInput
                formName="transactionForm"
                label='id'
                name='id'
                type='string'
                value={id.value}
                onChange={id.onChange}
                setValue={id.setValue}
                style={{display: 'none'}}
                reload={reload}
              />
              {<FormInput
                formName="transactionForm"
                label="Tipo"
                name='type'
                type='select'
                value={type}
                onChange={setType}
                options={typeOptions}
                setValue={setType}
                style={{gridColumn: 'span 2'}}
                reload={reload}
                disabled={id.value ? true : false}
              />}
              <FormInput
                formName="transactionForm"
                label='Data da transação'
                name='transaction-date'
                type='date'
                value={transactionDate.value}
                onChange={transactionDate.onChange}
                setValue={transactionDate.setValue}
                style={{gridColumn: 'span 2'}}
                reload={reload}
              />
              {(!type || type.value !== 'T') &&
                <FormInput
                formName="transactionForm"
                label='Data do pagamento'
                name='payment-date'
                type='date'
                value={paymentDate.value}
                onChange={paymentDate.onChange}
                setValue={paymentDate.setValue}
                style={{gridColumn: 'span 2'}}
                reload={reload}
              />}
              <FormInput
                formName="transactionForm"
                label='Valor'
                name='value'
                type='string'
                value={value.value}
                onChange={value.onChange}
                setValue={value.setValue}
                style={{gridColumn: 'span 2'}}
                reload={reload}
                currency={true}
              /> 
              <FormInput
                formName="transactionForm"
                label='Descrição'
                name='description'
                type='string'
                value={description.value}
                onChange={description.onChange}
                setValue={description.setValue}
                style={(type && type.value === 'T') ? {gridColumn: 'span 6'} : {gridColumn: 'span 4'}}
                reload={reload}
              />
              <FormInput
                formName="transactionForm"
                label={`Conta ${(type && type.value === 'T') ? 'de origem' : ''}`}
                name='account'
                type='select'
                value={account}
                onChange={setAccount}
                options={accountOptions}
                setValue={setAccount}
                style={{gridColumn: 'span 3'}}
                reload={reload}
                disabled={budgetControl.value}
              />       
              {type && type.value === 'T'
              ?
              <FormInput
                formName="transactionForm"
                label="Conta de destino"
                name='destination_account'
                type='select'
                value={destinationAccount}
                onChange={setDestinationAccount}
                options={accountOptions}
                setValue={setDestinationAccount}
                style={{gridColumn: 'span 3'}}
                reload={reload}
              />   
              :
              <FormInput
                formName="transactionForm"
                label="Categoria"
                name='category'
                type='select'
                value={category}
                onChange={setCategory}
                options={categoryOptions}
                setValue={setCategory}
                style={{gridColumn: 'span 2'}}
                reload={reload}
              />
              }
              {(!id.value && (!type || type.value !== 'T')) && 
              <FormInput
                formName="transactionForm"
                label="Parcelas"
                name="total_installments"
                type="text"
                value={totalInstallments.value}
                onChange={totalInstallments.onChange}
                setValue={totalInstallments.setValue}
                style={{gridColumn: 'span 1'}}
                reload={reload}
              />
              }
              {(id.value && type.value !== 'T') && 
            <span style={{gridRow: '3', gridColumn: '6'}} className={styles.checkboxesContainer}>
              <FormInput
                formName="transactionForm"
                label="Aplicar às parcelas seguintes"
                name="cascade"
                type="checkbox"
                value={cascade.value}
                onChange={cascade.onChange}
                setValue={cascade.setValue}
                reload={reload}
              /></span>}
            <span className={styles.checkboxesContainer}>
            {(!type || type.value !== 'T') && 
              <FormInput
                formName="transactionForm"
                label="Previsão"
                name="preview"
                type="checkbox"
                value={budgetControl.value ? "true" : preview.value}
                onChange={preview.onChange}
                setValue={preview.setValue}
                reload={reload}
                disabled={budgetControl.value}
              />}
            {(!type || type.value !== 'T') && 
              <FormInput
                formName="transactionForm"
                label="Controle de orç."
                name="budget_control"
                type="checkbox"
                value={budgetControl.value}
                onChange={budgetControl.onChange}
                setValue={budgetControl.setValue}
                reload={reload}
              />}
              <FormInput
                formName="transactionForm"
                label="Habitual"
                name="usual"
                type="checkbox"
                value={usual.value}
                onChange={usual.onChange}
                setValue={usual.setValue}
                reload={reload}
              />
            </span>
            {fetchLoading 
            ?
            <Button type="confirm" style={{gridRow: '4', gridColumn: '6', alignSelf: 'end'}} disabled>Registrando...</Button>
            :
            <Button type="confirm" style={{gridRow: '4', gridColumn: '6', alignSelf: 'end'}}>{id.value ? 'Editar' : 'Registrar'}</Button>
            }
            </form>
        </Modal>
  )
}

export default TransactionForm