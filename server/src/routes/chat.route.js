import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addNewParticipantInGroupChat, createAGroupChat, createOrGetAOneOnOneChat, deleteGroupChat, deleteOneOnOneChat, getGroupChats, leaveGroupChat, removeParticipantFromGroupChat, renameGroupChat, searchAvailableUsers,getGroupChat } from "../controllers/chat.controller.js";
import { mongoIdPathVariableValidator } from "../validators/mongodb.validator.js";

const router = Router()

router.use(verifyJWT)

router.route("/getgroupchats").get(getGroupChats)
router.route("/users").get(searchAvailableUsers)
router.route("/c/:receiverId").post(mongoIdPathVariableValidator("receiverId"),createOrGetAOneOnOneChat)
router.route("/group").post(createAGroupChat)
router.route("/group/:chatId")
.get(mongoIdPathVariableValidator('chatId'),getGroupChat)
.patch(mongoIdPathVariableValidator("chatId"),renameGroupChat)
.delete(mongoIdPathVariableValidator("chatId"), deleteGroupChat)
router.route("/group/:chatId/:participantId").post(mongoIdPathVariableValidator("chatId"),mongoIdPathVariableValidator("participantId"),addNewParticipantInGroupChat)
.delete(mongoIdPathVariableValidator("chatId"),mongoIdPathVariableValidator("participantId"), removeParticipantFromGroupChat)
router
  .route("/leave/group/:chatId")
  .delete(mongoIdPathVariableValidator("chatId"),leaveGroupChat);

router
  .route("/remove/:chatId")
  .delete(mongoIdPathVariableValidator("chatId"),deleteOneOnOneChat);

export default router;

