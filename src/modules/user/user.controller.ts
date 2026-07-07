import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const getCurrentUser = catchAsync(
    async(req: Request, res : Response, next : NextFunction) =>{
        const userId = req.user?.userId;
        const result = await userServices.getCurrentUserFromDB(userId as string)

        sendResponse(res,{
            success : true,
            statusCode : httpStatus.OK,
            message : "Current user's data retrieved successfully.",
            data : result
        })
    }
)

const updateUserData = catchAsync(
    async(req : Request, res : Response, next : NextFunction)=>{
        const payload = req.body;
        const userId = req.user?.userId;
        const result = await userServices.updateUserInDB(userId as string, payload)

        sendResponse(res,{
            success : true,
            statusCode : httpStatus.OK,
            message : "Data updated successfully.",
            data : result
        })

    }
)

const changePassword = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{
        const payload = req.body;
        const userId = req.user?.userId;

        const result = await userServices.updatePasswordInDB(userId as string, payload)
        sendResponse(res,{
            success : true,
            statusCode : httpStatus.OK,
            message : "Password change successfull.",
            data : result.message
        })


    }
)

export const userController = {getCurrentUser, updateUserData, changePassword}