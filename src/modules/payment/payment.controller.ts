import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentServices } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const createPaymentCheckoutSession = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{

        const userId = req.user?.userId;
        const {orderId} = req.body;
        const result = await paymentServices.createCheckoutSession(userId as string, orderId)

        sendResponse(res, {
            success : true,
            statusCode : httpStatus.CREATED,
            message : "Checkout completed successfully",
            data : result
        })
    }
)

const handleWebhooktPayment = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{
        const event = req.body as Buffer;
        const signature = req.headers['stripe-signature']!;
        const result = await paymentServices.handleWebhook(event, signature as string)

         sendResponse(res, {
            success : true,
            statusCode : httpStatus.OK,
            message : "Webhook triggered successfully",
        })


    }
)

const getUsersPayemnt = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{
        const userId = req.user?.userId;
        const result = await paymentServices.getUsersPaymentFromDB(userId as string)

        sendResponse(res, {
            success : true,
            statusCode : httpStatus.OK,
            message : "Payment history retrieved successfully.",
            data : result
        })
    }
)

const getPaymentDetail = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{
        
    }
)


export const paymentController = {createPaymentCheckoutSession, handleWebhooktPayment, getUsersPayemnt, getPaymentDetail}