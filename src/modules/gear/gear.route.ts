import { Router } from "express";
import { gearController } from "./gear.controller";

const router = Router();
router.get('/gear', gearController.getAllGear)
router.get('/gear/:gearId', gearController.getGearDetails)
router.get('/categories', gearController.getAllCategories)

export const gearRoutes = router;