import {Router} from 'express'
import { test } from '../Controller/user.controller.js';


const router=  Router();


router.post("/test", test)



export {router as testRouter}


