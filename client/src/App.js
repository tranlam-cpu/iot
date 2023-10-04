
import './App.css';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import House from './House'
import Dashboard from './Dashboard'
import Auth from './views/Auth'
import DataContextProvider from './Contexts/DataContext'
import Menu from './Components/Menu'
import Header from './views/Header'
import AuthcontextProvider from './Contexts/AuthContext'
import ProtectedRoute from './Components/ProtectedRoute'

function App() {
  
  return (
    <AuthcontextProvider>
    <DataContextProvider>
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Auth />} />
        
        <Route exact path='/house' element={
          <>
          <ProtectedRoute>
          <Menu />
          <House />
          </ProtectedRoute>  
          </>
        } />
      
        <Route exact path='/dashboard' element={
          <>
          <ProtectedRoute>
          <Menu />
          <Header />
          <Dashboard />
          </ProtectedRoute>
          </>
        } />
        
      </Routes>
    </BrowserRouter>
    </DataContextProvider>
    </AuthcontextProvider>
  );
}

export default App;
