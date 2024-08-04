import { Hono } from "hono";

import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user";

const userRoutes = new Hono();

userRoutes.post("/", (c) => createUser(c));
userRoutes.get("/", (c) => getUsers(c));
userRoutes.get("/:id", (c) => getUserById(c));
userRoutes.put("/:id", (c) => updateUser(c));
userRoutes.delete("/:id", (c) => deleteUser(c));

export { userRoutes };
