import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IUpdateUserPayload } from "./user.interface";
import config from "../../config";
import { emit } from "node:cluster";

const getCurrentUserFromDB = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { userId: userId },
    omit: { password: true },
  });

  return result;
};

const updateUserInDB = async (userId: string, payload: IUpdateUserPayload) => {
  const { email} = payload;

    if (email) {
        const isEmailExists = await prisma.user.findUnique({
             where: { email },
        });

        if (isEmailExists && isEmailExists.userId !== userId) {
             throw new Error("User already exists with this email.");
        }
    }

    const updateUserData = await prisma.user.update({
        where : {userId},
        data : payload,
        omit : {
            password : true
        }
    })

    return updateUserData;


};

const updatePasswordInDB = async() =>{

}

export const userServices = { getCurrentUserFromDB, updateUserInDB , updatePasswordInDB};
