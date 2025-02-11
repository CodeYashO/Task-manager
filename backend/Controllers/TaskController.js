const mongoose = require("mongoose")
const Task = require("../Models/Task")
const User = require("../Models/User")

exports.addTask = async (req , res) => {
    const {title , description , userEmail} = req.body
    console.log(req.body)

    try{
        const task = new Task({
            title,
            description,
        })

        const savedTask = await task.save();
        
        const user = await User.findOne({email : userEmail})
        user.Tasks.push(savedTask._id)
        user.save();

        console.log(user)

        res.status(201).json({message : "task added successfully." , task : savedTask});
    }catch (err) {
        console.error(err.message);
        res.status(500).json({message : "Server Error"});
    }
}
 
exports.updateTask = async (req , res) => {
    const { title, description } = req.body;
    console.log(req.body)
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description },
            { new: true }
        );
        res.status(200).json({ message: "Task updated", task: updatedTask });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}

exports.deleteTask = async (req , res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}