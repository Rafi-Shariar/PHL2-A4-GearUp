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
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const gearController = { getAllCategories, getGearDetails, getAllGear };
