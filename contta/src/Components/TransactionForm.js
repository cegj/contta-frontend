import React from 'react'
import styles from './TransactionForm.module.css'
import AppContext from '../Contexts/AppContext'
import {ReactComponent as PinIcon} from '../assets/icons/pin_icon.svg'
import {ReactComponent as CloseIcon} from '../assets/icons/close_icon.svg'
import Button from './Elements/Button'
import useFetch from '../Hooks/useFetch'
import useForm from '../Hooks/useForm'
import { POST_EXPENSE, POST_INCOME, POST_TRANSFER } from '../api'
import MessagesContext from '../Contexts/MessagesContext'
import TransactionFormInput from './TransactionFormInput'

const TransactionForm = () => {

  const {setMessage} = React.useContext(MessagesContext);
  const {request, loading} = useFetch();
  const {categories, accounts, transactionFormIsOpen, setTransactionFormIsOpen} = React.useContext(AppContext);

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

  const typeOptions = [
    {value: 'D', label: 'Despesa'},
    {value: 'R', label: 'Receita'},
    {value: 'T', label: 'Transferência'},
  ]

  const accountOptions = React.useMemo(() => {return []}, []);
  React.useEffect(() => {
    accountOptions.length = 0;
    accounts.forEach((account) => {
      const accountOption = {label: account.name, value: account.id};
      accountOptions.push(accountOption);
    })
  }, [accounts, accountOptions])

  const categoryOptions = React.useMemo(() => {return []}, []);
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

  React.useEffect(() => {}, [transactionFormIsOpen])

  function closeForm(){
    setTransactionFormIsOpen(false);
    clearForm();
  }

  function clearForm(){
    setType([]);
    transactionDate.setValue('');
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

  async function handleSubmit(event){
    event.preventDefault();
    const token = window.localStorage.getItem('token');
    let body = {};
    if (type.value === 'R' || type.value === 'D') {
      body = {
        transaction_date: transactionDate.value,
        payment_date: paymentDate.value,
        value: value.value,
        description: description.value,
        category_id: category.value,
        account_id: account.value,
        preview: preview.value,
        usual: usual.value,
        total_installments: totalInstallments.value
      }} else if (type.value === 'T'){
        body = {
          transaction_date: transactionDate.value,
          value: value.value,
          description: description.value,
          account_id: account.value,
          destination_account_id: destinationAccount.value,
          usual: usual.value      
        }
      }
      let url;
      let options;
      if (type.value === 'R') {({url, options} = POST_INCOME(body, token))}
      else if (type.value === 'D') {({url, options} = POST_EXPENSE(body, token))}
      else if (type.value === 'T') {({url, options} = POST_TRANSFER(body, token))}

      try {
        const {response, json, error} = await request(url, options);
        if (response.ok){
          setMessage({content: json.message, type: 's'})
        } else {
          throw new Error(error)
        }
      } catch (error) {
        console.log(error)
        setMessage({content: `Erro ao registrar transação: ${error.message}`, type: "e"})
      }

    }

  React.useEffect(() => {}, [transactionFormIsOpen, accounts, loading, accountOptions]);

  return (
      transactionFormIsOpen &&
        <div className={styles.modalContainer}>
          <div className={styles.formContainer}>
            <div className={styles.titleBar}>
              <h2
                className={`${styles.modalTitle}
                 ${(type && type.value === 'D') ? styles.d : ''}
                 ${(type && type.value === 'R') ? styles.r : ''}
                 ${(type && type.value === 'T') ? styles.t : ''}`}>
                  Registrar transação
              </h2>
              <span className={styles.buttonsContainer}>
                <span className={styles.pinButton}><PinIcon /></span>
                <span className={styles.closeButton} onClick={closeForm}><CloseIcon /></span>
              </span>
            </div>
            <form className={styles.transactionForm} onSubmit={handleSubmit}>
              <TransactionFormInput 
                label="Tipo"
                name='type'
                type='select'
                value={type}
                onChange={setType}
                options={typeOptions}
                setValue={setType}
                gridColumn="span 2"
              />
              <TransactionFormInput 
                label='Data da transação'
                name='transaction-date'
                type='date'
                value={transactionDate.value}
                onChange={transactionDate.onChange}
                setValue={transactionDate.setValue}
                gridColumn="span 2"
              />
              {(!type || type.value !== 'T') &&
                <TransactionFormInput 
                label='Data do pagamento'
                name='payment-date'
                type='date'
                value={paymentDate.value}
                onChange={paymentDate.onChange}
                setValue={paymentDate.setValue}
                gridColumn="span 2"
              />}
              <TransactionFormInput 
                label='Valor'
                name='value'
                type='string'
                value={value.value}
                onChange={value.onChange}
                setValue={value.setValue}
                gridColumn="span 2"
              /> 
              <TransactionFormInput 
                label='Descrição'
                name='description'
                type='string'
                value={description.value}
                onChange={description.onChange}
                setValue={description.setValue}
                gridColumn={(type && type.value === 'T') ? 'span 6' : 'span 4'}
              />
              <TransactionFormInput 
                label={`Conta ${(type && type.value === 'T') ? 'de origem' : ''}`}
                name='account'
                type='select'
                value={account}
                onChange={setAccount}
                options={accountOptions}
                setValue={setAccount}
                gridColumn="span 2"
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
                gridColumn="span 2"
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
                gridColumn="span 2"
              />
              }
              {(!type || type.value !== 'T') && 
              <TransactionFormInput 
                label="Parcelas"
                name="total_installments"
                type="text"
                value={totalInstallments.value}
                onChange={totalInstallments.onChange}
                setValue={totalInstallments.setValue}
                gridColumn="span 1"
              />
              }
            <span className={`${styles.formControl} ${styles.fc1}`}>
              <span className={styles.checkboxControl}>
                <input
                  type="checkbox"
                  name="preview"
                  id="preview"
                  value={preview.value}
                  onChange={preview.onCheck}/>
                <label htmlFor="preview">Previsão</label>
              </span>
              <span className={styles.checkboxControl}>
                <input
                  type="checkbox"
                  name="usual"
                  id="usual"
                  value={usual.value}
                  onChange={usual.onCheck}
                  />
                <label htmlFor="usual">Habitual</label>
              </span>
            </span>
            {loading 
            ?
            <Button type="confirm" style={{gridColumn: '6', alignSelf: 'end'}} disabled>Registrando...</Button>
            :
            <Button type="confirm" style={{gridColumn: '6', alignSelf: 'end'}}>Registrar</Button>
            }
            </form>
          </div>
      </div>
  )
}

export default TransactionForm