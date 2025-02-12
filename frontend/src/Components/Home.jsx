import { useState, useEffect } from "react";
import AddTask from "./AddTask";
import axios from "axios";
import "../Css/Home.css";

const Home = () => {
    const token = localStorage.getItem("token");
    const [tasks, setTasks] = useState([]);
    const [editTask, setEditTask] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [status, setStatus] = useState("Pending")
    const [showPopup, setShowPopup] = useState(false);
    const [user , setuser] = useState({});

    useEffect(() => {
        const findUser = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/auth/verify-token", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setuser(response.data.user);
                setTasks(response.data.user.Tasks);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        findUser();
    }, []);

    const updateTask = async (taskId) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/auth/update-task/${taskId}`,
                {
                    title: newTitle,
                    description: newDescription,
                    status: status,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setTasks(tasks.map((task) => (task._id === taskId ? response.data.task : task)));
            setEditTask(null);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:5000/api/auth/delete-task/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTasks(tasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div className="container">
            <button onClick={() => setShowPopup(true)} className="add-task-button">
                Add Task
            </button>

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <button onClick={() => setShowPopup(false)} className="close-button">
                            X
                        </button>
                        <AddTask />
                    </div>
                </div>
            )}

            {tasks.length > 0 && (
                <div className="task-grid">
                    {tasks.map((task) => (
                        <div key={task._id} className="task-card">
                            {editTask === task._id ? (
                                <div className="edit-popup">
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        className="title"
                                    />
                                    <textarea
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        className="description"
                                    />
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="option"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                    <button onClick={() => updateTask(task._id)} className="save-button">
                                        Save
                                    </button>
                                    <button onClick={() => setEditTask(null)} className="cancel-button">
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="task-title">{task.title}</h2>
                                    <p className="task-description">{task.description}</p>
                                    <span className="task-status">{task.status}</span>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => {
                                                setEditTask(task._id);
                                                setNewTitle(task.title);
                                                setNewDescription(task.description);
                                                setStatus(task.status);
                                            }}
                                            className="edit-button"
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => deleteTask(task._id)} className="delete-button">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
