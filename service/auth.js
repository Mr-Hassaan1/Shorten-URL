const jwt = require('jsonwebtoken');
const secret = "Hassaan@123"

function setUser(user) {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
                name: user.name,
            role: user.role
        },
        secret
    )
}

function getUser(token) {
    if (!token) return null
    try {
        return jwt.verify(token, secret)
    } catch (err) {
        return null
    }
}

module.exports = {
    setUser, getUser
}