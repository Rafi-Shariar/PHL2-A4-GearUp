import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IRegisterUserPayload } from "./auth.interface"
import config from "../../config";

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

export const authServices = {registerUserIntoDB}