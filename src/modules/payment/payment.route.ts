import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()
router.post('/create',auth(Role.CUSTOMER), paymentController.createPaymentCheckoutSession)
router.post('/confirm', paymentController.handleWebhooktoConfirmPayment)
// router.get('/')
// router.get('/:paymentId')

export const paymentRoutes = router;