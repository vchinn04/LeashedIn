import * as React from 'react'
import { Routes, Route } from "react-router";

import HomePage from "./HomePage"
import MainPage from "./MainPage"
import LoginState from "./LoginState"

const Router = () => {
  const [loginStatus, setLoginState] = LoginState();

  console.log(loginStatus)

  return (
    <Routes>
      <Route exact path="/" element={(loginStatus) ? <MainPage loginStatus={loginStatus} /> : <HomePage setLoginState={setLoginState} /> } /> //Render either login page or main page depending on login status.
      <Route exact path="/profile" element={<MainPage loginStatus={loginStatus} />} />
    </Routes>
  );
}

export default Router;
