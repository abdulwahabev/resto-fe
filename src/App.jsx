import './App.scss'
import "../node_modules/bootstrap/dist/js/bootstrap.bundle"   // bootstrap js
import Routes from '@/pages/Routes'
import { useAuth } from '@/context/Auth'
import ScreenLoader from '@/components/ScreenLoader'

const App = () => {
  const { isAppLoading } = useAuth()
  return (
    <>
      {isAppLoading ? <ScreenLoader /> : <Routes />}
    </>
  )
}

export default App