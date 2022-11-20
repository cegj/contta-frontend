import React from 'react'
import AppContext from '../Contexts/AppContext';

const useFetch = () => {

  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(null);

  const request = React.useCallback(async(url, options) => {
    let response;
    let json;
    let error;
    try {
      setLoading(true)
      response = await fetch(url, options);
      json = await response.json();
      if (!response.ok){
        throw new Error();
      }
    } catch (e) {
      if (json.error) error = json.error
      else if (json.message) error = json.message
      else error = 'Falha na requisição ao servidor'
      json = null;
    } finally {
      setData(json);
      setLoading(false)
      return {response, json, error}
    }
  }, [setLoading])

  return {request, data, loading}
}

export default useFetch