export const API_URL = 'http://3.220.229.85:8000/api';

export function POST_LOGIN(body){
  return {
    url: API_URL + '/users/login',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(body)
    }
  }
}

export function GET_USER(token){
  return {
    url: API_URL + '/users',
    options: {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }  
    }
  }
}