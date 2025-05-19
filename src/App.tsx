import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Projects from './pages/Project';
import Signup from './pages/signup';
import Chat from './pages/Chat';
import Task from './pages/Task';
import { ApolloProvider } from "@apollo/client";
import client from "./lib/ApolloClient"; 
import React from "react";
import "./App.css";
import {
  BrowserRouter as Router, Routes, Route,Navigate,} from "react-router-dom"; 
import Signin from './pages/Signin';


//import Posts from './components/posts'


const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
    <Router>
     <Routes>
      
        {/* <Route path="/Header" element={<Header />} />
        <Route path="/Sidebar" element={<Sidebar />} /> */}
        <Route path="/Home" element={<Home />} />
        <Route path='/Projects' element={<Projects/>}/>
        <Route path='/signup' element = {<Signup/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/Chat' element={<Chat/>}/>
        <Route path='/tasks' element={<Task/>}/>
        {/* <Route path="/Header" element={<Header />} />
        {/* <Route path="/posts" element={<Posts />} /> */}
        {/* Add more routes as needed */}
        
        {/* Redirect to Home if no matching route */}

        {/* Redirect to SignIn if no matching route */}
        <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
    </Router>
    </ApolloProvider>
  );
};

export default App;