const express = require('express')
const { register, login, getUser, logout, makeAdmin } = require('../controllers/authController')
const verifyToken = require('../middlewares/verifyToken')
const verifyAdmin = require('../middlewares/verifyAdmin')
const authRouter = express.Router()


authRouter.post("/register",register)
authRouter.post("/login",login)
authRouter.get("/user",verifyToken,getUser)
authRouter.get("/logout",logout)
authRouter.post("/make-admin",verifyAdmin,makeAdmin)

module.exports = authRouter