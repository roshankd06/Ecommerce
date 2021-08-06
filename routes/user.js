const express=require("express")
const router=express.Router()          //we need router so that's why we are bringing express

const {getUserById, getUser, updateUser, userPurchaseList }=require("../controllers/user")
const {isSignedIn, isAuthenticated, IsAdmin}=require("../controllers/auth")

router.param("userId", getUserById)

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser)

router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser)

router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList)

module.exports=router