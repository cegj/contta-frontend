import React from 'react'

const types = {
  email: {
    regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    message: 'Preencha um e-mail válido'
  }
}

const useForm = (type) => {

  const [value, setValue] = React.useState((type === 'checkbox') ? false : '');
  const [error, setError] = React.useState(null);

  function validate(value){
    if (!type) return true;
    if (value.length !== 0 && types[type] && !types[type].regex.test(value)){
      setError(types[type].message)
      return false;
    } else {
      setError(null);
      return true;
    }
  }

  function onChange({target}) {
    if(error) validate(target.value)
    if(type === 'checkbox') setValue(target.checked)
    else setValue(target.value)
  }

  return {
    value,
    setValue,
    onChange,
    error,
    validate: () => validate(value),
    onBlur: () => validate(value)
  }
}

export default useForm