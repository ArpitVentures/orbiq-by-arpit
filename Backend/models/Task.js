const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ""
        },

        priority: {
            type: String,
            enum: ["High", "Medium", "Low"],
            default: "Medium"
        },

        status: {
            type: String,
            enum: ["To Do", "In Progress", "Completed"],
            default: "To Do"
        },


        dueDate: {
            type: Date
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }

    },
    {
        timestamps: true
    });

module.exports = mongoose.model("Task", taskSchema);