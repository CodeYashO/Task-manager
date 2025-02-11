import { useState, useEffect } from "react";
import AddTask from "./AddTask";
import axios from "axios";

const Home = () => {
    const token = localStorage.getItem("token");
    const [tasks, setTasks] = useState([]);
    const [editTask, setEditTask] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const findUser = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/auth/verify-token", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTasks(response.data.user.Tasks);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        findUser();
    }, []);

    const updateTask = async (taskId) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/auth/update-task/${taskId}`, {
                title: newTitle,
                description: newDescription,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTasks(tasks.map(task => task._id === taskId ? response.data.task : task));
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

            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <button 
                onClick={() => setShowPopup(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
                Add Task
            </button>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <button
                            onClick={() => setShowPopup(false)}
                            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                        >
                            X
                        </button>
                        <AddTask />
                    </div>
                </div>
            )}

            {tasks.length === 0 ? (
                <AddTask />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasks.map((task) => (
                        <div key={task._id} className="border p-4 rounded-lg shadow-lg">
                            {editTask === task._id ? (
                                <div>
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        className="border p-2 w-full mb-2"
                                    />
                                    <textarea
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        className="border p-2 w-full mb-2"
                                    />
                                    <button 
                                        onClick={() => updateTask(task._id)} 
                                        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                                    >
                                        Save
                                    </button>
                                    <button 
                                        onClick={() => setEditTask(null)} 
                                        className="bg-gray-500 text-white px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-xl font-bold">{task.title}</h2>
                                    <p className="text-gray-700">{task.description}</p>
                                    <span className={`px-3 py-1 text-white text-sm rounded ${task.status === "completed" ? "bg-green-500" : "bg-yellow-500"}`}>
                                        {task.status}
                                    </span>
                                    <div className="mt-4">
                                        <button 
                                            onClick={() => { 
                                                setEditTask(task._id);
                                                setNewTitle(task.title);
                                                setNewDescription(task.description);
                                            }} 
                                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => deleteTask(task._id)} 
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                        >
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
