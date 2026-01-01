import jwt from 'jsonwebtoken'
export const token = (payload)=>{
    const token =  jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN}
    )
    return token
}
export const verifyToken = (token)=>{
    const decode = jwt.verify(
        token ,
        process.env.JWT_SECRET
    )
    return decode

}