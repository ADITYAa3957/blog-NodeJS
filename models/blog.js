const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// console.log(new Date());
const blogSchema = new Schema ({
    title:
    {
        type:String,
    },
    body:
    {
        type:String
    },
    createdAt:
    {
        type:Date,
        default:new Date()
    },
    updatedAt:
    {
        type:Date,
        default:new Date()
    }
});

const blogModel = mongoose.model("blog",blogSchema);
//created the model and then exporting it
module.exports = blogModel;