import {useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/Signup.css"

const SignUp = () => {
    const navigate = useNavigate();
    const [formdata , setformdata] = useState({
        firstName : "",
        lastName : "",
        email : "",
        password : "",
        confirmPassword : "",
    })
    const [message , setmessage] = useState("");

    const handleChange = (e) => {
        setformdata({...formdata , [e.target.name] : e.target.value})
    }

    console.log(formdata)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formdata.password !== formdata.confirmPassword) {
            setmessage("please match the password")
            return ;
        }
        try {
            const response = await axios.post("http://localhost:5000/api/auth/register" , formdata);
            if(response.status === 201) {
                setformdata({firstName : "" , lastName : "" , email : "" , password : "" , confirmPassword : ""})
                console.log(response);
                navigate('/email-verification');
            }
        }catch(err) {
            console.log(err);
        }
    }

    return ( 
        <div className="signup-container">
            <div className="form-title-container">
                <h1>Create an Account</h1>
            </div>

            <div className="form-container">
                <form className="form" onSubmit={handleSubmit}>
                    <input type="text" name="firstName" className="input-field firstname" placeholder="Enter your firstName" required onChange={handleChange}/>

                    <input type="text" name="lastName" className="input-field lastname" placeholder="Enter your lastName" required onChange={handleChange}/>

                    <input type="text" name="email" className="input-field email" placeholder="Enter your email" required onChange={handleChange}/>

                    <input type="Password" name="password" className="input-field password" placeholder="Enter your password" required onChange={handleChange}/>

                    <input type="Password" name="confirmPassword" className="input-field confirmPassword" placeholder="Enter your confirmPassword" required onChange={handleChange}/>

                    <input type="submit"/>
                </form>
                <div className="last">
                    already have an account ? <button className="loginbtn" onClick={() => navigate('/login')}>Login</button>
                </div>
            </div>
        </div>
    )
}

export default SignUp;