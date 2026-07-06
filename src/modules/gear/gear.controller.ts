import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { gearServices } from "./gear.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"
const getAllGear = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const qury = req.query;
    const result = await gearServices.getAllGearFromDB(qury);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gear retrieved successfully.",
      data: result.data,
      meta : result.meta
    });
  },
);

const getGearDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const gearId = req.params.gearId;

    if(!gearId){
      throw new Error("Please provide gearId in params.")
    }

    const result = await gearServices.getGearDetailsFromDB(gearId as string)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Gear details retrieved successfully.",
      data : result
    });

  },
);

const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await gearServices.getAllCategoriesFromDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All categories retrieved successfully.",
      data : result
    });
  },
);

export const gearController = { getAllCategories, getGearDetails, getAllGear };
