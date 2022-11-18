import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Components/Login/Login';
import { MessagesContextData } from './Contexts/MessagesContext';
import { UserContextData } from './Contexts/UserContext';
import { AppContextData } from './Contexts/AppContext';
import Accounts from './Components/Accounts/Accounts';
import Messages from './Components/Elements/Messages';
import ProtectedRoute from './Helpers/ProtectedRoute';
import AddTransactionButton from './Components/Elements/AddTransactionButton';
import TransactionForm from './Components/TransactionForm';
import ReactTooltip from 'react-tooltip';
import React from 'react';

function App() {

  return (
    <BrowserRouter>
      <MessagesContextData>
          <UserContextData>
            <AppContextData>
              <ReactTooltip effect="solid" className="tooltip" backgroundColor="#636262" />
              <Messages />
              <Routes>
                <Route path="/" element={<Login />}/>
                <Route path="/accounts/*" element={<ProtectedRoute><Accounts /></ProtectedRoute>}/>
              </Routes>
              <TransactionForm />
              <AddTransactionButton />
            </AppContextData>
          </UserContextData>
      </MessagesContextData>
    </BrowserRouter>
  );
}

export default App;
