import "reflect-metadata";
import '../config/container';
import app from './app';
import connectDB from '../config/db';


const PORT = process.env.PORT || 3008
connectDB()

app.listen(PORT, ()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`)
})