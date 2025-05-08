import { db } from "../db/db.js";
import { User } from "../db/models/User.js";
import bcrypt from 'bcrypt';
import { validateEmail,validatePassword,validateUser,checkEmailExists,checkUserExists } from "../utils/validation.js";
import jwt from 'jsonwebtoken';


export const register = async (req, res) => {
  const data = req.body;
  const requiredFields = ["name", "email", "password"];

  const missingFields = requiredFields.filter(
    (field) => !data[field] || data[field].trim() === ""
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Please fill all the required fields: ${missingFields.join(", ")}`,
    });
  }

  const { name, email, password } = data;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      message: "Password must be at least 6 characters and include one special character",
    });
  }

  if (!validateUser(name)) {
    return res.status(400).json({ message: "Invalid Username" });
  }

  try {
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const userExists = await checkUserExists(name);
    if (userExists) {
      return res.status(400).json({ message: "User with this name already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (result) {
      return res.status(200).json({ message: "User created successfully!" });
    } else {
      return res.status(500).json({ message: "Error in creating user" });
    }
  } catch (err) {
    console.error("Not able to create user", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      const token = jwt.sign(
        { user_id: user.user_id }, // ✅ Add user_id here
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      
  
      res.json({ token });
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ message: "Database error" });
    }
  };
  