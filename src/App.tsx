import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import React from "react";
import "./App.css";
import {
  BrowserRouter as Router, Routes, Route,Navigate,} from "react-router-dom"; 


//import Posts from './components/posts'


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/Header" element={<Header />} />
        <Route path="/Sidebar" element={<Sidebar />} /> */}
        <Route path="/Home" element={<Home />} />
        

        {/* Redirect to SignIn if no matching route */}
        <Route path="*" element={<Navigate to="/Header" />} />
      </Routes>
    </Router>
  );
};

export default App;