import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminServices } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const addNewCategory = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{

        const {categoryName} = req.body;
        const result = await adminServices.addNewCategoryInDB(categoryName)

        sendResponse(res, {
            success : true,
            statusCode : httpStatus.OK,
            message : "New category added successfully",
            data : result
        })
    }
)

const getAllUsers = catchAsync(
    async(req : Request, res : Response, next : NextFunction)=>{

        const result = await adminServices.getAllUsersFromDB()
        sendResponse(res, {
            success : true,
            statusCode : httpStatus.OK,
            message : "All users retrieved",
            data : result
        })

    }
)


const updateUserStatus = catchAsync(
    async(req : Request, res : Response, next : NextFunction)=>{
        const {userId} = req.params;
        const {status} = req.body;
        const result = await adminServices.updateUserStatusInDB(userId as string, status as string)

        sendResponse(res, {
            success : true,
            statusCode : httpStatus.OK,
            message : "User status updated.",
            data : result
        })


    }
)

const getAllGears = catchAsync(
    async(req : Request, res : Response, next : NextFunction)=>{
        const result = await adminServices.getAllGearsFromDB()
         sendResponse(res, {
            success : true,
            statusCode : httpStatus.OK,
            message : "All gears retrieved.",
            data : result
        })
    }
)

const getAllOrders = catchAsync(
    async(req : Request, res : Response, next : NextFunction)=>{
        const result = await adminServices.getAllOrdersFromDB()
        sendResponse(res, {
            success : true,
            statusCode : httpStatus.OK,
            message : "All orders retrieved.",
            data : result
        })

    }
)
export const adminController = {addNewCategory, getAllUsers, updateUserStatus, getAllGears, getAllOrders}