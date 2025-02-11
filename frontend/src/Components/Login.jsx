import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../Css/Login.css"

const Login = () => {
    const navigate = useNavigate();
    const [formdata , setformdata] = useState({email : "" , password : ""})

    const handleChange = (e) => {
        setformdata({...formdata , [e.target.name] : e.target.value})
    }

    console.log(formdata)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:5000/api/auth/login" , formdata);
            console.log(response);
            localStorage.setItem("token" , response.data.token);
            navigate("/home");
        }catch(err) {
            console.log(err);  
        }
    }

    const forgotPasswordHandler = () => {
        navigate('/forgot-password');
    }

    return (
        <div className="login-container">
            <div className="form-title-container">
                <h1>Login</h1>
            </div>

            <div className="form-container">
                <form className="form" onSubmit={handleSubmit}>
                
                    <input type="text" name="email" className="input-field email" placeholder="Enter your email" required onChange={handleChange}/>

                    <input type="password" name="password" className="input-field password" placeholder="Enter your password" required onChange={handleChange}/>

                    <input type="submit"/>
                </form>
            </div>

            <a className="forgot-password-button" onClick={forgotPasswordHandler}>forgot password</a>
        </div>
    )
}

export default Login;