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

export function GET_ACCOUNTS(token){
  return {
    url: API_URL + '/accounts',
    options: {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }  
    }
  }
}

export function GET_CATEGORIES(token){
  return {
    url: API_URL + '/categories/groups',
    options: {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }  
    }
  }
}

export function POST_INCOME(body, token){
  return {
    url: API_URL + '/transactions/incomes',
    options: {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(body)
    }
  }
}

export function POST_EXPENSE(body, token){
  return {
    url: API_URL + '/transactions/expenses',
    options: {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(body)
    }
  }
}

export function POST_TRANSFER(body, token){
  return {
    url: API_URL + '/transactions/transfers',
    options: {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(body)
    }
  }
}