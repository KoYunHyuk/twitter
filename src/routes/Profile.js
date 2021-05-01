import React from "react"
import { authService } from "fbase";
import { useHistory } from "react-router-dom";

function Profile(){
    const history = useHistory();
    function onLogOutClick(){
        authService.signOut();
        history.push("/"); // 로그아웃한 뒤에 Redirecting
    }
    return (
        <>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
}


export default Profile;