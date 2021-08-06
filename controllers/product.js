const Product=require(("../models/product"))
const formidable=require('formidable')              //using this to handle images 
const _=require("lodash")
const fs=require("fs")
const { sortBy } = require('lodash')


//middleware for getting id and whole body of product
exports.getProductById=(req, res, next, id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err, product)=>{
        if(err){
            return res.status(400).json({
                error:"No product found!"
            })
        }
        req.product=product
        next()
    })
}

exports.createProduct=(req, res)=>{
    let form=new formidable.IncomingForm()              //creation of form using formidable
    form.keepExtensions=true

    form.parse(req, (err, fields, file)=>{
        if(err){
            return res.status(400).json({
                error:"problem with image"
            })
        }

        //destructure the fields
        const {name, description, price, category, stock}=fields            //coming from models-> product
                 
        //putting restrictions on field
        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ){
            return res.status(400).json({
                error:"Please include all fields"
            })
        }


        let product=new Product(fields)

        //handling file here
        if(file.photo){
            if(file.photo.size > 3000000){           //3 mb  
                return res.status(400).json({
                    error:"File size too large!"
                })
            }            
            product.photo.data=fs.readFileSync(file.photo.path)
            product.photo.contentType=file.photo.type
        }

        //save to db
        product.save((err, product)=>{
            if(err){
                return res.status(400).json({
                    error:"Failed to save in DB!"
                })
            }
            res.json(product)
        })
    })
}

exports.getProduct=(req, res)=>{
    req.product.photo=undefined
    return res.json(req.product)
}

//middleware
exports.photo=(req, res, next)=>{
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

exports.removeProduct=(req, res)=>{
    let product=req.product
    product.remove((err, deletedProduct)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to delete the product"
            })
        }
        res.json({
            message:"Deletion was success",
            deletedProduct
        })
    })
}

exports.updateProduct=(req, res)=>{
    let form=new formidable.IncomingForm()              //creation of form using formidable
    form.keepExtensions=true

    form.parse(req, (err, fields, file)=>{
        if(err){
            return res.status(400).json({
                error:"problem with image"
            })
        }

        //updation code
        let product=req.product
        product=_.extend(product, fields)           //using lodash here

        //handling file here
        if(file.photo){
            if(file.photo.size > 3000000){           //3 mb  
                return res.status(400).json({
                    error:"File size too large!"
                })
            }            
            product.photo.data=fs.readFileSync(file.photo.path)
            product.photo.contentType=file.photo.type
        }

        //save to db
        product.save((err, product)=>{
            if(err){
                return res.status(400).json({
                    error:"Updation failed!"
                })
            }
            res.json(product)
        })
    })
}

//product listing
exports.getAllProducts=(req, res)=>{
    let limit=req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy=req.query.sortBy ? req.query.sortBy : "_id"      //if no query for sorting is there then it will by default show by id

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])               //'-' sign means that we dont want to see this.. to hide this we use -
    .limit(limit)
    .exec((err, products)=>{
        if(err){
            return res.status(400).json({
                error:"No Product Found!"
            })
        }
        res.json(products)
    })
}

exports.getAllUniqueCategories=(req, res)=>{
    Product.distinct("category", {}, (err, category)=>{     //getting unique categories using distinct()
        if(err){
            return res.status(400).json({
                error:"No Category Found!"
            })
        }
        res.json(category)
    })
}

//middlewares for inventory
exports.updateStock=(req, res, next)=>{
    //we are having order, in order we have many products and then we are looping through it using map()
    //then we are updating the inventory by incrementing the sold as well as decrementing the stock
    let myOperations=req.body.order.products.map(prod=>{
        return {
            updateOne:{
                filter:{_id: prod._id},          //finding the product based on the id
                update:{$inc: {stock: - prod.count, sold: + prod.count}}    //whole updation on stock and sold
            }
        }
    })

    Product.bulkWrite(myOperations, {}, (err, products)=>{      //bulkWrite operation is used to update things in bulk
        if(err){
            return res.status(400).json({
                error:"Bulk operations failed!"
            })
        }
        next()
    })
}

