import { useNavigate } from 'react-router-dom'
import logo from '../../../assets/logo.png'

const Header = () => {
  const navigate = useNavigate()

  return (
    <header className="absolute top-0 left-0 w-full bg-white shadow-md z-10">
      <div className="w-full px-6 py-3 flex justify-between items-center">
        
        <img 
          src={logo} 
          alt="Coraltask Logo" 
          className="h-10 cursor-pointer"
          onClick={() => navigate('/')}
        />

        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="bg-white text-primary-300 px-12 py-3 rounded-xl font-pretendard text-base">
              로그인
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="bg-primary-300 text-white px-12 py-3 rounded-xl font-pretendard text-base">
              회원가입
          </button>
        </div>
      </div>
    </header>
  )
}
export default Header
