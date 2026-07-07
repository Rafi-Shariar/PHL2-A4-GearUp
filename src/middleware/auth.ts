import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId : string;
                name : string;
                email : string;
                role : Role;

            }
        }
    }
}


export const auth = (...requiredRoles : Role[]) =>{

    return catchAsync(
        async(req : Request, res : Response, next : NextFunction) =>{
            const token = req.cookies.accessToken ? req.cookies.accessToken : 
                        req.headers.authorization?.startsWith("Bearer") ?
                        req.headers.authorization?.split(" ")[1] : req.headers.authorization;

            if(!token){
                throw new Error("You are not logged in. Please Login.")
            }

            const verifiedToken = jwtUtils.varifyJwtToken(token, config.jwt_access_screte)
            
            if(!verifiedToken.success){
                throw new Error(verifiedToken.error)
            }

            const {email, name, userId , role} = verifiedToken.data as JwtPayload;

            if(requiredRoles.length && !requiredRoles.includes(role)){
                throw new Error("Forbidden. You don't have permission.")
            }

            const user = await prisma.user.findUnique({
                where : {userId}
            })

            if(!user){
                throw new Error("User not found!")
            }

            if(user.accountStatus === "SUSPENDED"){
                throw new Error("This account is suspended. Please contact support.")
            }

            req.user = {email,name, userId, role}

            next();

        }
    )

}