import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react"

function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    

    function onChange(event){
        console.log(event.target.name);
        const {target : {name, value}} = event;
        if(name === "email"){
            setEmail(value);
        }else if(name === "password"){
            setPassword(value);
        }
    }
    async function onSubmit(event){
        event.preventDefault();
        try{
            let data;
            if(newAccount){
                // create Account
                data = await authService.createUserWithEmailAndPassword(email, password);
            }else {
                // log in
                data = await authService.signInWithEmailAndPassword(email, password);
            }
            console.log(data);
        }catch(error){
            console.log(error.message);
            setError(error.message);
        }
    }
    const toggleAccount = () => setNewAccount((prev) => !prev);
    async function onSocialClick(event){
        console.log(event.target.name);
        const {target: {name}} = event; // ES6
        let provider;
        
        if(name === "google"){
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        }else if(name === "github"){
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }
        const data = await authService.signInWithPopup(provider);
        console.log(data);
    }

    return(
        <div>
            <form onSubmit={onSubmit}>
                <input 
                    name="email" 
                    type="email" 
                    placeholder="Email" 
                    required value={email}
                    onChange={onChange}
                />
                <input 
                    name="password" 
                    type="password" 
                    placeholde="Password" 
                    required value={password} 
                    onChange={onChange}
                />
                <input name="" type="submit" value={newAccount ? "Create Account" : "Log In"} />
                {error}
            </form>
            <span onClick={toggleAccount}>{newAccount ? "Sign in" : "Create Account" }</span>
            <div>
                <button onClick={onSocialClick} name="google">Continue with Google</button>
                <button onClick={onSocialClick} name="github">Continue with Github</button>
            </div>
        </div>
    )
}
export default Auth;