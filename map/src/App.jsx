import React, { useState, useEffect } from "react";
import axios from "axios";
// import MapComponent from "./components/MapComponent";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Signin from './pages/signin';
import Signup from './pages/signup';
import Searchpage from './pages/Searchpage';


const App = () => {
 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/searchpage" element={<Searchpage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
