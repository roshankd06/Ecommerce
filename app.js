require('dotenv').config()

const mongoose = require('mongoose');
const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const cors=require('cors')


//routes declaration
const authRoutes=require('./routes/auth')
const userRoutes=require('./routes/user')
const categoryRoutes=require('./routes/category')
const productRoutes=require('./routes/product')
const orderRoutes=require('./routes/order')
const stripeRoutes=require("./routes/stripepayment")

//MongoDb Connectivity
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log("DB CONNECTED!")
})

//middlewares
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

//my routes
app.use("/api", authRoutes)                 //url for which the webpage will be displayed with '/api' is constant
app.use("/api", userRoutes)
app.use("/api", categoryRoutes)
app.use("/api", productRoutes)
app.use("/api", orderRoutes)
app.use("/api", stripeRoutes)

//PORTS
const port=process.env.PORT || 8000                 //for hiding the info in url

app.listen(port, ()=>{
    console.log(`Server is running on ${port}...`)
})