import { db } from "./db"

(async ()=>{
    try{
        await db.authenticate();
        console.log("Connected to MySQL using sequelize ");
    }catch(err){
        console.log("Error in connecting Mysql:",err.message);
    }
})();