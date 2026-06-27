const mongoose = require("mongoose");

const connectDB = async () => {

    try {

        await mongoose.connect(
            "mongodb://Arpit:Arpit12345@ac-27ofgzu-shard-00-00.6a8mg5z.mongodb.net:27017,ac-27ofgzu-shard-00-01.6a8mg5z.mongodb.net:27017,ac-27ofgzu-shard-00-02.6a8mg5z.mongodb.net:27017/miniproject?ssl=true&replicaSet=atlas-jqjfw7-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"
        );

        console.log("MongoDB Connected");

    } catch (error) {

        console.log("MongoDB Error:");
        console.log(error.message);

    }
};

module.exports = connectDB;