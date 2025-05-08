import { User } from "../db/models/User.js";

export const update=async(req,res)=>{
    const{id}=req.params;
    const{name,email,password,updated_by}=req.body;
    try {
        const user=await User.findByPk(id);
        if(!user){
            return res.status(404).json({message:"User does not exist!"});
        }
        await user.update({
            name,
            email,
            password,
            updated_by
        });
        res.status(200).json({message:"user updated successfully!"});
    }catch(err){
        console.log("Error in updating user:",err.message);
        return res.status(500).json({message:"Internal server error"});
    }
};

export const deleteUser=async(req,res)=>{
    const {id}=req.params;
    try {
        const user=await User.findByPk(id);
        if(!user){
            return res.status(404).json({message:"User not found "});
        }

        await user.destroy();
        return res.status(200).json({message:"user deleted successfully!"});
    }catch(err){
        console.log("error in deleting user:",err.message);
        return res.status(200).json({message:"Internal server error"});
    }
};

