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
            message : "New order placed successfully.",
            data : result
        })
        

    }
)


const getAllOrders = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{

        const customerId = req.user?.userId;
        const result = await rentalOrderServices.getAllOrdersOfUser(customerId as string)

        const message = result.totalOrder > 0 ? "My orders retrieved successfully" : "Sorry, you don't have any orders."


        sendResponse(res, {
            success : true,
            statusCode : httpStatus.OK,
            message : message,
            data : result
        })

    }
)

const getOrderDetails = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{
        const {orderId} = req.params;
        const userId = req.user?.userId;

        const result = await rentalOrderServices.getOrderDetailsById(orderId as string, userId as string)

         sendResponse(res, {
            success : true,
            statusCode : httpStatus.OK,
            message : "Order details retrieved.",
            data : result
        })

    }
)

const deleteOrderById = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{
        const {orderId} = req.params
        const userId = req.user?.userId;

        const result = await rentalOrderServices.deleteOrderInDB(orderId as string, userId as string)

        sendResponse(res, {
            success : true,
            statusCode : httpStatus.OK,
            message : "You order has been deleted successfully.",
            data : result

        })
    }
)

export const rentalOrderController = {addNewOrder, getAllOrders, getOrderDetails, deleteOrderById}
