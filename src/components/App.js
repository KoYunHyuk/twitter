import React, { useEffect, useState } from 'react'
import AppRouter from 'components/Router';
import { authService } from 'fbase'

function App() {
  const [init, setInit] = useState(false);
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    // Log In 또는 Log Out 할 때 발생함. 또는 Application이 초기화 될 때도 발생함.
    authService.onAuthStateChanged(function(user){
      if(user){
        //setIsLoggedIn(true); // => 밑에 isLoggedIn={userObj} 대신에 isLoggedIn을 사용할 시에 필요.
        setUserObj(user);
      }else{
        //setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, [])

  return (
    <div className="App">
      {init ? <AppRouter isLoggedIn={userObj} userObj={userObj} /> : "initializing"}
    </div>
  );
}

export default App;
