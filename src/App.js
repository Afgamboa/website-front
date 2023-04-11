import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import WelcomeMessage from './components/Welcome';
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="/welcome" Component={WelcomeMessage} />  

      </Routes>
    </Router>
  );
}

export default App;
