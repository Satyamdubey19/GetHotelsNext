import jwt from "jsonwebtoken";

export const signJwt=(payload:any)=>{
  return jwt.sign(payload,process.env.JWT_SECRET_KEY!,{expiresIn:"7d"})
}

export const verifyJwt=(token:string)=>{
  try{
    return jwt.verify(token,process.env.JWT_SECRET!)
  }catch(err){
    return null;
  }
}