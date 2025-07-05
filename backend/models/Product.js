import mongoose from 'mongoose';

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:
    {
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    brand:{
        type:String,
        required:true,
    },
    countInStock:{
        type:Number,
        required:true,
        default:0,
    },
    rating:{
        type:Number,
        required:true,
        default:0,
    },
    numreviews:{
        type:Number,
        required:true,
        default:0},
    },{
        timestamps:true //this will add createdAt and updatedAt fields to the schema
    }
);

//creating product model

const Product=mongoose.model('Product',productSchema);

export default Product;
