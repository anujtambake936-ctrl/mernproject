const jwt = require('jsonwebtoken')
const User = require('../models/user')

const verifyAdmin = async (req, res, next) => {
    try {
        // First verify the token
        const token = req.cookies.token

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token missing."
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized."
            })
        }

        // Check if user is admin
        const user = await User.findById(decoded.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        if (!user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            })
        }

        req.id = decoded.id
        next()
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = verifyAdmin

