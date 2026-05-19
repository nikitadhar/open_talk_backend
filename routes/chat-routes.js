import { Router } from "express";
import { deleteChats, generateChat, sendChatsToUser } from "../controlers/chat-controlers.js";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";

const chatRoutes = Router();
chatRoutes.post("/generateChat",validate(chatCompletionValidator),verifyToken,generateChat);
chatRoutes.get("/sendChat",verifyToken,sendChatsToUser);
chatRoutes.delete("/delete", verifyToken, deleteChats);
export default chatRoutes;