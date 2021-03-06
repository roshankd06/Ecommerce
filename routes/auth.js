var express = require('express')
const { check, validationResult } = require('express-validator');
var router = express.Router()
const { signout, signup, signin, isSignedIn } = require('../controllers/auth')



router.post("/signup", [
    //validation checks
    check("name", "Name should be atleast 3 characters long").isLength({min:3}),
    check("email", "Email is required").isEmail(),
    check("password", "Password should be atleast 3 char").isLength({min:3})
], signup)

router.post("/signin", [
    //validation checks
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isLength({min:1})
], signin)

router.get("/signout", signout )


module.exports=router