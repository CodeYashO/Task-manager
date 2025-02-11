const mongoose = require("mongoose");

const ConnectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB is Connected");
    }catch(error) {
        console.log(`showing error : ${error}`);
    }
}

module.exports = ConnectToDB;