import { Routes, Route } from 'react-router-dom'
import StartPage from '../features/landing/presentation/pages/StartPage'
import LoginPage from '../features/auth/presentation/pages/LoginPage'
import RegisterPage from '../features/auth/presentation/pages/RegisterPage'
import MainPage from "../features/calendar/presentation/pages/MainPage"
import ProfilePage from "../features/auth/presentation/pages/ProfilePage"

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