import React from 'react'
import { Routes, Route } from "react-router";

import HomePage from "./HomePage"
import Experience from "./Experience"

import Login from "../components/Login/Login"


const Router = () => {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route exact path="/Experience" element={<Experience />} />
      <Route exact path="/Login" element={<Login />} />

    </Routes>
  );
}

export default Router;
