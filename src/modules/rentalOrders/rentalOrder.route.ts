import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { rentalOrderController } from "./rentalOrder.controller";

const router = Router()
router.post('/', auth(Role.CUSTOMER), rentalOrderController.addNewOrder)
router.get('/', auth(Role.CUSTOMER), rentalOrderController.getAllOrders)
router.get('/:orderId', auth(Role.CUSTOMER), rentalOrderController.getOrderDetails)
router.delete('/:orderId', auth(Role.CUSTOMER), rentalOrderController.deleteOrderById)

export const rentalOrderRoutes = router;