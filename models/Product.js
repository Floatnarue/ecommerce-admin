const { model ,Schema } = require("mongoose");

const productSchema = new Schema ({
    title : {type : String , required :  true },
    description : {type : String} ,
    price : {type : Number , required : true},
});



export const Product = model('product',productSchema);