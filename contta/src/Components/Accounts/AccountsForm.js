import React from 'react'
import Modal from '../Elements/Modal'
import FormInput from '../FormInput'
import useForm from '../../Hooks/useForm'
import styles from './AccountsForm.module.css'
import Button from '../Elements/Button'
import convertToInteger from '../../Helpers/convertToInteger'
import MessagesContext from '../../Contexts/MessagesContext'
import { DELETE_ACCOUNT, PATCH_ACCOUNT, PATCH_INITIAL_BALANCE, POST_ACCOUNT, POST_INITIAL_BALANCE } from '../../api'
import useFetch from '../../Hooks/useFetch'
import AppContext from '../../Contexts/AppContext'
import convertToFloat from '../../Helpers/convertToFloat'
import { useNavigate } from 'react-router-dom'

const AccountsForm = ({isOpen, setIsOpen, setUpdateAccountsList, accountToEdit, setAccountToEdit}) => {

  const {setLoading, setAccounts} = React.useContext(AppContext)
  const {setMessage} = React.useContext(MessagesContext)
  const name = useForm();
  const [type, setType] = React.useState(null);
  const initialBalance = useForm();
  const show = useForm('checkbox');
  const {request, fetchLoading} = useFetch();
  const navigate = useNavigate();

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

  React.useEffect(() => {
    function setEdittingValues(){

      const typeOfEditting = typeOptions.find(type => type.value === accountToEdit.type)
      const showParsed = (accountToEdit.show === 1 || accountToEdit.show === true || accountToEdit.show === "1" || accountToEdit.show === "true") ? true : false;

      name.setValue(accountToEdit.name)
      setType(typeOfEditting)
      initialBalance.setValue(convertToFloat(accountToEdit.initial_balance.toString()))
      show.setValue(showParsed)
    }
    if (accountToEdit){
      setEdittingValues()
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountToEdit]) 

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
    setIsOpen(false)
  }

  React.useEffect(() => {
    if (!isOpen){
      name.setValue("")
      setType(null)
      initialBalance.setValue("")
      show.setValue(false)  
      setAccountToEdit(null)
      setIsOpen(false)
    }
  }, [isOpen, initialBalance, name, setAccountToEdit, setIsOpen, show])

  const storeInitialBalance = React.useCallback(async(body, idToEdit = null) => {
    try {
      let url;
      let options;
      const token = window.localStorage.getItem('token')
      if (idToEdit){
        const apiParams = PATCH_INITIAL_BALANCE(body, token, idToEdit)
        url = apiParams.url;
        options = apiParams.options;
      } else {
        const apiParams = POST_INITIAL_BALANCE(body, token)
        url = apiParams.url;
        options = apiParams.options;
      }
      const {response, json, error} = await request(url, options)  
      if (response.ok){
        return {response, json, error};
      } else {
        throw new Error(error)
      }
    } catch (error) {
      console.log(error)
      setMessage({content: `Erro ao salvar saldo inicial: ${error.message}`, type: "e"})
      return false;
    }
  }, [request, setMessage])

  const editAccount = React.useCallback(async(bodyAccount, id) => {
    try {
      let jsonAccount;
      let jsonInitialBalance;
      const token = window.localStorage.getItem('token');
      const {url, options} = PATCH_ACCOUNT(bodyAccount, token, id)
      const {response, json, error} = await request(url, options)  
      jsonAccount = json;
      if (response.ok){ //Account is edited
        const initialBalanceBody = { value: bodyAccount.initial_balance }
        const {response, json} = await storeInitialBalance(initialBalanceBody, id)
        jsonInitialBalance = json;
        if (response.ok){ //Initialbalance is stored
          setMessage({content: 'Conta editada com sucesso', type: 's'})
          setAccounts([])
          setUpdateAccountsList(true)
          return {jsonAccount, jsonInitialBalance}
        } else { // Account is edited, but initialbalance isn't
            throw new Error("A conta foi editada, mas não foi possível atualizar o saldo inicial.")
          }
      } else { // Account isn't stored
        throw new Error(error)
      }
    } catch (error) {
      console.log(error)
      setMessage({content: `Erro ao editar conta: ${error.message}`, type: "e"})
      return false;
    }
  }, [request, setMessage, setAccounts, storeInitialBalance, setUpdateAccountsList])

  const storeAccount = React.useCallback(async(bodyAccount) => {
    try {
      let jsonAccount;
      let jsonInitialBalance;
      const token = window.localStorage.getItem('token');
      const {url, options} = POST_ACCOUNT(bodyAccount, token)
      const {response, json, error} = await request(url, options)  
      jsonAccount = json;
      if (response.ok){ //Account is stored
        const initialBalanceBody = {
          account_id: jsonAccount.createdAccount.id,
          value: bodyAccount.initial_balance
        }
        const {response, json} = await storeInitialBalance(initialBalanceBody)
        jsonInitialBalance = json;
        if (response.ok){ //Initialbalance is stored
          setMessage({content: 'Conta criada com sucesso', type: 's'})
          setAccounts([])
          setUpdateAccountsList(true)
          return {jsonAccount, jsonInitialBalance}
        } else { // Account is stored, but initialbalance isn't
          const {url, options} = DELETE_ACCOUNT(token, jsonAccount.createdAccount.id)
          const {response, error} = await request(url, options)
          if (response.ok){
            throw new Error("criação desfeita devido a um erro ao salvar saldo inicial")
          } else {
            console.log(error)
            throw new Error("Erro ao salvar saldo inicial. Não foi possível desfazer criação da conta, exclua manualmente e cria novamente.")
          }
        }
      } else { // Account isn't stored
        throw new Error(error)
      }
    } catch (error) {
      console.log(error)
      setMessage({content: `Erro ao criar conta: ${error.message}`, type: "e"})
      return false;
    }
  }, [request, setMessage, setAccounts, storeInitialBalance, setUpdateAccountsList])


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
      initial_balance: +convertToInteger(initialBalance.value) || 0,
      show: show.value
    }

    const storedAccount = accountToEdit
    ? await editAccount(body, accountToEdit.id)
    : await storeAccount(body);

    if (storedAccount){
      closeForm()

      let dest = "";
      if (storedAccount.jsonAccount.editedAccount) {dest = storedAccount.jsonAccount.editedAccount.id}
      else if (storedAccount.jsonAccount.createdAccount) {dest = storedAccount.jsonAccount.createdAccount.id}

      navigate(`/accounts/${dest}`)
    }
  }

  return (
    isOpen && 
    <Modal title={accountToEdit ? "Editar conta" : "Criar conta"} isOpen={isOpen} setIsOpen={setIsOpen}>
      <form className={styles.accountsForm} onSubmit={handleSubmit}>
        <FormInput
          formName="accountsForm" 
          label='Nome da conta'
          name='name'
          type='string'
          value={name.value}
          onChange={name.onChange}
          setValue={name.setValue}
          style={{gridColumn: 'span 2'}}
        />
        <FormInput
          formName="accountsForm" 
          label="Tipo"
          name='type'
          type='select'
          value={type}
          onChange={setType}
          options={typeOptions}
          setValue={setType}
        />
        <FormInput
          formName="accountsForm" 
          label='Saldo inicial'
          name='initial_balance'
          type='string'
          value={initialBalance.value}
          onChange={initialBalance.onChange}
          setValue={initialBalance.setValue}
          // style={(type && type.value === 'T') ? {gridColumn: 'span 6'} : {gridColumn: 'span 4'}}
          currency={true}
        />
        <FormInput
          formName="accountsForm"
          label="Exibir conta"
          name="show"
          type="checkbox"
          value={show.value}
          onChange={show.onChange}
          setValue={show.setValue}
        />
        {fetchLoading 
          ?
          <Button type="confirm" disabled>{accountToEdit ? "Editando..." : "Criando..."}</Button>
          :
          <Button type="confirm">{accountToEdit ? "Editar conta" : "Criar conta"}</Button>
        }
      </form>
    </Modal>
  )
}

export default AccountsForm