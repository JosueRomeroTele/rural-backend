import { Router } from "express";

import * as deviceItemCtrl from '../controller/deviceItem.controller.js'

const router = Router();


router.get('/:table',deviceItemCtrl.listItems)

export default router;