import React, { useEffect } from 'react'
import Navbar from './components/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

//import components 
import Homepage from './pages/Homepage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';

const App = () => {
  const { authUser, CheckAuth, isCheckingAuth  , onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  console.log('Theme:', theme);

  useEffect(() => {
    CheckAuth();
  }, [CheckAuth]);

  // Apply theme whenever it changes (this is the key fix)
  useEffect(() => {
    // Apply theme to both document element and body
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    
    // Force a repaint by triggering a tiny layout change and back
    const html = document.documentElement;
    const originalStyle = html.style.cssText;
    html.style.cssText = originalStyle + '; padding-bottom: 1px';
    setTimeout(() => {
      html.style.cssText = originalStyle;
    }, 1);
    
    console.log('Theme updated to:', theme);
  }, [theme]);

  if(isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen' data-theme={theme}>
        <Loader className="size-10 animate-spin"/>
      </div>
    );
  }

  return (
    <div data-theme={theme}> 
      <Navbar/>
      <Routes>
        <Route path="/" element={authUser ? <Homepage/> : <Navigate to="/login"/>} />
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/"/>} />
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/"/>} />
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}/>
        <Route path="/notifications" element={authUser ? <NotificationsPage/> : <Navigate to="/login"/>}/>
      </Routes>

      <Toaster/>
    </div>
  );
};

export default App;