import express from 'express';
import connectDB from './config/mongoose.config';
const router=require('./routes')
const app = express();
const cors=require('cors')

//server 
app.use(cors());
app.use(express.json());

connectDB();

app.use('/',router)
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
