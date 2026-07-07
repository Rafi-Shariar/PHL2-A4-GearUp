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
            statusCode : httpStatus.OK,
            message : "Checkout completed successfully",
            data : result
        })
    }
)

const handleWebhooktoConfirmPayment = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{
        
    }
)

const getUsersPayemnt = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{
        
    }
)

const getPaymentDetail = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{
        
    }
)


export const paymentController = {createPaymentCheckoutSession, handleWebhooktoConfirmPayment, getUsersPayemnt, getPaymentDetail}