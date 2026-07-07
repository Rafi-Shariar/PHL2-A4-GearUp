import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { userController } from "./user.controller";

const router = Router()

router.get("/me", auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER), userController.getCurrentUser)
router.patch("/update", auth(Role.CUSTOMER, Role.ADMIN, Role.PROVIDER), userController.updateUserData)
router.patch("/password", auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN), userController.changePassword)
export const userRoutes = router;