import { Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

const App = () => {
  return (
    <div className="h-full">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage/>}/>
      </Routes>
    </div>
  )
}

export default App