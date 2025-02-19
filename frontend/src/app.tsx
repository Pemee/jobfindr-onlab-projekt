import './styles/app.css';
import {Home} from './pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import Registration from './auth/Registration';
import  Login  from './auth/Login';

export function App() {

  return <div>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='' element={<Home/>} />
            <Route path='/registration' element={<Registration/>} />
            <Route path='/login' element={<Login/>} />
          </Routes>
        </BrowserRouter>       
      </AuthProvider>
    </div>
    
  
}
