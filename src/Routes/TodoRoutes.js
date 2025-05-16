import express from 'express';
import {createTodo,getTodo,getTodoById,updateStatus,updateTodo,deleteTodo,deleteTodoByStatus,getTodoByPriority,
    getAllTasks,getTaskByDate,getOverdue,markAllCompleted
} from '../Controllers/TodoController.js';
import { Authorization } from '../middleware/Auth.js';

const TodoRouter=express.Router();

TodoRouter.post("/api/todo", Authorization, createTodo);

TodoRouter.get("/api/todo", Authorization, getTodo);

TodoRouter.get("/api/todo/:id", Authorization, getTodoById);

TodoRouter.patch("/api/todo/status/:id", Authorization, updateStatus);

TodoRouter.put("/api/todo/:id", Authorization, updateTodo);

TodoRouter.delete("/api/todo/:id", Authorization, deleteTodo);

TodoRouter.delete("/api/todo/completed/:id", Authorization, deleteTodoByStatus);

TodoRouter.get("/api/todo/priority/:id", Authorization, getTodoByPriority);

TodoRouter.get("/api/filters",Authorization,getAllTasks);

TodoRouter.get("/api/filters/date/:id",Authorization,getTaskByDate);

TodoRouter.get("/api/overdue/:id",Authorization,getOverdue);

TodoRouter.put("/api/mark/:id",Authorization,markAllCompleted);


export {TodoRouter};