//defining a schema for mongoose database

const mongoose=require('mongoose')
const crypto=require('crypto')
const uuidv1=require('uuid/v1')

  const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxlength:32,
        trim:true           //trims down extra spaces
    },
    lastname:{
        type:String,
        required:false,
        maxlength:20,
        trim:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    userinfo:{
        type:String,
        trim:true
    },
    encry_password:{
        type:String,
        required:true,
    },
    salt:String,
    role:{
        type:Number,        //higher the number, higher the privilages
        default:0,

    },
    purchases:{
        type:Array,
        default:[]
    }
  },{timestamps:true});

  userSchema.virtual("password")
    .set(function(password){
        this._password=password                             //in js, private variables are declared as _variable
        this.salt=uuidv1() 
        this.encry_password=this.securePassword(password)           
    })
    .get(function(){
        return this._password
    })

  userSchema.methods={

    authenticate:function(plainpassword){
        return this.securePassword(plainpassword)===this.encry_password
    },

      securePassword:function(plainpassword){
          if(!plainpassword){
              return ""
          }
          try{
            return crypto.createHmac('sha256', this.salt)       //cryptography function for password
            .update(plainpassword)
            .digest('hex')
          }catch(err){
            return ""
          }
      }
  }

  //exporting this schema
  module.exports=mongoose.model("User", userSchema)         
 //first parameter is for the name which we want to use for further reference and second is the name of the actual schema