import React from 'react'

const types = {
  email: {
    regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    message: 'Preencha um e-mail válido'
  }
}

const useForm = (type) => {

  const [value, setValue] = React.useState('');
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
    setValue(target.value)
  }

  function onCheck({target}) {
    setValue(target.checked)
  }

  return {
    value,
    setValue,
    onChange,
    onCheck,
    error,
    validate: () => validate(value),
    onBlur: () => validate(value)
  }
}

export default useForm