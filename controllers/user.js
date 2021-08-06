const User=require("../models/user")
const Order=require("../models/order")

//finding user by id
exports.getUserById = (req, res, next, id) =>{
    User.findById(id).exec((err, user)=>{                   //exec-> execution of database method
        if(err || !user){
            return res.status(400).json({
                error:"No User was found in DB!"
            })
        }
        req.profile=user                    //fetching whole data in user's profile
        next()
    })
}

exports.getUser = (req, res) =>{
    //getting rid of salt and password being showed at user's browser
    req.profile.salt=undefined                  
    req.profile.encry_password=undefined
    req.profile.createdAt=undefined
    req.profile.updatedAt=undefined

    return res.json(req.profile)
}

//updating info in database
exports.updateUser = (req, res) =>{
    User.findByIdAndUpdate(
        {_id:req.profile._id,},
        {$set:req.body},
        {new:true, useFindAndModify:false},
        (err, user)=>{
            if(err || !user){
               return  res.status(400).json({
                   error:"You are not authorized to update this info"
               })
            }
            user.salt=undefined                  
            user.encry_password=undefined
            user.createdAt=undefined
            user.updatedAt=undefined
        
            res.json(user)
        }
    )
}

//getting all the orders of a user
exports.userPurchaseList=(req, res)=>{
    Order.find({user:req.profile._id})
    .populate("user", "_id name")           //we are using populate() because we want to refer other collection in our model 
    .exec((err, order)=>{
        if(err){
            return res.status(400).json({
                error:"No Order in this account"
            })
        }
        return res.json(order)
    })
}

exports.pushOrderInPurchaseList=(req, res, next)=>{
    let purchases=[]
    req.body.order.products.forEach(product =>{
        purchases.push({
            _id:product._id,
            name:product.name,
            description:product.description,
            category:product.category,
            quantity:product.quantity,
            amount:req.body.order.amount,
            transaction_id:req.body.order.transaction_id
        })
    })

    //store this in db
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$push:{purchases:purchases}},
        {new:true},                  //telling db that return the updated info not the old one
        (err, purchases)=>{
            if(err){
                return res.status(400).json({
                    error:"Unable to save purchase list"
                })
            }
            next()
        }
    )
    
}