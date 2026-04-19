import { LoginUser, registerUser } from "@/services/auth.service";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { ResetPassword,RequestResetPassword } from "@/services/auth.service";
const authCookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};


export const register=async(request:NextRequest)=>{
  try{
    const body=await request.json();
    const {user}=await registerUser(body);
    return new Response(JSON.stringify({
      user,
      message:"Registration successful. Please check your email to verify your account."
    }),{status:201,headers:{"Content-Type":"application/json"}})
  } catch (error) {
    return new Response(JSON.stringify({error: (error as Error).message}), {status: 400, headers: {"Content-Type": "application/json"}});
  }
}

export const login=async(request:NextRequest)=>{
  try{
    const body=await request.json();
    const {user,token}=await LoginUser(body);
    (await cookies()).set("token",token,authCookieOptions);
    return new Response(JSON.stringify({user}),{status:200,headers:{"Content-Type":"application/json"}});
  } catch (error) {
    return new Response(JSON.stringify({error: (error as Error).message}), {status: 400, headers: {"Content-Type": "application/json"}});
  }
}


export const forgotPassword=async(req:NextRequest)=>{
  try{
    const {email}=await req.json();
    const result=await RequestResetPassword(email);
    return new Response(JSON.stringify(result),{
      status:201,
       headers: { "Content-Type": "application/json" },
    });
  }catch(err){
    const message = err instanceof Error ? err.message : "Server Error";
    const status = message === "Server Error" ? 500 : 400;

    return new Response(JSON.stringify({error: message}),{
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const ResetPasswordHandler=async(req:NextRequest)=>{
  try{
    const {email,token}=await req.json();
    const result=await ResetPassword(email,token);

    return new Response(JSON.stringify(result),{
      status:200,
      headers:{ "Content-Type": "application/json" },
    });
  }catch(err){
     return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 400 }
    );
  }
}