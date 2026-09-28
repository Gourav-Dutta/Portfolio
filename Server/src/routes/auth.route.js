import {Router} from "express";
// import { handleSignUpFunction,handleLoginFunction  } from "../../Controller/auth.controller.js";
// import {handleSignUpFunction, handleLoginFunction} from "../Controller/auth.controller.js";
import * as authController from "../Controller/auth.controller.js";



const route = Router();


route.post("/signup", authController.handleSignUpFunction);
route.post("/login", authController.handleLoginFunction);


export {route as authRoute};


