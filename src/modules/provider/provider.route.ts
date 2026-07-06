import { Router } from "express";
import { providerController } from "./provider.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()
router.post('/gear', auth(Role.PROVIDER), providerController.addNewGear)
router.put('/gear/:gearId', auth(Role.PROVIDER), providerController.updateGear)
router.delete('/gear/:gearId', auth(Role.PROVIDER), providerController.deleteGear)
router.get('/orders', auth(Role.PROVIDER), providerController.getAllOrders)

export const providerRoutes = router;