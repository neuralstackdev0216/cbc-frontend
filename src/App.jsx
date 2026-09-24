import './App.css'
import './index.css'
import HomePage from './pages/home'
import LoginPage from './pages/login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminPage from './pages/adminPage'
import TestPage from './pages/testPage'
import { Toaster } from 'react-hot-toast'
import RegisterPage from './pages/register'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ForgetPassword from './pages/forgetPassword.jsx'
function App() {
  

  return (
    <GoogleOAuthProvider clientId="226297600572-0749f3otaibtnkl45aga4g6fnrqebhtl.apps.googleusercontent.com">
    <BrowserRouter>
      <div >
        <Toaster />
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/forget' element={<ForgetPassword />} />
          <Route path='/signup' element={<RegisterPage />} />
          <Route path='/testing' element={<TestPage />} />
          <Route path='/admin/*' element={<AdminPage />} />
          <Route path='/*' element={<HomePage />} />  
        </Routes>

      </div>
    </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App




