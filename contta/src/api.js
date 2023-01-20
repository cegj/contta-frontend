import objectToQueryString from "./Helpers/objectToQueryString";

export const API_URL = 'http://3.220.229.85:8000/api';
// export const API_URL = 'http://localhost:8000/api';

export function GET_CHECK_TABLES(){
  return {
    url: API_URL + '/setup/checktables',
    options: {
      method: 'GET'
    }
  }
}

export function POST_SETUP_DATABASE(){
  return {
    url: API_URL + '/setup/database',
    options: {
      method: 'POST'
    }
  }
}

export function POST_SETUP_CATEGORIES(token){
  return {
    url: API_URL + '/setup/categories',
    options: {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      }  
    }
  }
}

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

export function POST_CREATE_USER(body){
  return {
    url: API_URL + '/users/create',
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

export function POST_CATEGORY(body, token){
  return {
    url: API_URL + '/categories',
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

export function POST_CATEGORY_GROUP(body, token){
  return {
    url: API_URL + '/categories/groups',
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

export function PATCH_CATEGORY(body, token, id){
  return {
    url: API_URL + `/categories/${id}`,
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

export function PATCH_CATEGORY_GROUP(body, token, id){
  return {
    url: API_URL + `/categories/groups/${id}`,
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

export function DELETE_CATEGORY(token, id){
  return {
    url: API_URL + `/categories/${id}`,
    options: {
      method: 'DELETE',
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

export function POST_INITIAL_BALANCE(body, token){
  return {
    url: API_URL + '/transactions/initialbalances',
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

export function PATCH_INITIAL_BALANCE(body, token, id){
  return {
    url: API_URL + `/transactions/initialbalances/${id}`,
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

export function DELETE_INITIAL_BALANCE(token, id){
  return {
    url: API_URL + `/transactions/initialbalances/${id}`,
    options: {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token
      }  
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


export function PATCH_INCOME(body, token, id, cascade = false){
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

export function PATCH_EXPENSE(body, token, id, cascade = false){
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

export function PATCH_TRANSFER(body, token, id, cascade = false){
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

export function GET_BALANCE(token, queryObject){
  const query = objectToQueryString(queryObject)

  return {
    url: API_URL + `/balances?${query}`,
    options: {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }  
    }
  }
}

export function GET_BALANCE_FOR_BUDGET(token, queryObject){
  const query = objectToQueryString(queryObject)

  return {
    url: API_URL + `/balances/budget?${query}`,
    options: {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }  
    }
  }
}

export function POST_ACCOUNT(body, token){
  return {
    url: API_URL + '/accounts',
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

export function PATCH_ACCOUNT(body, token, id){
  return {
    url: API_URL + `/accounts/${id}`,
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

export function DELETE_ACCOUNT(token, id){
  return {
    url: API_URL + `/accounts/${id}`,
    options: {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token
      }  
    }
  }
}