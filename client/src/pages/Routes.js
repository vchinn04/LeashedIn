import * as React from 'react'
import { Routes, Route, Navigate } from "react-router";
import {useEffect, useState} from 'react';

import HomePage from "./HomePage"
import MainPage from "./MainPage"



const Router = () => {
  const [loginStatus, setLoginStatus] = LoginHook();

  //let homepagePath = (loginStatus) ? "/main" : "/login"
  console.log(loginStatus)

  return (
    <Routes>
      <Route exact path="/" element={(loginStatus) ? <MainPage loginStat={loginStatus} /> : <HomePage loginStat={loginStatus} setLoginStat={setLoginStatus} /> } />

      <Route exact path="/profile" element={<MainPage loginStat={loginStatus} />} />

    </Routes>
  );
}

function LoginHook() {
  const [loginStatus, setLoginStatus] = useState(sessionStorage.getItem('LoginStatus'));


  const saveLoginStatus = (newLoginStatus) => {
    sessionStorage.setItem('LoginStatus', newLoginStatus);
    setLoginStatus(newLoginStatus);
  };


  return [loginStatus, saveLoginStatus];
}


export default Router;
