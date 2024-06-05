import { Router } from "express";
import * as authCtrl from '../controller/autentication.controller.js'
const router = Router();

router.post('/register',authCtrl.register)

export default router;