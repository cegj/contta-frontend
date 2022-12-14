import React from 'react'
import styles from './TransactionForm.module.css'
import AppContext from '../Contexts/AppContext'
import {ReactComponent as AttachIcon} from '../assets/icons/attach_icon.svg'
import {ReactComponent as PinIcon} from '../assets/icons/pin_icon.svg'
import Button from './Elements/Button'
import useFetch from '../Hooks/useFetch'
import useForm from '../Hooks/useForm'
import MessagesContext from '../Contexts/MessagesContext'
import TransactionFormInput from './TransactionFormInput'
import convertToInteger from '../Helpers/convertToInteger'
import ReactTooltip from 'react-tooltip'
import convertToFloat from '../Helpers/convertToFloat'
import TransactionsContext from '../Contexts/TransactionsContext'
import Modal from './Elements/Modal'

const TransactionForm = () => {

  const {setMessage} = React.useContext(MessagesContext);
  const {fetchLoading} = useFetch();
  const {categories, accounts, transactionToEdit, setTransactionToEdit, transactionModalIsOpen, setTransactionModalIsOpen, setLoading} = React.useContext(AppContext);
  const [modalIsFixed, setModalIsFixed] = React.useState(false);
  const [keepAllValues, setKeepAllValues] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const {getTransactionById, storeTransaction, editTransaction, typeOptions, categoryOptions, accountOptions} = React.useContext(TransactionsContext);
  
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
  const usual = useForm('checkbox');
  const cascade = useForm('checkbox');

  // React.useEffect(() => {
  //   const regex = /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/
  //   if (regex.test(transactionDate.value)){
  //     if (paymentDate.value === ""){
  //       paymentDate.setValue(transactionDate.value)
  //     }  
  //   }
  // }, [transactionDate, paymentDate])

  // React.useEffect(() => {
  //   if (!transactionToEdit){
  //     const date = new Date()
  //     const today = date.toISOString().split('T')[0]
  //     transactionDate.setValue(today)
  //     paymentDate.setValue(today)
  //   }
  // }, [paymentDate, transactionDate, transactionToEdit])

  const clearForm = React.useCallback(() => {
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    ReactTooltip.rebuild()
    if(!transactionModalIsOpen) {ReactTooltip.hide()}
  }, [transactionModalIsOpen])

  React.useEffect(() => {
    setLoading(fetchLoading)
  }, [fetchLoading, setLoading])

  //Update form is reload is setted true by some child
  React.useEffect(() => {
    if(reload){
      setReload(false)
    }
  }, [reload])

  //Update transaction form component if some of this dependencies changes
  React.useEffect(() => {}, [transactionModalIsOpen, accounts, categories, accountOptions, categoryOptions]);

  const setEditingTransactionValues = React.useCallback(async(transactionToEdit) => {
    async function getRelatedTransactions(id){
      const transactions = await getTransactionById(id);
      return transactions.allRelated
    }
    async function setValues(transactionToEdit){
      const typeOfEditting = typeOptions.find(type => type.value === transactionToEdit.type)
      let categoryOfEditting;
      categoryOptions.forEach((group) => {
        const cat = group.options.find((category) => category.value === 1)
        if (cat) {categoryOfEditting = cat; return};
      })
      let relatedTransactions = null;
      if (transactionToEdit.type === "T") {relatedTransactions = await getRelatedTransactions(transactionToEdit.id)}
      let accountOfEditting;
      let destinationAccountOfEditting;
      if (transactionToEdit.type === "T"){
        accountOfEditting = accountOptions.find(account => account.value === relatedTransactions[0].account_id)
        destinationAccountOfEditting = accountOptions.find(account => account.value === relatedTransactions[1].account_id)
      } else {
        accountOfEditting = accountOptions.find(account => account.value === transactionToEdit.account_id)
      }

      setType(typeOfEditting);
      transactionDate.setValue(transactionToEdit.transaction_date);
      paymentDate.setValue(transactionToEdit.payment_date);
      value.setValue(convertToFloat(transactionToEdit.value));
      description.setValue(transactionToEdit.description);
      setCategory(categoryOfEditting);
      setAccount(accountOfEditting);
      setDestinationAccount(destinationAccountOfEditting);
      totalInstallments.setValue(transactionToEdit.total_installments);
      preview.setValue(transactionToEdit.preview);
      usual.setValue(transactionToEdit.usual);  
      setTransactionModalIsOpen(true)  
    }
    setValues(transactionToEdit);
  }, [transactionToEdit]) // eslint-disable-line react-hooks/exhaustive-deps


  // Open transaction with transaction data setted if user clicks to edit transaction
  React.useEffect(() => {
    if (transactionToEdit){
      setEditingTransactionValues(transactionToEdit)
    }
  }, [transactionToEdit, setEditingTransactionValues])

  //Set options and values to default when form is closed
  React.useEffect(() => {
    if (!transactionModalIsOpen){
      clearForm();
      setTransactionToEdit(null)
    }
  }, [transactionModalIsOpen, setTransactionToEdit, clearForm])

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
          {field: transactionDate, name: 'data da transa????o'},
          {field: paymentDate, name: 'data do pagamento'}, 
          {field: value, name: 'valor'}, 
          {field: description, name: 'descri????o'}, 
          {field: account, name: 'conta'},
          {field: category, name: 'categoria'} 
        ]
        if (!validateSubmit(fields)){
          return;
        }
        body = {
          transaction_date: transactionDate.value,
          payment_date: paymentDate.value,
          value: convertToInteger(value.value),
          description: description.value,
          category_id: category.value,
          account_id: account.value,
          preview: preview.value,
          usual: usual.value,
          total_installments: totalInstallments.value
        }} else {
          let fields = [
            {field: transactionDate, name: 'data da transa????o'},
            {field: value, name: 'valor'}, 
            {field: description, name: 'descri????o'}, 
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
          setMessage({content: "O tipo de transa????o deve ser informado", type: 'a'})
          return
      }

      if (transactionToEdit){
        const stored = editTransaction(body, transactionToEdit.type, transactionToEdit.id, cascade.value)
        if (stored){
          clearForm();
          setReload(true);
          if(!modalIsFixed){
            setTransactionModalIsOpen(false);
          }  
        }
      } else {
        const editted = storeTransaction(body, type.value)
        if (editted){
          clearForm();
          setReload(true);
          if(!modalIsFixed){
            setTransactionModalIsOpen(false);
          }  
      }
    }}

  const additionalBtns = [
    <span key="1" data-tip="Manter valores" className={`${styles.pinButton} ${keepAllValues && styles.active}`} onClick={() => {keepAllValues ? setKeepAllValues(false) : setKeepAllValues(true)}}><AttachIcon /></span>,
    <span key="2" data-tip="Manter janela aberta ap??s envio" className={`${styles.pinButton} ${modalIsFixed && styles.active}`} onClick={() => {modalIsFixed ? setModalIsFixed(false) : setModalIsFixed(true)}}><PinIcon /></span>]
    
  return (
      transactionModalIsOpen &&
        <Modal
        title={transactionToEdit ? 'Editar transa????o' : 'Registrar transa????o'}
        isOpen={transactionModalIsOpen}
        setIsOpen={setTransactionModalIsOpen}
        additionalBtns={additionalBtns}
        >
            <form className={styles.transactionForm} onSubmit={handleSubmit}>
              {<TransactionFormInput 
                label="Tipo"
                name='type'
                type='select'
                value={type}
                onChange={setType}
                options={typeOptions}
                setValue={setType}
                style={{gridColumn: 'span 2'}}
                reload={reload}
                keepAllValues={keepAllValues}
                disabled={transactionToEdit ? true : false}
              />}
              <TransactionFormInput 
                label='Data da transa????o'
                name='transaction-date'
                type='date'
                value={transactionDate.value}
                onChange={transactionDate.onChange}
                setValue={transactionDate.setValue}
                style={{gridColumn: 'span 2'}}
                reload={reload}
                keepAllValues={keepAllValues}
              />
              {(!type || type.value !== 'T') &&
                <TransactionFormInput 
                label='Data do pagamento'
                name='payment-date'
                type='date'
                value={paymentDate.value}
                onChange={paymentDate.onChange}
                setValue={paymentDate.setValue}
                style={{gridColumn: 'span 2'}}
                reload={reload}
                keepAllValues={keepAllValues}
              />}
              <TransactionFormInput 
                label='Valor'
                name='value'
                type='string'
                value={value.value}
                onChange={value.onChange}
                setValue={value.setValue}
                style={{gridColumn: 'span 2'}}
                reload={reload}
                currency={true}
                keepAllValues={keepAllValues}
              /> 
              <TransactionFormInput 
                label='Descri????o'
                name='description'
                type='string'
                value={description.value}
                onChange={description.onChange}
                setValue={description.setValue}
                style={(type && type.value === 'T') ? {gridColumn: 'span 6'} : {gridColumn: 'span 4'}}
                reload={reload}
                keepAllValues={keepAllValues}
              />
              <TransactionFormInput 
                label={`Conta ${(type && type.value === 'T') ? 'de origem' : ''}`}
                name='account'
                type='select'
                value={account}
                onChange={setAccount}
                options={accountOptions}
                setValue={setAccount}
                style={{gridColumn: 'span 2'}}
                reload={reload}
                keepAllValues={keepAllValues}
              />       
              {type && type.value === 'T'
              ?
              <TransactionFormInput 
                label="Conta de destino"
                name='destination_account'
                type='select'
                value={destinationAccount}
                onChange={setDestinationAccount}
                options={accountOptions}
                setValue={setDestinationAccount}
                style={{gridColumn: 'span 3'}}
                reload={reload}
                keepAllValues={keepAllValues}
              />   
              :
              <TransactionFormInput 
                label="Categoria"
                name='category'
                type='select'
                value={category}
                onChange={setCategory}
                options={categoryOptions}
                setValue={setCategory}
                style={{gridColumn: 'span 2'}}
                reload={reload}
                keepAllValues={keepAllValues}
              />
              }
              {(!transactionToEdit && (!type || type.value !== 'T')) && 
              <TransactionFormInput 
                label="Parcelas"
                name="total_installments"
                type="text"
                value={totalInstallments.value}
                onChange={totalInstallments.onChange}
                setValue={totalInstallments.setValue}
                style={{gridColumn: 'span 1'}}
                reload={reload}
                keepAllValues={keepAllValues}
              />
              }
            <span className={styles.checkboxesContainer}>
            {(!type || type.value !== 'T') && 
              <TransactionFormInput
                label="Previs??o"
                name="preview"
                type="checkbox"
                value={preview.value}
                onChange={preview.onChange}
                setValue={preview.setValue}
                reload={reload}
                keepAllValues={keepAllValues}
              />}
              <TransactionFormInput
                label="Habitual"
                name="usual"
                type="checkbox"
                value={usual.value}
                onChange={usual.onChange}
                setValue={usual.setValue}
                reload={reload}
                keepAllValues={keepAllValues}
              />
            </span>
            {(transactionToEdit && type.value !== 'T') && <TransactionFormInput
                label="Aplicar mudan??as ??s parcelas seguintes"
                name="cascade"
                type="checkbox"
                value={cascade.value}
                onChange={cascade.onChange}
                setValue={cascade.setValue}
                reload={reload}
                keepAllValues={keepAllValues}
                style={{gridRow: '4', gridColumn: 'span 5', alignSelf: 'center'}}
              />}
            {fetchLoading 
            ?
            <Button type="confirm" style={{gridRow: '4', gridColumn: '6', alignSelf: 'end'}} disabled>Registrando...</Button>
            :
            <Button type="confirm" style={{gridRow: '4', gridColumn: '6', alignSelf: 'end'}}>{transactionToEdit ? 'Editar' : 'Registrar'}</Button>
            }
            </form>
        </Modal>
  )
}

export default TransactionForm