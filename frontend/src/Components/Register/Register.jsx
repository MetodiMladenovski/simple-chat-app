import React, { useState } from "react";
import '../Register/Register.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const[email, setEmail] = useState("");
    const[name, setName] = useState("");
    const[lastname, setLastname] = useState("");
    const[password, setPassword] = useState("");

    const navigate = useNavigate();

    const registerUser = () => {
        axios.post("http://localhost:8080/users/register", {
                email: email,
                name: name,
                lastname: lastname,
                password: password
        });

        navigate("/login");
    }


    return (
        <div className="mainRegister">
            <h1>Register user</h1>
            <div className="formHolder">
                <form>
                    <label id="email" htmlFor="email">Email</label>
                    <input id="email" 
                            name="email" 
                            type="text"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            />
                    <label id="firstName" htmlFor="firstName">First Name</label>
                    <input id="firstName" 
                            name="firstName" 
                            type="text"
                            required
                            onChange={(e) => setName(e.target.value)}
                            />
                    <label id="lastname" htmlFor="lastname">Last Name</label>
                    <input id="lastname" 
                            name="lastname"
                            type="text"
                            required
                            onChange={(e) => setLastname(e.target.value)}
                            />
                    <label id="password" htmlFor="password">Password</label>
                    <input id="password"
                            name="password" 
                            type="password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            
                    <button type="submit" onClick={() => registerUser()}>Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;