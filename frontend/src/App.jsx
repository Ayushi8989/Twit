import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import SignUpPage from "./pages/auth/signup/SignUpPage"
import LoginPage from "./pages/auth/login/LoginPage"
import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"
import Notification  from "./pages/notification/NotificationPage"
import Profile from "./pages/profile/ProfilePage"
import {Toaster} from "react-hot-toast";

function App() {

  return (
    <div className='flex max-w-6xl mx-auto'>
      <Sidebar/>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/notifications' element={<Notification />} />
        <Route path='/profile/:username' element={<Profile />} />
      </Routes>
      <RightPanel/>
      <Toaster/>
    </div>
  )
}

export default App
