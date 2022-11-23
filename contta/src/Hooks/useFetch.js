import React from 'react'

const useFetch = () => {

  const [data, setData] = React.useState(null);
  const [fetchLoading, setFetchLoading] = React.useState(null);

  const request = React.useCallback(async(url, options) => {
    let response;
    let json;
    let error;
    try {
      setFetchLoading(true)
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
      setFetchLoading(false)
      return {response, json, error}
    }
  }, [setFetchLoading])

  return {request, data, fetchLoading}
}

export default useFetch