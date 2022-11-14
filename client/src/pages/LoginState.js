import { useState } from 'react';

function LoginState() { //Custom Hook/Global State.. example used from React Docs: https://reactjs.org/docs/hooks-custom.html
  const [loginStatus, setState] = useState(sessionStorage.getItem('LoginStatus'));

  function dispatch(newLoginState){
    if (!newLoginState){
      sessionStorage.removeItem('LoginStatus');
    }
    else {
      sessionStorage.setItem('LoginStatus', newLoginState);
    }
    setState(newLoginState);
  };

  return [loginStatus, dispatch];
}

export default LoginState;
