import { Router } from "express";
import * as authCtrl from '../controller/authentication.controller.js'
const router = Router();

router.post('/register',authCtrl.register)
router.post('/login',authCtrl.login)

export default router;