import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const registerUser = catchAsync(
    async(req: Request, res : Response, next : NextFunction)=>{

        const payload = req.body;
        const user = await authServices.registerUserIntoDB(payload)

        sendResponse(res, {
            success : true,
            statusCode : httpStatus.OK,
            message : "Registration successfull. Please log in.",
            data : {user}
        })

    }
)

const loginUser = catchAsync(
    async(req: Request, res : Response, next : NextFunction) =>{

        const payload = req.body;
        const {accessToken, refreshToken} = await authServices.loginUserFromDB(payload)

        res.cookie("accessToken", accessToken, {
            httpOnly : true,
            secure : false,
            sameSite : "none",
            maxAge : 1000*60*60*24
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly : true,
            secure : false,
            sameSite : "none",
            maxAge : 1000*60*60*24*7
        })

        sendResponse(res, {
            success : true,
            statusCode : httpStatus.OK,
            message : "Login successful.",
            data : {accessToken, refreshToken}
        })

    }
)

export const authController = {registerUser, loginUser}