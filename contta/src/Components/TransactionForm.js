import React from 'react'
import styles from './TransactionForm.module.css'
import AppContext from '../Contexts/AppContext'
import {ReactComponent as AttachIcon} from '../assets/icons/attach_icon.svg'
import {ReactComponent as PinIcon} from '../assets/icons/pin_icon.svg'
import {ReactComponent as CloseIcon} from '../assets/icons/close_icon.svg'
import Button from './Elements/Button'
import useFetch from '../Hooks/useFetch'
import useForm from '../Hooks/useForm'
import { PATCH_INCOME, PATCH_EXPENSE, PATCH_TRANSFER, POST_EXPENSE, POST_INCOME, POST_TRANSFER } from '../api'
import MessagesContext from '../Contexts/MessagesContext'
import TransactionFormInput from './TransactionFormInput'
import convertToInteger from '../Helpers/convertToInteger'
import ReactTooltip from 'react-tooltip'
import convertToFloat from '../Helpers/convertToFloat'
import TransactionsContext from '../Contexts/TransactionsContext'

const TransactionForm = () => {

  const {setMessage} = React.useContext(MessagesContext);
  const {request, loading} = useFetch();
  const {categories, accounts, transactionToEdit, setTransactionToEdit, transactionFormIsOpen, setTransactionFormIsOpen} = React.useContext(AppContext);
  const [modalIsFixed, setModalIsFixed] = React.useState(false);
  const [keepAllValues, setKeepAllValues] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const {getTransactions, getTransactionById} = React.useContext(TransactionsContext);

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

  const typeOptions = React.useMemo(() => {
    return [
      {value: 'D', label: 'Despesa'},
      {value: 'R', label: 'Receita'},
      {value: 'T', label: 'Transferência'},
    ]
  }, [])

  //Set account options object to SELECT field
  const accountOptions = React.useMemo(() => {return []}, []);
  React.useEffect(() => {
    accountOptions.length = 0;
    accounts.forEach((account) => {
      const accountOption = {label: account.name, value: account.id};
      accountOptions.push(accountOption);
    })
  }, [accounts, accountOptions])

  const categoryOptions = React.useMemo(() => {return []}, []);

  //Set categories options object to SELECT field
  React.useEffect(() => {
    categories.forEach((group) => {
      const categories = [];
      group.categories.forEach((cat) => {
        categories.push({value: cat.id, label: cat.name})
      })
      categoryOptions.push({
        label: group.name,
        options: categories
      })
    })
  }, [categories, categoryOptions])


  React.useEffect(() => {
    ReactTooltip.rebuild()
    if(!transactionFormIsOpen) {ReactTooltip.hide()}
  }, [transactionFormIsOpen])

  //Update form is reload is setted true by some child
  React.useEffect(() => {
    if(reload){
      setReload(false)
    }
  }, [reload])

  //Update transaction form component if some of this dependencies changes
  React.useEffect(() => {}, [transactionFormIsOpen, accounts, loading, accountOptions, categoryOptions]);

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
      setTransactionFormIsOpen(true)  
    }
    setValues(transactionToEdit);
  }, [transactionToEdit]) // eslint-disable-line react-hooks/exhaustive-deps


  // Open transaction with transaction data setted if user clicks to edit transaction
  React.useEffect(() => {
    if (transactionToEdit){
      setEditingTransactionValues(transactionToEdit)
    }
  }, [transactionToEdit, setEditingTransactionValues])

  function handleCloseForm(){
    setTransactionFormIsOpen(false);
    setTransactionToEdit(null);
    cascade.setValue(false);
    clearForm();
  }

  function clearForm(){
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
  }

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
      console.log(field)
      if(!validate(field.field)){
        invalidFieldsNames.push(field.name)
      }
    })
    if(invalidFieldsNames.length > 0){
      let fieldsAsString = invalidFieldsNames.toString().replace(/,(?=[^,]*$)/, ' e ').replace(/,/g, ', ')
      console.log(fieldsAsString)
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
    const token = window.localStorage.getItem('token');
    let body = {};
    
    if (type.value === 'R' || type.value === 'D' || type.value === 'T') {
      if (type.value === 'R' || type.value === 'D'){
        let fields = [
          {field: transactionDate, name: 'data da transação'},
          {field: paymentDate, name: 'data do pagamento'}, 
          {field: value, name: 'valor'}, 
          {field: description, name: 'descrição'}, 
          {field: account, name: 'conta'},
          {field: category, name: 'categoria'} 
        ]
        if (!validateSubmit(fields)){
          return;
        }
        const integerValue = convertToInteger(value.value)
        body = {
          transaction_date: transactionDate.value,
          payment_date: paymentDate.value,
          value: integerValue,
          description: description.value,
          category_id: category.value,
          account_id: account.value,
          preview: preview.value,
          usual: usual.value,
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
          const integerValue = convertToInteger(value.value)
          body = {
            transaction_date: transactionDate.value,
            value: integerValue,
            description: description.value,
            account_id: account.value,
            destination_account_id: destinationAccount.value,
            usual: usual.value      
          }
      }} else {
          setMessage({content: "O tipo de transação deve ser informado", type: 'a'})
          return
      }
      let url;
      let options;
      if(transactionToEdit){
        if (type.value === 'R') {({url, options} = PATCH_INCOME(body, token, transactionToEdit.id, cascade.value))}
        else if (type.value === 'D') {({url, options} = PATCH_EXPENSE(body, token, transactionToEdit.id, cascade.value))}
        else if (type.value === 'T') {({url, options} = PATCH_TRANSFER(body, token, transactionToEdit.id, cascade.value))}  
      } else {
        if (type.value === 'R') {({url, options} = POST_INCOME(body, token))}
        else if (type.value === 'D') {({url, options} = POST_EXPENSE(body, token))}
        else if (type.value === 'T') {({url, options} = POST_TRANSFER(body, token))}  
      }
      try {
        const {response, json, error} = await request(url, options);
        if (response.ok){
          setMessage({content: json.message, type: 's'})
          clearForm();
          setReload(true);
          getTransactions();
          if(!modalIsFixed){
            setTransactionFormIsOpen(false);
          }
        } else {
          throw new Error(error)
        }
      } catch (error) {
        console.log(error)
        setMessage({content: `Erro ao registrar transação: ${error.message}`, type: "e"})
      }
    }
    
  return (
      transactionFormIsOpen &&
        <div className={styles.modalContainer}>
          {/* <ReactTooltip /> */}
          <div className={styles.formContainer}>
            <div className={styles.titleBar}>
              <h2
                className={`${styles.modalTitle}
                 ${(type && type.value === 'D') ? styles.d : ''}
                 ${(type && type.value === 'R') ? styles.r : ''}
                 ${(type && type.value === 'T') ? styles.t : ''}`}>
                  {transactionToEdit ? 'Editar transação' : 'Registrar transação'}
              </h2>
              <span className={styles.buttonsContainer}>
                <span data-tip="Manter valores" className={`${styles.pinButton} ${keepAllValues && styles.active}`} onClick={() => {keepAllValues ? setKeepAllValues(false) : setKeepAllValues(true)}}><AttachIcon /></span>
                <span data-tip="Manter janela aberta após envio" className={`${styles.pinButton} ${modalIsFixed && styles.active}`} onClick={() => {modalIsFixed ? setModalIsFixed(false) : setModalIsFixed(true)}}><PinIcon /></span>
                <span data-tip="Fechar" className={styles.closeButton} onClick={handleCloseForm} ><CloseIcon /></span>
              </span>
            </div>
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
                label='Data da transação'
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
                label='Descrição'
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
                label="Previsão"
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
                label="Aplicar mudanças às parcelas seguintes"
                name="cascade"
                type="checkbox"
                value={cascade.value}
                onChange={cascade.onChange}
                setValue={cascade.setValue}
                reload={reload}
                keepAllValues={keepAllValues}
                style={{gridRow: '4', gridColumn: 'span 5', alignSelf: 'center'}}
              />}
            {loading 
            ?
            <Button type="confirm" style={{gridRow: '4', gridColumn: '6', alignSelf: 'end'}} disabled>Registrando...</Button>
            :
            <Button type="confirm" style={{gridRow: '4', gridColumn: '6', alignSelf: 'end'}}>{transactionToEdit ? 'Editar' : 'Registrar'}</Button>
            }
            </form>
          </div>
      </div>
  )
}

export default TransactionForm