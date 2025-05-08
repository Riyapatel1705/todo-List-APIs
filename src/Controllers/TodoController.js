import { Todo } from "../db/models/Todo.js";
import { Sequelize } from "sequelize";
import { User } from "../db/models/User.js";
export const createTodo = async (req, res) => {
  try {
    const { title, task, status, due_date, priority } = req.body;
    const user_id = req.user.user_id; // assuming JWT middleware adds user info

    const requiredFields = ["title", "task", "priority"];
    const missingFields = requiredFields.filter(
      (field) => !req.body[field] || req.body[field].toString().trim() === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Please fill all the required fields: ${missingFields.join(", ")}`,
      });
    }

    const todo = await Todo.create({
      user_id,
      title,
      task,
      status: status || false, // default to false if not provided
      due_date,                // optional: DB already sets default
      priority,
    });

    return res.status(201).json({
      message: "To-Do task has been added successfully",
      data: todo,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTodo = async (req, res) => {
    try {
      const { id } = req.query; // ✅ Typo fixed: 'quey' → 'query'
  
      if (!id) {
        return res.status(400).json({ message: "No userId provided" });
      }
  
      const todos = await Todo.findAll({ where: { user_id: id } }); // ✅ You want to match user_id, not the todo id
  
      if (!todos || todos.length === 0) {
        return res.status(404).json({ message: "No to-do found for this user" });
      }
  
      return res.status(200).json({ todos });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  export const getTodoById=async(req,res)=>{
    try{const{id}=req.params;
    if(!id){
        return res.status(400).json({message:"Id is not provided!"});
    }
    const todo=await Todo.findOne({where:{toto_id:id}});
    if(!todo){
        return res.status(404).json({message:"This id's Todo does not exist"});
    }
    res.status(200).json({todo});
  }catch(err){
    console.log("Error in fetching Todo by Id");
    return res.status(500).json({message:"Internal server error"});
  }
}
  
export const updateStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      if (!id) {
        return res.status(400).json({ message: "No ID provided." });
      }
  
      if (!status) {
        return res.status(400).json({ message: "Status is required in request body." });
      }
  
      const todo = await Todo.findOne({ where: { todo_id: id } });
  
      if (!todo) {
        return res.status(404).json({ message: "Todo with this ID does not exist." });
      }
  
      await todo.update({ status });
  
      return res.status(200).json({ message: "Todo's status has been updated successfully." });
    } catch (err) {
      console.error("Error in updating status:", err.message);
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  export const updateTodo = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, task, status, due_date, priority } = req.body;
  
      if (!id) {
        return res.status(400).json({ message: "No ID provided." });
      }
  
      const todo = await Todo.findOne({ where: { todo_id: id } });
  
      if (!todo) {
        return res.status(404).json({ message: "Todo with this ID does not exist." });
      }
  
      await todo.update({
        title,
        task,
        status,
        due_date,
        priority
      });
  
      return res.status(200).json({ message: "Todo's details have been updated successfully!" });
  
    } catch (err) {
      console.error("Error in updating Todo's details:", err.message);
      return res.status(500).json({ message: "Internal server error!" });
    }
  };

export const deleteTodo=async(req,res)=>{
    try {
        const {id}=req.params;
        if(!id){
            return res.status(400).json({message:"No id provided"});
        }
        const todo=await Todo.findOne({where:{todo_id:id}});
        if(!todo){
            return res.status(404).json({message:"Todo with this id does not exists!"});
        }
        await todo.destroy();
        return res.status(200).json({message:"Todo has been deleted successfully!"});
    }catch(err){
        console.log("error in deleting Todo:",err.message);
        return res.status(500).json({message:"internal server error"});
    }
}

export const deleteTodoByStatus = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ message: "No id provided" });
      }
  
      const user = await User.findOne({ where: { user_id: id } });
      if (!user) {
        return res.status(404).json({ message: "User does not exist" });
      }
  
      const todo = await Todo.findAll({ where: { user_id: id, status: "completed" } });
      if (!todo || todo.length === 0) {
        return res.status(400).json({ message: "User has no completed ToDo tasks" });
      }
  
      await Todo.destroy({ where: { user_id: id, status: "completed" } });
  
      return res.status(200).json({ message: "User's completed tasks have been deleted" });
  
    } catch (err) {
      console.error("Error in deleting completed tasks:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  

export const getTodoByPriority=async(req,res)=>{
    try{
        const{id}=req.params;
        if(!id){
            return res.status(400).json({message:"No id provided"});
        }
        const user=await User.findOne({where:{user_id:id}});
        if(!user){
            return res.status(404).json({message:"User does not exists"});
        }
        const priorityTasks=await Todo.findAll({
            where:{user_id:id,priority:"High"}
        });
        if(!priorityTasks){
            return res.status(400).json({message:"Thus user has no high priority tasks"});
        }
        return res.status(200).json({priorityTasks});
    }catch(err){
        console.log("Error in deleting completed tasks:",err.message);
        return res.status(500).json({message:"Internal server error"});
    }
}