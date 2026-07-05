import { Role } from "../../../generated/prisma/enums";

export interface IRegisterUserPayload {
    email : string;
    name : string;
    password : string;
    phoneNumber : string;
    role : Role;
    address ?: string;
    photoURL ?: string;
}