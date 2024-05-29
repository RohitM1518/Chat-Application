import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteMessage, getAllMessages, sendMessage } from "../controllers/message.controller.js";
import { mongoIdPathVariableValidator } from "../validators/mongodb.validator.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()
router.use(verifyJWT)

router.route("/:chatId").post(mongoIdPathVariableValidator("chatId"),upload.fields([{name:"attachments", maxCount:5}]),sendMessage )
.get(mongoIdPathVariableValidator("chatId"),getAllMessages)

router.route("/:chatId/:messageId").delete(mongoIdPathVariableValidator("chatId"),mongoIdPathVariableValidator("messageId"),deleteMessage)

export default router;