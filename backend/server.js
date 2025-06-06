const express=require('express');
const dotenv=require('dotenv').config();
const cors=require('cors');
const mongoose=require('mongoose');
const app=express();


app.use(cors());  //middleware call
app.use(express.json());

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
        res.json(Products);
    }
    catch(error)
    {
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
