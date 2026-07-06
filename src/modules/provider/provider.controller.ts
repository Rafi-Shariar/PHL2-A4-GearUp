import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { providerServices } from "./provider.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
const addNewGear = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{
        const newGearData = req.body;
        const providerId = req.user?.userId;

        const result = await providerServices.addGearIntoDB(newGearData, providerId as string)

        sendResponse(res, {
            success : true,
            statusCode : httpStatus.OK,
            message : "Added new gear successfully.",
            data : result
        })
    }
)


const updateGear = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{
        const payload = req.body;
        const userId = req.user?.userId;
        const {gearId} = req.params

        const result = await providerServices.updateGearInDB(payload, userId as string, gearId as string)

         sendResponse(res, {
            success : true,
            statusCode : httpStatus.OK,
            message : "Gear data updated successfully.",
            data : result
        })

    }
)


const deleteGear = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{
        const userId = req.user?.userId;
        const {gearId} = req.params

        const result = await providerServices.deleteGearFromDB(userId as string, gearId as string)

         sendResponse(res, {
            success : true,
            statusCode : httpStatus.OK,
            message : "Gear data deleted successfully.",
            data : result
        })
    }
)

const getAllOrders = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{
        //todo
    }
)


const updateOrder = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{
        //todo
    }
)

export const providerController = {addNewGear, updateGear, deleteGear, getAllOrders, updateOrder}