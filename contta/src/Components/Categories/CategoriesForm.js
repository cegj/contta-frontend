import React from 'react'
import Modal from '../Elements/Modal'
import FormInput from '../FormInput'
import useForm from '../../Hooks/useForm'
import styles from './CategoriesForm.module.css'
import Button from '../Elements/Button'
import MessagesContext from '../../Contexts/MessagesContext'
import useFetch from '../../Hooks/useFetch'
import AppContext from '../../Contexts/AppContext'
import { useNavigate } from 'react-router-dom'
import { PATCH_CATEGORY, PATCH_CATEGORY_GROUP, POST_CATEGORY, POST_CATEGORY_GROUP } from '../../api'

const CategoriesForm = ({isOpen, setIsOpen, setUpdateCategoriesList, categoryToEdit, setCategoryToEdit}) => {

  const {setLoading, setCategories} = React.useContext(AppContext)
  const {setMessage} = React.useContext(MessagesContext)
  const {request, fetchLoading} = useFetch();
  const navigate = useNavigate();
  const name = useForm();
  const isGroup = useForm('checkbox');
  const [group, setGroup] = React.useState(null);
  const {categories} = React.useContext(AppContext)

  //Set categories options object to SELECT fields
  const groupOptions = React.useMemo(() => {return []}, []);
  React.useEffect(() => {
    groupOptions.length = 0;
    categories.forEach((group) => {
      const groupOption = {label: group.name, value: group.id};
      groupOptions.push(groupOption);
    })
  }, [categories, groupOptions])

  React.useEffect(() => {
    setLoading(fetchLoading)
  }, [fetchLoading, setLoading])

  React.useEffect(() => {
    function setEdittingValues(){
      const editIsGroup = categoryToEdit.group_id ? false : true;
      const groupOfEditting = groupOptions.find(group => group.value === categoryToEdit.group_id)
      name.setValue(categoryToEdit.name)
      if(editIsGroup) isGroup.setValue(true)
      if(!editIsGroup) setGroup(groupOfEditting)
    }
    if (categoryToEdit){
      setEdittingValues()
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryToEdit]) 

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
      isGroup.setValue(false)
      setGroup(null)
      setCategoryToEdit(null)
    }
  }, [isOpen, name, isGroup, setGroup, setCategoryToEdit, setIsOpen])

  const editCategory = React.useCallback(async(body, id, isGroup) => {
    try {
      const token = window.localStorage.getItem('token');
      let url;
      let options;
      if (isGroup) {
        const apiParams = PATCH_CATEGORY_GROUP(body, token, id)
        url = apiParams.url
        options = apiParams.options
      } else {
        const apiParams = PATCH_CATEGORY(body, token, id)
        url = apiParams.url
        options = apiParams.options
      }
      const {response, json, error} = await request(url, options)  
      if (response.ok){
        setMessage({content: `${!isGroup ? 'Categoria editada' : 'Grupo editado'} com sucesso`, type: 's'})
        setCategories([])
        setUpdateCategoriesList(true)
        return json
      } else {
        throw new Error(error)
      }
    } catch (error) {
      console.log(error)
      setMessage({content: `Erro ao editar ${!isGroup? 'categoria' : 'grupo'}: ${error.message}`, type: "e"})
      return false;
    }
  }, [request, setMessage, setCategories, setUpdateCategoriesList])

  const storeCategory = React.useCallback(async(body, isGroup) => {
    try {
      const token = window.localStorage.getItem('token');
      let url;
      let options;
      if (isGroup) {
        const apiParams = POST_CATEGORY_GROUP(body, token)
        url = apiParams.url
        options = apiParams.options
      } else {
        const apiParams = POST_CATEGORY(body, token)
        url = apiParams.url
        options = apiParams.options
      }
      const {response, json, error} = await request(url, options)  
      if (response.ok){
        setMessage({content: `${!isGroup ? 'Categoria criada' : 'Grupo criado'} com sucesso`, type: 's'})
        setCategories([])
        setUpdateCategoriesList(true)
        return json
      } else {
        throw new Error(error)
      }
    } catch (error) {
      console.log(error)
      setMessage({content: `Erro ao criar ${!isGroup? 'categoria' : 'grupo'}: ${error.message}`, type: "e"})
      return false;
    }
  }, [request, setMessage, setCategories, setUpdateCategoriesList])


  async function handleSubmit(event){
    event.preventDefault();
    let fields = [
      {field: name, name: `nome ${!isGroup.value ? 'da categoria' : 'do grupo'}`}
    ]
    if (!isGroup.value) {
      fields.push({field: group, name: 'grupo da categoria'})
    }
    if (!validateSubmit(fields)){
      return;
    }

    const body = {
      name: name.value,
    }
    if (!isGroup.value) {
      body.group_id = group.value;
    }

    const storedCategory = categoryToEdit
    ? await editCategory(body, categoryToEdit.id, isGroup.value)
    : await storeCategory(body, isGroup.value);

    if (storedCategory){
      closeForm()

      let dest = "";
      if (storedCategory.group) {dest = `groups/${storedCategory.group.id}`}
      else if (storedCategory.category) {dest = storedCategory.category.id}

      navigate(`/categories/${dest}`)
    }
  }

  return (
    isOpen && 
    <Modal title={categoryToEdit ? `Editar ${!isGroup.value ? 'categoria' : 'grupo'}` : `Criar ${!isGroup.value ? 'categoria' : 'grupo'}`} isOpen={isOpen} setIsOpen={setIsOpen}>
      <form className={styles.CategoriesForm} onSubmit={handleSubmit}>
        {!categoryToEdit && 
          <FormInput
            formName="categoriesForm"
            label="Grupo de categorias"
            name="isGroup"
            type="checkbox"
            value={isGroup.value}
            onChange={isGroup.onChange}
            setValue={isGroup.setValue}
          />}
        <FormInput
          formName="categoriesForm" 
          label={`Nome ${!isGroup.value ? 'da categoria' : 'do grupo'}`}
          name='name'
          type='string'
          value={name.value}
          onChange={name.onChange}
          setValue={name.setValue}
        />
        {!isGroup.value &&         
        <FormInput
          formName="categoriesForm"
          label="Grupo da categoria"
          name='group'
          type='select'
          value={group}
          onChange={setGroup}
          options={groupOptions}
          setValue={setGroup}
        />}
        {fetchLoading 
          ?
          <Button type="confirm" disabled>{categoryToEdit ? "Editando..." : "Criando..."}</Button>
          :
          <Button type="confirm">{categoryToEdit ? `Editar ${!isGroup.value ? 'categoria' : 'grupo'}` : `Criar ${!isGroup.value ? 'categoria' : 'grupo'}`}</Button>
        }
      </form>
    </Modal>
  )
}

export default CategoriesForm