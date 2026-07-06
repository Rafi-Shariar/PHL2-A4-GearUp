import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status"
import { rentalOrderServices } from "./rentalOrder.service";
import { sendResponse } from "../../utils/sendResponse";


const addNewOrder = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{
        const payoad = req.body;
        const customerId = req.user?.userId
        const result = await rentalOrderServices.addNewOrderIntoDB(payoad, customerId as string)

        sendResponse(res, {
            success : true,
            statusCode : httpStatus.CREATED,
            message : "New order placed successlly.",
            data : result
        })
        

    }
)


const getAllOrders = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{

    }
)

const getOrderDetails = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{

    }
)

export const rentalOrderController = {addNewOrder, getAllOrders, getOrderDetails}
