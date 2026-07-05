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

export const adminController = {addNewCategory}