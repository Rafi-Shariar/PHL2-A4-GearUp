import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()
router.post('/create',auth(Role.CUSTOMER), paymentController.createPaymentCheckoutSession)
router.post('/confirm', paymentController.handleWebhooktPayment)
router.get('/', auth(Role.CUSTOMER), paymentController.getUsersPayemnt)
router.get('/:paymentId', auth(Role.CUSTOMER), paymentController.getPaymentDetail)

export const paymentRoutes = router;