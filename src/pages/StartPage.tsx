import Header from '../components/Header'
import beachImage from '../assets/beach.jpg'

const StartPage = () => {
  return (
    <div
      className="relative w-full h-full bg-cover bg-center"
      style={{ backgroundImage: `url(${beachImage})` }}
    >
      <Header />
    </div>
  )
}

export default StartPage