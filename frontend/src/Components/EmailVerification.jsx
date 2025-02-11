import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const EmailVerification = () => {
    const navigate = useNavigate();
    const [formdata , setformdata] = useState({email : "" , otp : ""})

    const handleChange = (e) => {
        setformdata({...formdata , [e.target.name] : e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/verify-otp" , formdata);
            if(response.status === 200) {
                console.log(response)
                localStorage.setItem("token" , response.data.token)
                navigate('/home')
            }
        }catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="email-verification-container">
            <div className="form-title-container">
                <h1>Email Verification</h1>
            </div>

            <div className="form-container">
                <form className="form" onSubmit={handleSubmit}>
                
                    <input type="text" name="email" className="input-field email" placeholder="Enter your email" required onChange={handleChange}/>

                    <input type="text" name="otp" className="input-field otp" placeholder="Enter your otp" required onChange={handleChange}/>

                    <input type="submit"/>
                </form>
            </div>
        </div>
    )
}

export default EmailVerification;
