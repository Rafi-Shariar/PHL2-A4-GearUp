import jwt, {JwtPayload,SignOptions} from "jsonwebtoken";
const createJwtToken = ( payload : JwtPayload, secrete : string, expiresIn : SignOptions) =>{
    const token = jwt.sign(payload, secrete, {expiresIn} as SignOptions)
    return token;
}

const varifyJwtToken = (token : string, secrete : string)=>{
    try {
        
        const varifyToken = jwt.verify(token, secrete);
        return {
            success : true,
            data : varifyToken
        }
        
    } catch (error : any) {
        return {
            success : false,
            error : error.message
        }
    }
}



export const jwtUtils = {createJwtToken, varifyJwtToken}