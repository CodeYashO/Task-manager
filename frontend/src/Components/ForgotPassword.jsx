import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/ForgotPassword.css"

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [formdata , setformdata] = useState({email : ""})

    const handleChange = (e) => {
        setformdata({...formdata , [e.target.name] : e.target.value})
    }

    console.log(formdata)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post(`http://localhost:5000/api/auth/forgot-password` , formdata);
            console.log(response);
            navigate("/login");
        }catch(err) {
            console.log(err);  
        }
    }

    return (
        <div className="forgot-password-container">
            <div className="form-title-container">
                <h1>Forgot Password ?</h1>
            </div>

            <div className="form-container">
                <form className="form" onSubmit={handleSubmit}>
                
                    <input type="text" name="email" className="input-field email" placeholder="Enter your email" required onChange={handleChange}/>

                    <input type="submit"/>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword;
