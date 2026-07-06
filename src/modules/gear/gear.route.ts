import { Router } from "express";
import { gearController } from "./gear.controller";

const router = Router();
router.get('/gear', gearController.getAllGear)
router.get('/gear/:gearId', gearController.getGearDetails)

export const gearRoutes = router;