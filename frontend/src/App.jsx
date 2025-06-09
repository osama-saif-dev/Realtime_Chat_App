import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from 'lucide-react';
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
import SettingPage from "./pages/SettingPage";
import NotificationPage from "./pages/NotificationPage";
import { useChatStore } from "./store/useChatStore";


export default function App() {
  const { authUser, checkAuth, isCheckingAuth, connectSocket, disconnectSocket } = useAuthStore();
  const { subscribeToNotifications, unsubscribeToNotifications } = useChatStore();
  
 useEffect(() => {
    if (authUser) {
      connectSocket();
      subscribeToNotifications();
    }
    
    return () => {
      if (authUser) {
        unsubscribeToNotifications();
        disconnectSocket();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, subscribeToNotifications, unsubscribeToNotifications]);

  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to={'/login'} />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to={'/'} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to={'/login'} />} />
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to={'/login'} />} />
        <Route path="/settings" element={<SettingPage />} />
      </Routes>
      <Toaster />
    </div>
  )
}