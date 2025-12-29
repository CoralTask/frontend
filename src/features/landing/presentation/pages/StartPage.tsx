import Header from '../../../../shared/ui/Header/Header'
import beachImage from '../../../../assets/beach.png'

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