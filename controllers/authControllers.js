const bcrypt = require("bcrypt");
const crypto = require("crypto");

const users = [];

const signup = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const existingUser = users.find(
        user => user.email === email
    );

    if (existingUser) {
        return res.status(400).json({
            message: "Email already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken =
        crypto.randomBytes(16).toString("hex");

    const user = {
        name,
        email,
        password: hashedPassword,
        isVerified: false,
        verificationToken
    };

    users.push(user);

    res.json({
        message: "User saved successfully",
        verificationLink:
            `http://localhost:3000/auth/verify/${verificationToken}`
    });
};

const getUsers = (req, res) => {

    res.json({
        totalUsers: users.length,
        users: users
    });

};

const verifyEmail = (req, res) => {

    const token = req.params.token;

    const user = users.find(
        user => user.verificationToken === token
    );

    if (!user) {
        return res.status(404).json({
            message: "Invalid token"
        });
    }

    user.isVerified = true;

    res.json({
        message: "Email verified successfully"
    });
};

module.exports = {
    signup,
    getUsers,
    verifyEmail
};