import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, googleAuth } from "../controllers/user.controller.js";
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()
router.route("/register").post(upload.single('avatar'),registerUser)

router.route("/login").post(loginUser)
router.route("/googleauth").post(googleAuth)

//secured routes
router.route("/logout").get(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").post(verifyJWT, getCurrentUser)
router.route("/update-details").patch(verifyJWT, updateAccountDetails) //patch is used to update only some feilds like name and id not all, if we use post it will update everything
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

export default router