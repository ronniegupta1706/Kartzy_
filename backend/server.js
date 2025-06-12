const express=require('express');
const dotenv=require('dotenv').config();
const cors=require('cors');
const mongoose=require('mongoose');
const Product=require('./models/Product'); //importing the product model
const app=express();


app.use(cors());  //middleware call
app.use(express.json());

app.use('/images', express.static('images')); //to serve static files from images folder

app.get('/',(req,res)=>{
    res.send("API is running");
});
//postman test api
app.get('/api/test',(req,res)=>{
    res.json({message: "Test API is working"});
});
//product api
app.get('/api/products',async(req,res)=>{
    try{
        
        const products= await Product.find({});
        res.json(products);
    }
    catch(error)
    {
        res.status(500).json({message:"Server Error"});
    }
});

//get product by id
app.get('/api/products/:id',async(req,res)=>{
    try{
        const product=await Product.findById(req.params.id);
        if(!product)
        {
            return res.status(404).json({message:"Product not found"});
        }
        res.json(product)
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
});

//connecting the mongodb database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected successfully");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

const port=process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
