import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { addNewParticipantInGroupChat, createAGroupChat, createOrGetAOneOnOneChat, deleteGroupChat, getAllChats, removeParticipantFromGroupChat, renameGroupChat, searchAvailableUsers } from "../controllers/chat.controller";
import { mongoIdPathVariableValidator } from "../validators/mongodb.validator";

const router = Router()

router.use(verifyJWT)

router.route("/").get(getAllChats)
router.route("/users").get(searchAvailableUsers)
router.route("/c/:receiverId").post(mongoIdPathVariableValidator("receiverId"),createOrGetAOneOnOneChat)
router.route("/group").post(createAGroupChat)
router.route("/group/:chatId")
.patch(mongoIdPathVariableValidator("chatId"),renameGroupChat)
.delete(mongoIdPathVariableValidator("chatId"), deleteGroupChat)

router.route("/group/:chatId/:participantId").post(mongoIdPathVariableValidator("chatId"),mongoIdPathVariableValidator("participantId"),addNewParticipantInGroupChat)
.delete(mongoIdPathVariableValidator("chatId"),mongoIdPathVariableValidator("participantId"), removeParticipantFromGroupChat)
router
  .route("/leave/group/:chatId")
  .delete(mongoIdPathVariableValidator("chatId"), validate, leaveGroupChat);

router
  .route("/remove/:chatId")
  .delete(mongoIdPathVariableValidator("chatId"), validate, deleteOneOnOneChat);

export default router;
