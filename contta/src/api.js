import objectToQueryString from "./Helpers/objectToQueryString";

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

export function GET_TRANSACTIONS(token, queryObject){
  const query = objectToQueryString(queryObject)

  return {
    url: API_URL + `/transactions?${query}`,
    options: {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }  
    }
  }
}

export function GET_TRANSACTION_BY_ID(token, id){
  return {
    url: API_URL + `/transactions/${id}`,
    options: {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }  
    }
  }
}

export function DELETE_TRANSACTION(token, transactionId, transactionType, cascade){
  let typeOnUrl;
  switch(transactionType){
    case 'D':
      typeOnUrl = 'expenses'
      break
    case 'R':
      typeOnUrl = 'incomes'
      break
    case 'T':
      typeOnUrl = 'transfers'
      break
    default:
      typeOnUrl = false;
      break
  }

  return {
    url: API_URL + `/transactions/${typeOnUrl}/${transactionId}?cascade=${cascade}`,
    options: {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token
      }  
    }
  }
}


export function PATCH_INCOME(body, token, id, cascade){
  return {
    url: API_URL + `/transactions/incomes/${id}?cascade=${cascade}`,
    options: {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(body)
    }
  }
}

export function PATCH_EXPENSE(body, token, id, cascade){
  return {
    url: API_URL + `/transactions/expenses/${id}?cascade=${cascade}`,
    options: {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(body)
    }
  }
}

export function PATCH_TRANSFER(body, token, id, cascade){
  return {
    url: API_URL + `/transactions/transfers/${id}?cascade=${cascade}`,
    options: {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(body)
    }
  }
}