require('dotenv').config()
const express=require('express');
const cors=require('cors');
const helmet=require('helmet');
const paymentRoutes=require('./routes/payment-routes')

const app=express();

const PORT=process.env.PORT||3000;


app.use(express.json())
app.use(cors());
app.use(helmet());

app.use('/api/payment',paymentRoutes);

app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`);
    
})