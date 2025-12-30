const User = require("../models/user")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async(req,res) =>{
    try{
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }
        const user = await User.findOne({email})

        if(user){
            return res.status(400).json({
                success:false,
                message:"Email already exist."
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)

        // Check if this is the first user - make them admin
        const userCount = await User.countDocuments()
        const isAdmin = userCount === 0

        const newUser = new User({
            name,
            email,
            password:hashedPassword,
            isAdmin
        })

        await newUser.save()

        res.status(201).json({
            success:true,
            message:"Account Created." + (isAdmin ? " You are the first user and have been granted admin privileges." : "")
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const login = async(req,res) =>{
    try{

        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }
        const user = await User.findOne({email})

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found."
            })
        }

        const comparePassword = await bcrypt.compare(password,user.password)

        if(!comparePassword){
            return res.status(400).json({
                success:false,
                message:"Wrong email or password."
            })
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1h'})
        res.cookie('token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            expires:new Date(Date.now()+3600000)
        })
       
        res.status(200).json({
            success:true,
            message:"Login Successfull." + (user.isAdmin ? " Admin access granted." : ""),
            isAdmin: user.isAdmin
        })


    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const logout = async(req,res) =>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            expires:new Date(Date.now())
        })

        res.status(200).json({
            success:true,
            message:"Logout Successfull."
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const getUser = async(req,res) =>{
    try{
        const userId = req.id;

        const user = await User.findById(userId).select("-password")

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found."
            })
        }

        res.status(200).json({
            success:true,
            user
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const makeAdmin = async(req,res) =>{
    try{
        const userId = req.id
        const { email } = req.body

        if(!email){
            return res.status(400).json({
                success:false,
                message:"Email is required."
            })
        }

        // Check if current user is admin
        const currentUser = await User.findById(userId)
        if(!currentUser || !currentUser.isAdmin){
            return res.status(403).json({
                success:false,
                message:"Access denied. Admin privileges required."
            })
        }

        // Update target user to admin
        const user = await User.findOneAndUpdate(
            { email },
            { isAdmin: true },
            { new: true }
        )

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found."
            })
        }

        res.status(200).json({
            success:true,
            message:"User has been granted admin privileges.",
            user: {
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


module.exports = {
    register,
    login,
    logout,
    getUser,
    makeAdmin
}
