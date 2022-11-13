import React from 'react'
import styles from './TransactionForm.module.css'
import AppContext from '../Contexts/AppContext'
import {ReactComponent as PinIcon} from '../assets/icons/pin_icon.svg'
import {ReactComponent as CloseIcon} from '../assets/icons/close_icon.svg'
import Button from './Elements/Button'
import useFetch from '../Hooks/useFetch'
import Select from 'react-select'
import selectStyles from '../options/selectStyles'
import useForm from '../Hooks/useForm'
import { POST_EXPENSE, POST_INCOME, POST_TRANSACTION } from '../api'

const TransactionForm = () => {

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

  // React.useEffect(() => [], [type.value])

  function closeForm(){
    setTransactionFormIsOpen(false);
  }

  async function handleSubmit(event){
    event.preventDefault();
    const token = window.localStorage.getItem('token');
    let body = {};
    let adjustedValue;
    if (type.value === 'D') adjustedValue = value.value * -1
    else adjustedValue = value.value;
    if (type.value === 'R' || type.value === 'D') {
      body = {
        transaction_date: transactionDate.value,
        payment_date: paymentDate.value,
        value: adjustedValue,
        description: description.value,
        category_id: category.value,
        account_id: account.value,
        preview: preview.value,
        usual: usual.value,
        total_installments: totalInstallments.value
      }} else if (type.value === 'T'){
        body = {
          transaction_date: transactionDate.value,
          value: adjustedValue,
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
      else if (type.value === 'T') {({url, options} = POST_TRANSACTION(body, token))}

      try {
        const {response, json, error} = await request(url, options);
        if (response.ok){
          console.log(response);
          console.log(json);
        } else {
          throw new Error(error)
        }
      } catch (error) {
        console.log(error)
      }

    }

  React.useEffect(() => {}, [transactionFormIsOpen, accounts, loading, accountOptions]);

  return (
      transactionFormIsOpen &&
        <div className={styles.modalContainer}>
          <div className={styles.formContainer}>
            <div className={styles.titleBar}>
              <h2>Registrar transação</h2>
              <span className={styles.buttonsContainer}>
                <span className={styles.pinButton}><PinIcon /></span>
                <span className={styles.closeButton} onClick={closeForm}><CloseIcon /></span>
              </span>
            </div>
            <form className={styles.transactionForm} onSubmit={handleSubmit}>
              <span className={`${styles.formControl} ${styles.fc2}`}>
                <label htmlFor="type">Tipo</label>
                <Select 
                  placeholder="Selecione..."
                  isClearable={true}
                  styles={selectStyles}
                  value={type}
                  onChange={setType}
                  options={typeOptions}
                />
              </span>
              <span className={`${styles.formControl} ${styles.fc2}`}>
                <label htmlFor="transaction-date">Data da transação</label>
                <input
                  type="date"
                  name="transaction-date"
                  id="transaction-date"
                  value={transactionDate.value}
                  onChange={transactionDate.onChange}>
                </input>
              </span>
              {(!type || type.value !== 'T') &&
                <span className={`${styles.formControl} ${styles.fc2}`}>
                <label htmlFor="payment-date">Data do pagamento</label>
                <input
                  type="date"
                  name="payment-date"
                  id="payment-date"
                  value={paymentDate.value}
                  onChange={paymentDate.onChange}>
                </input>
              </span>}
              <span className={`${styles.formControl} ${styles.fc2}`}>
                <label htmlFor="value">Valor</label>
                <input
                  type="text"
                  name="value"
                  id="value"
                  value={value.value}
                  onChange={value.onChange}>
                </input>
              </span>
              <span className={`${styles.formControl} ${(type && type.value === 'T') ? styles.fc6 : styles.fc4}`}>
                <label htmlFor="description">Descrição</label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  value={description.value}
                  onChange={description.onChange}>
                </input>
              </span>
              <span className={`${styles.formControl} ${styles.fc2}`}>
                <label htmlFor="account">Conta {type && type.value === 'T' && "de origem"}</label>
                <Select
                  placeholder="Selecione..."
                  isClearable={true}
                  styles={selectStyles}
                  value={account}
                  onChange={setAccount}
                  options={accountOptions}
                />
              </span>
              {type && type.value === 'T'
              ?
              <span className={`${styles.formControl} ${styles.fc2}`}>
                <label htmlFor="account">Conta de destino</label>
                <Select
                  placeholder="Selecione..."
                  isClearable={true}
                  styles={selectStyles}
                  value={destinationAccount}
                  onChange={setDestinationAccount}
                  options={accountOptions}
                />
              </span>
              :
              <span className={`${styles.formControl} ${styles.fc2}`}>
              <label htmlFor="category">Categoria</label>
              <Select 
                placeholder="Selecione..."
                isClearable={true}
                styles={selectStyles}
                value={category}
                onChange={setCategory}
                options={categoryOptions}
              />
              </span>
              }
              {(!type || type.value !== 'T') && 
                <span className={`${styles.formControl} ${styles.fc1}`}>
                <label htmlFor="total_installments">Parcelas</label>
                <input
                  type="number" 
                  name="total_installments"
                  id="total_installments"
                  value={totalInstallments.value}
                  onChange={totalInstallments.onChange}>
                </input>
              </span>}
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
            <Button type="confirm" style={{gridColumn: '6'}}>Registrar</Button>
            </form>
          </div>
      </div>
  )
}

export default TransactionForm