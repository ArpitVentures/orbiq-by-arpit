const Task = require("../models/Task");

const createTask = async (req, res) => {

    try {

        const {
            title,
            description
        } = req.body;

        const task =
            await Task.create({

                title,
                description,

                userId:
                req.user.userId

            });

        res.status(201).json({
            message:
                "Task created successfully",
            task
        });

    } catch (error) {

        res.status(500).json({
            message:
            error.message
        });

    }

};

const getTasks = async (req, res) => {

    try{

        const tasks =
            await Task.find({
                userId: req.user.userId
            });
        res.json({
            totalTasks : tasks.length,
            tasks
        });
    } catch (error) {

        res.status(500).json({
            message : error.message
        });
    }
};

const updateTask = async (req, res) => {

    try {

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.userId
            },
            req.body,
            {
                new: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const deleteTask = async (req, res) => {

    try {

        const task = await Task.findOneAndDelete(
            {
                _id: req.params.id,
                userId: req.user.userId
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};