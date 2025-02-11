const express = require("express");
const {addTask , updateTask , deleteTask} = require("../Controllers/TaskController")
const router = express.Router();

router.post('/add-task' , addTask)
router.put('/update-task/:id' , updateTask)
router.delete('/delete-task/:id' , deleteTask)

module.exports = router;