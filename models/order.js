const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema

const ProductCartSchema=new mongoose.Schema({
    product:{
        type:ObjectId,
        ref:"Product",                  //coming from product.js -> Product
    },
    name:String,
    count:Number,
    price:Number
})

const ProductCart=mongoose.model("ProductCart", ProductCartSchema)

const OrderSchema=new mongoose.Schema({
    //products which are inside the cart
    products:[ProductCartSchema],
    transaction_id:{},
    amount:{type:Number},
    address:{
        type:String,
    },
    status:{
        type:String,
        default:"Recieved",
        enum:["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"]    //using enum for restricting the keywords
    },
    updated:Date,
    user:{
        type:ObjectId,
        ref:'User'                      //coming from user.js -> User
    }
},{timestamps:true})

const Order=mongoose.model("Order", OrderSchema)
module.exports={Order, ProductCart}                 //exporting 2 different schemas at once