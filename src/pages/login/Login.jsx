import React, { useState, useContext } from 'react'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
    const [error, setError] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const {dispatch} = useContext(AuthContext);

    const handleLogin = (e) => { 
        e.preventDefault();

        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user);
            dispatch({type: "LOGIN", payload:user})
            navigate("/todo");
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            setError(true);
            // ..
        });

     }

  return (
    <>
        <Navbar />
            <div className="login">
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="email" onChange={ (e) => setEmail(e.target.value) } />
                    <input type="password" placeholder="********" onChange={ (e) => setPassword(e.target.value)} />
                    <button type="submit">Login</button>
                    {error ? <p className="wrong">Wrong email or password!</p> : <p className="enter">Enter email and password</p>}
                </form>
            
            </div>
    </>
  )
}

export default Login
