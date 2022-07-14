import React, { Fragment, useState } from 'react';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = ({ setAuth }) => {
    const [inputs, setInputs] = useState({
        email: "",
        name: "",
        password: ""
    });

    const {email, name, password} = inputs;

    const onChange = e => {
        setInputs({...inputs, [e.target.name] : e.target.value});
    };

    const onSubmitForm = async(e) => {
        e.preventDefault();

        try {
            const body = {email, name, password};
            
            const response = await fetch('http://localhost:5000/auth/register', {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(body)    
            });

            const parseResponse = await response.json();
            
            if(parseResponse.token){
                localStorage.setItem('token', parseResponse.token);
            
                setAuth(true);
                toast.success(`Welcome to the club, ${parseResponse.name.charAt(0).toUpperCase()}${parseResponse.name.substring(1,)}!`);
            } else {
                setAuth(false);
                toast.error(parseResponse);
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
    <Fragment>
        <h1 className="text-center my-5">Register</h1>
        <form onSubmit={onSubmitForm}>
            <input 
                className="form-control my-3" 
                type="email" 
                name="email" 
                placeholder="Example@example.com"
                value={email}
                onChange={e => onChange(e)}
            />
            <input 
                className="form-control my-3" 
                type="text" 
                name="name" 
                placeholder="Select Username"
                value={name}
                onChange={e => onChange(e)}
            />
            <input 
                className="form-control my-3" 
                type="password" 
                name="password" 
                placeholder="Enter Password"
                value={password}
                onChange={e => onChange(e)}
            />
            <button className="btn btn-success btn-block ">Submit</button>
        </form>
        <Link to="/login">Login</Link>
    </Fragment>
 )

};
export default Register;