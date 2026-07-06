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

    }
)


const deleteGear = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{

    }
)

const getAllOrders = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{

    }
)


const updateOrder = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{

    }
)

export const providerController = {addNewGear, updateGear, deleteGear, getAllOrders, updateOrder}