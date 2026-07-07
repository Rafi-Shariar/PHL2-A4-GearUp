import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewServices } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const addNewReview = catchAsync(
    async(req : Request, res : Response, next : NextFunction) =>{
        const payload = req.body;
        const customerId = req.user?.userId;

        const result = await reviewServices.addNewReviewInDB(payload, customerId as string)

        sendResponse(res, {
            success : true,
            statusCode : httpStatus.CREATED,
            message : "Review added successfully.",
            data : result
        })
    }
)

export const reviewController = {addNewReview}