import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post("/category",auth(Role.ADMIN), adminController.addNewCategory)
router.get('/users', auth(Role.ADMIN), adminController.getAllUsers)
router.patch('/users/:userId', auth(Role.ADMIN), adminController.updateUserStatus)
router.get('/gear', auth(Role.ADMIN), adminController.getAllGears)
router.get('/rentals', auth(Role.ADMIN), adminController.getAllOrders)

export const adminRoutes = router