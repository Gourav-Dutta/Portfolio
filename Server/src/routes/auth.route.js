import {Router} from "express";
import { handleSignUpFunction } from "../../Controller/auth.controller.js";



const route = Router();


route.post("/signup", handleSignUpFunction);


export {route as authRoute};


