import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUserPayload, IRegisterUserPayload } from "./auth.interface"
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";

const registerUserIntoDB = async (payload : IRegisterUserPayload) =>{
    const {email, name, password, phoneNumber, role, address, photoURL } = payload;

    const isUserExists = await prisma.user.findUnique({
        where : {email}
    })

    if(isUserExists){
        throw new Error("User already exists with is email.")
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

    const createdUser = await prisma.user.create({
        data :{
            email,
            name,
            password : hashedPassword,
            phoneNumber,
            role,
            address,
            photoURL
        }
    })

    const user = await prisma.user.findUnique({
        where : { userId : createdUser.userId},
        omit : { password : true}
    })
    
    return user

}

const loginUserFromDB = async (payload : ILoginUserPayload) =>{

    const {email, password} = payload

    const user = await prisma.user.findUniqueOrThrow({
        where : {email : email}
    })

    if(user.accountStatus === "SUSPENDED"){
        throw new Error("This account has been suspended!")
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if(!isPasswordMatched){
        throw new Error("Password Incorrect. Try Again.")
    }

    const jwtPayload = {
        userId : user.userId,
        name : user.name,
        email : user.email,
        role : user.role

    }

    const accessToken = jwtUtils.createJwtToken(jwtPayload, config.jwt_access_screte, config.jwt_access_expires_in as SignOptions)
    const refreshToken = jwtUtils.createJwtToken(jwtPayload, config.jwt_refresh_screte, config.jwt_refresh_expires_in as SignOptions)

    return { accessToken, refreshToken}


}

const getCurrentUserFromDB = async(userId : string) => {

    const result = await prisma.user.findUnique({
        where : {userId : userId},
        omit : {password : true}
    })

    return result

}
export const authServices = {registerUserIntoDB, loginUserFromDB, getCurrentUserFromDB}