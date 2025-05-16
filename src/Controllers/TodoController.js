import { Todo } from "../db/models/Todo.js";
import { Sequelize } from "sequelize";
import { User } from "../db/models/User.js";
import { validStatus,isValidDate ,escapeLike} from "../utils/validation.js";
import {Op} from "sequelize";
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

//add filters in todo
/*export const getTodoByStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.query;

        // Check if userId is provided
        if (!id) {
            return res.status(400).json({ message: "userId is required" });
        }

        // Validate status
        if (!validStatus(status)) {
            return res.status(400).json({ message: "Please provide a valid status (Pending, Completed, In-Progress)" });
        }

        // Check if the user exists
        const user = await User.findOne({ where: { user_id: id } });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Fetch the todos based on user_id and status
        const todos = await Todo.findAll({ where: { user_id: id, status } });

        // Check if no todos are found
        if (todos.length === 0) {
            return res.status(404).json({ message: `User has no ${status} tasks` });
        }

        // Return the todos
        return res.status(200).json({ todos });

    } catch (err) {
        console.error("Error in fetching Status wise tasks:", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}; */

export const getAllTasks = async (req, res) => {
    try {
        const { title, status, due_date, priority } = req.query;

        // Validate status
        if (status && !validStatus(status)) {
            return res.status(400).json({ message: "Please provide a valid status" });
        }

        // Validate due_date
        if (due_date && !isValidDate(due_date)) {
            return res.status(400).json({ message: "Please provide a valid date in the format yyyy-MM-DD" });
        }

        const filters = {};

        // Apply title filter
        if (title?.trim()) {
            filters.title = {
                [Op.like]: `%${escapeLike(title.trim())}%`,
            };
        }

        // Apply status filter
        if (status?.trim()) {
            filters.status = {
                [Op.like]: `%${escapeLike(status.trim())}%`,
            };
        }

        // Apply due_date filter
        if (due_date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to midnight
        
            const targetDate = new Date(due_date);
            targetDate.setHours(23, 59, 59, 999); // End of that day
        
            filters.due_date = {
                [Op.between]: [today, targetDate],
            };
        }
        
        // Apply priority filter
        if (priority?.trim()) {
            filters.priority = {
                [Op.like]: `%${escapeLike(priority.trim())}%`,
            };
        }

        // Fetch tasks based on filters
        const rows = await Todo.findAll({
            where: filters,
        });

        // Check if no rows are found
        if (rows.length === 0) {
            return res.status(404).json({ message: "No data found for this filter" });
        }

        // Return tasks
        res.status(200).json({
            data: rows,
        });
    } catch (err) {
        console.error("Error in fetching tasks:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

//filter by due_date
export const getTaskByDate = async (req, res) => {
    try {
      const { id } = req.params; // Extract user id from URL params
      const { filter } = req.query; // filter = "today", "tomorrow", etc.
  
      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      const startDate = new Date();
      let endDate = new Date();
  
      if (filter === "tomorrow") {
        startDate.setDate(startDate.getDate() + 1);
        endDate = new Date(startDate);
      } else if (filter === "thisWeek") {
        endDate.setDate(startDate.getDate() + 7);
      } else if (filter === "thisMonth") {
        endDate.setDate(startDate.getDate() + 30);
      } else {
        // For "today", it's just the current date range.
        endDate = new Date(startDate);
      }
  
      const rows = await Todo.findAll({
        where: {
          user_id: id,
          due_date: {
            [Op.between]: [startDate, endDate]
          }
        }
      });
  
      // Check if no rows are found
      if (rows.length === 0) {
        return res.status(404).json({ message: "No data found for this filter" });
      }
  
      // Return tasks
      res.status(200).json({
        data: rows,
      });
    } catch (err) {
      console.log("Error in fetching tasks by date:", err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  //get overdue todos
  export const getOverdue=async(req,res)=>{
    try{const {id}=req.params;
    if(!id){
        return res.status(400).json({message:"Id is required parameter"});
    }
    const user=await User.findOne({where:{user_id:id}});
    if(!user){
        return res.status(404).json({message:"user with this Id does not exists"});
    }
    const overduetodos=await Todo.findAll({
        where:{
            due_date:{
                [Op.lte]:new Date()
            },
            user_id:id,
            status:"Pending"
        }
    });
    if(overduetodos.length==0){
        return res.status(400).json({message:"No overdue tasks are there for this user"});
    }
    return res.status(200).json({overduetodos});
  }catch(err){
    console.log("Error in fetching overdue tasks:",err.message);
    return res.status(500).json({message:"Internal server error!"});
  }
}

//mark all compeleted
export const markAllCompleted = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Id is required parameter" });
        }

        if (!status) {
            return res.status(400).json({ message: "Status is required field" });
        }

        const user = await User.findOne({ where: { user_id: id } });
        if (!user) {
            return res.status(404).json({ message: "User with this Id does not exist" });
        }

        const mark = await Todo.update(
            { status },
            { where: { user_id: id } }
        );

        if (mark[0] === 0) {
            return res.status(400).json({ message: "No tasks were updated" });
        }

        return res.status(200).json({ message: "All tasks have been marked as completed" });

    } catch (err) {
        console.error("Error in updating tasks:", err);
        return res.status(500).json({ message: "Internal server error!" });
    }
};
