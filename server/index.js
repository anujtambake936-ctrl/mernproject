require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/authRoutes')
const connectDb = require('./config/db')
const cartRouter = require('./routes/cartRoutes')
const orderRouter = require('./routes/orderRoutes')
const productRouter = require('./routes/productRoutes')
const app = express()
const port = 5000

connectDb()

app.use(express.json())

// CORS configuration
const allowedOrigins = [
    'https://shopping-cart-mern-yo9j.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
]
if (process.env.ORIGIN) {
    allowedOrigins.push(process.env.ORIGIN)
}

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true)
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(cookieParser())

app.use("/api/auth",authRouter)
app.use("/api/cart",cartRouter)
app.use("/api/orders",orderRouter)
app.use("/api/products",productRouter)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})