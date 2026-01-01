
import bcrypt from 'bcrypt'

export const hashedPassword = async (pass)=>{
    const salt = await bcrypt.genSalt(8) //gen salt not get salt 
    const hashedPass = await bcrypt.hash(pass , salt)
    return hashedPass
}

export const comparePassword = async (pass , hashedPass)=>{
    const isPasswordCorrect = await bcrypt.compare(pass,hashedPass)
    return isPasswordCorrect
}
