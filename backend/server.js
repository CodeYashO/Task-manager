require("dotenv").config()
const express = require("express");
const app = express();
const cors = require("cors");
const ConnectToDB = require("./DBConnection/db")
const authRoutes = require("./Routes/AuthRoutes");
const taskRoutes = require("./Routes/TaskRoutes")

ConnectToDB();

app.use(cors());
app.use(express.json());
 
app.use('/api/auth' , authRoutes);
app.use('/api/auth' , taskRoutes);
 
const PORT = process.env.PORT
app.listen(PORT , () => {
    console.log(`server is running on port ${PORT}`);
}); 