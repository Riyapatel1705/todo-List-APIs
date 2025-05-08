import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const Authorization=(req,res,next)=>{
    try {
        console.log("Request Headers:",req.headers);
       const authHeader=req.header('Authorization');
        if(!authHeader){
            return res.status(401).json({message:"Access denied. No token provided"});
        }
     const token=authHeader.split(" ")[1];

     if(!token){
        return res.status(401).json({message:"Access denied .Invalid token format."});
     }
     const decoded=jwt.verify(token,process.env.JWT_SECRET);
     console.log("Decoded Token:",decoded);

     req.user=decoded;
     next();
    }catch(err){
        console.error("Auth Middleware Error:",err.message);
        res.status(401).json({message:"Invalid or expired Token"});
    }
};
