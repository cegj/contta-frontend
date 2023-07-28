import React from 'react'
import { useNavigate } from 'react-router-dom';

const useFetch = () => {

  const [data, setData] = React.useState(null);
  const [fetchLoading, setFetchLoading] = React.useState(null);
  const navigate = useNavigate();

  const request = React.useCallback(async(url, options) => {
    let response;
    let json;
    let error;
    try {
      setFetchLoading(true)
      response = await fetch(url, options);
      json = await response.json();
      if (!response.ok){
        // if (response.status === 401) {
        //   navigate('/')
        // }
        throw new Error();
      }
    } catch (e) {
      if (json.error) error = json.error
      else if (json.message) error = json.message
      else error = 'Falha na requisição ao servidor'
      json = null;
    } finally {
      setData(json);
      setFetchLoading(false)
      return {response, json, error}
    }
  }, [setFetchLoading, navigate])

  return {request, data, fetchLoading}
}

export default useFetch