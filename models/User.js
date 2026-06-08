class User {

    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.isVerified = false;
    }

}

module.exports = User;