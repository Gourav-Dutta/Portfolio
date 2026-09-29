import {Router} from "express";
// import { handleSignUpFunction,handleLoginFunction  } from "../../Controller/auth.controller.js";
// import {handleSignUpFunction, handleLoginFunction} from "../Controller/auth.controller.js";
import * as authController from "../Controller/auth.controller.js";



const route = Router();


route.post("/signup", authController.handleSignUpFunction);
route.post("/login", authController.handleLoginFunction);
route.post("/refresh-token", authController.handleRefreshTokenFunction);
route.post("/logout", authController.handleLogoutFunction);


export {route as authRoute};


