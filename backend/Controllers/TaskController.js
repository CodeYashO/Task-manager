const mongoose = require("mongoose")
const Task = require("../Models/Task")
const User = require("../Models/User")
const jwt = require("jsonwebtoken")

exports.addTask = async (req , res) => {
    console.log(req.body)
    const {title , description , userEmail} = req.body

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
    const { title, description , status } = req.body;
    console.log(req.body)
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description , status },
            { new: true }
        );
        res.status(200).json({ message: "Task updated", task: updatedTask });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}

exports.deleteTask = async (req , res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
         
        if (!token) {
            return res.status(401).json({valid : false , message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);
        const user = await User.findById(decoded.userId).populate('Tasks');
        console.log(user);

        if(!user) {
            return res.status(401).json({valid : false , message: "User not found" });
        }

        await Task.findByIdAndDelete(req.params.id);

        await User.findByIdAndUpdate(
            decoded.userId,
            { $pull: { Tasks: req.params.id } },
            { new: true }
        );
        res.status(200).json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    } 
}