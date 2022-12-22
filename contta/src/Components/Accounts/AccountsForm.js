import React from 'react'
import Modal from '../Elements/Modal'
import TransactionFormInput from '../TransactionFormInput'
import useForm from '../../Hooks/useForm'
import styles from './AccountsForm.module.css'
import Button from '../Elements/Button'
import convertToInteger from '../../Helpers/convertToInteger'
import MessagesContext from '../../Contexts/MessagesContext'
import { POST_ACCOUNT, POST_INITIAL_BALANCE } from '../../api'
import useFetch from '../../Hooks/useFetch'
import AppContext from '../../Contexts/AppContext'

const AccountsForm = ({isOpen, setIsOpen}) => {

  const {setLoading, setAccounts} = React.useContext(AppContext)
  const {setMessage} = React.useContext(MessagesContext)
  const name = useForm();
  const [type, setType] = React.useState(null);
  const initialBalance = useForm();
  const show = useForm('checkbox');
  const {request, fetchLoading} = useFetch();

  React.useEffect(() => {
    setLoading(fetchLoading)
  }, [fetchLoading, setLoading])

  const typeOptions = React.useMemo(() => {
    return [
      {value: 'Carteira', label: 'Carteira'},
      {value: 'Cartão de crédito', label: 'Cartão de crédito'},
      {value: 'Conta bancária', label: 'Conta bancária'},
      {value: 'Investimentos', label: 'Investimentos'},
    ]
  }, [])

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

  function closeForm(){
    name.setValue("")
    setType(null)
    initialBalance.setValue("")
    show.setValue(false)  
    setIsOpen(false)
  }

  const storeInitialBalance = React.useCallback(async(body) => {
    try {
      const token = window.localStorage.getItem('token')
      const {url, options} = POST_INITIAL_BALANCE(body, token)
      const {response, json, error} = await request(url, options)  
      if (response.ok){
        setMessage({content: json.message, type: 's'})
        return json;
      } else {
        throw new Error(error)
      }
    } catch (error) {
      console.log(error)
      setMessage({content: `Erro ao salvar saldo inicial: ${error.message}`, type: "e"})
      return false;
    }
  }, [request, setMessage])


  const storeAccount = React.useCallback(async(body) => {
    try {
      const token = window.localStorage.getItem('token');
      const {url, options} = POST_ACCOUNT(body, token)
      const {response, json, error} = await request(url, options)  
      if (response.ok){
        setMessage({content: json.message, type: 's'})
        setAccounts([])
        const bodybalance = {
          account_id: json.createdAccount.id,
          value: body.initial_balance
        }
        await storeInitialBalance(bodybalance)
        return json.createdAccount;
      } else {
        throw new Error(error)
      }
    } catch (error) {
      console.log(error)
      setMessage({content: `Erro ao criar conta: ${error.message}`, type: "e"})
      return false;
    }
  }, [request, setMessage, setAccounts, storeInitialBalance])


  async function handleSubmit(event){
    event.preventDefault();
    let fields = [
      {field: name, name: 'nome da conta'},
      {field: type, name: 'tipo'}
    ]
    if (!validateSubmit(fields)){
      return;
    }

    const body = {
      name: name.value,
      type: type.value,
      initial_balance: convertToInteger(initialBalance.value) || 0,
      show: show.value
    }

    const storedAccount = await storeAccount(body);
    if (storedAccount){
      closeForm()
    }
  }

  return (
    isOpen && 
    <Modal title="Criar conta" isOpen={isOpen} setIsOpen={setIsOpen}>
      <form className={styles.accountsForm} onSubmit={handleSubmit}>
        <TransactionFormInput 
          label='Nome da conta'
          name='name'
          type='string'
          value={name.value}
          onChange={name.onChange}
          setValue={name.setValue}
          style={{gridColumn: 'span 2'}}
        />
        <TransactionFormInput 
          label="Tipo"
          name='type'
          type='select'
          value={type}
          onChange={setType}
          options={typeOptions}
          setValue={setType}
        />
        <TransactionFormInput 
          label='Saldo inicial'
          name='initial_balance'
          type='string'
          value={initialBalance.value}
          onChange={initialBalance.onChange}
          setValue={initialBalance.setValue}
          // style={(type && type.value === 'T') ? {gridColumn: 'span 6'} : {gridColumn: 'span 4'}}
          currency={true}
        />
        <TransactionFormInput
          label="Exibir conta"
          name="show"
          type="checkbox"
          value={show.value}
          onChange={show.onChange}
          setValue={show.setValue}
        />
        {/* {fetchLoading 
          ?
          <Button type="confirm" style={{gridRow: '4', gridColumn: '6', alignSelf: 'end'}} disabled>Registrando...</Button>
          : */}
          <Button type="confirm">Criar conta</Button>
        {/* } */}
      </form>
    </Modal>
  )
}

export default AccountsForm