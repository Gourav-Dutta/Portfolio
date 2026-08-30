import {Router} from 'express'
import { test, getUsers } from '../Controller/user.controller.js';


const router=  Router();


router.post("/test", test)
router.get("/getUser", getUsers)



export {router as testRouter}


