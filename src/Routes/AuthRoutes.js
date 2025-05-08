import express from 'express';
import {register,login} from '../Controllers/AuthController.js';
const AuthRouter=express.Router();

AuthRouter.post("/api/register",register);
AuthRouter.post("/api/login",login);

export {AuthRouter};