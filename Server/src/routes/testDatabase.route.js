import {Router} from 'express';
import {test} from "../Controller/test.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js";


const route = Router();


route.get("/testApi", authMiddleware, test);


export {route as testRoute};