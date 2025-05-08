import { User } from "../db/models/User.js";
import { Todo } from "../db/models/Todo.js";
import { register } from "module";

export const validateEmail=(email)=>{
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export const validatePassword=(password)=>{
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,}$/;
  return regex.test(password);
}

export const validateUser=(name)=>{
    const regex=/^[a-zA-Z\s-]{3,}$/;
    return regex.test(name);
}

export const checkEmailExists=async(email)=>{
    try {
        const user=await User.findOne({where:{email}});
        return user !==null;
    }catch(err){
        throw new Error("Error checking email:"+err.message);
        console.log("Error checking email:",err.message);
    }
};

export const checkUserExists=async(name)=>{
    try {
        const user=await User.findOne({where:{name}});
        return user !==null;
    }catch(err){
        throw new Error("Error checking user:"+err.message);
        console.log("Error checking user:",err.message);
    }
};