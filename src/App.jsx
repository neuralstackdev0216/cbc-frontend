import './App.css'
import './index.css'
import Header from './components/Header'
import ProductCard from './components/productCard'
import HomePage from './pages/home'
import LoginPage from './pages/login'
import SignupPage from './pages/signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminPage from './pages/adminPage'

function App() {
  

  return (
    <BrowserRouter>
      <div >
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/admin/*' element={<AdminPage />} />
          <Route path='/*' element={<h1>404 Not Found</h1>} />  
        </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App
