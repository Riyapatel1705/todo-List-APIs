import { User } from "./models/User.js";
import { Todo } from "./models/Todo.js";


User.hasMany(Todo,{foreignKey:'user_id'});
Todo.belongsTo(User,{foreignKey:'user_id'});