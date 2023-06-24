import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import ChatsPage from './pages/ChatsPage';

function App() {
  return (
    <div className="App">
    <Routes>
    <Route path='/' Component={HomePage}/>
    <Route path='/chats' Component={ChatsPage}/>
    </Routes>
    </div>
  );
}

export default App;
