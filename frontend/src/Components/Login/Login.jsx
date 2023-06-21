import React, {useState} from "react";
import '../Register/Register.css';
import { useNavigate } from "react-router";
import AxiosInstance from "../axios/AxiosInstance";

const Login = () => {
    const [emailForLogin, setEmailForLogin] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [passwordForLogin, setPasswordForLogin] = useState('');

    const navigate = useNavigate();

      const login = async () => {
        var response = await AxiosInstance.post("/users/login", {
            email: emailForLogin,
            password: passwordForLogin
        }).catch(() => {
            setErrorMsg("Wrong username or password.");
        });
        if(response !== null && response !== undefined) {
            var userId = response.data.id;
            localStorage.setItem("loggedUser", userId);
            navigate(`/${userId}`, {state: {id: userId}});
        }
        console.log(errorMsg);
    }

    return (
        <div className="mainRegister">
            <h1>Login</h1>
            <div className='formHolder'>
            <form>
                <input
                    id="email"
                    placeholder="Enter your email"
                    name="email"
                    type='text'
                    onChange={(e) => setEmailForLogin(e.target.value)}
                    margin="normal"      
                />
                <br></br>
                <input
                    id="password"
                    placeholder="Enter your password"
                    name="password"
                    type='password'
                    onChange={(e) => setPasswordForLogin(e.target.value)}
                    margin="normal"      
                />
                <br></br>
                {errorMsg!=='' ? <p style={{color: 'red'}}>{errorMsg}</p> : <p></p>}
                <br></br>
                <button style={{cursor: "pointer"}} type="button" onClick={() => login()}>
                        Login
                </button> 
              </form>
              </div>
        </div>
    )
}

export default Login;