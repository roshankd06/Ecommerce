const Category=require("../models/category")

exports.getCategoryById=(req, res, next, id)=>{
    Category.findById(id).exec((err, cate)=>{
        if(err){
            res.status(400).json({
                error:"No Category Found!"
            })
        }
        req.category=cate
        next()
    })
}

exports.createCategory=(req, res)=>{
    const category=new Category(req.body)
    category.save((err, category)=>{
        if(err){
            return res.status(400).json({
                error:"NOT able to save category in DB"
            })
        }
        res.json({category})
    })

}

exports.getCategory = (req, res) => {
    return res.json(req.category);                  //req.category is coming from middlware defined above
  };
  
  exports.getAllCategory = (req, res) => {
    Category.find().exec((err, categories) => {
      if (err) {
        return res.status(400).json({
          error: "NO categories found"
        });
      }
      res.json(categories);
    });
  };

  exports.updateCategory=(req, res)=>{
      const category=req.category
      category.name=req.body.name       //this is responsible for grabbing the name of category sent by frontend

      category.save((err, updatedCategory)=>{
        if (err) {
            return res.status(400).json({
              error: "Failed to update category"
            });
          }
          res.json(updatedCategory)
      })
  }

  exports.removeCategory=(req, res)=>{
    const category=req.category

    category.remove((err, category)=>{
        if (err) {
            return res.status(400).json({
              error: "Failed to delete the category"
            });
          }
          res.json({
              message:"Successfully Deleted!"
          })
    })
  }