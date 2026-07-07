export interface IUpdateUserPayload {
    name ?: string;
    email ?: string;
    phoneNumber ?: string;
    address ?: string;
    photoURL ?: string;
}

export interface IChangePasswordPayload {
    currentPassword : string;
    newPassword : string;
}