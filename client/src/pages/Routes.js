import React from 'react'
import { Routes, Route } from "react-router";

import HomePage from "./HomePage"
import Experience from "./Experience"



const Router = () => {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route exact path="/Experience" element={<Experience />} />

    </Routes>
  );
}

export default Router;
