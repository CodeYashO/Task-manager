import { useState , useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/AddTask.css"

const AddTask = () => {
    const navigate = useNavigate()
    const [user , setuser] = useState({});
    const token = localStorage.getItem("token");
    console.log(token)
    const [formdata , setformdata] = useState({title : "" , description : ""});

    const changeHandler  = (e) => {
        setformdata({...formdata , [e.target.name] : e.target.value})
    }

    useEffect(() => {
        const findUser = async () => {
            const response = await axios.get("http://localhost:5000/api/auth/verify-token" , {
                headers: { Authorization: `Bearer ${token}` },
            })
            setuser(response.data.user);
        }
        findUser();
    } , [])

    const submitHandler = async (e) =>{
        try{
            const response = await axios.post("http://localhost:5000/api/auth/add-task" , {...formdata , userEmail : user.email})
            console.log(response)
            navigate("/home")
        }catch(err) {
            console.log(err);
        }
    }

    return (
        <div className="container">
            <div>
                <h1>Add a New Task</h1>
            </div>
            <div className="formdiv">
                <form onSubmit={submitHandler}>
                    <input type="text" name="title" onChange={changeHandler} placeholder="title of task" required/>
                    <textarea type="text" rows="10" cols="50" name="description" placeholder="description" onChange={changeHandler} required></textarea>
                    <input type="submit" className="submit-button" />
                </form>
            </div>
        </div>
    )
}

export default AddTask;