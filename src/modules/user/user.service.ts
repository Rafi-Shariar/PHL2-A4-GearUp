import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IChangePasswordPayload, IUpdateUserPayload } from "./user.interface";
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

const updatePasswordInDB = async(userId : string, payload : IChangePasswordPayload) =>{

  const {currentPassword, newPassword} = payload

  const userData = await prisma.user.findUniqueOrThrow({
    where : {userId}
  })

  const isPasswordMatch = await bcrypt.compare(currentPassword, userData.password);

  if(!isPasswordMatch){
    throw new Error("Incorrect current password! Try again.")
  }

  if(currentPassword === newPassword){
    throw new Error("New password can not be same as previous password. Try again.")
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, Number(config.bcrypt_salt_rounds))

  await prisma.user.update({
    where : {userId},
    data : {
      password : hashedNewPassword
    }
  })

  return { message : "Password changed. Login to check."};

}

export const userServices = { getCurrentUserFromDB, updateUserInDB , updatePasswordInDB};
