import { Routes, Route } from 'react-router-dom'
import StartPage from './pages/StartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MainPage from "./pages/MainPage"
import ProfilePage from "./pages/ProfilePage"

const App = () => {
  return (
    <div className="h-full">
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/main" element={<MainPage/>}/>
        <Route path="/profile" element ={<ProfilePage/>}/>
      </Routes>
    </div>
  )
}

export default App