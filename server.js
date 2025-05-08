import dotenv from "dotenv";
import express from "express";
import { AuthRouter } from "./src/Routes/AuthRoutes.js";
import { UserRouter } from "./src/Routes/UserRoutes.js";
import { TodoRouter } from "./src/Routes/TodoRoutes.js";
import {db} from './src/db/db.js';
import './src/db/association.js';

dotenv.config();

const app=express();
app.use(express.json());


app.use(AuthRouter);
app.use(UserRouter);
app.use(TodoRouter);

app.use((req,res,next)=>{
    console.log(`Incoming request:${req.method} ${req.url}`);
    next();
});

(async()=>{
    try{
        await db.sync({alter:true});
        console.log("Database synchronised");
    }catch(err){
        console.error("Error syncing database:", err.message);
    }
})();

const PORT=process.env.PORT||7000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});