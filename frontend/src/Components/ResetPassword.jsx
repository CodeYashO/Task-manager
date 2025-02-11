import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const ResetPassword = ({params}) => {
    const navigate = useNavigate();
    const {token} = useParams();

    const [formdata , setformdata] = useState({password : ""})

    const handleChange = (e) => {
        setformdata({...formdata , [e.target.name] : e.target.value})
    }

    console.log(formdata)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}` , formdata);
            console.log(response);
            localStorage.setItem("token" , response.data.token);
            navigate("/home");
        }catch(err) {
            console.log(err);  
        }
    }

    return (
        <div className="reset-password-container">
            <div className="form-title-container">
                <h1>Reset Password</h1>
            </div>

            <div className="form-container">
                <form className="form" onSubmit={handleSubmit}>
                
                    <input type="password" name="password" className="input-field password" placeholder="Enter your password" required onChange={handleChange}/>

                    <input type="submit"/>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword