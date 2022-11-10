import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Components/Login/Login';
import { MessagesContextData } from './Contexts/MessagesContext';
import { UserContextData } from './Contexts/UserContext';
import Accounts from './Components/Accounts/Accounts';
import Messages from './Components/Elements/Messages';

function App() {

  return (
    <BrowserRouter>
      <MessagesContextData>
        <UserContextData>
          <Messages />
          <Routes>
            <Route path="/" element={<Login />}/>
            <Route path="/accounts" element={<Accounts />}/>
          </Routes>
        </UserContextData>
      </MessagesContextData>
    </BrowserRouter>
  );
}

export default App;
